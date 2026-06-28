import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import rstruther from "@/infraestructure/http/nodeApi";
import {
  saveLastCredentials,
  getLastCredentials,
  clearLastCredentials,
} from "../components/securecredentials";

interface SignInResult {
  error: boolean;
  token?: string;
  msg?: string;
}

interface AuthContextProps {
  token: string | null;
  isRestoringSession: boolean;
  signIn: (identifier: string, password: string) => Promise<SignInResult>;
  signOut: () => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// Cliente axios separado e "limpo" para chamadas de auth (login/refresh).
// Importante: NÃO usar `rstruther` aqui, porque `rstruther` carrega o
// interceptor de 401 declarado mais abaixo. Se o próprio endpoint de
// refresh devolvesse 401 e estivesse interceptado, entraríamos num loop.
const authClient = axios.create({
  baseURL: rstruther.defaults.baseURL,
});

function AuthProvider({ children }: AuthProviderProps) {
  const [token, setToken] = useState<string | null>(null);
  const [isRestoringSession, setIsRestoringSession] = useState(true);

  // Guarda o token mais recente também numa ref, porque o interceptor é
  // registrado uma única vez (ver useEffect com array de dependências
  // vazio abaixo) e closures antigas não veriam atualizações de state.
  const tokenRef = useRef<string | null>(null);

  // Coordena múltiplas requisições que recebem 401 ao mesmo tempo: a
  // primeira dispara o refresh, as demais esperam essa mesma Promise em
  // vez de cada uma tentar renovar o token por conta própria.
  const refreshPromiseRef = useRef<Promise<string | null> | null>(null);

  useEffect(() => {
    const loadStoredToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("token");
        if (storedToken) {
          applyToken(storedToken);
        }
      } finally {
        setIsRestoringSession(false);
      }
    };
    loadStoredToken();
  }, []);

  const applyToken = (newToken: string) => {
    tokenRef.current = newToken;
    setToken(newToken);
    axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
  };

  const clearSession = async () => {
    tokenRef.current = null;
    setToken(null);
    delete axios.defaults.headers.common["Authorization"];
    await AsyncStorage.multiRemove([
      "token",
      "refreshToken",
      "name",
      "uuid",
      "typeAuth",
    ]);
  };

  const signIn = async (
    identifier: string,
    password: string,
  ): Promise<SignInResult> => {
    try {
      const response = await authClient.post("auth/login", {
        username: identifier,
        password,
      });

      if (response.status === 200 || response.status === 201) {
        const { access_token, refresh_token } = response.data;
        const { display, uuid, typeAuth } = response.data.data;

        await AsyncStorage.setItem("token", access_token);
        await AsyncStorage.setItem("refreshToken", refresh_token);
        await AsyncStorage.setItem("name", display || "Usuário");
        await AsyncStorage.setItem("uuid", uuid);
        await AsyncStorage.setItem("typeAuth", typeAuth);

        applyToken(access_token);

        // Salva a credencial para o fallback de re-login automático,
        // usado apenas se o refresh token também vier a falhar.
        await saveLastCredentials(identifier, password);

        return { error: false, token: access_token };
      }

      return { error: true, msg: "#02 Unexpected response" };
    } catch (e: any) {
      const msg = e?.response?.data?.message ?? "#01 Bad Request";
      return { error: true, msg };
    }
  };

  const signOut = async () => {
    await clearSession();
    // Logout explícito do usuário deve sempre limpar a credencial
    // salva — nunca re-logar automaticamente depois de um "Sair".
    await clearLastCredentials();
  };

  /**
   * Tenta renovar o access token usando o refresh token salvo.
   * Retorna o novo token em caso de sucesso, ou null se o refresh
   * token também estiver inválido/expirado.
   */
  const refreshAccessToken = async (): Promise<string | null> => {
    const storedRefreshToken = await AsyncStorage.getItem("refreshToken");
    if (!storedRefreshToken) return null;

    try {
      const refreshResponse = await authClient.post("auth/refresh-token", {
        refreshToken: storedRefreshToken,
      });

      // Mesma convenção de nomes usada no login (access_token /
      // refresh_token), evitando o bug do campo "accessToken" que
      // nunca existia na resposta.
      const { access_token: newAccessToken, refresh_token: newRefreshToken } =
        refreshResponse.data;

      if (!newAccessToken) return null;

      await AsyncStorage.setItem("token", newAccessToken);
      if (newRefreshToken) {
        await AsyncStorage.setItem("refreshToken", newRefreshToken);
      }
      applyToken(newAccessToken);

      return newAccessToken;
    } catch {
      return null;
    }
  };

  /**
   * Último recurso: se o refresh token também falhou, tenta re-logar
   * automaticamente usando a última credencial salva com segurança.
   * Se não houver credencial salva, ou se o re-login falhar, retorna
   * null e o usuário precisa logar manualmente.
   */
  const attemptAutoRelogin = async (): Promise<string | null> => {
    const credentials = await getLastCredentials();
    if (!credentials) return null;

    const result = await signIn(credentials.identifier, credentials.password);
    if (result.error || !result.token) return null;

    return result.token;
  };

  // Interceptador para renovar o token quando expirar — registrado uma
  // única vez (não depende de `token`), evitando trocas de interceptor
  // em corrida com requests em andamento.
  useEffect(() => {
    const interceptorId = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const status = error?.response?.status;
        const originalRequest = error?.config;

        // Sem token ativo, ou erro sem resposta (ex: falha de rede),
        // ou não é 401: não há o que renovar, propaga o erro.
        if (status !== 401 || !tokenRef.current || !originalRequest) {
          return Promise.reject(error);
        }

        // Evita retry infinito se a requisição já foi reenviada uma vez.
        if (originalRequest._retry) {
          return Promise.reject(error);
        }
        originalRequest._retry = true;

        // Se já existe um refresh em andamento, todas as requisições
        // que falharam ao mesmo tempo esperam essa mesma Promise em
        // vez de disparar refreshes paralelos.
        if (!refreshPromiseRef.current) {
          refreshPromiseRef.current = (async () => {
            const refreshed = await refreshAccessToken();
            if (refreshed) return refreshed;

            // Refresh token também falhou: tenta o fallback de
            // re-login automático antes de desistir.
            return attemptAutoRelogin();
          })().finally(() => {
            refreshPromiseRef.current = null;
          });
        }

        const newToken = await refreshPromiseRef.current;

        if (!newToken) {
          await clearSession();
          return Promise.reject(error);
        }

        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${newToken}`,
        };
        return axios(originalRequest);
      },
    );

    return () => axios.interceptors.response.eject(interceptorId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider
      value={{ token, isRestoringSession, signIn, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}

export { AuthProvider, useAuth };

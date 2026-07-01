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
} from "./secureCredentials";

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
  /**
   * Verifica se a senha informada é válida para a conta atualmente
   * logada, SEM afetar a sessão ativa (não troca o token, não altera
   * nada em AsyncStorage). Usado como camada extra de confirmação
   * antes de ações sensíveis (ex: assinar um saque de wallet,
   * exportar a seed phrase).
   *
   * Internamente, isso ainda chama o endpoint de login — porque não
   * existe (ainda) um endpoint dedicado de "apenas verificar senha"
   * na API. Se um endpoint mais leve existir/for criado no futuro
   * (ex: auth/verify-password), troque a implementação aqui sem
   * precisar mudar nada nas telas que chamam isto.
   */
  verifyPassword: (password: string) => Promise<boolean>;
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
      "identifier",
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
        // Necessário para verifyPassword() conseguir revalidar a senha
        // mais tarde (ex: antes de assinar um saque), sem precisar
        // pedir o usuário/e-mail de novo nessas confirmações.
        await AsyncStorage.setItem("identifier", identifier);

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

  const verifyPassword = async (password: string): Promise<boolean> => {
    const identifier = await AsyncStorage.getItem("identifier");
    if (!identifier) return false;

    try {
      // authClient é isolado (sem o interceptor de 401 do axios global)
      // e o resultado nunca é aplicado via applyToken/AsyncStorage —
      // isso é só uma validação, não um login de fato. Mesmo que a API
      // devolva um token novo aqui, ele é descartado propositalmente.
      const response = await authClient.post("auth/login", {
        username: identifier,
        password,
      });
      return response.status === 200 || response.status === 201;
    } catch {
      return false;
    }
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
      value={{ token, isRestoringSession, signIn, signOut, verifyPassword }}
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

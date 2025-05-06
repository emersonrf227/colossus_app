import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";
import Constants from "expo-constants";
import { Platform } from "react-native";
// import { useAuth } from "@/hook/AuthContext"; // Remova esta importação, pois não é usada aqui

const rstruther: AxiosInstance = axios.create({
  baseURL: "https://api.colossuscrypto.com.br/v1/",
  timeout: 300000,
  maxBodyLength: Number.POSITIVE_INFINITY,
  headers: {
    "User-Agent": `I Like Technology/${Constants?.expoConfig?.extra?.version} (${Platform.OS}; Mobile)`,
  },
});

async function getAuthToken(): Promise<string | null> {
  const beartoken = await AsyncStorage.getItem("token");
  return beartoken;
}

async function getAuthRefreshToken(): Promise<string | null> {
  const beartoken = await AsyncStorage.getItem("refreshToken");
  return beartoken;
}

/**
 * Função para fazer refresh do token em caso de 401
 * Tenta obter um novo token de acesso usando o refresh token.
 * Em caso de sucesso, atualiza o AsyncStorage e retorna o novo token.
 * Em caso de falha, limpa os dados de autenticação e lança o erro original.
 */
async function refreshToken(): Promise<string> {
  const refresh = await getAuthRefreshToken();
  if (!refresh) {
    throw new Error("Refresh token não encontrado."); // Força o tratamento do erro
  }
  try {
    const response: AxiosResponse<{
      access_token: string;
      refresh_token: string;
    }> = await rstruther.post("auth/refresh-token", {
      refreshToken: refresh,
    });
    console.log("refreshToken - Response Status:", response.status);
    console.log("refreshToken - Response Data:", response.data);
    if (response.status === 200 || response.status === 201) {
      await AsyncStorage.setItem("token", response.data.access_token);
      await AsyncStorage.setItem("refreshToken", response.data.refresh_token);
      return response.data.access_token;
    } else {
      await clearAuthData();
      throw new Error(
        `Falha ao atualizar o token: Resposta inesperada - ${response.status}`
      );
    }
  } catch (error: any) {
    await clearAuthData();
    console.error("refreshToken - Erro ao atualizar o token:", error);
    throw error; // Relança o erro para ser capturado no interceptor
  }
}

/**
 * Função para limpar os dados de autenticação do AsyncStorage.
 */
const clearAuthData = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("refreshToken");
    await AsyncStorage.removeItem("name");
    await AsyncStorage.removeItem("uuid");
    await AsyncStorage.removeItem("typeAuth");
    console.log(
      "clearAuthData: Dados de autenticação removidos do AsyncStorage"
    );
  } catch (e) {
    console.error("clearAuthData - Erro ao limpar asyncStorage", e);
  }
};

// Interceptor para adicionar o token de acesso ao cabeçalho da requisição
rstruther.interceptors.request.use(
  async (config: AxiosRequestConfig): Promise<AxiosRequestConfig> => {
    const token = await getAuthToken();
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }
    return config;
  },
  (error: AxiosError): Promise<AxiosError> => Promise.reject(error)
);

// Interceptor para tratar erros de resposta, especialmente 401 (Não autorizado)
rstruther.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,
  async (error: AxiosError): Promise<any> => {
    const originalRequest: AxiosRequestConfig & {
      _retry?: boolean;
      _isRefreshing?: boolean;
    } = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Marca a requisição para evitar repetições infinitas
      if (!originalRequest._isRefreshing) {
        // Garante que o refresh token seja chamado apenas uma vez
        originalRequest._isRefreshing = true;
        try {
          const newToken: string = await refreshToken(); // Aguarda a conclusão da atualização do token
          if (newToken) {
            // Tenta novamente a requisição original com o novo token
            originalRequest.headers = {
              ...originalRequest.headers,
              Authorization: `Bearer ${newToken}`,
            };
            return rstruther(originalRequest); // Retorna a Promise da nova requisição
          }
        } catch (refreshError: any) {
          // Trata o erro de refresh token (já limpou o AsyncStorage)
          console.error("Erro ao tentar reautenticar:", refreshError);
          // Redirecione o usuário para a tela de login ou exiba uma mensagem de erro
          // **Importante:** Este é o ponto onde você deve lidar com a navegação
          // Por exemplo, usando navigation.navigate do React Navigation (se estiver em um componente React)
          // Ou chamando uma função do seu contexto de autenticação, se tiver um.
          return Promise.reject(refreshError); // Propaga o erro para o código que chamou a requisição original
        } finally {
          originalRequest._isRefreshing = false;
        }
      } else {
        // Se outra requisição já estiver tentando o refresh, espera o resultado
        return new Promise((resolve, reject) => {
          const interval = setInterval(() => {
            if (!originalRequest._isRefreshing) {
              clearInterval(interval);
              if (originalRequest.headers.Authorization) {
                // Se o token foi atualizado, repete a requisição
                resolve(rstruther(originalRequest));
              } else {
                // Se o refresh falhou, rejeita com o erro original
                reject(error);
              }
            }
          }, 100); // Checa a cada 100ms
        });
      }
    }
    return Promise.reject(error); // Propaga o erro para o código que chamou a requisição original
  }
);

export default rstruther;

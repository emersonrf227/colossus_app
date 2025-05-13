import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";
import Constants from "expo-constants";
import { Platform } from "react-native";

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
  console.log("refeshtoken");
  const beartoken = await AsyncStorage.getItem("refreshToken");
  return beartoken;
}

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

// ✅ Usar instância separada do Axios para evitar loop de interceptores
async function refreshToken(): Promise<string> {
  try {
    const refresh = await getAuthRefreshToken();

    if (!refresh) {
      throw new Error("Refresh token não encontrado.");
    }

    console.log("Iniciando refresh");

    const axiosWithoutInterceptor = axios.create({
      baseURL: "https://api.colossuscrypto.com.br/v1/",
      timeout: 300000,
    });

    const response = await axiosWithoutInterceptor.post("auth/refresh-token", {
      refreshToken: refresh,
    });

    console.log("Response recebido", response.status);

    if (response?.status === 200 || response?.status === 201) {
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
    throw error;
  }
}

// Interceptor para adicionar token às requisições
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

// Interceptor de resposta (refresh token em caso de 401)
rstruther.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,
  async (error: AxiosError): Promise<any> => {
    const originalRequest: AxiosRequestConfig & {
      _retry?: boolean;
      _isRefreshing?: boolean;
    } = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (!originalRequest._isRefreshing) {
        originalRequest._isRefreshing = true;
        try {
          const newToken: string = await refreshToken();
          if (newToken) {
            originalRequest.headers = {
              ...originalRequest.headers,
              Authorization: `Bearer ${newToken}`,
            };
            return rstruther(originalRequest);
          }
        } catch (refreshError: any) {
          console.error("Erro ao tentar reautenticar:", refreshError);
          return Promise.reject(refreshError);
        } finally {
          originalRequest._isRefreshing = false;
        }
      } else {
        return new Promise((resolve, reject) => {
          const interval = setInterval(() => {
            if (!originalRequest._isRefreshing) {
              clearInterval(interval);
              if (originalRequest.headers.Authorization) {
                resolve(rstruther(originalRequest));
              } else {
                reject(error);
              }
            }
          }, 100);
        });
      }
    }

    return Promise.reject(error);
  }
);

export default rstruther;

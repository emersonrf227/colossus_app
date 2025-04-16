import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import rstruther from "@/infraestructure/http/nodeApi";
import { useToast } from "./Toast";

interface AuthContextProps {
  token: string | null;
  signIn: (username: string, password: string) => Promise<void>;
  signOut: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

function AuthProvider({ children }: AuthProviderProps) {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const loadStoredToken = async () => {
      const storedToken = await AsyncStorage.getItem("token");
      if (storedToken) {
        setToken(storedToken);
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${storedToken}`;
      }
    };
    loadStoredToken();
  }, []);

  const signIn = async (username: string, password: string) => {
    try {
      const data = {
        username: username,
        password: password,
      };

      const response = await rstruther.post("auth/login", data);
      if (response.status === 200 || response.status === 201) {
        const { access_token, refresh_token } = response.data;
        const { display, uuid, typeAuth } = response.data.data;

        await AsyncStorage.setItem("token", access_token);
        await AsyncStorage.setItem("refreshToken", refresh_token);
        await AsyncStorage.setItem("name", display ? display : "Usuário");
        await AsyncStorage.setItem("uuid", uuid);
        await AsyncStorage.setItem("typeAuth", typeAuth);

        return {
          error: false,
          token: access_token,
        };
      }
    } catch (e: any) {
      if (e?.response?.data?.message) {
        return {
          error: true,
          msg: e.response.data.message,
        };
      } else {
        return {
          error: true,
          msg: `#01 Bad Request`,
        };
      }
    }
  };

  const signOut = async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("refreshToken");
    setToken(null);
    delete axios.defaults.headers.common["Authorization"];
  };

  // Interceptador para renovar o token quando expirar
  useEffect(() => {
    const interceptRequest = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response.status === 401 && token) {
          console.log("refresh =====>");
          const storedRefreshToken = await AsyncStorage.getItem("refreshToken");

          if (storedRefreshToken) {
            try {
              const refreshResponse = await rstruther.post(
                "auth/refresh-token",
                {
                  refreshToken: storedRefreshToken,
                }
              );
              const { accessToken: newAccessToken } = refreshResponse.data;

              await AsyncStorage.setItem("token", newAccessToken);
              setToken(newAccessToken);
              axios.defaults.headers.common[
                "Authorization"
              ] = `Bearer ${newAccessToken}`;

              return axios(error.config); // Reenvia a requisição original
            } catch (refreshError) {
              await AsyncStorage.multiRemove([
                "token",
                "refreshToken",
                "name",
                "uuid",
                "typeAuth",
              ]);
              signOut();
            }
          } else {
            signOut();
          }
        }
        return Promise.reject(error);
      }
    );

    return () => axios.interceptors.response.eject(interceptRequest);
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, signIn, signOut }}>
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

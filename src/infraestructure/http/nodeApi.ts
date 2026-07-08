import axios, { AxiosInstance } from "axios";
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

export default rstruther;

import { useEffect, useState, useCallback } from "react";
import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import helmApi from "@/infraestructure/http/nodeApi";

export interface Notification {
  uuid: string;
  scope: string;
  title: string;
  body: string;
  data?: Record<string, any>;
  read: boolean;
  createdAt: string;
}

const PUSH_TOKEN_SENT_KEY = (address: string) => `pushTokenSent:${address}`;
const NOTIFICATIONS_CACHE_KEY = (address: string) => `notifications:${address}`;

/**
 * Hook para gerenciar notificações push e in-app.
 *
 * - Pede permissão ao mount
 * - Busca token Expo e registra na API (primeira vez apenas)
 * - Carrega notificações da API
 * - Fornece função pra marcar como lida
 */
export function useNotifications(address?: string) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Contar não lidas
  useEffect(() => {
    const count = notifications.filter((n) => !n.read).length;
    setUnreadCount(count);
  }, [notifications]);

  // 1) Registrar push token na API (primeira vez)
  const registerPushToken = useCallback(async (addr: string) => {
    if (!addr) {
      console.log("🔔 Sem endereço para registrar token");
      return;
    }
    try {
      const alreadySent = await AsyncStorage.getItem(PUSH_TOKEN_SENT_KEY(addr));
      if (alreadySent) {
        console.log("🔔 Token já foi registrado para", addr);
        return;
      }

      // Pede permissão
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        console.log("🔔 Permissão de notificações negada");
        return;
      }

      // Busca token Expo
      const token = await Notifications.getExpoPushTokenAsync();
      if (!token.data) {
        console.log("🔔 Falha ao obter token Expo");
        return;
      }

      // Envia pra API
      console.log(
        "🔔 Registrando token Expo:",
        token.data.substring(0, 20) + "...",
      );
      await helmApi.post("notifications/add-device", {
        address: addr,
        expo_code: token.data,
      });

      // Marca como enviado
      await AsyncStorage.setItem(PUSH_TOKEN_SENT_KEY(addr), "true");
      console.log("✅ Token Expo registrado com sucesso");
    } catch (err) {
      console.warn("⚠️ Erro ao registrar push token:", err);
    }
  }, []);

  // 2) Carregar notificações
  const loadNotifications = useCallback(async (addr: string) => {
    if (!addr) {
      setLoading(false);
      return;
    }
    try {
      const response = await helmApi.get<{
        status: number;
        msg: string;
        res: Notification[];
      }>(`notifications?address=${addr}`);

      console.log(
        "📬 Notificações carregadas:",
        response.data?.res?.length ?? 0,
      );

      if (response.data?.res) {
        setNotifications(response.data.res);
        // Cache local
        await AsyncStorage.setItem(
          NOTIFICATIONS_CACHE_KEY(addr),
          JSON.stringify(response.data.res),
        );
      }
    } catch (err) {
      console.warn("⚠️ Erro ao carregar notificações da API:", err);
      // Tenta cache se falhar
      const cached = await AsyncStorage.getItem(NOTIFICATIONS_CACHE_KEY(addr));
      if (cached) {
        const parsed = JSON.parse(cached);
        console.log("📦 Usando cache local:", parsed.length);
        setNotifications(parsed);
      } else {
        console.log("📭 Nenhuma notificação no cache");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // 3) Marcar como lida
  const markAsRead = useCallback(async (uuid: string) => {
    try {
      await helmApi.patch(`notifications/${uuid}/read`);
      // Atualiza local
      setNotifications((prev) =>
        prev.map((n) => (n.uuid === uuid ? { ...n, read: true } : n)),
      );
    } catch (err) {
      console.error("Erro ao marcar como lida:", err);
    }
  }, []);

  // Mount: registra token e carrega notificações
  useEffect(() => {
    if (!address) {
      console.log("🔴 useNotifications: sem address");
      return;
    }

    console.log("🟢 useNotifications: iniciando com address", address);
    registerPushToken(address);
    loadNotifications(address);
  }, [address, registerPushToken, loadNotifications]);

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    refresh: () => address && loadNotifications(address),
  };
}

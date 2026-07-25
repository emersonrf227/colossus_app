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
 * - Define handler padrão para notificações
 * - Pede permissão ao mount
 * - Busca token Expo e registra na API (primeira vez apenas)
 * - Carrega notificações da API
 * - Configura listeners para notificações recebidas e respostas
 * - Fornece função pra marcar como lida
 */
export function useNotifications(address?: string) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [permissionStatus, setPermissionStatus] = useState<"granted" | "denied" | "pending">("pending");

  // Setup handler padrão de notificações (executar uma vez)
  useEffect(() => {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });
  }, []);

  // Contar não lidas
  useEffect(() => {
    const count = notifications.filter((n) => !n.read).length;
    setUnreadCount(count);
  }, [notifications]);

  // Setup listeners para notificações recebidas
  useEffect(() => {
    if (!address) return;

    // Listener: notificação recebida enquanto app está aberto
    const receivedSubscription = Notifications.addNotificationReceivedListener(() => {
      // Recarrega as notificações da API
      loadNotifications(address);
    });

    // Listener: usuário toca na notificação
    const responseSubscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const uuid = response.notification.request.content.data?.uuid;
        if (uuid) {
          markAsRead(uuid);
        }
        // Recarrega as notificações
        loadNotifications(address);
      }
    );

    // Cleanup: remover listeners ao desmontar
    return () => {
      receivedSubscription.remove();
      responseSubscription.remove();
    };
  }, [address, loadNotifications, markAsRead]);

  // 1) Registrar push token na API (primeira vez)
  const registerPushToken = useCallback(async (addr: string) => {
    if (!addr) return;

    try {
      const key = PUSH_TOKEN_SENT_KEY(addr);
      const alreadySent = await AsyncStorage.getItem(key);

      if (alreadySent === "true") return;

      // Remove marca anterior se existir
      if (alreadySent) {
        await AsyncStorage.removeItem(key);
      }

      // Pede permissão
      const { status } = await Notifications.requestPermissionsAsync();
      setPermissionStatus(status === "granted" ? "granted" : "denied");

      if (status !== "granted") return;

      // Busca token Expo
      try {
        const token = await Notifications.getExpoPushTokenAsync();
        if (!token.data) return;

        // Envia pra API
        await helmApi.post("notifications/add-device", {
          address: addr,
          expo_code: token.data,
        });

        // Marca como enviado
        await AsyncStorage.setItem(key, "true");
      } catch (err: any) {
        console.error("Erro ao registrar token:", err.message);
      }
    } catch (err) {
      console.error("Erro ao registrar push token:", err);
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

      if (response.data?.res) {
        setNotifications(response.data.res);
        // Cache local
        await AsyncStorage.setItem(
          NOTIFICATIONS_CACHE_KEY(addr),
          JSON.stringify(response.data.res),
        );
      }
    } catch (err) {
      // Tenta cache se falhar
      const cached = await AsyncStorage.getItem(NOTIFICATIONS_CACHE_KEY(addr));
      if (cached) {
        setNotifications(JSON.parse(cached));
      }
      console.error("Erro ao carregar notificações:", err);
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
    if (!address) return;

    registerPushToken(address);
    loadNotifications(address);
  }, [address, registerPushToken, loadNotifications]);

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    permissionStatus,
    refresh: () => address && loadNotifications(address),
  };
}

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
    try {
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: true,
        }),
      });
      console.log("✅ Notification handler configurado");
    } catch (err) {
      console.error("Erro ao configurar handler:", err);
    }
  }, []);

  // Contar não lidas
  useEffect(() => {
    const count = notifications.filter((n) => !n.read).length;
    setUnreadCount(count);
  }, [notifications]);

  // Setup listeners para notificações recebidas
  useEffect(() => {
    if (!address) return;

    console.log("📬 Configurando listeners de notificações...");

    // Listener: notificação recebida enquanto app está aberto
    const receivedSubscription = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log("📬 Notificação recebida:", notification.request.content.body);
        // Recarrega as notificações da API
        loadNotifications(address);
      }
    );

    // Listener: usuário toca na notificação
    const responseSubscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        console.log("👆 Notificação tocada:", response.notification.request.content.body);
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
      console.log("🔔 Status de permissão:", status);
      setPermissionStatus(status === "granted" ? "granted" : "denied");

      if (status !== "granted") {
        console.log("🔔 Permissão de notificações negada pelo usuário");
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
    permissionStatus,
    refresh: () => address && loadNotifications(address),
  };
}

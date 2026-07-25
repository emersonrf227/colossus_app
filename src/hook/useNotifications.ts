import { useEffect, useState, useCallback, useRef } from "react";
import { OneSignal } from "react-native-onesignal";
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

const PUSH_ID_SENT_KEY = (address: string) => `oneSignalIdSent:${address}`;
const NOTIFICATIONS_CACHE_KEY = (address: string) => `notifications:${address}`;

/**
 * Hook para gerenciar notificações push (OneSignal) e in-app (API Helm).
 *
 * Diferença principal em relação ao expo-notifications: o OneSignal
 * resolve o registro no FCM/APNs sozinho. O que identificamos aqui é o
 * subscription ID do device, e além disso chamamos OneSignal.login()
 * com o endereço da carteira — assim o backend pode disparar push por
 * external_id (o próprio address) sem depender de guardar device IDs.
 */
export function useNotifications(address?: string) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [permissionStatus, setPermissionStatus] = useState<
    "granted" | "denied" | "pending"
  >("pending");

  // 1) Carregar notificações da API (com cache de fallback)
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
        await AsyncStorage.setItem(
          NOTIFICATIONS_CACHE_KEY(addr),
          JSON.stringify(response.data.res),
        );
      }
    } catch (err) {
      const cached = await AsyncStorage.getItem(NOTIFICATIONS_CACHE_KEY(addr));
      if (cached) {
        setNotifications(JSON.parse(cached));
      }
      console.error("Erro ao carregar notificações:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // 2) Marcar como lida
  const markAsRead = useCallback(async (uuid: string) => {
    try {
      await helmApi.patch(`notifications/${uuid}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.uuid === uuid ? { ...n, read: true } : n)),
      );
    } catch (err) {
      console.error("Erro ao marcar como lida:", err);
    }
  }, []);

  // Refs pros listeners não precisarem re-registrar quando os callbacks mudam
  const loadRef = useRef(loadNotifications);
  const markRef = useRef(markAsRead);
  loadRef.current = loadNotifications;
  markRef.current = markAsRead;

  // 3) Registrar device no OneSignal + na API
  const registerDevice = useCallback(async (addr: string) => {
    if (!addr) return;

    try {
      // Vincula o address como external_id no OneSignal.
      // É idempotente e permite ao backend disparar por external_id.
      OneSignal.login(addr);

      // Pede permissão (fallbackToSettings: abre config do SO se já negou antes)
      const granted = await OneSignal.Notifications.requestPermission(true);
      setPermissionStatus(granted ? "granted" : "denied");

      if (!granted) return;

      const key = PUSH_ID_SENT_KEY(addr);
      const alreadySent = await AsyncStorage.getItem(key);

      // O subscription ID pode demorar alguns instantes pra existir logo
      // após o primeiro grant de permissão — tentamos algumas vezes.
      let subscriptionId: string | null = null;
      for (let attempt = 0; attempt < 5; attempt++) {
        subscriptionId = await OneSignal.User.pushSubscription.getIdAsync();
        if (subscriptionId) break;
        await new Promise((r) => setTimeout(r, 1000));
      }

      if (!subscriptionId) {
        console.warn("OneSignal: subscription ID ainda indisponível");
        return;
      }

      // Só reenvia pra API se o ID mudou (reinstall, novo device, etc)
      if (alreadySent === subscriptionId) return;

      await helmApi.post("notifications/add-device", {
        address: addr,
        // mantido por compatibilidade com o endpoint atual
        expo_code: subscriptionId,
      });

      await AsyncStorage.setItem(key, subscriptionId);
      console.log("✅ Device registrado no OneSignal:", subscriptionId);
    } catch (err) {
      console.error("Erro ao registrar device:", err);
    }
  }, []);

  // Contador de não lidas
  useEffect(() => {
    setUnreadCount(notifications.filter((n) => !n.read).length);
  }, [notifications]);

  // Listeners do OneSignal
  useEffect(() => {
    if (!address) return;

    const onForeground = (event: any) => {
      // Exibe a notificação mesmo com o app aberto
      event.getNotification()?.display?.();
      loadRef.current(address);
    };

    const onClick = (event: any) => {
      const uuid = event?.notification?.additionalData?.uuid;
      if (uuid) markRef.current(uuid);
      loadRef.current(address);
    };

    OneSignal.Notifications.addEventListener(
      "foregroundWillDisplay",
      onForeground,
    );
    OneSignal.Notifications.addEventListener("click", onClick);

    return () => {
      OneSignal.Notifications.removeEventListener(
        "foregroundWillDisplay",
        onForeground,
      );
      OneSignal.Notifications.removeEventListener("click", onClick);
    };
  }, [address]);

  // Mount: registra device e carrega notificações
  useEffect(() => {
    if (!address) return;

    registerDevice(address);
    loadNotifications(address);
  }, [address, registerDevice, loadNotifications]);

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    permissionStatus,
    refresh: () => address && loadNotifications(address),
  };
}

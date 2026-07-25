import { useEffect } from "react";
import { OneSignal, LogLevel } from "react-native-onesignal";

export const ONESIGNAL_APP_ID = "545e5b5a-f337-4b9e-9b97-297d309bcf34";

/**
 * Inicializa o OneSignal uma única vez, no boot do app.
 *
 * O OneSignal cuida do FCM/APNs internamente — não é preciso
 * google-services.json nem configurar Firebase no projeto. As
 * credenciais ficam no painel do OneSignal.
 */
export function useOneSignal() {
  useEffect(() => {
    // Em __DEV__ ajuda a ver no logcat por que um device não registra
    OneSignal.Debug.setLogLevel(__DEV__ ? LogLevel.Verbose : LogLevel.None);

    OneSignal.initialize(ONESIGNAL_APP_ID);

    console.log("✅ OneSignal inicializado");
  }, []);
}

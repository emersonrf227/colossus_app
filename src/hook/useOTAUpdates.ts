import { useEffect } from "react";
import * as Updates from "expo-updates";

/**
 * Verifica e aplica atualizações OTA (EAS Update) no launch do app.
 *
 * - Em desenvolvimento (__DEV__ / Expo Go / dev client) não faz nada.
 * - Se houver update na channel do build, baixa e recarrega o app.
 * - Falhas são silenciosas: o app segue com o bundle atual.
 */
export function useOTAUpdates() {
  useEffect(() => {
    async function checkForUpdate() {
      if (__DEV__ || !Updates.isEnabled) return;

      try {
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
          await Updates.fetchUpdateAsync();
          await Updates.reloadAsync();
        }
      } catch {
        // Sem rede ou servidor indisponível — segue com o bundle atual.
      }
    }

    checkForUpdate();
  }, []);
}

export default useOTAUpdates;

import React, { useEffect, useRef } from "react";
import { ActivityIndicator, StatusBar } from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as S from "./styles";
import { getWalletStatus } from "../../../components/wallet/walletStatus";
import { useToast } from "@/hook/Toast";
import { colors } from "../dashboard/styles";

/**
 * Esta tela não tem UI própria de decisão — ela existe só para
 * consultar o status real da wallet (GET saller/wallet + checagem de
 * seed local) e empurrar o usuário direto para o destino certo:
 *
 * - "none"      -> WalletSetup (escolher criar nova ou conectar externa)
 * - "full"      -> WalletHome em modo completo (saldo + ações)
 * - "view-only" -> WalletHome em modo visualização (só saldo)
 *
 * Sempre que o app precisar entrar na área de carteira (ex: botão no
 * menu principal), navegue para "WalletGate" em vez de ir direto para
 * WalletSetup ou WalletHome — assim a decisão é sempre tomada com dados
 * atuais, nunca assumida.
 */
export default function WalletGate() {
  const navigation = useNavigation();
  const { showToast } = useToast();
  const hasNavigatedRef = useRef(false);

  useEffect(() => {
    let isActive = true;

    (async () => {
      try {
        const status = await getWalletStatus();
        if (!isActive || hasNavigatedRef.current) return;
        hasNavigatedRef.current = true;

        if (status.mode === "none") {
          navigation.reset({
            index: 0,
            routes: [{ name: "WalletSetup" as never }],
          });
          return;
        }

        navigation.reset({
          index: 0,
          routes: [
            {
              name: "WalletHome" as never,
              params: {
                mode: status.mode,
                record: status.record,
              } as never,
            },
          ],
        });
      } catch {
        if (!isActive) return;
        showToast({
          message: "Não foi possível verificar sua carteira. Tente novamente.",
          type: "error",
        });
        navigation.goBack();
      }
    })();

    return () => {
      isActive = false;
    };
  }, [navigation, showToast]);

  return (
    <S.Container>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <ActivityIndicator color={colors.primary} size="large" />
    </S.Container>
  );
}

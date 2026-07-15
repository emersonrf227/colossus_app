import React, { useEffect, useRef, useState } from "react";
import { StatusBar } from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as S from "./styles";
import { getStoredMnemonic } from "../../../components/wallet/walletStorage";
import { hasWalletPin } from "../../../components/wallet/walletPin";

/**
 * Gate da wallet sem login — decisão 100% local:
 *
 * 1. Tem seed + PIN  → WalletHome (modo completo)
 * 2. Tem seed, sem PIN → WalletPinSetup (fluxo interrompido)
 * 3. Sem seed         → WalletSetup (criar ou importar)
 */
export default function WalletGate() {
  const navigation = useNavigation();
  const hasNavigatedRef = useRef(false);
  const [statusText, setStatusText] = useState("Iniciando...");

  useEffect(() => {
    let isActive = true;
    setStatusText("Verificando sua sessão...");

    (async () => {
      if (!isActive || hasNavigatedRef.current) return;
      hasNavigatedRef.current = true;

      const mnemonic = await getStoredMnemonic();
      const pinConfigured = await hasWalletPin();

      if (!isActive) return;

      if (!mnemonic) {
        // Sem seed — vai criar ou importar
        (navigation as any).replace("WalletSetup");
        return;
      }

      if (!pinConfigured) {
        // Tem seed mas PIN não foi configurado (fluxo interrompido)
        (navigation as any).replace("WalletPinSetup", { mode: "create" });
        return;
      }

      // Tudo pronto — abre a wallet
      (navigation as any).replace("WalletHome");
    })();

    return () => {
      isActive = false;
    };
  }, [navigation]);

  return (
    <S.Container>
      <S.Background source={require("@/assets/background.png")}>
        <S.BackgroundOverlay />
      </S.Background>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      <S.LoaderWrapper>
        <S.LoaderAnimation
          source={require("@/assets/helm-loading.gif")}
          resizeMode="contain"
        />
        <S.StatusText>{statusText}</S.StatusText>
      </S.LoaderWrapper>
    </S.Container>
  );
}

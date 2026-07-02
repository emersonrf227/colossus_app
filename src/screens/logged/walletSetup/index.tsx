import React, { useState, useCallback } from "react";
import { Clipboard, StatusBar } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { isAddress } from "ethers";
import {
  ArrowLeft,
  Wallet,
  Sparkles,
  ClipboardPaste,
  ShieldAlert,
  KeyRound,
} from "lucide-react-native";

import * as S from "./styles";
import { useToast } from "@/hook/Toast";
import { persistExternalWallet } from "../../../components/wallet/walletStorage";
import { colors } from "../dashboard/styles";

type Mode = "choice" | "external";

export default function WalletSetup() {
  const navigation = useNavigation();
  const { navigate } = navigation;
  const { showToast } = useToast();

  const [mode, setMode] = useState<Mode>("choice");
  const [externalAddress, setExternalAddress] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handlePaste = useCallback(async () => {
    try {
      const text = await Clipboard.getString();
      setExternalAddress(text.trim());
    } catch {
      showToast({
        message: "Não foi possível acessar a área de transferência",
        type: "error",
      });
    }
  }, [showToast]);

  const handleConfirmExternal = useCallback(async () => {
    if (!isAddress(externalAddress)) {
      showToast({ message: "Endereço inválido.", type: "error" });
      return;
    }
    setSubmitting(true);
    try {
      await persistExternalWallet(externalAddress);
      showToast({ message: "Wallet externa conectada!", type: "success" });
      navigate("WalletHome" as never);
    } catch {
      showToast({
        message: "Não foi possível salvar a wallet. Tente novamente.",
        type: "error",
      });
    } finally {
      setSubmitting(false);
    }
  }, [externalAddress, showToast, navigate]);

  const handleCreateNew = useCallback(() => {
    navigate("WalletBackup" as never);
  }, [navigate]);

  const handleImport = useCallback(() => {
    navigate("WalletImport" as never);
  }, [navigate]);

  return (
    <S.Container>
      <S.Background source={require("@/assets/background.png")}>
        <S.BackgroundOverlay />
        <StatusBar
          barStyle="light-content"
          backgroundColor="transparent"
          translucent
        />

        <S.SafeArea>
          <S.Header>
            <S.BackButton
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
            >
              <ArrowLeft size={22} color="#FFFFFF" strokeWidth={2.2} />
            </S.BackButton>
            <S.HeaderTitle>Configurar carteira</S.HeaderTitle>
          </S.Header>

          <S.IntroWrapper>
            <S.IntroIconWrapper>
              <Wallet size={30} color={colors.primary} strokeWidth={2} />
            </S.IntroIconWrapper>
            <S.IntroTitle>Como você quer configurar?</S.IntroTitle>
            <S.IntroSubtitle>
              Crie uma nova carteira, importe uma existente ou conecte um
              endereço externo para visualização.
            </S.IntroSubtitle>
          </S.IntroWrapper>

          {/* Opção 1: Criar nova */}
          <S.OptionCard onPress={handleCreateNew} activeOpacity={0.8}>
            <S.OptionHeaderRow>
              <S.OptionIconWrapper accentColor={colors.primary}>
                <Sparkles size={20} color={colors.primary} strokeWidth={2.2} />
              </S.OptionIconWrapper>
              <S.OptionTitle>Criar nova carteira</S.OptionTitle>
              <S.RecommendedBadge>
                <S.RecommendedBadgeText>RECOMENDADO</S.RecommendedBadgeText>
              </S.RecommendedBadge>
            </S.OptionHeaderRow>
            <S.OptionDescription>
              O app gera uma carteira só sua, com saldo, saque e PIX integrados.
              Você guarda a frase de recuperação de 12 palavras.
            </S.OptionDescription>
          </S.OptionCard>

          {/* Opção 2: Importar via seed phrase */}
          <S.OptionCard onPress={handleImport} activeOpacity={0.8}>
            <S.OptionHeaderRow>
              <S.OptionIconWrapper accentColor={colors.accent}>
                <KeyRound size={20} color={colors.accent} strokeWidth={2.2} />
              </S.OptionIconWrapper>
              <S.OptionTitle>Importar carteira existente</S.OptionTitle>
            </S.OptionHeaderRow>
            <S.OptionDescription>
              Já tem uma carteira com frase de 12 palavras (MetaMask, Trust
              Wallet, SafePal)? Importe aqui para ter acesso completo a saldo,
              saque e PIX.
            </S.OptionDescription>
          </S.OptionCard>

          {/* Opção 3: Endereço externo (só visualização) */}
          <S.OptionCard
            onPress={() => setMode(mode === "external" ? "choice" : "external")}
            activeOpacity={0.8}
          >
            <S.OptionHeaderRow>
              <S.OptionIconWrapper accentColor={colors.textMuted}>
                <Wallet size={20} color={colors.textMuted} strokeWidth={2.2} />
              </S.OptionIconWrapper>
              <S.OptionTitle>Só visualizar saldo</S.OptionTitle>
            </S.OptionHeaderRow>
            <S.OptionDescription>
              Informe apenas o endereço público. Você verá o saldo mas não
              poderá sacar pelo app — movimentações ficam na sua wallet
              original.
            </S.OptionDescription>

            {mode === "external" && (
              <S.ExternalFormWrapper>
                <S.InputWrapper>
                  <S.StyledInput
                    placeholder="0x..."
                    placeholderTextColor="rgba(255,255,255,0.35)"
                    value={externalAddress}
                    onChangeText={setExternalAddress}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  <S.PasteButton onPress={handlePaste} activeOpacity={0.7}>
                    <ClipboardPaste
                      size={18}
                      color={colors.textMuted}
                      strokeWidth={2.2}
                    />
                  </S.PasteButton>
                </S.InputWrapper>

                <S.ConfirmButton
                  onPress={handleConfirmExternal}
                  disabled={submitting || !externalAddress}
                  activeOpacity={0.85}
                >
                  <S.ConfirmButtonText>Conectar endereço</S.ConfirmButtonText>
                </S.ConfirmButton>
              </S.ExternalFormWrapper>
            )}
          </S.OptionCard>

          <S.WarningNote>
            <ShieldAlert size={11} color={colors.textMuted} /> Nunca compartilhe
            sua frase de 12 palavras ou chave privada com ninguém. A Colossus
            Crypto jamais vai pedir essas informações.
          </S.WarningNote>
        </S.SafeArea>
      </S.Background>
    </S.Container>
  );
}

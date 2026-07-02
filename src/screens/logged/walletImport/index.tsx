import React, { useState, useCallback, useRef } from "react";
import { StatusBar, TextInput, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ArrowLeft, Download, AlertTriangle } from "lucide-react-native";
import styled from "styled-components/native";
import { ethers } from "ethers";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Platform, StatusBar as RNStatusBar } from "react-native";

import { useToast } from "@/hook/Toast";
import { persistGeneratedWallet } from "../../../components/wallet/walletStorage";
import { registerWalletAddress } from "../../../components/wallet/walletStatus";
import { colors } from "../dashboard/styles";

const STATUSBAR_HEIGHT =
  Platform.OS === "android" ? (RNStatusBar.currentHeight ?? 24) : 0;

// --- Estilos ---
const Container = styled.View`
  flex: 1;
  background-color: ${colors.bgDark};
`;
const Background = styled.ImageBackground`
  flex: 1;
  width: 100%;
  height: 100%;
`;
const Overlay = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(5, 4, 10, 0.72);
`;
const SafeArea = styled.SafeAreaView`
  flex: 1;
  padding-top: ${STATUSBAR_HEIGHT}px;
`;
const Header = styled.View`
  flex-direction: row;
  align-items: center;
  padding-horizontal: ${wp(5)}px;
  margin-top: ${hp(1)}px;
  margin-bottom: ${hp(2)}px;
`;
const BackButton = styled.TouchableOpacity`
  width: 44px;
  height: 44px;
  border-radius: 14px;
  align-items: center;
  justify-content: center;
  background-color: ${colors.surface};
  border-width: 1px;
  border-color: ${colors.surfaceBorder};
`;
const HeaderTitle = styled.Text`
  color: ${colors.textPrimary};
  font-size: 18px;
  font-weight: 700;
  margin-left: 14px;
`;
const WarningCard = styled.View`
  flex-direction: row;
  align-items: flex-start;
  gap: 10px;
  padding: 14px;
  border-radius: 16px;
  margin-horizontal: ${wp(5)}px;
  margin-bottom: ${hp(2)}px;
  background-color: rgba(255, 107, 107, 0.1);
  border-width: 1px;
  border-color: rgba(255, 107, 107, 0.3);
`;
const WarningText = styled.Text`
  flex: 1;
  color: ${colors.textPrimary};
  font-size: 12.5px;
  line-height: 18px;
`;
const WarningHighlight = styled.Text`
  font-weight: 700;
  color: ${colors.danger};
`;
const SectionLabel = styled.Text`
  color: ${colors.textMuted};
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1.1px;
  margin-horizontal: ${wp(5)}px;
  margin-bottom: ${hp(1.5)}px;
`;
const WordsGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  padding-horizontal: ${wp(5)}px;
  margin-bottom: ${hp(3)}px;
`;
const WordInputWrapper = styled.View<{ hasError?: boolean }>`
  width: 31%;
  margin-bottom: 10px;
  border-radius: 12px;
  padding: 8px 10px;
  background-color: ${colors.surface};
  border-width: 1.5px;
  border-color: ${({ hasError }) =>
    hasError ? colors.danger : colors.surfaceBorder};
`;
const WordIndex = styled.Text`
  color: ${colors.textMuted};
  font-size: 10px;
  font-weight: 700;
  margin-bottom: 3px;
`;
const WordInputField = styled.TextInput`
  color: ${colors.textPrimary};
  font-size: 13px;
  padding: 0;
`;
const SubmitButton = styled.TouchableOpacity<{ disabled?: boolean }>`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: ${hp(6.8)}px;
  border-radius: 16px;
  margin-horizontal: ${wp(5)}px;
  margin-bottom: ${hp(4)}px;
  background-color: ${colors.primary};
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
  elevation: 8;
`;
const SubmitButtonText = styled.Text`
  color: #fff;
  font-size: 15px;
  font-weight: 700;
`;

export default function WalletImport() {
  const navigation = useNavigation();
  const { navigate, goBack } = navigation;
  const { showToast } = useToast();

  const [words, setWords] = useState<string[]>(Array(12).fill(""));
  const [errors, setErrors] = useState<boolean[]>(Array(12).fill(false));
  const [submitting, setSubmitting] = useState(false);

  // Refs para navegar entre campos com o teclado
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const handleWordChange = useCallback((index: number, value: string) => {
    // Detecta se o usuário colou a frase inteira no primeiro campo
    const trimmed = value.trim();
    const parts = trimmed.split(/\s+/);
    if (parts.length === 12 && index === 0) {
      setWords(parts.map((w) => w.toLowerCase()));
      setErrors(Array(12).fill(false));
      // Foca no último campo após colar
      inputRefs.current[11]?.focus();
      return;
    }

    setWords((prev) => {
      const next = [...prev];
      next[index] = value.toLowerCase().trim();
      return next;
    });
    setErrors((prev) => {
      const next = [...prev];
      next[index] = false;
      return next;
    });
  }, []);

  const handleSubmit = useCallback(async () => {
    // Valida que todos os campos estão preenchidos
    const newErrors = words.map((w) => !w || w.trim().length === 0);
    if (newErrors.some(Boolean)) {
      setErrors(newErrors);
      showToast({ message: "Preencha todas as 12 palavras.", type: "error" });
      return;
    }

    const mnemonic = words.map((w) => w.trim()).join(" ");

    // Valida o mnemônico via ethers antes de salvar
    try {
      ethers.Mnemonic.fromPhrase(mnemonic); // lança se inválido
    } catch {
      showToast({
        message:
          "Frase de recuperação inválida. Verifique as palavras e a ordem.",
        type: "error",
      });
      return;
    }

    setSubmitting(true);
    try {
      const wallet = ethers.Wallet.fromPhrase(mnemonic);

      // Persiste a seed localmente (criptografada)
      await persistGeneratedWallet({ address: wallet.address, mnemonic });

      // Registra o endereço na API
      try {
        await registerWalletAddress({
          network: "polygon",
          address: wallet.address,
        });
      } catch {
        showToast({
          message:
            "Carteira importada localmente, mas não foi possível registrá-la no servidor. Verifique sua internet.",
          type: "error",
        });
        navigate("WalletPinSetup" as never, { mode: "create" } as never);
        return;
      }

      showToast({
        message: "Carteira importada com sucesso!",
        type: "success",
      });
      navigate("WalletPinSetup" as never, { mode: "create" } as never);
    } catch {
      showToast({
        message: "Não foi possível importar a carteira. Tente novamente.",
        type: "error",
      });
    } finally {
      setSubmitting(false);
    }
  }, [words, showToast, navigate]);

  const allFilled = words.every((w) => w.trim().length > 0);

  return (
    <Container>
      <Background source={require("@/assets/background.png")}>
        <Overlay />
        <StatusBar
          barStyle="light-content"
          backgroundColor="transparent"
          translucent
        />

        <SafeArea>
          <Header>
            <BackButton onPress={() => goBack()} activeOpacity={0.7}>
              <ArrowLeft size={22} color="#FFFFFF" strokeWidth={2.2} />
            </BackButton>
            <HeaderTitle>Importar carteira</HeaderTitle>
          </Header>

          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <WarningCard>
              <AlertTriangle
                size={18}
                color={colors.danger}
                strokeWidth={2.2}
              />
              <WarningText>
                <WarningHighlight>Nunca compartilhe</WarningHighlight> sua frase
                de recuperação. A Colossus Crypto nunca vai pedir essas palavras
                por telefone, chat ou e-mail. Digite apenas em conexões
                confiáveis.
              </WarningText>
            </WarningCard>

            <SectionLabel>FRASE DE RECUPERAÇÃO (12 PALAVRAS)</SectionLabel>

            <WordsGrid>
              {Array.from({ length: 12 }).map((_, index) => (
                <WordInputWrapper key={index} hasError={errors[index]}>
                  <WordIndex>{index + 1}.</WordIndex>
                  <WordInputField
                    ref={(ref) => {
                      inputRefs.current[index] = ref;
                    }}
                    placeholder="palavra"
                    placeholderTextColor="rgba(255,255,255,0.25)"
                    value={words[index]}
                    onChangeText={(text) => handleWordChange(index, text)}
                    autoCapitalize="none"
                    autoCorrect={false}
                    returnKeyType={index < 11 ? "next" : "done"}
                    onSubmitEditing={() => {
                      if (index < 11) inputRefs.current[index + 1]?.focus();
                    }}
                    blurOnSubmit={index === 11}
                  />
                </WordInputWrapper>
              ))}
            </WordsGrid>

            <SubmitButton
              onPress={handleSubmit}
              disabled={!allFilled || submitting}
              activeOpacity={0.85}
            >
              <Download size={18} color="#FFFFFF" strokeWidth={2.2} />
              <SubmitButtonText>
                {submitting ? "Importando..." : "Importar carteira"}
              </SubmitButtonText>
            </SubmitButton>
          </ScrollView>
        </SafeArea>
      </Background>
    </Container>
  );
}

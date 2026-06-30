import React, { useState, useMemo, useCallback, useEffect } from "react";
import { StatusBar } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ArrowLeft, Eye, AlertTriangle, Check } from "lucide-react-native";
import * as S from "./styles";
import { useToast } from "@/hook/Toast";
import {
  generateWallet,
  pickRandomWordIndexes,
  persistGeneratedWallet,
} from "../../../components/wallet/walletStorage";
import { registerWalletAddress } from "../../../components/wallet/walletStatus";
import { colors } from "../dashboard/styles";

type Step = "reveal" | "confirm";

export default function WalletBackup() {
  const navigation = useNavigation();
  const { navigate } = navigation;
  const { showToast } = useToast();

  // A wallet é gerada uma única vez, em memória, na montagem da tela —
  // e SÓ é persistida (criptografada) depois que o usuário confirmar
  // corretamente as palavras sorteadas. Até esse ponto, ela existe
  // apenas neste estado de componente; se o usuário sair da tela antes
  // de confirmar, nada é salvo e a próxima tentativa gera uma wallet
  // nova do zero (não há "meia wallet" persistida).
  const wallet = useMemo(() => generateWallet(), []);
  const words = useMemo(() => wallet.mnemonic.split(" "), [wallet]);

  const [step, setStep] = useState<Step>("reveal");
  const [blurred, setBlurred] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const checkIndexes = useMemo(
    () => pickRandomWordIndexes(words.length, 3),
    [words.length],
  );
  const [confirmInputs, setConfirmInputs] = useState<Record<number, string>>(
    {},
  );
  const [fieldErrors, setFieldErrors] = useState<Record<number, boolean>>({});

  const handleRevealAndContinue = useCallback(() => {
    if (blurred) {
      showToast({
        message: "Toque em 'Revelar palavras' antes de continuar.",
        type: "error",
      });
      return;
    }
    setStep("confirm");
  }, [blurred, showToast]);

  const handleConfirmInputChange = useCallback(
    (index: number, value: string) => {
      setConfirmInputs((prev) => ({
        ...prev,
        [index]: value.trim().toLowerCase(),
      }));
      setFieldErrors((prev) => ({ ...prev, [index]: false }));
    },
    [],
  );

  const handleFinish = useCallback(async () => {
    const errors: Record<number, boolean> = {};
    let allCorrect = true;

    checkIndexes.forEach((index) => {
      const expected = words[index].toLowerCase();
      const typed = (confirmInputs[index] ?? "").toLowerCase();
      const isCorrect = typed === expected;
      errors[index] = !isCorrect;
      if (!isCorrect) allCorrect = false;
    });

    setFieldErrors(errors);

    if (!allCorrect) {
      showToast({
        message: "Alguma palavra não confere. Verifique seu backup.",
        type: "error",
      });
      return;
    }

    setSubmitting(true);
    try {
      // Ordem importa: persiste a seed localmente primeiro (rápido,
      // sempre funciona offline), só então registra o endereço na API
      // (pode falhar por rede). Se o registro na API falhar, a seed já
      // está salva neste device — o usuário não perde a carteira, só
      // precisa que o endereço seja sincronizado depois.
      await persistGeneratedWallet(wallet);

      try {
        await registerWalletAddress({
          network: "polygon",
          address: wallet.address,
        });
      } catch {
        // A seed já está salva neste device nesse ponto — o usuário não
        // perde a carteira, mas o endereço ainda não está sincronizado
        // com o backend (logo, não vai aparecer no GET saller/wallet
        // até isso ser refeito). Não há retry automático implementado
        // ainda; o usuário precisa tentar novamente manualmente.
        showToast({
          message:
            "Carteira criada localmente, mas não foi possível registrá-la no servidor. Verifique sua internet e tente novamente em Configurações > Carteira.",
          type: "error",
        });
        navigate("WalletHome" as never);
        return;
      }

      showToast({ message: "Carteira criada com sucesso!", type: "success" });
      navigate("WalletHome" as never);
    } catch {
      showToast({
        message: "Não foi possível salvar a carteira. Tente novamente.",
        type: "error",
      });
    } finally {
      setSubmitting(false);
    }
  }, [checkIndexes, words, confirmInputs, wallet, showToast, navigate]);

  const allFieldsFilled = checkIndexes.every(
    (index) => (confirmInputs[index] ?? "").length > 0,
  );

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
            <S.HeaderTitle>
              {step === "reveal" ? "Frase de recuperação" : "Confirme o backup"}
            </S.HeaderTitle>
          </S.Header>

          <S.ScrollContent showsVerticalScrollIndicator={false}>
            {step === "reveal" ? (
              <>
                <S.WarningCard>
                  <AlertTriangle
                    size={18}
                    color={colors.danger}
                    strokeWidth={2.2}
                  />
                  <S.WarningText>
                    <S.WarningHighlight>Nunca compartilhe</S.WarningHighlight>{" "}
                    estas 12 palavras com ninguém. Qualquer pessoa com elas pode
                    acessar e mover todo o saldo da sua carteira. A Colossus
                    Crypto nunca vai pedir essas palavras por telefone, chat ou
                    e-mail.
                  </S.WarningText>
                </S.WarningCard>

                {blurred ? (
                  <S.RevealButton
                    onPress={() => setBlurred(false)}
                    activeOpacity={0.75}
                  >
                    <Eye size={16} color={colors.textMuted} strokeWidth={2.2} />
                    <S.RevealButtonText>
                      Toque para revelar as palavras
                    </S.RevealButtonText>
                  </S.RevealButton>
                ) : (
                  <S.WordsGrid>
                    {words.map((word, index) => (
                      <S.WordChip key={index}>
                        <S.WordIndex>{index + 1}.</S.WordIndex>
                        <S.WordText>{word}</S.WordText>
                      </S.WordChip>
                    ))}
                  </S.WordsGrid>
                )}

                <S.PrimaryButton
                  onPress={handleRevealAndContinue}
                  disabled={blurred}
                  activeOpacity={0.85}
                >
                  <S.PrimaryButtonText>
                    Já anotei, continuar
                  </S.PrimaryButtonText>
                </S.PrimaryButton>
              </>
            ) : (
              <>
                <S.StepLabel>ÚLTIMA ETAPA</S.StepLabel>
                <S.StepTitle>Confirme que anotou corretamente</S.StepTitle>
                <S.StepSubtitle>
                  Digite as palavras solicitadas para confirmar seu backup. Isso
                  garante que você realmente guardou a frase em local seguro.
                </S.StepSubtitle>

                {checkIndexes.map((index) => (
                  <S.ConfirmFieldWrapper key={index}>
                    <S.ConfirmFieldLabel>
                      PALAVRA Nº {index + 1}
                    </S.ConfirmFieldLabel>
                    <S.ConfirmInput
                      placeholder="Digite a palavra"
                      placeholderTextColor="rgba(255,255,255,0.3)"
                      value={confirmInputs[index] ?? ""}
                      onChangeText={(text) =>
                        handleConfirmInputChange(index, text)
                      }
                      autoCapitalize="none"
                      autoCorrect={false}
                      hasError={fieldErrors[index]}
                    />
                  </S.ConfirmFieldWrapper>
                ))}

                <S.PrimaryButton
                  onPress={handleFinish}
                  disabled={!allFieldsFilled || submitting}
                  activeOpacity={0.85}
                >
                  <Check size={18} color="#FFFFFF" strokeWidth={2.4} />
                  <S.PrimaryButtonText>
                    Confirmar e criar carteira
                  </S.PrimaryButtonText>
                </S.PrimaryButton>
              </>
            )}
          </S.ScrollContent>
        </S.SafeArea>
      </S.Background>
    </S.Container>
  );
}

import React, { useState, useCallback, useRef } from "react";
import { StatusBar } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { ArrowLeft, Delete } from "lucide-react-native";
import * as S from "./styles";
import {
  saveWalletPin,
  clearWalletPin,
} from "../../../components/wallet/walletPin";
import { useToast } from "@/hook/Toast";
import { colors } from "../dashboard/styles";

const PIN_LENGTH = 6;
const KEYPAD = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "⌫"];

interface RouteParams {
  // "create" = parte do fluxo de criação de wallet (navega pro WalletHome ao terminar)
  // "reset"  = redefinição via fluxo de recuperação (navega de volta ao modal/tela chamadora)
  mode?: "create" | "reset";
}

type Step = "enter" | "confirm";

export default function WalletPinSetup() {
  const navigation = useNavigation();
  const { navigate, goBack } = navigation;
  const route = useRoute();
  const { showToast } = useToast();

  const { mode = "create" } = (route.params ?? {}) as RouteParams;

  const [step, setStep] = useState<Step>("enter");
  const [firstPin, setFirstPin] = useState<string[]>([]);
  const [confirmPin, setConfirmPin] = useState<string[]>([]);
  const [hasError, setHasError] = useState(false);
  const [saving, setSaving] = useState(false);

  const currentPin = step === "enter" ? firstPin : confirmPin;
  const setCurrentPin = step === "enter" ? setFirstPin : setConfirmPin;

  const handleKeyPress = useCallback(
    async (key: string) => {
      if (key === "⌫") {
        setCurrentPin((prev) => prev.slice(0, -1));
        setHasError(false);
        return;
      }

      if (!key || currentPin.length >= PIN_LENGTH) return;

      const next = [...currentPin, key];
      setCurrentPin(next);
      setHasError(false);

      if (next.length < PIN_LENGTH) return;

      // PIN completo — aguarda um frame pra o dot final aparecer cheio
      // antes de processar, dando feedback visual antes de qualquer
      // transição de estado.
      await new Promise((r) => setTimeout(r, 120));

      if (step === "enter") {
        setStep("confirm");
        return;
      }

      // Etapa de confirmação: verifica se os dois PINs batem.
      if (firstPin.join("") !== next.join("")) {
        setHasError(true);
        setConfirmPin([]);
        showToast({
          message: "Os PINs não coincidem. Tente novamente.",
          type: "error",
        });
        return;
      }

      // PINs batem: persiste e navega.
      setSaving(true);
      try {
        if (mode === "reset") await clearWalletPin();
        await saveWalletPin(next.join(""));
        showToast({
          message:
            mode === "reset"
              ? "PIN redefinido com sucesso!"
              : "PIN criado com sucesso!",
          type: "success",
        });
        if (mode === "reset") {
          goBack();
        } else {
          navigate("WalletHome" as never);
        }
      } catch {
        showToast({
          message: "Não foi possível salvar o PIN. Tente novamente.",
          type: "error",
        });
        setConfirmPin([]);
      } finally {
        setSaving(false);
      }
    },
    [
      currentPin,
      step,
      firstPin,
      mode,
      showToast,
      navigate,
      goBack,
      setCurrentPin,
    ],
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
            {step === "confirm" ? (
              <S.BackButton
                onPress={() => {
                  setStep("enter");
                  setConfirmPin([]);
                  setHasError(false);
                }}
                activeOpacity={0.7}
              >
                <ArrowLeft size={22} color="#FFFFFF" strokeWidth={2.2} />
              </S.BackButton>
            ) : (
              <S.BackButton onPress={() => goBack()} activeOpacity={0.7}>
                <ArrowLeft size={22} color="#FFFFFF" strokeWidth={2.2} />
              </S.BackButton>
            )}
          </S.Header>

          <S.Content>
            <S.StepLabel>
              {mode === "reset" ? "REDEFINIR PIN" : "CRIAR PIN"}
            </S.StepLabel>
            <S.StepTitle>
              {step === "enter" ? "Escolha seu PIN" : "Confirme o PIN"}
            </S.StepTitle>
            <S.StepSubtitle>
              {step === "enter"
                ? "Este PIN de 6 dígitos será pedido antes de qualquer movimentação da carteira."
                : "Digite o PIN novamente para confirmar."}
            </S.StepSubtitle>

            <S.DotsRow>
              {Array.from({ length: PIN_LENGTH }).map((_, index) => (
                <S.Dot
                  key={index}
                  filled={index < currentPin.length}
                  hasError={hasError}
                />
              ))}
            </S.DotsRow>

            {hasError && <S.ErrorText>Os PINs não coincidem.</S.ErrorText>}

            <S.Keypad>
              {KEYPAD.map((key, index) => (
                <S.KeypadButton
                  key={index}
                  onPress={() => key && handleKeyPress(key)}
                  activeOpacity={key ? 0.6 : 1}
                  disabled={!key || saving}
                  style={{ opacity: !key ? 0 : 1 }}
                >
                  {key === "⌫" ? (
                    <Delete
                      size={22}
                      color={colors.textMuted}
                      strokeWidth={2}
                    />
                  ) : (
                    <S.KeypadButtonText>{key}</S.KeypadButtonText>
                  )}
                </S.KeypadButton>
              ))}
            </S.Keypad>
          </S.Content>
        </S.SafeArea>
      </S.Background>
    </S.Container>
  );
}

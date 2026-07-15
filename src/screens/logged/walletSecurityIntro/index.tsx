import React, { useState, useCallback } from "react";
import { StatusBar } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  ArrowLeft,
  ShieldCheck,
  PenLine,
  CameraOff,
  CloudOff,
  Check,
} from "lucide-react-native";
import { useTranslation } from "react-i18next";

import * as S from "./styles";
import { colors } from "../dashboard/styles";

/**
 * Passos educativos exibidos ANTES da geração das 12 palavras.
 *
 * Cada passo ocupa uma tela; o último exige aceite explícito de que a
 * perda da seed significa perda definitiva dos fundos. Só depois disso
 * o usuário chega em WalletBackup (onde a seed é gerada e exibida).
 */
const STEPS = [
  { icon: ShieldCheck, accent: colors.primary, key: "selfCustody" },
  { icon: PenLine, accent: colors.accent, key: "writePaper" },
  { icon: CameraOff, accent: "#F7B731", key: "noScreenshot" },
  { icon: CloudOff, accent: "#FF6B6B", key: "noCloud" },
] as const;

export default function WalletSecurityIntro() {
  const navigation = useNavigation();
  const { navigate, goBack } = navigation;
  const route = useRoute();
  // Para onde ir após o aceite: gerar seed (padrão) ou importar
  const target =
    (route.params as { target?: string } | undefined)?.target ??
    "WalletBackup";
  const { t } = useTranslation();
  const [step, setStep] = useState(0);
  const [accepted, setAccepted] = useState(false);

  const isLast = step === STEPS.length - 1;
  const current = STEPS[step];
  const Icon = current.icon;

  const handleNext = useCallback(() => {
    if (!isLast) {
      setStep((s) => s + 1);
      return;
    }
    if (!accepted) return;
    navigate(target as never);
  }, [isLast, accepted, navigate, target]);

  const handleBack = useCallback(() => {
    if (step === 0) goBack();
    else setStep((s) => s - 1);
  }, [step, goBack]);

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
            <S.BackButton onPress={handleBack} activeOpacity={0.7}>
              <ArrowLeft size={22} color="#fff" strokeWidth={2.2} />
            </S.BackButton>
            <S.HeaderTitle>{t("walletSecurity.title")}</S.HeaderTitle>
          </S.Header>

          <S.Content>
            <S.StepIconWrapper accentColor={current.accent}>
              <Icon size={40} color={current.accent} strokeWidth={2} />
            </S.StepIconWrapper>
            <S.StepTitle>
              {t(`walletSecurity.steps.${current.key}.title`)}
            </S.StepTitle>
            <S.StepText>
              {t(`walletSecurity.steps.${current.key}.text`)}
            </S.StepText>
          </S.Content>

          <S.Footer>
            <S.DotsRow>
              {STEPS.map((s, i) => (
                <S.Dot key={s.key} active={i === step} />
              ))}
            </S.DotsRow>

            {isLast && (
              <S.AcceptRow
                onPress={() => setAccepted((v) => !v)}
                activeOpacity={0.8}
              >
                <S.Checkbox checked={accepted}>
                  {accepted && (
                    <Check size={16} color="#fff" strokeWidth={3} />
                  )}
                </S.Checkbox>
                <S.AcceptText>{t("walletSecurity.acceptText")}</S.AcceptText>
              </S.AcceptRow>
            )}

            <S.PrimaryButton
              onPress={handleNext}
              disabled={isLast && !accepted}
              activeOpacity={0.85}
            >
              <S.PrimaryButtonText disabled={isLast && !accepted}>
                {isLast
                  ? t("walletSecurity.acceptButton")
                  : t("walletSecurity.nextButton")}
              </S.PrimaryButtonText>
            </S.PrimaryButton>
          </S.Footer>
        </S.SafeArea>
      </S.Background>
    </S.Container>
  );
}

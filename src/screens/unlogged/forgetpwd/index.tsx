import React, { useState, useCallback } from "react";
import { StatusBar } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ArrowLeft, Mail, SendHorizontal } from "lucide-react-native";
import * as S from "./styles";
import LogoSvg from "@/assets/logov2.svg";
import { useToast } from "@/hook/Toast";
import rstruther from "@/infraestructure/http/nodeApi";
import Loader from "@/components/loader";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useTranslation } from "react-i18next";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ForgetPwd() {
  const { t } = useTranslation();
  const [identifier, setIdentifier] = useState("");
  const [loading, setLoading] = useState(false);
  const { navigate, goBack } = useNavigation();
  const { showToast } = useToast();

  const sendResetPassword = useCallback(async () => {
    if (!identifier) {
      showToast({ message: "Informe seu e-mail.", type: "error" });
      return;
    }

    if (!EMAIL_REGEX.test(identifier)) {
      showToast({ message: "Informe um e-mail válido.", type: "error" });
      return;
    }

    setLoading(true);
    try {
      const response = await rstruther.post("auth/recovery-password", {
        email: identifier,
      });

      if (response.status === 200 || response.status === 201) {
        showToast({
          message: "Enviamos um código para o seu e-mail.",
          type: "success",
        });
        navigate("PinForget" as never, { email: identifier } as never);
      }
    } catch (error: any) {
      // error?.response pode ser undefined em falhas de rede — nunca
      // acessar error.response.data.message direto sem optional chaining,
      // ou o catch quebra e mascara o toast que acabamos de mostrar.
      const message =
        error?.response?.data?.message ?? "Não foi possível enviar o e-mail.";
      showToast({ message, type: "error" });
    } finally {
      setLoading(false);
    }
  }, [identifier, showToast, navigate]);

  return (
    <S.Container>
      {loading && <Loader />}
      <S.Background source={require("@/assets/background.png")}>
        <S.BackgroundOverlay />
        <StatusBar
          barStyle="light-content"
          backgroundColor="transparent"
          translucent
        />

        <S.SafeArea>
          <S.Header>
            <S.BackButton onPress={() => goBack()} activeOpacity={0.7}>
              <ArrowLeft size={22} color="#FFFFFF" strokeWidth={2.2} />
            </S.BackButton>
          </S.Header>

          <S.ScrollContent
            contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <S.LogoWrapper>
              <LogoSvg width={wp(40)} height={hp(12)} />
              <S.Title>{t("forget.title")}</S.Title>
              <S.Subtitle>{t("forget.subtitle")}</S.Subtitle>
            </S.LogoWrapper>

            <S.InputWrapper>
              <S.InputIconWrapper>
                <Mail size={18} color="#FFFFFF" strokeWidth={2} opacity={0.6} />
              </S.InputIconWrapper>
              <S.StyledInput
                placeholder={t("forget.iemail")}
                placeholderTextColor="rgba(255,255,255,0.4)"
                value={identifier}
                onChangeText={(text) =>
                  setIdentifier(text.toLowerCase().trim())
                }
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
              />
            </S.InputWrapper>

            <S.SubmitButton
              onPress={sendResetPassword}
              disabled={loading}
              activeOpacity={0.85}
            >
              <SendHorizontal size={18} color="#FFFFFF" strokeWidth={2.2} />
              <S.SubmitButtonText>{t("forget.send")}</S.SubmitButtonText>
            </S.SubmitButton>

            <S.BackToLoginButton
              onPress={() => navigate("SingIn" as never)}
              activeOpacity={0.7}
            >
              <S.BackToLoginText>
                {t("forget.know")}{" "}
                <S.BackToLoginHighlight>
                  {t("forget.open")}
                </S.BackToLoginHighlight>
              </S.BackToLoginText>
            </S.BackToLoginButton>
          </S.ScrollContent>
        </S.SafeArea>
      </S.Background>
    </S.Container>
  );
}

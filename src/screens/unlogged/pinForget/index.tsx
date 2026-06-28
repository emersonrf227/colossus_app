import React, {
  useRef,
  useState,
  useCallback,
  useMemo,
  useEffect,
} from "react";
import { TextInput, StatusBar } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { ArrowLeft, Lock, Eye, EyeOff, ShieldCheck } from "lucide-react-native";
import * as S from "./styles";
import LogoSvg from "@/assets/logov2.svg";
import rstruther from "@/infraestructure/http/nodeApi";
import { useToast } from "@/hook/Toast";
import Loader from "@/components/loader";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useTranslation } from "react-i18next";

interface RouteParams {
  email?: string;
}

const PIN_LENGTH = 6;

export default function PinForget() {
  const [pin, setPin] = useState<string[]>(Array(PIN_LENGTH).fill(""));
  const inputs = useRef<(TextInput | null)[]>([]);
  const { t } = useTranslation();

  const [password, setPassword] = useState("");
  const [cpassword, setCPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowCPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { navigate, goBack } = useNavigation();
  const route = useRoute();
  const { showToast } = useToast();

  const email = (route.params as RouteParams | undefined)?.email;

  // Se o usuário cair nessa tela sem ter vindo do fluxo de "Esqueci
  // senha" (deep link, navegação manual, etc), não há e-mail para
  // associar o reset — melhor avisar e voltar do que deixar a tela
  // quebrar tentando usar um valor que não existe.
  useEffect(() => {
    if (!email) {
      showToast({
        message: "Sessão de recuperação inválida. Solicite novamente.",
        type: "error",
      });
      goBack();
    }
  }, [email, showToast, goBack]);

  const handlePinChange = useCallback((text: string, index: number) => {
    if (text.length > 1) {
      // Colou um valor (ex: PIN inteiro copiado) — distribui nos campos.
      const pastedDigits = text
        .replace(/\D/g, "")
        .slice(0, PIN_LENGTH)
        .split("");
      const nextPin = [
        ...pastedDigits,
        ...Array(PIN_LENGTH - pastedDigits.length).fill(""),
      ];
      setPin(nextPin);
      const lastFilledIndex = Math.min(pastedDigits.length, PIN_LENGTH - 1);
      inputs.current[lastFilledIndex]?.focus();
      return;
    }

    setPin((prev) => {
      const next = [...prev];
      next[index] = text;
      return next;
    });

    if (text !== "" && index < PIN_LENGTH - 1) {
      inputs.current[index + 1]?.focus();
    }
  }, []);

  const handlePinKeyPress = useCallback(
    (event: { nativeEvent: { key: string } }, index: number) => {
      // Backspace em campo vazio volta o foco para o campo anterior,
      // permitindo apagar o PIN inteiro navegando para trás.
      if (
        event.nativeEvent.key === "Backspace" &&
        pin[index] === "" &&
        index > 0
      ) {
        inputs.current[index - 1]?.focus();
      }
    },
    [pin],
  );

  const pinComplete = useMemo(() => pin.every((digit) => digit !== ""), [pin]);
  const passwordsMatch = password.length > 0 && password === cpassword;
  const showMismatchWarning = cpassword.length > 0 && !passwordsMatch;

  const canSubmit =
    pinComplete && password.length >= 6 && passwordsMatch && !loading;

  const handleSubmit = useCallback(async () => {
    if (!email) return;

    if (!pinComplete) {
      showToast({ message: "Informe o código de 6 dígitos.", type: "error" });
      return;
    }
    if (password.length < 6) {
      showToast({
        message: "A senha deve ter ao menos 6 caracteres.",
        type: "error",
      });
      return;
    }
    if (!passwordsMatch) {
      showToast({ message: "As senhas não coincidem.", type: "error" });
      return;
    }

    setLoading(true);
    try {
      const response = await rstruther.post("auth/reset-password", {
        email,
        password,
        cpassword,
        pin: pin.join(""),
      });

      if (response.status === 200 || response.status === 201) {
        showToast({
          message: "Senha redefinida com sucesso!",
          type: "success",
        });
        navigate("SingIn" as never);
      }
    } catch (error: any) {
      const message =
        error?.response?.data?.message ?? "Não foi possível redefinir a senha.";
      showToast({ message, type: "error" });
    } finally {
      setLoading(false);
    }
  }, [
    email,
    pin,
    pinComplete,
    password,
    cpassword,
    passwordsMatch,
    showToast,
    navigate,
  ]);

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
              <LogoSvg width={wp(36)} height={hp(11)} />
              <S.Title>{t("pinforger.title")}</S.Title>
              <S.Subtitle>
                {t("pinforger.subtitle")}{" "}
                <S.EmailHighlight>{email ?? "seu e-mail"}</S.EmailHighlight>
              </S.Subtitle>
            </S.LogoWrapper>

            <S.PinRow>
              {pin.map((digit, index) => (
                <S.PinBox
                  key={index}
                  ref={(ref) => {
                    inputs.current[index] = ref;
                  }}
                  filled={digit !== ""}
                  keyboardType="numeric"
                  maxLength={PIN_LENGTH}
                  value={digit}
                  onChangeText={(text) => handlePinChange(text, index)}
                  onKeyPress={(event) => handlePinKeyPress(event, index)}
                />
              ))}
            </S.PinRow>

            <S.SectionLabel>{t("pinforger.label_new_pass")}</S.SectionLabel>
            <S.InputGroup>
              <S.InputWrapper>
                <S.InputIconWrapper>
                  <Lock
                    size={18}
                    color="#FFFFFF"
                    strokeWidth={2}
                    opacity={0.6}
                  />
                </S.InputIconWrapper>
                <S.StyledInput
                  placeholder={t("pinforger.inew")}
                  placeholderTextColor="rgba(255,255,255,0.4)"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                />
                <S.PasswordToggle
                  onPress={() => setShowPassword((p) => !p)}
                  activeOpacity={0.7}
                >
                  {showPassword ? (
                    <EyeOff
                      size={18}
                      color="#FFFFFF"
                      strokeWidth={2}
                      opacity={0.6}
                    />
                  ) : (
                    <Eye
                      size={18}
                      color="#FFFFFF"
                      strokeWidth={2}
                      opacity={0.6}
                    />
                  )}
                </S.PasswordToggle>
              </S.InputWrapper>

              <S.InputWrapper>
                <S.InputIconWrapper>
                  <ShieldCheck
                    size={18}
                    color="#FFFFFF"
                    strokeWidth={2}
                    opacity={0.6}
                  />
                </S.InputIconWrapper>
                <S.StyledInput
                  placeholder={t("pinforger.cnew")}
                  placeholderTextColor="rgba(255,255,255,0.4)"
                  secureTextEntry={!showCPassword}
                  value={cpassword}
                  onChangeText={setCPassword}
                />
                <S.PasswordToggle
                  onPress={() => setShowCPassword((p) => !p)}
                  activeOpacity={0.7}
                >
                  {showCPassword ? (
                    <EyeOff
                      size={18}
                      color="#FFFFFF"
                      strokeWidth={2}
                      opacity={0.6}
                    />
                  ) : (
                    <Eye
                      size={18}
                      color="#FFFFFF"
                      strokeWidth={2}
                      opacity={0.6}
                    />
                  )}
                </S.PasswordToggle>
              </S.InputWrapper>
            </S.InputGroup>

            {showMismatchWarning && (
              <S.PasswordMismatchText>
                As senhas não coincidem.
              </S.PasswordMismatchText>
            )}

            <S.SubmitButton
              onPress={handleSubmit}
              disabled={!canSubmit}
              activeOpacity={0.85}
            >
              <S.SubmitButtonText>{t("pinforger.bconfirm")}</S.SubmitButtonText>
            </S.SubmitButton>

            <S.BackToLoginButton onPress={() => goBack()} activeOpacity={0.7}>
              <S.BackToLoginText>{t("pinforger.breturn")}</S.BackToLoginText>
            </S.BackToLoginButton>
          </S.ScrollContent>
        </S.SafeArea>
      </S.Background>
    </S.Container>
  );
}

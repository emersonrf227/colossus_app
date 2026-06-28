import React, { useState, useCallback, useEffect } from "react";
import { Linking, Modal, StatusBar } from "react-native";
import {
  User,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  MessageCircle,
  Check,
} from "lucide-react-native";
import * as S from "./styles";
import LogoSvg from "@/assets/logov2.svg";
import { useAuth } from "@/hook/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { useToast } from "@/hook/Toast";
import Loader from "@/components/loader";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import {
  LANGUAGES,
  LanguageCode,
  resolveLanguage,
  loadSavedLanguage,
} from "../../../components/language";
import AsyncStorage from "@react-native-async-storage/async-storage";

const WHATSAPP_NUMBER = "+551129089826";
const WHATSAPP_MESSAGE = "Olá, preciso de ajuda!";
const STORAGE_KEY_LANGUAGE = "appLanguage";

export default function SingIn() {
  const { signIn } = useAuth();
  const { showToast } = useToast();
  const { navigate } = useNavigation();

  const [password, setPassword] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [language, setLanguage] = useState(() => resolveLanguage());
  const [languageModalVisible, setLanguageModalVisible] = useState(false);

  useEffect(() => {
    loadSavedLanguage().then(setLanguage);
  }, []);

  const handleSelectLanguage = useCallback(async (code: LanguageCode) => {
    setLanguage(resolveLanguage(code));
    setLanguageModalVisible(false);
    try {
      await AsyncStorage.setItem(STORAGE_KEY_LANGUAGE, code);
    } catch {
      // Falha ao salvar não impede o uso imediato do idioma escolhido.
    }
  }, []);

  const openWhatsApp = useCallback(async () => {
    const url = `https://wa.me/${WHATSAPP_NUMBER.replace(
      "+",
      "",
    )}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        showToast({
          message: "Não foi possível abrir o WhatsApp",
          type: "error",
        });
      }
    } catch {
      showToast({
        message: "Não foi possível abrir o WhatsApp",
        type: "error",
      });
    }
  }, [showToast]);

  const handleLogin = useCallback(async () => {
    if (!identifier || !password) {
      showToast({
        message: "Usuário e senha não podem ficar em branco.",
        type: "error",
      });
      return;
    }

    setLoading(true);
    try {
      const result = await signIn(identifier, password);

      if (result.error) {
        showToast({
          message: result.msg ?? "Não foi possível entrar.",
          type: "error",
        });
        return;
      }

      navigate("Dashboard" as never);
    } catch {
      showToast({
        message: "Erro inesperado. Tente novamente.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  }, [identifier, password, signIn, showToast, navigate]);

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
          <S.TopBar>
            <S.LanguagePill
              onPress={() => setLanguageModalVisible(true)}
              activeOpacity={0.75}
            >
              <S.LanguagePillFlag>{language.flagEmoji}</S.LanguagePillFlag>
              <S.LanguagePillText>{language.label}</S.LanguagePillText>
            </S.LanguagePill>
          </S.TopBar>

          <S.ScrollContent
            contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <S.LogoWrapper>
              <LogoSvg width={wp(42)} height={hp(13)} />
              <S.WelcomeTitle>Bem-vindo de volta</S.WelcomeTitle>
              <S.WelcomeSubtitle>
                Entre com sua conta para continuar
              </S.WelcomeSubtitle>
            </S.LogoWrapper>

            <S.InputGroup>
              <S.InputWrapper>
                <S.InputIconWrapper>
                  <User
                    size={18}
                    color="#FFFFFF"
                    strokeWidth={2}
                    opacity={0.6}
                  />
                </S.InputIconWrapper>
                <S.StyledInput
                  placeholder="Usuário"
                  placeholderTextColor="rgba(255,255,255,0.4)"
                  value={identifier}
                  onChangeText={setIdentifier}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </S.InputWrapper>

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
                  placeholder="Senha"
                  placeholderTextColor="rgba(255,255,255,0.4)"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                />
                <S.PasswordToggle
                  onPress={() => setShowPassword((prev) => !prev)}
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
            </S.InputGroup>

            <S.LoginButton
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.85}
            >
              <LogIn size={18} color="#FFFFFF" strokeWidth={2.2} />
              <S.LoginText>Entrar</S.LoginText>
            </S.LoginButton>

            <S.ForgotPasswordButton
              onPress={() => navigate("ForgetPwd" as never)}
              activeOpacity={0.7}
            >
              <S.ForgotPasswordText>Esqueci minha senha</S.ForgotPasswordText>
            </S.ForgotPasswordButton>

            <S.DividerRow>
              <S.DividerLine />
              <S.DividerText>OU</S.DividerText>
              <S.DividerLine />
            </S.DividerRow>

            <S.RegisterButton onPress={openWhatsApp} activeOpacity={0.75}>
              <MessageCircle size={18} color="#FFFFFF" strokeWidth={2.2} />
              <S.RegisterButtonText>Quero me cadastrar</S.RegisterButtonText>
            </S.RegisterButton>
          </S.ScrollContent>
        </S.SafeArea>

        <Modal
          visible={languageModalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setLanguageModalVisible(false)}
        >
          <S.ModalOverlay>
            <S.ModalBackdropTouchable
              activeOpacity={1}
              onPress={() => setLanguageModalVisible(false)}
            />
            <S.ModalSheet>
              <S.ModalHandle />
              <S.ModalTitle>Escolha o idioma</S.ModalTitle>
              <S.ModalSubtitle>
                Isso muda o idioma exibido no aplicativo
              </S.ModalSubtitle>

              <S.LanguageOptionsGroup>
                {Object.values(LANGUAGES).map((item, index) => {
                  const isSelected = language.code === item.code;
                  const isLast = index === Object.values(LANGUAGES).length - 1;
                  return (
                    <S.LanguageRow
                      key={item.code}
                      isLast={isLast}
                      activeOpacity={0.7}
                      onPress={() => handleSelectLanguage(item.code)}
                    >
                      <S.LanguageRowFlag>{item.flagEmoji}</S.LanguageRowFlag>
                      <S.LanguageRowLabel>{item.label}</S.LanguageRowLabel>
                      <S.CheckCircle checked={isSelected}>
                        {isSelected && (
                          <Check size={13} color="#FFFFFF" strokeWidth={3} />
                        )}
                      </S.CheckCircle>
                    </S.LanguageRow>
                  );
                })}
              </S.LanguageOptionsGroup>
            </S.ModalSheet>
          </S.ModalOverlay>
        </Modal>
      </S.Background>
    </S.Container>
  );
}

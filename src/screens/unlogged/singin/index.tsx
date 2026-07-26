import BRAND from "@/config/brand";
import { setWalletSessionUnlocked } from "@/components/wallet/walletSession";
import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  Animated,
  Linking,
  Modal,
  Pressable,
  StatusBar,
  View,
} from "react-native";
import {
  User,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  MessageCircle,
  Check,
  Send,
} from "lucide-react-native";
import * as S from "./styles";
import LogoSvg from "@/assets/logov2.svg";
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
import i18n from "@/i18n";
import { useTranslation } from "react-i18next";
import Constants from "expo-constants";

const WHATSAPP_NUMBER = "+551129089826";
const WHATSAPP_MESSAGE = "Olá, preciso de ajuda!";
const STORAGE_KEY_LANGUAGE = "appLanguage";

export default function SingIn() {
  const appVersion = Constants.expoConfig?.version ?? "—";
  const { showToast } = useToast();
  const { navigate, reset } = useNavigation();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const [language, setLanguage] = useState(() => resolveLanguage());
  const [languageModalVisible, setLanguageModalVisible] = useState(false);

  // Easter egg: segurar a logo revela a frase, que some sozinha depois.
  const easterEggOpacity = useRef(new Animated.Value(0)).current;
  const easterEggTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const revealEasterEgg = useCallback(() => {
    console.log("🕊️ easter egg");
    if (easterEggTimer.current) clearTimeout(easterEggTimer.current);

    Animated.timing(easterEggOpacity, {
      toValue: 1,
      duration: 900,
      useNativeDriver: true,
    }).start();

    easterEggTimer.current = setTimeout(() => {
      Animated.timing(easterEggOpacity, {
        toValue: 0,
        duration: 1200,
        useNativeDriver: true,
      }).start();
    }, 3200);
  }, [easterEggOpacity]);

  useEffect(
    () => () => {
      if (easterEggTimer.current) clearTimeout(easterEggTimer.current);
    },
    [],
  );

  useEffect(() => {
    loadSavedLanguage().then(setLanguage);
    // Voltou para a tela inicial: encerra a sessão desbloqueada da wallet,
    // para o PIN ser pedido novamente na próxima entrada na WalletHome.
    setWalletSessionUnlocked(false);
  }, []);

  const handleSelectLanguage = useCallback(async (code: LanguageCode) => {
    setLanguage(resolveLanguage(code));
    await i18n.changeLanguage(code);

    setLanguageModalVisible(false);
    try {
      await AsyncStorage.setItem(STORAGE_KEY_LANGUAGE, code);
    } catch {
      // Falha ao salvar não impede o uso imediato do idioma escolhido.
    }
  }, []);

  const openTelegram = useCallback(async () => {
    const username = BRAND.telegram;
    // App scheme primeiro (abre direto no app do Telegram se instalado);
    // se não for suportado, cai no link universal https://t.me/..., que
    // o sistema resolve abrindo o app (se instalado) ou o navegador.
    const appUrl = `tg://resolve?domain=${username}`;
    const webUrl = `https://t.me/${username}`;

    try {
      const supported = await Linking.canOpenURL(appUrl);
      await Linking.openURL(supported ? appUrl : webUrl);
    } catch {
      showToast({
        message: "Não foi possível abrir o Telegram",
        type: "error",
      });
    }
  }, [showToast]);

  const openApp = useCallback(async () => {
    reset({
      index: 0,
      routes: [{ name: "Splash" as never }],
    });
  }, []);

  const openWhast = useCallback(async () => {
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
          message: "Não foi possível abrir o Telegram",
          type: "error",
        });
      }
    } catch {
      showToast({
        message: "Não foi possível abrir o Telegram",
        type: "error",
      });
    }
  }, [showToast]);

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
              <Pressable
                onLongPress={revealEasterEgg}
                delayLongPress={50}
                android_disableSound
                // O SVG não recebe toque: o Pressable é quem trata o gesto.
                style={{ width: wp(34), height: hp(26) }}
              >
                <View pointerEvents="none">
                  <LogoSvg width={wp(34)} height={hp(26)} />
                </View>
              </Pressable>

              <S.WelcomeTitle> {t("login.welcome")}</S.WelcomeTitle>
              <S.WelcomeSubtitle>{t("login.subtitle")}</S.WelcomeSubtitle>

              {/* Altura fixa: reserva o espaço para nada deslocar no fade-in */}
              <S.EasterEggWrapper pointerEvents="none">
                <Animated.View style={{ opacity: easterEggOpacity }}>
                  <S.EasterEggText>Deus é fiel!</S.EasterEggText>
                  <S.EasterEggText>Isaías 43:19</S.EasterEggText>
                </Animated.View>
              </S.EasterEggWrapper>
            </S.LogoWrapper>
            <S.LoginButton
              onPress={openApp}
              disabled={loading}
              activeOpacity={0.85}
            >
              <LogIn size={18} color="#FFFFFF" strokeWidth={2.2} />
              <S.LoginText>{t("login.login")}</S.LoginText>
            </S.LoginButton>
            <S.DividerRow>
              <S.DividerLine />
              <S.DividerLine />
            </S.DividerRow>

            <S.RegisterButton onPress={openTelegram} activeOpacity={0.75}>
              <Send size={18} color="#FFFFFF" strokeWidth={2.2} />
              <S.RegisterButtonText>
                {" "}
                {t("login.register")}
              </S.RegisterButtonText>
            </S.RegisterButton>
          </S.ScrollContent>

          <S.Footer>
            <S.FooterText>
              {" "}
              {t("about.versionLabel", { version: appVersion })}
            </S.FooterText>
          </S.Footer>
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

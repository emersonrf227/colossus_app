import React, { useState, useCallback } from "react";
import { Modal } from "react-native";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import {
  Info,
  Wallet,
  History,
  FileText,
  LifeBuoy,
  HelpCircle,
  ReceiptText,
  LogOut,
  ArrowLeft,
  Languages,
  MapIcon,
  KeyRound,
  AlertTriangle,
} from "lucide-react-native";
import { useTranslation } from "react-i18next";
import * as S from "./styles";
import { StatusBar } from "react-native";
import LogoSvg from "@/assets/logov2.svg";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Loader from "@/components/loader";
import { useToast } from "@/hook/Toast";
import { colors } from "../dashboard/styles";
import { useAuth } from "@/hook/AuthContext";
import {
  loadSavedCurrency,
  resolveCurrency,
} from "../../../components/currency";
import {
  loadSavedLanguage,
  resolveLanguage,
} from "../../../components/language";

interface MenuItem {
  labelKey: string;
  icon: React.ComponentType<{
    size?: number;
    color?: string;
    strokeWidth?: number;
  }>;
  accentColor: string;
  route?: string;
}

const MENU_ITEMS: MenuItem[] = [
  {
    labelKey: "menu.items.info",
    icon: Info,
    accentColor: "#6C5CE7",
    route: "getInfo",
  },
  {
    labelKey: "menu.items.wallet",
    icon: KeyRound,
    accentColor: "#00D2D3",
    route: "WalletExport",
  },
  {
    labelKey: "menu.items.invoices",
    icon: History,
    accentColor: "#F7B731",
    route: "WalletHistory",
  },
  {
    labelKey: "menu.items.support",
    icon: LifeBuoy,
    accentColor: "#3FA9F5",
    route: "supportScren",
  },
  {
    labelKey: "menu.items.about",
    icon: HelpCircle,
    accentColor: "#A55EEA",
    route: "getAbout",
  },
  {
    labelKey: "menu.items.termsOfUse",
    icon: ReceiptText,
    accentColor: "#26DE81",
    route: "TermsOfUse",
  },

  {
    labelKey: "menu.items.community",
    icon: MapIcon,
    accentColor: "#c3f883",
    route: "Maps",
  },
];

export default function MenuScreen() {
  const auth = useAuth();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const { navigate, goBack, reset } = navigation;
  const { showToast } = useToast();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  // Idioma e moeda salvos pelo usuário — começam com o default síncrono
  // e são atualizados sempre que a tela ganha foco (ex: usuário voltou
  // da tela "Idioma e Moeda" depois de trocar alguma preferência).
  const [language, setLanguage] = useState(() => resolveLanguage());
  const [currency, setCurrency] = useState(() => resolveCurrency());

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      Promise.all([loadSavedLanguage(), loadSavedCurrency()]).then(
        ([savedLanguage, savedCurrency]) => {
          if (!isActive) return;
          setLanguage(savedLanguage);
          setCurrency(savedCurrency);
        },
      );

      return () => {
        isActive = false;
      };
    }, []),
  );

  const handleNavigateTo = useCallback(
    (route?: string) => {
      if (!route) return;
      navigate(route as never);
    },
    [navigate],
  );

  const handleLogout = useCallback(async () => {
    setLoading(true);
    try {
      await AsyncStorage.multiRemove([
        "token",
        "refreshToken",
        "name",
        "uuid",
        "typeAuth",
      ]);
      navigation.reset({
        index: 0,
        routes: [{ name: "SingIn" }],
      });
    } catch {
      showToast({
        message: t("menu.logoutError"),
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  }, [navigation, showToast, t]);

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
            <S.HeaderTitle>{t("menu.title")}</S.HeaderTitle>
          </S.Header>

          <Modal
            visible={showLogoutModal}
            transparent
            animationType="fade"
            onRequestClose={() => setShowLogoutModal(false)}
          >
            <S.ModalOverlay>
              <S.ModalContainer>
                <AlertTriangle size={60} color="#F44336" strokeWidth={2} />

                <S.ModalTitle>{t("menu.modal.title")}</S.ModalTitle>

                <S.ModalDescription>
                  {t("menu.modal.description")}
                </S.ModalDescription>

                <S.ModalWarning>{t("menu.modal.warning")}</S.ModalWarning>

                <S.ModalDescription>
                  {t("menu.modal.warning_plus")}
                </S.ModalDescription>

                <S.ModalButtons>
                  <S.CancelButton onPress={() => setShowLogoutModal(false)}>
                    <S.CancelButtonText>
                      {" "}
                      {t("menu.modal.cancel")}
                    </S.CancelButtonText>
                  </S.CancelButton>

                  <S.ConfirmButton
                    onPress={async () => {
                      setShowLogoutModal(false);

                      await auth.clearSession();

                      navigation.replace("SingIn" as never);
                    }}
                  >
                    <S.ConfirmButtonText>
                      {t("menu.modal.understood")}
                    </S.ConfirmButtonText>
                  </S.ConfirmButton>
                </S.ModalButtons>
              </S.ModalContainer>
            </S.ModalOverlay>
          </Modal>

          <S.cardLogo>
            <LogoSvg width={wp(38)} height={hp(11)} />
          </S.cardLogo>

          <S.ScrollContent showsVerticalScrollIndicator={false}>
            <S.SectionLabel>{t("menu.preferences")}</S.SectionLabel>

            <S.HighlightCard
              onPress={() => handleNavigateTo("SettingsLanguage")}
              activeOpacity={0.75}
            >
              <S.HighlightIconWrapper>
                <Languages size={20} color={colors.primary} strokeWidth={2.2} />
              </S.HighlightIconWrapper>
              <S.HighlightTextWrapper>
                <S.HighlightTitle>
                  {t("menu.languageAndCurrency")}
                </S.HighlightTitle>
                <S.HighlightSubtitle>
                  {language.label} · {currency.label}
                </S.HighlightSubtitle>
              </S.HighlightTextWrapper>
            </S.HighlightCard>

            <S.SectionLabel>{t("menu.general")}</S.SectionLabel>

            <S.ButtonGrid>
              {MENU_ITEMS.map(
                ({ labelKey, icon: Icon, accentColor, route }) => (
                  <S.MenuCard
                    key={labelKey}
                    onPress={() => handleNavigateTo(route)}
                    activeOpacity={0.75}
                  >
                    <S.MenuCardIconWrapper accentColor={accentColor}>
                      <Icon size={20} color={accentColor} strokeWidth={2.2} />
                    </S.MenuCardIconWrapper>
                    <S.MenuCardText>{t(labelKey)}</S.MenuCardText>
                  </S.MenuCard>
                ),
              )}
            </S.ButtonGrid>
            <S.LogoutButton
              // onPress={async () => {
              //   // await auth.clearSession();
              //   // navigation.replace("SingIn" as never);
              // }}
              onPress={() => setShowLogoutModal(true)}
              activeOpacity={0.7}
            >
              <LogOut size={18} color={colors.danger} strokeWidth={2.2} />
              <S.LogoutButtonText>{t("menu.logout")}</S.LogoutButtonText>
            </S.LogoutButton>
          </S.ScrollContent>
        </S.SafeArea>
      </S.Background>
    </S.Container>
  );
}

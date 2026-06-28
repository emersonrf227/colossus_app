import React, { useState, useCallback } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import {
  Info,
  Wallet,
  FileText,
  LifeBuoy,
  HelpCircle,
  ReceiptText,
  Printer,
  LogOut,
  ArrowLeft,
  Languages,
  MapIcon,
} from "lucide-react-native";
import * as S from "./styles";
import { StatusBar } from "react-native";
import LogoSvg from "@/assets/logov2.svg";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Loader from "@/components/loader";
import { useToast } from "@/hook/Toast";
import { colors } from "../dashboard/styles";
import {
  loadSavedCurrency,
  resolveCurrency,
} from "../../../components/currency";
import {
  loadSavedLanguage,
  resolveLanguage,
} from "../../../components/language";

interface MenuItem {
  label: string;
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
    label: "Informações",
    icon: Info,
    accentColor: "#6C5CE7",
    route: "getInfo",
  },
  {
    label: "Carteira",
    icon: Wallet,
    accentColor: "#00D2D3",
    route: "CadWallet",
  },
  {
    label: "Cobranças",
    icon: FileText,
    accentColor: "#F7B731",
    route: "Extract",
  },
  {
    label: "Suporte",
    icon: LifeBuoy,
    accentColor: "#3FA9F5",
    route: "supportScren",
  },
  {
    label: "Sobre",
    icon: HelpCircle,
    accentColor: "#A55EEA",
    route: "getAbout",
  },
  {
    label: "Termos de uso",
    icon: ReceiptText,
    accentColor: "#26DE81",
    route: "TermsOfUse",
  },
  {
    label: "Impressora",
    icon: Printer,
    accentColor: "#FD9644",
    route: "SelectPrinterScreen",
  },
  {
    label: "Comunnity",
    icon: MapIcon,
    accentColor: "#c3f883",
    route: "Maps",
  },
];

export default function MenuScreen() {
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const { navigate, goBack } = navigation;
  const { showToast } = useToast();

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
      navigation.navigate("SingIn" as never);
    } catch {
      showToast({
        message: "Não foi possível sair. Tente novamente.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  }, [navigation, showToast]);

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
            <S.HeaderTitle>Configurações</S.HeaderTitle>
          </S.Header>

          <S.cardLogo>
            <LogoSvg width={wp(38)} height={hp(11)} />
          </S.cardLogo>

          <S.ScrollContent showsVerticalScrollIndicator={false}>
            <S.SectionLabel>PREFERÊNCIAS</S.SectionLabel>

            <S.HighlightCard
              onPress={() => handleNavigateTo("SettingsLanguage")}
              activeOpacity={0.75}
            >
              <S.HighlightIconWrapper>
                <Languages size={20} color={colors.primary} strokeWidth={2.2} />
              </S.HighlightIconWrapper>
              <S.HighlightTextWrapper>
                <S.HighlightTitle>Idioma e Moeda</S.HighlightTitle>
                <S.HighlightSubtitle>
                  {language.label} · {currency.label}
                </S.HighlightSubtitle>
              </S.HighlightTextWrapper>
            </S.HighlightCard>

            <S.SectionLabel>GERAL</S.SectionLabel>

            <S.ButtonGrid>
              {MENU_ITEMS.map(({ label, icon: Icon, accentColor, route }) => (
                <S.MenuCard
                  key={label}
                  onPress={() => handleNavigateTo(route)}
                  activeOpacity={0.75}
                >
                  <S.MenuCardIconWrapper accentColor={accentColor}>
                    <Icon size={20} color={accentColor} strokeWidth={2.2} />
                  </S.MenuCardIconWrapper>
                  <S.MenuCardText>{label}</S.MenuCardText>
                </S.MenuCard>
              ))}
            </S.ButtonGrid>

            <S.LogoutButton onPress={handleLogout} activeOpacity={0.7}>
              <LogOut size={18} color={colors.danger} strokeWidth={2.2} />
              <S.LogoutButtonText>Sair da conta</S.LogoutButtonText>
            </S.LogoutButton>
          </S.ScrollContent>
        </S.SafeArea>
      </S.Background>
    </S.Container>
  );
}

import React, { useState, useCallback } from "react";
import { Linking, StatusBar } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ArrowLeft, MessageCircle, Send } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import * as S from "./styles";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Loader from "@/components/loader";
import LogoSvg from "@/assets/logov2.svg";
import { AccordionItem } from "@/components/faq";
import { useToast } from "@/hook/Toast";

const WHATSAPP_NUMBER = "+551129089826";

// Chaves do FAQ, na ordem de exibição — texto vem do i18n via t().
const FAQ_KEYS = [
  "q1",
  "q2",
  "q3",
  "q4",
  "q5",
  "q6",
  "q7",
  "q8",
  "q9",
] as const;

export default function SupportScreen() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const { showToast } = useToast();

  const openTelegram = useCallback(async () => {
    const username = "colossus_crypto";
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
            <S.BackButton
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
            >
              <ArrowLeft size={22} color="#FFFFFF" strokeWidth={2.2} />
            </S.BackButton>
            <S.HeaderTitle>{t("support.title")}</S.HeaderTitle>
          </S.Header>

          <S.cardLogo>
            <LogoSvg width={wp(36)} height={hp(10)} />
          </S.cardLogo>

          <S.ScrollContent
            contentContainerStyle={{ paddingBottom: 32 }}
            showsVerticalScrollIndicator={false}
          >
            <S.ContactCard>
              <S.ContactIconWrapper>
                <Send size={28} color="#26a4e2" strokeWidth={2.2} />
              </S.ContactIconWrapper>
              <S.ContactTitle>{t("support.needHelp")}</S.ContactTitle>
              <S.ContactSubtitle>
                {t("support.contactSubtitle")}
              </S.ContactSubtitle>
              <S.TelegramButton
                style={{ backgroundColor: "#26a4e2" }}
                onPress={openTelegram}
                activeOpacity={0.85}
              >
                <Send size={18} color="#FFFFFF" strokeWidth={2.2} />
                <S.TelegramButtonText>
                  {t("support.telegramButton")}
                </S.TelegramButtonText>
              </S.TelegramButton>
            </S.ContactCard>

            <S.SectionLabel>{t("support.faqSectionTitle")}</S.SectionLabel>

            {FAQ_KEYS.map((key) => (
              <AccordionItem
                key={key}
                question={t(`support.faq.${key}.question`)}
                answer={t(`support.faq.${key}.answer`)}
              />
            ))}
          </S.ScrollContent>
        </S.SafeArea>
      </S.Background>
    </S.Container>
  );
}

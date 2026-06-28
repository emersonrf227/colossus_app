import React, { useState, useCallback } from "react";
import { Linking, StatusBar } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ArrowLeft, MessageCircle } from "lucide-react-native";
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

  const openWhatsApp = useCallback(async () => {
    const message = t("support.whatsappMessage");
    const url = `https://wa.me/${WHATSAPP_NUMBER.replace(
      "+",
      "",
    )}?text=${encodeURIComponent(message)}`;

    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        showToast({
          message: t("support.whatsappError"),
          type: "error",
        });
      }
    } catch {
      showToast({
        message: t("support.whatsappError"),
        type: "error",
      });
    }
  }, [showToast, t]);

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
                <MessageCircle size={28} color="#2ECC71" strokeWidth={2.2} />
              </S.ContactIconWrapper>
              <S.ContactTitle>{t("support.needHelp")}</S.ContactTitle>
              <S.ContactSubtitle>
                {t("support.contactSubtitle")}
              </S.ContactSubtitle>
              <S.WhatsAppButton onPress={openWhatsApp} activeOpacity={0.85}>
                <MessageCircle size={18} color="#FFFFFF" strokeWidth={2.2} />
                <S.WhatsAppButtonText>
                  {t("support.whatsappButton")}
                </S.WhatsAppButtonText>
              </S.WhatsAppButton>
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

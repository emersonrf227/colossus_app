import React from "react";
import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "react-native";
import { ArrowLeft } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import * as S from "./styles";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import LogoSvg from "@/assets/logov2.svg";

// Data legal — não muda por idioma, é metadado do documento.
const TERMS_LAST_UPDATED = "06/04/2025";

// Ordem de exibição das seções; número exibido vem do índice (+1).
const SECTION_KEYS = ["s1", "s2", "s3", "s4", "s5", "s6", "s7"] as const;

export default function TermsOfUse() {
  const { t } = useTranslation();
  const navigation = useNavigation();

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
            <S.BackButton
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
            >
              <ArrowLeft size={22} color="#FFFFFF" strokeWidth={2.2} />
            </S.BackButton>
            <S.HeaderTitle>{t("terms.title")}</S.HeaderTitle>
          </S.Header>

          <S.cardLogo>
            <LogoSvg width={wp(36)} height={hp(10)} />
          </S.cardLogo>

          <S.ScrollContent
            contentContainerStyle={{ paddingBottom: 32 }}
            showsVerticalScrollIndicator={false}
          >
            <S.DocHeader>
              <S.DocTitle>{t("terms.docTitle")}</S.DocTitle>
              <S.DocUpdatedAt>
                {t("terms.lastUpdated", { date: TERMS_LAST_UPDATED })}
              </S.DocUpdatedAt>
            </S.DocHeader>

            <S.IntroCard>
              <S.IntroText>{t("terms.intro")}</S.IntroText>
            </S.IntroCard>

            {SECTION_KEYS.map((key, index) => {
              const sectionNumber = index + 1;
              const paragraphs = t(`terms.sections.${key}.paragraphs`, {
                returnObjects: true,
              }) as string[];
              const bullets = t(`terms.sections.${key}.bullets`, {
                returnObjects: true,
                defaultValue: [],
              }) as string[];

              return (
                <S.SectionCard key={key}>
                  <S.SectionHeader>
                    <S.SectionNumberBadge>
                      <S.SectionNumberText>{sectionNumber}</S.SectionNumberText>
                    </S.SectionNumberBadge>
                    <S.SectionTitle>
                      {t(`terms.sections.${key}.title`)}
                    </S.SectionTitle>
                  </S.SectionHeader>

                  {paragraphs.map((paragraph, pIndex) => (
                    <S.SectionBody key={pIndex}>{paragraph}</S.SectionBody>
                  ))}

                  {bullets.map((bullet, bIndex) => (
                    <S.SectionBullet key={bIndex}>• {bullet}</S.SectionBullet>
                  ))}
                </S.SectionCard>
              );
            })}

            <S.FooterNote>{t("terms.footerNote")}</S.FooterNote>
          </S.ScrollContent>
        </S.SafeArea>
      </S.Background>
    </S.Container>
  );
}

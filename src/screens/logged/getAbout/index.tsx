import React from "react";
import { StatusBar } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ArrowLeft, MapPin } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import * as S from "./styles";
import Constants from "expo-constants";

export default function GetAbout() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const appVersion = Constants.expoConfig?.version ?? "—";

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
            <S.HeaderTitle>{t("about.title")}</S.HeaderTitle>
          </S.Header>

          <S.ScrollContent
            contentContainerStyle={{ paddingBottom: 32 }}
            showsVerticalScrollIndicator={false}
          >
            <S.BrandImageWrapper>
              <S.BrandImage
                source={require("@/assets/logoAbout.png")}
                resizeMode="contain"
              />
              <S.BrandName>COLOSSUS CRYPTO</S.BrandName>
              <S.VersionBadge>
                <S.VersionBadgeText>
                  {t("about.versionLabel", { version: appVersion })}
                </S.VersionBadgeText>
              </S.VersionBadge>
            </S.BrandImageWrapper>

            <S.BrazilCard>
              <S.BrazilStripe>
                <S.BrazilStripeGreen />
                <S.BrazilStripeYellow />
                <S.BrazilStripeGreen />
              </S.BrazilStripe>

              <S.BrazilHeaderRow>
                <S.BrazilIconWrapper>
                  <MapPin size={20} color="#009C3B" strokeWidth={2.2} />
                </S.BrazilIconWrapper>
                <S.BrazilTitle>{t("about.brazilTitle")}</S.BrazilTitle>
              </S.BrazilHeaderRow>

              <S.BrazilDescription>
                {t("about.brazilDescriptionBefore")}
                <S.BrazilHighlight>
                  {t("about.brazilDescriptionHighlight")}
                </S.BrazilHighlight>
                {t("about.brazilDescriptionAfter")}
              </S.BrazilDescription>
            </S.BrazilCard>

            <S.SectionLabel>{t("about.developedBy")}</S.SectionLabel>
            <S.CompanyCard>
              <S.FieldRow>
                <S.FieldLabel>{t("about.companyLabel")}</S.FieldLabel>
                <S.FieldValue>I Like Technology LTDA</S.FieldValue>
              </S.FieldRow>
              <S.FieldRow isLast>
                <S.FieldLabel>{t("about.cnpjLabel")}</S.FieldLabel>
                <S.FieldValue>45.123.168/0001-22</S.FieldValue>
              </S.FieldRow>
            </S.CompanyCard>

            <S.FooterNote>{t("about.footerNote")}</S.FooterNote>
          </S.ScrollContent>
        </S.SafeArea>
      </S.Background>
    </S.Container>
  );
}

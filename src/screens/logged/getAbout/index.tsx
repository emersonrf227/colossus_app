import React from "react";
import { StatusBar } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ArrowLeft, MapPin } from "lucide-react-native";
import * as S from "./styles";
import Constants from "expo-constants";

export default function GetAbout() {
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
            <S.HeaderTitle>Sobre</S.HeaderTitle>
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
                <S.VersionBadgeText>VERSÃO {appVersion}</S.VersionBadgeText>
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
                <S.BrazilTitle>Tecnologia 100% brasileira</S.BrazilTitle>
              </S.BrazilHeaderRow>

              <S.BrazilDescription>
                A Colossus Crypto é desenvolvida e mantida{" "}
                <S.BrazilHighlight>
                  no Brasil, por brasileiros
                </S.BrazilHighlight>
                , unindo tecnologia de ponta em criptomoedas com o suporte e a
                confiança de uma empresa nacional.
              </S.BrazilDescription>
            </S.BrazilCard>

            <S.SectionLabel>DESENVOLVIDO POR</S.SectionLabel>
            <S.CompanyCard>
              <S.FieldRow>
                <S.FieldLabel>EMPRESA</S.FieldLabel>
                <S.FieldValue>I Like Technology LTDA</S.FieldValue>
              </S.FieldRow>
              <S.FieldRow isLast>
                <S.FieldLabel>CNPJ</S.FieldLabel>
                <S.FieldValue>45.123.168/0001-22</S.FieldValue>
              </S.FieldRow>
            </S.CompanyCard>

            <S.FooterNote>Feito com 💜 e no 🇧🇷 para todo o mundo.</S.FooterNote>
          </S.ScrollContent>
        </S.SafeArea>
      </S.Background>
    </S.Container>
  );
}

import React, { useEffect, useState, useCallback } from "react";
import { StatusBar } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ArrowLeft, AlertCircle } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import * as S from "./styles";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Loader from "@/components/loader";
import LogoSvg from "@/assets/logov2.svg";
import rstruther from "@/infraestructure/http/nodeApi";

interface AddressData {
  address?: string;
  number?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}

interface UserData {
  name?: string;
  socialName?: string;
  document?: string;
  typerson?: "F" | "J" | string;
  Address?: AddressData[];
  ContactEmail?: { email: string }[];
  ContactPhone?: { phone: string }[];
}

function getInitials(name?: string): string {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : "";
  return (first + last).toUpperCase();
}

function formatAddressLine(
  address: AddressData | undefined,
  empty: string,
): string {
  if (!address || !address.address) return empty;
  const parts = [address.address, address.number, address.neighborhood].filter(
    Boolean,
  );
  return parts.join(", ") || empty;
}

function formatCityLine(
  address: AddressData | undefined,
  empty: string,
): string {
  if (!address || (!address.city && !address.state)) return empty;
  return [address.city, address.state].filter(Boolean).join(" - ") || empty;
}

export default function GetInfo() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [hasError, setHasError] = useState(false);

  const emptyValue = t("info.emptyValue");

  const fetchData = useCallback(async () => {
    setLoading(true);
    setHasError(false);
    try {
      const response = await rstruther.get("saller/account/information");
      setUserData(response.data ?? null);
    } catch (error) {
      console.error("Erro ao buscar dados do usuário:", error);
      setHasError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Acessos sempre seguros: o array pode vir ausente, vazio, ou com o
  // primeiro item incompleto — nenhum desses casos deve quebrar a tela.
  const address = userData?.Address?.[0];
  const email = userData?.ContactEmail?.[0]?.email;
  const phone = userData?.ContactPhone?.[0]?.phone;
  const personTypeLabel =
    userData?.typerson === "F"
      ? t("info.personTypeIndividual")
      : userData?.typerson === "J"
        ? t("info.personTypeCompany")
        : emptyValue;

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
            <S.HeaderTitle>{t("info.title")}</S.HeaderTitle>
          </S.Header>

          <S.cardLogo>
            <LogoSvg width={wp(36)} height={hp(10)} />
          </S.cardLogo>

          {!loading && hasError ? (
            <S.CenteredState>
              <S.ErrorIconWrapper>
                <AlertCircle size={28} color="#FF6B6B" strokeWidth={2.2} />
              </S.ErrorIconWrapper>
              <S.ErrorText>{t("info.errorLoad")}</S.ErrorText>
              <S.RetryButton onPress={fetchData} activeOpacity={0.7}>
                <S.RetryButtonText>{t("info.retry")}</S.RetryButtonText>
              </S.RetryButton>
            </S.CenteredState>
          ) : userData ? (
            <S.ScrollContent
              contentContainerStyle={{ paddingBottom: 32 }}
              showsVerticalScrollIndicator={false}
            >
              <S.ProfileHeader>
                <S.AvatarCircle>
                  <S.AvatarInitials>
                    {getInitials(userData.name)}
                  </S.AvatarInitials>
                </S.AvatarCircle>
                <S.ProfileName>{userData.name || emptyValue}</S.ProfileName>
                <S.ProfileTypeBadge>
                  <S.ProfileTypeBadgeText>
                    {personTypeLabel}
                  </S.ProfileTypeBadgeText>
                </S.ProfileTypeBadge>
              </S.ProfileHeader>

              <S.SectionLabel>{t("info.registrationData")}</S.SectionLabel>
              <S.SectionCard>
                <S.FieldRow>
                  <S.FieldLabel>{t("info.socialName")}</S.FieldLabel>
                  <S.FieldValue>
                    {userData.socialName || emptyValue}
                  </S.FieldValue>
                </S.FieldRow>
                <S.FieldRow isLast>
                  <S.FieldLabel>{t("info.document")}</S.FieldLabel>
                  <S.FieldValue>{userData.document || emptyValue}</S.FieldValue>
                </S.FieldRow>
              </S.SectionCard>

              <S.SectionLabel>{t("info.contact")}</S.SectionLabel>
              <S.SectionCard>
                <S.FieldRow>
                  <S.FieldLabel>{t("info.email")}</S.FieldLabel>
                  <S.FieldValue>{email || emptyValue}</S.FieldValue>
                </S.FieldRow>
                <S.FieldRow isLast>
                  <S.FieldLabel>{t("info.phone")}</S.FieldLabel>
                  <S.FieldValue>{phone || emptyValue}</S.FieldValue>
                </S.FieldRow>
              </S.SectionCard>

              <S.SectionLabel>{t("info.address")}</S.SectionLabel>
              <S.SectionCard>
                <S.FieldRow>
                  <S.FieldLabel>{t("info.street")}</S.FieldLabel>
                  <S.FieldValue>
                    {formatAddressLine(address, emptyValue)}
                  </S.FieldValue>
                </S.FieldRow>
                <S.FieldRow>
                  <S.FieldLabel>{t("info.city")}</S.FieldLabel>
                  <S.FieldValue>
                    {formatCityLine(address, emptyValue)}
                  </S.FieldValue>
                </S.FieldRow>
                <S.FieldRow isLast>
                  <S.FieldLabel>{t("info.zipCode")}</S.FieldLabel>
                  <S.FieldValue>{address?.zipCode || emptyValue}</S.FieldValue>
                </S.FieldRow>
              </S.SectionCard>
            </S.ScrollContent>
          ) : !loading ? (
            <S.CenteredState>
              <S.ErrorIconWrapper>
                <AlertCircle size={28} color="#FF6B6B" strokeWidth={2.2} />
              </S.ErrorIconWrapper>
              <S.ErrorText>{t("info.errorEmpty")}</S.ErrorText>
            </S.CenteredState>
          ) : null}
        </S.SafeArea>
      </S.Background>
    </S.Container>
  );
}

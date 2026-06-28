import React, { useEffect, useState, useCallback } from "react";
import { StatusBar } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ArrowLeft, AlertCircle } from "lucide-react-native";
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

function formatAddressLine(address?: AddressData): string {
  if (!address || !address.address) return "-";
  const parts = [address.address, address.number, address.neighborhood].filter(
    Boolean,
  );
  return parts.join(", ") || "-";
}

function formatCityLine(address?: AddressData): string {
  if (!address || (!address.city && !address.state)) return "-";
  return [address.city, address.state].filter(Boolean).join(" - ") || "-";
}

export default function GetInfo() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [hasError, setHasError] = useState(false);

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
      ? "Pessoa Física"
      : userData?.typerson === "J"
        ? "Pessoa Jurídica"
        : "-";

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
            <S.HeaderTitle>Minhas Informações</S.HeaderTitle>
          </S.Header>

          <S.cardLogo>
            <LogoSvg width={wp(36)} height={hp(10)} />
          </S.cardLogo>

          {!loading && hasError ? (
            <S.CenteredState>
              <S.ErrorIconWrapper>
                <AlertCircle size={28} color="#FF6B6B" strokeWidth={2.2} />
              </S.ErrorIconWrapper>
              <S.ErrorText>
                Não foi possível carregar suas informações.
              </S.ErrorText>
              <S.RetryButton onPress={fetchData} activeOpacity={0.7}>
                <S.RetryButtonText>Tentar novamente</S.RetryButtonText>
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
                <S.ProfileName>{userData.name || "-"}</S.ProfileName>
                <S.ProfileTypeBadge>
                  <S.ProfileTypeBadgeText>
                    {personTypeLabel}
                  </S.ProfileTypeBadgeText>
                </S.ProfileTypeBadge>
              </S.ProfileHeader>

              <S.SectionLabel>DADOS CADASTRAIS</S.SectionLabel>
              <S.SectionCard>
                <S.FieldRow>
                  <S.FieldLabel>NOME SOCIAL</S.FieldLabel>
                  <S.FieldValue>{userData.socialName || "-"}</S.FieldValue>
                </S.FieldRow>
                <S.FieldRow isLast>
                  <S.FieldLabel>DOCUMENTO</S.FieldLabel>
                  <S.FieldValue>{userData.document || "-"}</S.FieldValue>
                </S.FieldRow>
              </S.SectionCard>

              <S.SectionLabel>CONTATO</S.SectionLabel>
              <S.SectionCard>
                <S.FieldRow>
                  <S.FieldLabel>E-MAIL</S.FieldLabel>
                  <S.FieldValue>{email || "-"}</S.FieldValue>
                </S.FieldRow>
                <S.FieldRow isLast>
                  <S.FieldLabel>TELEFONE</S.FieldLabel>
                  <S.FieldValue>{phone || "-"}</S.FieldValue>
                </S.FieldRow>
              </S.SectionCard>

              <S.SectionLabel>ENDEREÇO</S.SectionLabel>
              <S.SectionCard>
                <S.FieldRow>
                  <S.FieldLabel>LOGRADOURO</S.FieldLabel>
                  <S.FieldValue>{formatAddressLine(address)}</S.FieldValue>
                </S.FieldRow>
                <S.FieldRow>
                  <S.FieldLabel>CIDADE</S.FieldLabel>
                  <S.FieldValue>{formatCityLine(address)}</S.FieldValue>
                </S.FieldRow>
                <S.FieldRow isLast>
                  <S.FieldLabel>CEP</S.FieldLabel>
                  <S.FieldValue>{address?.zipCode || "-"}</S.FieldValue>
                </S.FieldRow>
              </S.SectionCard>
            </S.ScrollContent>
          ) : !loading ? (
            <S.CenteredState>
              <S.ErrorIconWrapper>
                <AlertCircle size={28} color="#FF6B6B" strokeWidth={2.2} />
              </S.ErrorIconWrapper>
              <S.ErrorText>Nenhuma informação encontrada.</S.ErrorText>
            </S.CenteredState>
          ) : null}
        </S.SafeArea>
      </S.Background>
    </S.Container>
  );
}

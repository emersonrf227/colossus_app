import React, { useEffect, useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "react-native";
import * as S from "./styles";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Loader from "@/components/loader";
import LogoSvg from "@/assets/logov2.svg";
import rstruther from "@/infraestructure/http/nodeApi";

export default function getInfo() {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [address, setAddress] = useState(null);
  const [email, setEmail] = useState(null);
  const [phone, setPhone] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await rstruther.get(`saller/account/information`);
        setUserData(response.data);
        setAddress(response.data.Address?.[0] || {});
        setEmail(response.data.ContactEmail?.[0]?.email);
        setPhone(response.data.ContactPhone?.[0]?.phone);
      } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const renderField = (label: string, value?: string) => (
    <S.FieldWrapper>
      <S.Label>{label}</S.Label>
      <S.Value>{value || "-"}</S.Value>
    </S.FieldWrapper>
  );

  return (
    <S.Container>
      {loading && <Loader />}

      <S.Background source={require("@/assets/background.png")}>
        <StatusBar
          barStyle="default"
          backgroundColor="transparent"
          translucent
        />
        <S.SafeArea>
          <S.Header>
            <S.BackButton onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={32} color="white" />
            </S.BackButton>
          </S.Header>

          <S.cardLogo>
            <LogoSvg width={wp(45)} height={hp(15)} />
          </S.cardLogo>

          {userData ? (
            <S.CardCenter>
              <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
                <S.InfoBox>
                  {renderField("Name", userData.name)}
                  {renderField("Social Name", userData.socialName)}
                  {renderField("ID", userData.document)}
                  {renderField(
                    "Type Person",
                    userData.typerson === "F" ? "Física" : "Jurídica"
                  )}
                  {renderField("Email", email)}
                  {renderField("Phone", phone)}
                  {renderField(
                    "Address",
                    `${address.address}, ${address.number} - ${address.neighborhood}`
                  )}
                  {renderField("City", `${address.city} - ${address.state}`)}
                  {renderField("ZipCode", address.zipCode)}
                </S.InfoBox>
              </ScrollView>
            </S.CardCenter>
          ) : (
            <>
              <S.Value>Error</S.Value>
            </>
          )}
        </S.SafeArea>
      </S.Background>
    </S.Container>
  );
}

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
import { ImgLogo } from "../invoice/styles";

export default function getAbout() {
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  useEffect(() => {}, []);

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

          <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
            <S.InfoBox>
              <S.imageAbout
                source={require("@/assets/logoAbout.png")}
                resizeMode="contain"
              />
              <S.Label>COLOSSUS CRYPTO</S.Label>
              <S.Label>V 1.0.0</S.Label>
              <S.Label>Development by</S.Label>
              <S.Label>I Like Technology LTDA</S.Label>
              <S.Label>45.123.168/0001-22</S.Label>
            </S.InfoBox>
          </ScrollView>
        </S.SafeArea>
      </S.Background>
    </S.Container>
  );
}

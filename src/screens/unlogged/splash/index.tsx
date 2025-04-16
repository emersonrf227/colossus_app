import { StatusBar } from "react-native";
import React, { useEffect } from "react";
import * as S from "./styles";
import { useNavigation } from "@react-navigation/native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LogoSvg from "@/assets/logov2.svg";
import Loader from "@/components/loader";

export default function Splash() {
  const logoIlike = require("../../../assets/ilikel.png");

  const { navigate } = useNavigation();
  const navigation = useNavigation();

  async function viewRoute() {
    const token = await AsyncStorage.getItem("token");
    const refreshToken = await AsyncStorage.getItem("refreshToken");

    console.log("token==>", token);
    console.log("refreshToken==>", refreshToken);

    if (token) {
      navigation.reset({
        index: 0,
        routes: [{ name: "Dashboard" }],
      });
      return;
    }

    console.log("entrando no login");
    navigation.reset({
      index: 0,
      routes: [{ name: "SingIn" }],
    });
  }
  useEffect(() => {
    setTimeout(function () {
      viewRoute();
    }, 2000);
  }, []);
  return (
    <S.Container>
      <Loader></Loader>
      <S.Background source={require("@/assets/background.png")}></S.Background>
    </S.Container>
  );
}

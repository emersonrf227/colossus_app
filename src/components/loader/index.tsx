import { StatusBar } from "react-native";
import React from "react";
import * as S from "./styles";

export default function Loader() {
  return (
    <S.LoaderOverlay>
      <StatusBar barStyle="default" backgroundColor="transparent" translucent />
      <S.LoaderBackground />
      <S.cardLogo>
        <S.ImgGig source={require("@/assets/helm-loading.gif")} />
      </S.cardLogo>
    </S.LoaderOverlay>
  );
}

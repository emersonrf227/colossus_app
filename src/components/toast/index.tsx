import React from "react";
import { useState } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Platform, StatusBar, StatusBarStyle } from "react-native";
import { getStatusBarHeight } from "react-native-iphone-x-helper";
import * as S from "./styles";
import { useEffect } from "react";
import { Dimensions } from "react-native";

const height = Dimensions.get("window").height;

interface ToastProps {
  animatedStyles: {
    transform: {
      translateY: number;
    }[];
  };
  message: string;
  color: "success" | "warn" | "error" | "default";
}

export function Toast({ animatedStyles, message, color }: ToastProps) {
  const [styleStatusBar, setStyleStatusBar] =
    useState<StatusBarStyle>("dark-content");

  function zIndex(val: number) {
    return Platform.select({
      ios: { zIndex: val },
      android: { elevation: val },
    });
  }

  return (
    <S.Container style={[{ ...zIndex(100) }, animatedStyles]}>
      <StatusBar
        barStyle={styleStatusBar}
        backgroundColor={"#FFF"}
        translucent={true}
      />

      <S.Button>
        <S.Content type={color}>
          <S.Wrapper>
            <S.Icon name="alert-circle" />
            <S.Text>{message}</S.Text>
          </S.Wrapper>
        </S.Content>
      </S.Button>
    </S.Container>
  );
}

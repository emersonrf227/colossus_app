import styled, { css } from "styled-components/native";
import Animated from "react-native-reanimated";

import { Feather } from "@expo/vector-icons";

import { Dimensions } from "react-native";
import { getStatusBarHeight } from "react-native-iphone-x-helper";
import { RFValue } from "react-native-responsive-fontsize";

const { width } = Dimensions.get("window");

interface ContentProps {
  type?: "success" | "warn" | "error" | "default";
}

const toastTypeVariations = {
  success: css`
    background-color: #43d29e;
  `,
  warn: css`
    background-color: #fd951f;
  `,
  error: css`
    background-color: #e45227;
  `,
  default: css`
    background-color: #3a405b;
  `,
};

export const Container = styled(Animated.View)``;

export const Button = styled.TouchableOpacity``;

export const Content = styled.View<ContentProps>`
  position: absolute;
  width: ${width}px;
  padding: 0 7px;
  padding-bottom: 0px;
  padding-top: ${getStatusBarHeight() + 50}px;

  align-self: center;
  justify-content: center;

  ${(props) => toastTypeVariations[props.type || "default"]}
`;

export const Wrapper = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 0 30px;
`;

export const Text = styled.Text`
  font-family: ${({ theme }) => theme.fonts.semi_bold};
  color: #fff;
  margin: 0px 10px;
  font-size: ${RFValue(14)}px;
`;

export const Icon = styled(Feather)`
  color: #fff;
  font-size: ${RFValue(20)}px;
`;

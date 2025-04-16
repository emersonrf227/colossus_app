import styled from "styled-components/native";
import { Dimensions, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const { width } = Dimensions.get("window");

export const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: #000;
  background-color: rgba(0, 0, 0, 0.1);
`;

export const Background = styled.ImageBackground`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export const SafeArea = styled(SafeAreaView)`
  flex: 1;
  width: ${wp("100%")};
  height: ${hp("100%")};
  align-items: center;
  background-color: rgba(0, 0, 0, 0.8);
  border-radius: 20px;
`;

export const Header = styled.View`
  width: ${wp("100%")};
  top: 0;
`;

export const cardLogo = styled.View`
  align-items: center;
  justify-content: center;
  width: ${wp("100%")};
  height: ${hp("10%")};
`;

export const ImgGig = styled.Image`
  width: 300px;
  height: 300px;
`;

export const LoaderOverlay = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.8);
`;

export const LoaderBackground = styled.View`
  ...${StyleSheet.absoluteFillObject};
  background-color: rgba(0, 0, 0, 0.5);
`;

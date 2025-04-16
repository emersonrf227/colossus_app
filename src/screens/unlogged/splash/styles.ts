import styled from "styled-components/native";
import { Dimensions } from "react-native";
import { TextInputMask } from "react-native-masked-text";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { SafeAreaView } from "react-native-safe-area-context";

const { width: screenWidth } = Dimensions.get("window");

export const Background = styled.ImageBackground`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

export const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: "#000";
  width: 100%;
`;

export const CardLogo1 = styled.View`
  width: 90%;
  padding: 20px;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: 20px;
`;

export const CardText = styled.Text`
  color: #fff;
  font-size: 12px;
  font-weight: bold;
  margin-top: 20px;
`;

export const SafeArea = styled(SafeAreaView)`
  flex: 1;
  width: ${wp("100%")};
  height: ${hp("100%")};
  align-items: center;
  flex: 1;
  width: 100%;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.7);
  justify-content: space-between;
`;

export const Logo = styled.Image`
  position: fixed;
  width: 120px;
  height: 120px;
  bottom: 0;
`;

export const Footer = styled.View`
  position: fixed;
  width: 120px;
  height: 120px;
  bottom: 0;
`;

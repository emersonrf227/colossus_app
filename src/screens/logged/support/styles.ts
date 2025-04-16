import styled from "styled-components/native";
import { Dimensions, TouchableOpacity } from "react-native";
import { TextInputMask } from "react-native-masked-text";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

export const Background = styled.ImageBackground`
  flex: 1;
`;

export const Container = styled.View`
  flex: 1;
  /* width: ${wp("100%")};
  height: ${hp("100%")}; */
  align-items: center;
  justify-content: center;
  background-color: "#000";
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

export const BackButton = styled.TouchableOpacity`
  padding: 10px;
`;

export const InfoBox = styled.View`
  margin-top: ${hp("3%")}px;
  border-radius: 15px;
  padding: 20px;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const FieldWrapper = styled.View`
  margin-bottom: 15px;
`;

export const Label = styled.Text`
  font-weight: bold;
  color: #fff;
  font-size: ${wp("3%")}px;
  margin-top: 2px;
`;

export const LoginButton = styled.TouchableOpacity`
  width: 100%;
  height: 50px;
  background-color: #00ffcc;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 255, 204, 0.5);
  margin-bottom: 40px;
  margin-top: 40px;
`;

export const ButtonText = styled.Text`
  color: #000;
  font-size: 18px;
  font-weight: bold;
`;

export const Value = styled.Text`
  color: #000;
  font-size: ${wp("4%")}px;
`;

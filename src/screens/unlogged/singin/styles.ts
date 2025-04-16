import styled from "styled-components/native";
import { Dimensions } from "react-native";
import { TextInputMask } from "react-native-masked-text";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const { width: screenWidth } = Dimensions.get("window");

export const Background = styled.ImageBackground`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

export const Header = styled.View`
  width: ${wp("100%")};
  top: 0;
`;

export const Container = styled.View`
  width: 90%;
  padding: 20px;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.8);
  border-radius: 20px;
`;

export const Logo = styled.Image`
  width: 120px;
  height: 120px;
  margin-bottom: 20px;
`;

export const Input = styled.TextInput`
  width: 100%;
  height: 50px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  margin-bottom: 15px;
  padding: 10px;
  color: #fff;
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
`;

export const ResetButton = styled.TouchableOpacity``;

export const LoginText = styled.Text`
  color: #000;
  font-size: 18px;
  font-weight: bold;
`;

export const ForgotPassword = styled.Text`
  margin-top: 50px;
  color: #fff;
  margin-top: 10px;
`;

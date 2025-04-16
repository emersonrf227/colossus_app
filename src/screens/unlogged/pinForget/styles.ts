import styled from "styled-components/native";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";

export const Background = styled.ImageBackground`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

export const Container = styled.View`
  width: 90%;
  padding: 20px;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.8);
  border-radius: 20px;
`;

export const Title = styled.Text`
  font-size: 22px;
  color: #fff;
  margin-bottom: 20px;
`;

export const InputContainer = styled.View`
  flex-direction: row;
  gap: 10px;
`;

export const PinInput = styled.TextInput`
  width: 50px;
  height: 50px;
  border-radius: 10px;
  background-color: rgba(255, 255, 255, 0.1);
  text-align: center;
  font-size: 24px;
  color: #fff;
  border-width: 2px;
  border-color: #00ffcc;
`;

export const ConfirmButton = styled.TouchableOpacity`
  width: 100%;
  height: 50px;
  background-color: #00ffcc;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 255, 204, 0.5);
  margin-top: 20px;
`;

export const ConfirmText = styled.Text`
  color: #000;
  font-size: 18px;
  font-weight: bold;
`;

export const viewBoxInput = styled.View`
  width: 100%;
  margin-top: 30px;
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

export const ResetButton = styled.TouchableOpacity``;

export const ForgotPassword = styled.Text`
  margin-top: 10px;
  color: #fff;
`;

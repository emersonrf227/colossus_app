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
//10

export const cardLogo = styled.View`
  align-items: center;
  justify-content: center;
  width: ${wp("100%")};
  height: ${hp("10%")};
`;

export const CardSelectNetwork = styled.View`
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: ${wp("100%")};
  height: ${hp("15%")};
  margin-top: 10px;
`;

export const CardNetwork = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: ${wp("100%")};
  bottom: 10px;
  margin-top: 20px;
`;

export const TextNetwork = styled.Text`
  color: ${({ theme }) => theme.colors.secondary};
  font-size: 12px;
  margin-top: ${wp("3%")};
`;

export const NetworkButton = styled(TouchableOpacity)`
  margin: 0 15px;
`;

export const MenuButton = styled(TouchableOpacity)`
  width: 50px;
  margin-left: 5px;
  height: 50px;
  justify-content: center;
`;

export const MenuIcon = styled.Text`
  top: 0;
  margin-left: 10px;
  color: ${({ theme }) => theme.colors.secondary};
  font-size: 40px;
`;

export const CardPad = styled.View`
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: ${wp("100%")};
  height: ${hp("60%")};
  margin: 10px;
`;

export const Display = styled.Text`
  flex-direction: row;
  width: 80%;
  height: 40px;
  background-color: transparent;
  border: 2px solid #00ffcc;
  text-align: center;
  font-size: 24px;
  color: #fff;

  justify-content: center;

  margin: 10px 10px;
  border-radius: 10px;
`;

export const ButtonContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  width: ${wp("70%")};
`;

export const Button = styled(TouchableOpacity)`
  width: ${wp("19%")};
  aspect-ratio: 1.1;
  justify-content: center;
  align-items: center;
  background-color: #e0e0e0;
  margin: 4px;
  border-radius: 10px;
  border: 2px solid ${({ theme }) => theme.colors.secondary};
`;

export const ButtonSend = styled.TouchableOpacity`
  width: 80%;
  height: 50px;
  background-color: #00ffcc;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 255, 204, 0.5);
  bottom: 40px;
`;

export const ButtonTextSend = styled.Text`
  color: #412659;
  font-size: 18px;
  font-weight: bold;
`;

export const ButtonText = styled.Text`
  font-size: 24px;
`;

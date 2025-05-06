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

export const BackButton = styled.TouchableOpacity`
  position: fixed;
  top: 0;
  padding: 10px;
  border-radius: 10px;
`;

export const BackButtonText = styled.Text`
  color: #fff;
  font-size: 35px;
  font-weight: bold;
`;

export const CardPad = styled.View`
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: ${wp("100%")};
  height: ${hp("50%")};
  top: ${hp("15%")};
`;

export const ButtonContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  width: ${wp("50%")};
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

export const ButtonGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;
  padding-horizontal: ${wp(10)}px;
`;

export const ButtonShutdown = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;
`;

export const MenuButtonfunction = styled(TouchableOpacity)`
  width: ${wp(60)}px; /* Ajustado para 3 colunas com espaçamento */
  height: ${wp(18)}px; /* Botões quadrados */
  background-color: #00ffcc;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
  margin: ${wp(2)}px; /* Espaçamento entre os botões */
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.25;
  shadow-radius: 3.84px;
  elevation: 5;
`;

export const MenuButton = styled(TouchableOpacity)`
  width: ${wp(24)}px; /* Ajustado para 3 colunas com espaçamento */
  height: ${wp(24)}px; /* Botões quadrados */
  background-color: #00ffcc;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
  margin: ${wp(2)}px; /* Espaçamento entre os botões */
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.25;
  shadow-radius: 3.84px;
  elevation: 5;
`;

export const ButtonText = styled.Text`
  color: #412659; /* Cor do texto dos botões */
  font-size: ${wp(3)}px;
  margin-top: ${hp(1)}px;
  text-align: center;
`;

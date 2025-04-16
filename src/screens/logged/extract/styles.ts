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

export const ListContainer = styled.View`
  flex: 1;
  width: 100%;
  padding: 0 16px;
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
  z-index: 10;
`;

export const cardLogo = styled.View`
  align-items: center;
  justify-content: center;
  width: ${wp("100%")};
  height: ${hp("10%")};
`;

export const cardDropDown = styled.View`
  align-items: center;
  justify-content: center;
  width: ${wp("70%")};
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

export const FilterDateArea = styled.View`
  width: ${wp("100%")};
  align-items: center;
  flex-direction: row;
  justify-content: center;
  margin-top: 20px;
`;

export const FilterArea = styled.View`
  width: ${wp("100%")};
  align-items: center;
  flex-direction: row;
  justify-content: center;
`;

export const Input = styled.TextInput`
  height: 50px;
  background-color: #fff;
  border-radius: 8px;
  margin: 15px;
  width: ${wp("40%")};
  align-items: center;
  text-align: center;
`;

export const SearchButton = styled.TouchableOpacity`
  background-color: #00ffcc;
  padding: 12px;
  border-radius: 8px;
  align-items: center;
  justify-content: center;
  align-items: center;
  width: ${wp("18%")};
  height: 50px;
`;

export const InvoiceItem = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.1);
  padding: 16px;
  border-radius: 10px;
  margin-bottom: 10px;
  width: ${wp("100%")};
`;

export const TextContainer = styled.View`
  flex: 1;
`;

export const IconContainer = styled.View`
  justify-content: center;
  align-items: center;
  margin-left: 20px;
  align-items: center;
  justify-content: center;
  width: 60px;
`;

export const SelectContainer = styled.View`
  background-color: #fff;
  border-radius: 8px;
  margin-bottom: 10px;
  overflow: hidden;
`;

export const InvoiceText = styled.Text`
  color: white;
  font-size: ${wp(3.8)}px;
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
  width: ${wp(28)}px; /* Ajustado para 3 colunas com espaçamento */
  height: ${wp(28)}px; /* Botões quadrados */
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
  font-size: 16px;
  text-align: center;
`;

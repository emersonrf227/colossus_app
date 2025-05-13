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
`;

export const CardNetwork = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: ${wp("100%")};
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

export const TextNetwork = styled.Text`
  color: ${({ theme }) => theme.colors.secondary};
  font-size: 12px;
  margin-top: ${wp("3%")};
`;

export const NetworkButton = styled(TouchableOpacity)`
  margin: 0 15px;
`;

export const CardPad = styled.View`
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: ${wp("100%")};
  height: ${hp("60%")};
`;

export const Display = styled.Text`
  font-size: 27px;
  width: ${wp("100%")};
  height: ${hp("8%")};
  text-align: right;
  border-width: 1px;
  border-color: #ccc;
  padding: 5px;
  background-color: white;
  border: 2px solid ${({ theme }) => theme.colors.secondary};
`;

export const ButtonContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  width: ${wp("70%")};
`;

export const CardInput = styled.View`
  flex-direction: row;
  align-items: center;
  width: "100%";
  padding: 16px;
`;

export const Input = styled.TextInput`
  width: ${wp("90%")};
  height: ${hp("6%")};
  background-color: #fff;
  border: 2px solid ${({ theme }) => theme.colors.secondy};
  border-radius: 8px;
  margin-bottom: 15px;
  padding: 10px;
  margin-top: 15px;
  margin-bottom: 15px;
  font-size: 11px;
`;

export const CopyButton = styled(TouchableOpacity)`
  /* width: ${wp("19%")};
  aspect-ratio: 1.1; */
  width: ${wp("10%")};
  height: ${hp("5%")};

  justify-content: center;
  align-items: center;
  background-color: transparent;

  border: 1px solid ${({ theme }) => theme.colors.white};
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
  background-color: ${({ theme }) => theme.colors.primary};

  border: 2px solid ${({ theme }) => theme.colors.secondary};
  padding: 15px;
  width: ${wp("90%")};
  border-radius: 10px;
  align-items: center;
  margin-top: ${hp("-5%")};
  bottom: ${hp("3%")};
`;
export const ButtonTextSend = styled.Text`
  color: #412659;
  font-size: 16px;
  font-weight: bold;
`;

export const CardQrCode = styled.View`
  width: 220px;
  height: 220px;
  align-items: center;
  justify-content: center;
  background-color: white;
`;

export const TextWallet = styled.Text`
  color: ${({ theme }) => theme.colors.white};
  font-size: 12px;
  margin-top: 20px;
`;

export const TextBalance = styled.Text`
  color: ${({ theme }) => theme.colors.white};
  font-size: 25px;
  margin-top: 20px;
`;

export const cardBalance = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const imageToken = styled.Image`
  height: 20px;
  width: 20px;
  margin-top: 18px;
  margin-left: 10px;
`;

export const QRCodeContainer = styled.View`
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: ${wp("100%")};
  margin-top: 50px;
  height: ${hp("60%")};
`;

export const walletItsOk = styled.Text`
  flex: 1;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  width: "100%";
`;

export const walletItsNOk = styled.Text`
  align-items: center;
  justify-content: center;
`;

export const ButtonText = styled.Text`
  color: #412659;
  font-size: 16px;
  font-weight: bold;
`;

export const FooterButton = styled.TouchableOpacity`
  background-color: ${({ theme }) => theme.colors.secondary};
  padding: 15px;
  border-radius: 10px;
  align-items: center;
  border: 2px solid ${({ theme }) => theme.colors.secondary};
  width: ${wp("90%")};
  margin-top: ${wp("1%")};
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

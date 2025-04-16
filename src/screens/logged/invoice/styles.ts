import styled from "styled-components/native";
import { Dimensions, TouchableOpacity } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

export const Background = styled.ImageBackground`
  flex: 1;
`;

export const cardBalance = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: -50px;
`;

export const cardPay = styled.View`
  flex-direction: column;
  align-items: center;
`;

export const imageToken = styled.Image`
  height: 40px;
  width: 40px;
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

export const CardQr = styled.View`
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: ${wp("100%")};
  height: ${hp("60%")};
`;

export const QRCodeContainer = styled.View`
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: ${wp("100%")};
  margin-top: 50px;
  height: ${hp("60%")};
`;

export const CardQrCode = styled.View`
  width: 200px;
  height: 200px;
  align-items: center;
  justify-content: center;
  background-color: white;
`;

export const cardAddress = styled.View`
  flex-direction: row;
  margin-top: -10px;
`;

export const TextWallet = styled.Text`
  color: ${({ theme }) => theme.colors.secondary};
  font-size: 12px;
  margin: 20px;
`;

export const CardNetwork = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
`;

export const ImgLogo = styled.Image`
  position: fixed;
  width: 100px;
  height: 100px;
`;

export const TextAmount = styled.Text`
  color: ${({ theme }) => theme.colors.white};
  font-size: 24px;
  margin: 10px;
`;

export const TextNetwork = styled.Text`
  color: ${({ theme }) => theme.colors.secondary};
  font-size: 24px;
  margin-top: 8%;
  margin-bottom: -3%;
`;

export const TimerText = styled.Text`
  font-size: 20px;
  color: ${({ theme }) => theme.colors.white};
  margin-top: -20px;
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

export const ButtonText = styled.Text`
  color: #fff;
  font-size: 16px;
  font-weight: bold;
`;

export const FooterButton = styled.TouchableOpacity`
  background-color: ${({ theme }) => theme.colors.attention};
  padding: 15px;
  border-radius: 10px;
  align-items: center;
  border: 2px solid ${({ theme }) => theme.colors.white};
  width: ${wp("90%")};
  margin-top: ${wp("1%")};
`;

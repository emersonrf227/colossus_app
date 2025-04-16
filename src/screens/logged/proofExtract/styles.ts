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

export const BackButton = styled.TouchableOpacity`
  position: fixed;
  top: 0;
  padding: 10px;
  border-radius: 10px;
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
  justify-content: space-between;
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

export const ReceiptContainer = styled.View`
  background-color: #ffffff;
  border-radius: 12px;
  padding: 20px;
  width: ${wp("90%")};
  height: ${hp("60%")};
  margin-top: 20px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.2;
  elevation: 3;
  justify-content: space-between;
  overflow: hidden; /* Evita elementos que ultrapassam o container */
`;

export const Title = styled.Text`
  font-size: 20px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 0px;
`;

export const DetailRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding: 3px 0;
`;

export const DetailColumn = styled.View`
  flex-direction: column;
  justify-content: space-between;
  padding: 3px 0;
`;

export const DetailLabel = styled.Text`
  font-size: 14px;
  color: #333;
`;

export const DetailValue = styled.Text`
  font-size: 10px;
  font-weight: bold;
  color: #333;
`;

export const ButtonContainer = styled.View`
  align-items: center;
`;

export const ButtonPrint = styled.TouchableOpacity`
  background-color: #4caf50;
  margin-top: 30px;
  border: 2px solid ${({ theme }) => theme.colors.secondary};
  padding: 15px;
  width: ${wp("90%")};
  border-radius: 10px;
  align-items: center;
  bottom: ${hp("3%")};
`;

export const ButtonReturn = styled.TouchableOpacity`
  background-color: rgb(63, 157, 250);
  margin-top: 10px;

  border: 2px solid ${({ theme }) => theme.colors.secondary};
  padding: 15px;
  width: ${wp("90%")};
  border-radius: 10px;
  align-items: center;
  bottom: ${hp("3%")};
`;

export const ButtonText = styled.Text`
  color: #fff;
  font-size: 16px;
  font-weight: bold;
`;

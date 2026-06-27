import styled from "styled-components/native";
import { LinearGradient } from "expo-linear-gradient";
import { Platform, StatusBar as RNStatusBar } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

// Altura da status bar no Android (no iOS o SafeAreaView já trata sozinho)
const STATUSBAR_HEIGHT =
  Platform.OS === "android" ? (RNStatusBar.currentHeight ?? 24) : 0;

// Paleta — ajuste para sua marca se quiser
export const colors = {
  bgDark: "#0B0E14",
  primary: "#6C5CE7", // roxo principal
  primaryDark: "#4834D4",
  accent: "#00D2D3", // ciano de destaque
  surface: "rgba(255,255,255,0.06)",
  surfaceBorder: "rgba(255,255,255,0.10)",
  danger: "#FF6B6B",
  textPrimary: "#FFFFFF",
  textMuted: "rgba(255,255,255,0.55)",
};

export const Container = styled.View`
  flex: 1;
  background-color: ${colors.bgDark};
`;

export const Background = styled.ImageBackground`
  flex: 1;
  width: 100%;
  height: 100%;
`;

// Overlay escuro por cima do background, para dar contraste com os cards/textos
export const BackgroundOverlay = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(5, 4, 10, 0.65);
`;

export const SafeArea = styled.SafeAreaView`
  flex: 1;
  padding-horizontal: ${wp(5)}px;
  padding-top: ${STATUSBAR_HEIGHT}px;
`;

export const Header = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  margin-top: ${hp(1)}px;
`;

export const MenuButton = styled.TouchableOpacity`
  width: 44px;
  height: 44px;
  border-radius: 14px;
  align-items: center;
  justify-content: center;
  background-color: ${colors.surface};
  border-width: 1px;
  border-color: ${colors.surfaceBorder};
`;

export const cardLogo = styled.View`
  align-items: center;
  margin-top: ${hp(1)}px;
`;

export const CardSelectNetwork = styled.View`
  align-items: center;
  margin-top: ${hp(2)}px;
`;

export const CardNetwork = styled.View`
  flex-direction: row;
  gap: 16px;
`;

interface NetworkButtonProps {
  selected?: boolean;
  disabled?: boolean;
}

export const NetworkButton = styled.TouchableOpacity<NetworkButtonProps>`
  width: ${wp(18)}px;
  height: ${wp(18)}px;
  border-radius: ${wp(9)}px;
  align-items: center;
  justify-content: center;
  background-color: ${({ selected }) =>
    selected ? "rgba(108,92,231,0.18)" : "transparent"};
  border-width: 2px;
  border-color: ${({ selected }) =>
    selected ? colors.primary : "transparent"};
  shadow-color: ${colors.primary};
  shadow-opacity: ${({ selected }) => (selected ? 0.5 : 0)};
  shadow-radius: 10px;
  shadow-offset: 0px 0px;
  elevation: ${({ selected }) => (selected ? 6 : 0)};
`;

export const CardPad = styled.View`
  flex: 1;
  margin-top: ${hp(3)}px;
  justify-content: flex-end;
  padding-bottom: ${hp(3)}px;
`;

export const DisplayWrapper = styled.View`
  align-items: center;
  margin-bottom: ${hp(3)}px;
`;

export const DisplayCurrencyLabel = styled.Text`
  color: ${colors.textMuted};
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 2px;
  margin-bottom: 4px;
`;

export const Display = styled.Text`
  color: ${colors.textPrimary};
  font-size: 48px;
  font-weight: 700;
  letter-spacing: 0.5px;
`;

export const ButtonContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
`;

interface KeyButtonProps {
  variant?: "default" | "action";
}

export const Button = styled.TouchableOpacity<KeyButtonProps>`
  width: 30%;
  height: ${hp(8)}px;
  border-radius: 18px;
  align-items: center;
  justify-content: center;
  margin-bottom: ${hp(1.5)}px;
  background-color: ${({ variant }) =>
    variant === "action" ? "rgba(255,107,107,0.10)" : colors.surface};
  border-width: 1px;
  border-color: ${({ variant }) =>
    variant === "action" ? "rgba(255,107,107,0.25)" : colors.surfaceBorder};
`;

export const ButtonText = styled.Text`
  color: ${colors.textPrimary};
  font-size: 24px;
  font-weight: 600;
`;

export const ButtonSend = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 10px;
  height: ${hp(7)}px;
  border-radius: 18px;
  margin-top: ${hp(1)}px;
  background-color: ${colors.primary};
  shadow-color: ${colors.primary};
  shadow-opacity: 0.4;
  shadow-radius: 12px;
  shadow-offset: 0px 6px;
  elevation: 8;
`;

export const ButtonTextSend = styled.Text`
  color: ${colors.textPrimary};
  font-size: 17px;
  font-weight: 700;
  letter-spacing: 0.3px;
`;

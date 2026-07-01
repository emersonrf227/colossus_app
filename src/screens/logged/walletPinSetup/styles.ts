import styled from "styled-components/native";
import { Platform, StatusBar as RNStatusBar } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { colors } from "../dashboard/styles";

const STATUSBAR_HEIGHT =
  Platform.OS === "android" ? (RNStatusBar.currentHeight ?? 24) : 0;

export const Container = styled.View`
  flex: 1;
  background-color: ${colors.bgDark};
`;

export const Background = styled.ImageBackground`
  flex: 1;
  width: 100%;
  height: 100%;
`;

export const BackgroundOverlay = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(5, 4, 10, 0.72);
`;

export const SafeArea = styled.SafeAreaView`
  flex: 1;
  padding-horizontal: ${wp(6)}px;
  padding-top: ${STATUSBAR_HEIGHT}px;
`;

export const Header = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: ${hp(1)}px;
`;

export const BackButton = styled.TouchableOpacity`
  width: 44px;
  height: 44px;
  border-radius: 14px;
  align-items: center;
  justify-content: center;
  background-color: ${colors.surface};
  border-width: 1px;
  border-color: ${colors.surfaceBorder};
`;

export const Content = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding-bottom: ${hp(6)}px;
`;

export const StepLabel = styled.Text`
  color: ${colors.textMuted};
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1.2px;
  margin-bottom: 8px;
`;

export const StepTitle = styled.Text`
  color: ${colors.textPrimary};
  font-size: 20px;
  font-weight: 700;
  text-align: center;
`;

export const StepSubtitle = styled.Text`
  color: ${colors.textMuted};
  font-size: 13px;
  text-align: center;
  margin-top: 6px;
  margin-bottom: ${hp(4)}px;
  padding-horizontal: 10px;
  line-height: 18px;
`;

export const DotsRow = styled.View`
  flex-direction: row;
  gap: 14px;
  margin-bottom: ${hp(5)}px;
`;

interface DotProps {
  filled?: boolean;
  hasError?: boolean;
}

export const Dot = styled.View<DotProps>`
  width: 14px;
  height: 14px;
  border-radius: 7px;
  background-color: ${({ filled, hasError }) =>
    hasError ? colors.danger : filled ? colors.primary : "transparent"};
  border-width: 1.5px;
  border-color: ${({ hasError }) =>
    hasError ? colors.danger : colors.surfaceBorder};
`;

export const Keypad = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;
`;

export const KeypadButton = styled.TouchableOpacity`
  width: 28%;
  aspect-ratio: 1.6;
  align-items: center;
  justify-content: center;
  margin: 4px;
  border-radius: 14px;
  background-color: ${colors.surface};
`;

export const KeypadButtonText = styled.Text`
  color: ${colors.textPrimary};
  font-size: 22px;
  font-weight: 600;
`;

export const ErrorText = styled.Text`
  color: ${colors.danger};
  font-size: 13px;
  margin-top: ${hp(1)}px;
  text-align: center;
`;

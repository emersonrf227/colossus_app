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
`;

export const BackgroundOverlay = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(5, 4, 10, 0.7);
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
  border-width: 1px;
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

export const HeaderTitle = styled.Text`
  color: ${colors.textPrimary};
  font-size: 18px;
  font-weight: 700;
  margin-left: 14px;
  width: 100%;
  height: 100%;
`;

export const Content = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding-horizontal: ${wp(2)}px;
`;

export const StepIconWrapper = styled.View<{ accentColor?: string }>`
  width: 88px;
  height: 88px;
  border-radius: 28px;
  align-items: center;
  justify-content: center;
  background-color: ${(p) => (p.accentColor ?? colors.primary) + "22"};
  border-width: 1px;
  border-color: ${(p) => (p.accentColor ?? colors.primary) + "55"};
  margin-bottom: ${hp(3)}px;
`;

export const StepTitle = styled.Text`
  color: ${colors.textPrimary};
  font-size: 22px;
  font-weight: 800;
  text-align: center;
  margin-bottom: ${hp(1.5)}px;
`;

export const StepText = styled.Text`
  color: ${colors.textMuted};
  font-size: 15px;
  line-height: 23px;
  text-align: center;
`;

export const StepTextStrong = styled.Text`
  color: ${colors.textPrimary};
  font-weight: 700;
`;

export const DotsRow = styled.View`
  flex-direction: row;
  justify-content: center;
  gap: 8px;
  margin-bottom: ${hp(2.5)}px;
`;

export const Dot = styled.View<{ active?: boolean }>`
  width: ${(p) => (p.active ? 22 : 8)}px;
  height: 8px;
  border-radius: 4px;
  background-color: ${(p) =>
    p.active ? colors.primary : "rgba(255,255,255,0.25)"};
`;

export const Footer = styled.View`
  padding-bottom: ${hp(4)}px;
`;

export const AcceptRow = styled.TouchableOpacity`
  flex-direction: row;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: ${hp(2.5)}px;
  padding: 14px;
  border-radius: 14px;
  background-color: ${colors.surface};
  border-width: 1px;
  border-color: ${colors.surfaceBorder};
`;

export const Checkbox = styled.View<{ checked?: boolean }>`
  width: 24px;
  height: 24px;
  border-radius: 8px;
  border-width: 2px;
  border-color: ${(p) => (p.checked ? colors.primary : colors.surfaceBorder)};
  background-color: ${(p) => (p.checked ? colors.primary : "transparent")};
  align-items: center;
  justify-content: center;
`;

export const AcceptText = styled.Text`
  flex: 1;
  color: ${colors.textPrimary};
  font-size: 14px;
  line-height: 21px;
`;

export const PrimaryButton = styled.TouchableOpacity<{ disabled?: boolean }>`
  height: 54px;
  border-radius: 16px;
  align-items: center;
  justify-content: center;
  background-color: ${(p) =>
    p.disabled ? "rgba(255,255,255,0.12)" : colors.primary};
`;

export const PrimaryButtonText = styled.Text<{ disabled?: boolean }>`
  color: ${(p) => (p.disabled ? colors.textMuted : "#ffffff")};
  font-size: 16px;
  font-weight: 700;
`;

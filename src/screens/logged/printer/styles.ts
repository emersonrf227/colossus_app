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
  background-color: rgba(5, 4, 10, 0.65);
`;

export const SafeArea = styled.SafeAreaView`
  flex: 1;
  padding-horizontal: ${wp(5)}px;
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

export const HeaderTitle = styled.Text`
  color: ${colors.textPrimary};
  font-size: 18px;
  font-weight: 700;
  margin-left: 14px;
`;

export const cardLogo = styled.View`
  align-items: center;
  margin-top: ${hp(0.5)}px;
`;

export const CardPad = styled.View`
  flex: 1;
  justify-content: center;
`;

export const TitleText = styled.Text`
  color: ${colors.textPrimary};
  font-size: 16px;
  font-weight: 700;
  text-align: center;
  margin-bottom: ${hp(0.5)}px;
`;

export const SubtitleText = styled.Text`
  color: ${colors.textMuted};
  font-size: 13px;
  text-align: center;
  margin-bottom: ${hp(4)}px;
`;

export const OptionsRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  gap: 16px;
`;

interface PrinterCardProps {
  selected?: boolean;
}

export const PrinterCard = styled.TouchableOpacity<PrinterCardProps>`
  flex: 1;
  aspect-ratio: 0.95;
  border-radius: 20px;
  align-items: center;
  justify-content: center;
  background-color: ${({ selected }) =>
    selected ? "rgba(108,92,231,0.20)" : colors.surface};
  border-width: 2px;
  border-color: ${({ selected }) =>
    selected ? colors.primary : colors.surfaceBorder};
  shadow-color: ${colors.primary};
  shadow-opacity: ${({ selected }) => (selected ? 0.45 : 0)};
  shadow-radius: 12px;
  shadow-offset: 0px 4px;
  elevation: ${({ selected }) => (selected ? 8 : 0)};
`;

export const PrinterIconWrapper = styled.View<PrinterCardProps>`
  width: 56px;
  height: 56px;
  border-radius: 18px;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
  background-color: ${({ selected }) =>
    selected ? "rgba(108,92,231,0.25)" : "rgba(255,255,255,0.08)"};
`;

export const PrinterCardLabel = styled.Text<PrinterCardProps>`
  color: ${({ selected }) =>
    selected ? colors.textPrimary : colors.textMuted};
  font-size: 17px;
  font-weight: 700;
`;

export const PrinterCardSubLabel = styled.Text<PrinterCardProps>`
  color: ${({ selected }) =>
    selected ? colors.textMuted : "rgba(255,255,255,0.35)"};
  font-size: 11.5px;
  margin-top: 2px;
`;

export const SelectedBadge = styled.View`
  position: absolute;
  top: 10px;
  right: 10px;
  width: 22px;
  height: 22px;
  border-radius: 11px;
  align-items: center;
  justify-content: center;
  background-color: ${colors.primary};
`;

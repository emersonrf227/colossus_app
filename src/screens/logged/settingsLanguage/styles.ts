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
  margin-bottom: ${hp(1)}px;
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

export const ScrollContent = styled.ScrollView`
  flex: 1;
`;

export const SectionLabel = styled.Text`
  color: ${colors.textMuted};
  font-size: 12.5px;
  font-weight: 700;
  letter-spacing: 1.2px;
  margin-bottom: ${hp(1.2)}px;
  margin-top: ${hp(2.5)}px;
`;

// Card "container" que agrupa as opções de uma seção, com divisórias internas
export const OptionsGroup = styled.View`
  border-radius: 16px;
  overflow: hidden;
  background-color: ${colors.surface};
  border-width: 1px;
  border-color: ${colors.surfaceBorder};
`;

interface OptionRowProps {
  isLast?: boolean;
}

export const OptionRow = styled.TouchableOpacity<OptionRowProps>`
  flex-direction: row;
  align-items: center;
  padding: 14px 16px;
  border-bottom-width: ${({ isLast }) => (isLast ? 0 : 1)}px;
  border-bottom-color: ${colors.surfaceBorder};
`;

export const OptionEmoji = styled.Text`
  font-size: 20px;
  margin-right: 12px;
  width: 26px;
`;

export const OptionLabel = styled.Text`
  flex: 1;
  color: ${colors.textPrimary};
  font-size: 15px;
  font-weight: 500;
`;

export const OptionSubLabel = styled.Text`
  color: ${colors.textMuted};
  font-size: 12.5px;
  margin-top: 1px;
`;

export const OptionTextWrapper = styled.View`
  flex: 1;
`;

export const CheckCircle = styled.View<{ checked?: boolean }>`
  width: 22px;
  height: 22px;
  border-radius: 11px;
  align-items: center;
  justify-content: center;
  background-color: ${({ checked }) =>
    checked ? colors.primary : "transparent"};
  border-width: 1.5px;
  border-color: ${({ checked }) =>
    checked ? colors.primary : colors.surfaceBorder};
`;

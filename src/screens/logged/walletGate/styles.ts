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

export const IntroWrapper = styled.View`
  align-items: center;
  margin-top: ${hp(4)}px;
  margin-bottom: ${hp(5)}px;
`;

export const IntroIconWrapper = styled.View`
  width: 72px;
  height: 72px;
  border-radius: 36px;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  background-color: rgba(108, 92, 231, 0.18);
`;

export const IntroTitle = styled.Text`
  color: ${colors.textPrimary};
  font-size: 21px;
  font-weight: 700;
  text-align: center;
`;

export const IntroSubtitle = styled.Text`
  color: ${colors.textMuted};
  font-size: 13.5px;
  text-align: center;
  margin-top: 8px;
  line-height: 19px;
  padding-horizontal: 10px;
`;

export const OptionCard = styled.TouchableOpacity`
  border-radius: 20px;
  padding: 20px;
  margin-bottom: ${hp(2)}px;
  background-color: ${colors.surface};
  border-width: 1.5px;
  border-color: ${colors.surfaceBorder};
`;

export const OptionHeaderRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 10px;
`;

export const OptionIconWrapper = styled.View<{ accentColor?: string }>`
  width: 44px;
  height: 44px;
  border-radius: 14px;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  background-color: ${({ accentColor }) =>
    accentColor ? `${accentColor}22` : colors.surface};
`;

export const OptionTitle = styled.Text`
  color: ${colors.textPrimary};
  font-size: 16px;
  font-weight: 700;
  flex: 1;
`;

export const RecommendedBadge = styled.View`
  padding: 3px 9px;
  border-radius: 9px;
  background-color: rgba(46, 204, 113, 0.18);
`;

export const RecommendedBadgeText = styled.Text`
  color: ${colors.success};
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.4px;
`;

export const OptionDescription = styled.Text`
  color: ${colors.textMuted};
  font-size: 13px;
  line-height: 19px;
`;

export const ExternalFormWrapper = styled.View`
  margin-top: 12px;
`;

export const InputWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  height: ${hp(6.5)}px;
  border-radius: 14px;
  padding-horizontal: 14px;
  background-color: rgba(0, 0, 0, 0.2);
  border-width: 1px;
  border-color: ${colors.surfaceBorder};
  margin-bottom: 12px;
`;

export const StyledInput = styled.TextInput`
  flex: 1;
  color: ${colors.textPrimary};
  font-size: 13.5px;
  height: 100%;
`;

export const PasteButton = styled.TouchableOpacity`
  padding: 4px;
  margin-left: 8px;
`;

interface ConfirmButtonProps {
  disabled?: boolean;
}

export const ConfirmButton = styled.TouchableOpacity<ConfirmButtonProps>`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: ${hp(6)}px;
  border-radius: 14px;
  background-color: ${colors.primary};
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
`;

export const ConfirmButtonText = styled.Text`
  color: #ffffff;
  font-size: 14.5px;
  font-weight: 700;
`;

export const WarningNote = styled.Text`
  color: ${colors.textMuted};
  font-size: 11.5px;
  line-height: 16px;
  margin-top: ${hp(2)}px;
  text-align: center;
  padding-horizontal: 16px;
`;

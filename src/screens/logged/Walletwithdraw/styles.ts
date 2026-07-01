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

export const ScrollContent = styled.ScrollView`
  flex: 1;
`;

export const SectionLabel = styled.Text`
  color: ${colors.textMuted};
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1.1px;
  margin-bottom: ${hp(1.2)}px;
  margin-top: ${hp(2)}px;
`;

export const NetworkRow = styled.View`
  flex-direction: row;
  gap: 10px;
`;

interface NetworkChipProps {
  selected?: boolean;
}

export const NetworkChip = styled.TouchableOpacity<NetworkChipProps>`
  flex: 1;
  align-items: center;
  padding-vertical: 14px;
  border-radius: 14px;
  background-color: ${({ selected }) =>
    selected ? "rgba(108,92,231,0.18)" : colors.surface};
  border-width: 1.5px;
  border-color: ${({ selected }) =>
    selected ? colors.primary : colors.surfaceBorder};
`;

export const NetworkChipText = styled.Text<NetworkChipProps>`
  color: ${({ selected }) =>
    selected ? colors.textPrimary : colors.textMuted};
  font-size: 13.5px;
  font-weight: 700;
  margin-top: 6px;
`;

export const NetworkChipBalance = styled.Text`
  color: ${colors.textMuted};
  font-size: 11px;
  margin-top: 2px;
`;

export const InputWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  height: ${hp(6.5)}px;
  border-radius: 14px;
  padding-horizontal: 14px;
  background-color: ${colors.surface};
  border-width: 1px;
  border-color: ${colors.surfaceBorder};
`;

export const StyledInput = styled.TextInput`
  flex: 1;
  color: ${colors.textPrimary};
  font-size: 14px;
  height: 100%;
`;

export const PasteButton = styled.TouchableOpacity`
  padding: 4px;
  margin-left: 6px;
`;

export const AmountRow = styled.View`
  flex-direction: row;
  align-items: center;
  height: ${hp(7)}px;
  border-radius: 14px;
  padding-horizontal: 14px;
  background-color: ${colors.surface};
  border-width: 1px;
  border-color: ${colors.surfaceBorder};
`;

export const AmountInput = styled.TextInput`
  flex: 1;
  color: ${colors.textPrimary};
  font-size: 22px;
  font-weight: 700;
  height: 100%;
`;

export const AmountSuffix = styled.Text`
  color: ${colors.textMuted};
  font-size: 14px;
  font-weight: 600;
`;

export const MaxButton = styled.TouchableOpacity`
  padding: 6px 10px;
  border-radius: 10px;
  background-color: rgba(108, 92, 231, 0.18);
  margin-left: 8px;
`;

export const MaxButtonText = styled.Text`
  color: ${colors.primary};
  font-size: 11px;
  font-weight: 700;
`;

export const AvailableText = styled.Text`
  color: ${colors.textMuted};
  font-size: 12px;
  margin-top: 8px;
`;

export const WarningText = styled.Text`
  color: #f7b731;
  font-size: 12px;
  margin-top: 8px;
  line-height: 17px;
`;

interface SubmitButtonProps {
  disabled?: boolean;
}

export const SubmitButton = styled.TouchableOpacity<SubmitButtonProps>`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: ${hp(6.8)}px;
  border-radius: 16px;
  margin-top: ${hp(3)}px;
  margin-bottom: ${hp(4)}px;
  background-color: ${colors.primary};
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
  shadow-color: ${colors.primary};
  shadow-opacity: 0.4;
  shadow-radius: 12px;
  shadow-offset: 0px 6px;
  elevation: 8;
`;

export const SubmitButtonText = styled.Text`
  color: #ffffff;
  font-size: 15px;
  font-weight: 700;
`;

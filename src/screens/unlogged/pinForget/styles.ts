import styled from "styled-components/native";
import { Platform, StatusBar as RNStatusBar } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { colors } from "../../logged/dashboard/styles";

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
  padding-horizontal: ${wp(7)}px;
  padding-top: ${STATUSBAR_HEIGHT}px;
`;

export const Header = styled.View`
  flex-direction: row;
  margin-top: ${hp(1.5)}px;
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

export const ScrollContent = styled.ScrollView`
  flex: 1;
`;

export const LogoWrapper = styled.View`
  align-items: center;
  margin-top: ${hp(2)}px;
  margin-bottom: ${hp(1)}px;
`;

export const Title = styled.Text`
  color: ${colors.textPrimary};
  font-size: 21px;
  font-weight: 700;
  text-align: center;
  margin-top: ${hp(2)}px;
`;

export const Subtitle = styled.Text`
  color: ${colors.textMuted};
  font-size: 13px;
  text-align: center;
  margin-top: 6px;
  margin-bottom: ${hp(3)}px;
  padding-horizontal: 6px;
  line-height: 18px;
`;

export const EmailHighlight = styled.Text`
  color: ${colors.textPrimary};
  font-weight: 700;
`;

// --- Caixas de PIN ----------------------------------------------------

export const PinRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: ${hp(3.5)}px;
`;

interface PinBoxProps {
  filled?: boolean;
}

export const PinBox = styled.TextInput<PinBoxProps>`
  width: ${wp(11.5)}px;
  height: ${wp(13)}px;
  border-radius: 14px;
  text-align: center;
  font-size: 20px;
  font-weight: 700;
  color: ${colors.textPrimary};
  background-color: ${({ filled }) =>
    filled ? "rgba(108,92,231,0.18)" : colors.surface};
  border-width: 1.5px;
  border-color: ${({ filled }) =>
    filled ? colors.primary : colors.surfaceBorder};
`;

// --- Inputs de senha -----------------------------------------------------

export const SectionLabel = styled.Text`
  color: ${colors.textMuted};
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1.1px;
  margin-bottom: ${hp(1.2)}px;
`;

export const InputGroup = styled.View`
  gap: 14px;
  margin-bottom: ${hp(1)}px;
`;

export const InputWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  height: ${hp(6.5)}px;
  border-radius: 16px;
  padding-horizontal: 16px;
  background-color: ${colors.surface};
  border-width: 1px;
  border-color: ${colors.surfaceBorder};
`;

export const InputIconWrapper = styled.View`
  margin-right: 10px;
`;

export const StyledInput = styled.TextInput`
  flex: 1;
  color: ${colors.textPrimary};
  font-size: 15px;
  height: 100%;
`;

export const PasswordToggle = styled.TouchableOpacity`
  padding: 4px;
  margin-left: 8px;
`;

export const PasswordMismatchText = styled.Text`
  color: ${colors.danger};
  font-size: 12px;
  margin-top: -4px;
  margin-bottom: ${hp(1)}px;
`;

// --- Ações -----------------------------------------------------------------

interface SubmitButtonProps {
  disabled?: boolean;
}

export const SubmitButton = styled.TouchableOpacity<SubmitButtonProps>`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 10px;
  height: ${hp(6.8)}px;
  border-radius: 16px;
  margin-top: ${hp(2.5)}px;
  background-color: ${colors.primary};
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
  shadow-color: ${colors.primary};
  shadow-opacity: 0.4;
  shadow-radius: 14px;
  shadow-offset: 0px 8px;
  elevation: 10;
`;

export const SubmitButtonText = styled.Text`
  color: #ffffff;
  font-size: 16px;
  font-weight: 700;
`;

export const BackToLoginButton = styled.TouchableOpacity`
  align-self: center;
  margin-top: ${hp(2.5)}px;
  margin-bottom: ${hp(4)}px;
`;

export const BackToLoginText = styled.Text`
  color: ${colors.textMuted};
  font-size: 13.5px;
`;

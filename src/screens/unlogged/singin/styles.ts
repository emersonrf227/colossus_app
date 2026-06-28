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

// --- Seletor de idioma, canto superior --------------------------------

export const TopBar = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  margin-top: ${hp(1.5)}px;
`;

export const LanguagePill = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 20px;
  background-color: ${colors.surface};
  border-width: 1px;
  border-color: ${colors.surfaceBorder};
`;

export const LanguagePillFlag = styled.Text`
  font-size: 15px;
`;

export const LanguagePillText = styled.Text`
  color: ${colors.textPrimary};
  font-size: 12.5px;
  font-weight: 600;
`;

// --- Conteúdo central ------------------------------------------------------

export const ScrollContent = styled.ScrollView`
  flex: 1;
`;

export const LogoWrapper = styled.View`
  align-items: center;
  margin-top: ${hp(4)}px;
  margin-bottom: ${hp(1)}px;
`;

export const WelcomeTitle = styled.Text`
  color: ${colors.textPrimary};
  font-size: 22px;
  font-weight: 700;
  text-align: center;
  margin-top: ${hp(2)}px;
`;

export const WelcomeSubtitle = styled.Text`
  color: ${colors.textMuted};
  font-size: 13.5px;
  text-align: center;
  margin-top: 4px;
  margin-bottom: ${hp(4)}px;
`;

// --- Inputs ----------------------------------------------------------------

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

// --- Ações -----------------------------------------------------------------

interface LoginButtonProps {
  disabled?: boolean;
}

export const LoginButton = styled.TouchableOpacity<LoginButtonProps>`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 10px;
  height: ${hp(6.8)}px;
  border-radius: 16px;
  margin-top: ${hp(3)}px;
  background-color: ${colors.primary};
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
  shadow-color: ${colors.primary};
  shadow-opacity: 0.4;
  shadow-radius: 14px;
  shadow-offset: 0px 8px;
  elevation: 10;
`;

export const LoginText = styled.Text`
  color: #ffffff;
  font-size: 16px;
  font-weight: 700;
`;

export const ForgotPasswordButton = styled.TouchableOpacity`
  align-self: center;
  margin-top: ${hp(2.5)}px;
`;

export const ForgotPasswordText = styled.Text`
  color: ${colors.textMuted};
  font-size: 13.5px;
`;

export const DividerRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: ${hp(4)}px;
  margin-bottom: ${hp(2.5)}px;
`;

export const DividerLine = styled.View`
  flex: 1;
  height: 1px;
  background-color: ${colors.surfaceBorder};
`;

export const DividerText = styled.Text`
  color: ${colors.textMuted};
  font-size: 12px;
  margin-horizontal: 12px;
`;

export const RegisterButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: ${hp(6.5)}px;
  border-radius: 16px;
  margin-bottom: ${hp(4)}px;
  background-color: transparent;
  border-width: 1.5px;
  border-color: ${colors.surfaceBorder};
`;

export const RegisterButtonText = styled.Text`
  color: ${colors.textPrimary};
  font-size: 15px;
  font-weight: 600;
`;

// --- Modal de idioma (bottom sheet) ---------------------------------------

export const ModalOverlay = styled.View`
  flex: 1;
  justify-content: flex-end;
  background-color: rgba(0, 0, 0, 0.55);
`;

export const ModalBackdropTouchable = styled.TouchableOpacity`
  flex: 1;
`;

export const ModalSheet = styled.View`
  background-color: ${colors.bgDark};
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
  padding: 22px 20px;
  padding-bottom: ${hp(4)}px;
  border-width: 1px;
  border-color: ${colors.surfaceBorder};
`;

export const ModalHandle = styled.View`
  width: 40px;
  height: 4px;
  border-radius: 2px;
  align-self: center;
  margin-bottom: 18px;
  background-color: ${colors.surfaceBorder};
`;

export const ModalTitle = styled.Text`
  color: ${colors.textPrimary};
  font-size: 17px;
  font-weight: 700;
  margin-bottom: 4px;
`;

export const ModalSubtitle = styled.Text`
  color: ${colors.textMuted};
  font-size: 13px;
  margin-bottom: ${hp(2)}px;
`;

export const LanguageOptionsGroup = styled.View`
  border-radius: 16px;
  overflow: hidden;
  background-color: ${colors.surface};
  border-width: 1px;
  border-color: ${colors.surfaceBorder};
`;

interface LanguageRowProps {
  isLast?: boolean;
}

export const LanguageRow = styled.TouchableOpacity<LanguageRowProps>`
  flex-direction: row;
  align-items: center;
  padding: 14px 16px;
  border-bottom-width: ${({ isLast }) => (isLast ? 0 : 1)}px;
  border-bottom-color: ${colors.surfaceBorder};
`;

export const LanguageRowFlag = styled.Text`
  font-size: 20px;
  margin-right: 12px;
  width: 26px;
`;

export const LanguageRowLabel = styled.Text`
  flex: 1;
  color: ${colors.textPrimary};
  font-size: 15px;
  font-weight: 500;
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

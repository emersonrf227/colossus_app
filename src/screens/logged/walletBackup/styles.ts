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
  background-color: rgba(5, 4, 10, 0.75);
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

export const ScrollContent = styled.ScrollView`
  flex: 1;
`;

// --- Aviso de segurança ----------------------------------------------

export const WarningCard = styled.View`
  flex-direction: row;
  align-items: flex-start;
  gap: 10px;
  padding: 14px;
  border-radius: 16px;
  margin-top: ${hp(2)}px;
  margin-bottom: ${hp(2.5)}px;
  background-color: rgba(255, 107, 107, 0.1);
  border-width: 1px;
  border-color: rgba(255, 107, 107, 0.3);
`;

export const WarningText = styled.Text`
  flex: 1;
  color: ${colors.textPrimary};
  font-size: 12.5px;
  line-height: 18px;
`;

export const WarningHighlight = styled.Text`
  font-weight: 700;
  color: ${colors.danger};
`;

// --- Grid das 12 palavras ----------------------------------------------

export const WordsGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-bottom: ${hp(3)}px;
`;

export const WordChip = styled.View`
  width: 31%;
  flex-direction: row;
  align-items: center;
  gap: 6px;
  padding: 10px 8px;
  border-radius: 12px;
  margin-bottom: 10px;
  background-color: ${colors.surface};
  border-width: 1px;
  border-color: ${colors.surfaceBorder};
`;

export const WordIndex = styled.Text`
  color: ${colors.textMuted};
  font-size: 10.5px;
  font-weight: 700;
  width: 16px;
`;

export const WordText = styled.Text`
  color: ${colors.textPrimary};
  font-size: 13px;
  font-weight: 600;
`;

export const RevealButton = styled.TouchableOpacity`
  align-self: center;
  flex-direction: row;
  align-items: center;
  gap: 6px;
  padding: 10px 18px;
  border-radius: 14px;
  margin-bottom: ${hp(3)}px;
  background-color: ${colors.surface};
  border-width: 1px;
  border-color: ${colors.surfaceBorder};
`;

export const RevealButtonText = styled.Text`
  color: ${colors.textMuted};
  font-size: 12.5px;
  font-weight: 600;
`;

// --- Confirmação por palavras --------------------------------------------

export const StepLabel = styled.Text`
  color: ${colors.textMuted};
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1.1px;
  margin-top: ${hp(1)}px;
  margin-bottom: ${hp(0.5)}px;
`;

export const StepTitle = styled.Text`
  color: ${colors.textPrimary};
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 6px;
`;

export const StepSubtitle = styled.Text`
  color: ${colors.textMuted};
  font-size: 13px;
  line-height: 19px;
  margin-bottom: ${hp(3)}px;
`;

export const ConfirmFieldWrapper = styled.View`
  margin-bottom: ${hp(2)}px;
`;

export const ConfirmFieldLabel = styled.Text`
  color: ${colors.textMuted};
  font-size: 12px;
  font-weight: 700;
  margin-bottom: 8px;
`;

interface ConfirmInputProps {
  hasError?: boolean;
}

export const ConfirmInput = styled.TextInput<ConfirmInputProps>`
  height: ${hp(6.2)}px;
  border-radius: 14px;
  padding-horizontal: 16px;
  font-size: 14px;
  color: ${colors.textPrimary};
  background-color: ${colors.surface};
  border-width: 1.5px;
  border-color: ${({ hasError }) =>
    hasError ? colors.danger : colors.surfaceBorder};
`;

interface PrimaryButtonProps {
  disabled?: boolean;
}

export const PrimaryButton = styled.TouchableOpacity<PrimaryButtonProps>`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: ${hp(6.8)}px;
  border-radius: 16px;
  margin-top: ${hp(1)}px;
  margin-bottom: ${hp(4)}px;
  background-color: ${colors.primary};
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
  shadow-color: ${colors.primary};
  shadow-opacity: 0.4;
  shadow-radius: 12px;
  shadow-offset: 0px 6px;
  elevation: 8;
`;

export const PrimaryButtonText = styled.Text`
  color: #ffffff;
  font-size: 15px;
  font-weight: 700;
`;

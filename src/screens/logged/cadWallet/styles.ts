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
  margin-bottom: ${hp(1)}px;
`;

export const ScrollContent = styled.ScrollView`
  flex: 1;
`;

// --- Estado: wallet já configurada (QR + saldo) -------------------------

export const WalletConfiguredCard = styled.View`
  align-items: center;
`;

export const StatusBadge = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 14px;
  margin-bottom: ${hp(2.5)}px;
  background-color: rgba(46, 204, 113, 0.15);
`;

export const StatusBadgeText = styled.Text`
  color: ${colors.success};
  font-size: 12.5px;
  font-weight: 700;
`;

export const QrCard = styled.View`
  width: ${wp(54)}px;
  height: ${wp(54)}px;
  border-radius: 24px;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  shadow-color: ${colors.primary};
  shadow-opacity: 0.25;
  shadow-radius: 16px;
  shadow-offset: 0px 8px;
  elevation: 10;
  margin-bottom: ${hp(2.5)}px;
`;

export const AddressCard = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 14px 16px;
  border-radius: 16px;
  background-color: ${colors.surface};
  border-width: 1px;
  border-color: ${colors.surfaceBorder};
  margin-bottom: ${hp(2)}px;
`;

export const AddressText = styled.Text`
  flex: 1;
  color: ${colors.textPrimary};
  font-size: 13px;
  margin-right: 10px;
`;

export const CopyIconWrapper = styled.View`
  width: 32px;
  height: 32px;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
  background-color: rgba(108, 92, 231, 0.18);
`;

export const BalanceCard = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  padding: 18px;
  border-radius: 18px;
  background-color: ${colors.surface};
  border-width: 1px;
  border-color: ${colors.surfaceBorder};
`;

export const BalanceLabel = styled.Text`
  color: ${colors.textMuted};
  font-size: 12.5px;
  font-weight: 600;
  letter-spacing: 1px;
`;

export const BalanceValue = styled.Text`
  color: ${colors.textPrimary};
  font-size: 26px;
  font-weight: 700;
`;

export const TokenIcon = styled.Image`
  width: 26px;
  height: 26px;
`;

// --- Estado: wallet não configurada (formulário) -------------------------

export const FormSectionLabel = styled.Text`
  color: ${colors.textMuted};
  font-size: 12.5px;
  font-weight: 700;
  letter-spacing: 1.2px;
  margin-bottom: ${hp(1.5)}px;
  margin-top: ${hp(1)}px;
`;

export const FormIntro = styled.Text`
  color: ${colors.textMuted};
  font-size: 13.5px;
  line-height: 20px;
  margin-bottom: ${hp(2.5)}px;
`;

export const CardSelectNetwork = styled.View`
  align-items: center;
  margin-bottom: ${hp(2.5)}px;
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
    selected ? colors.primary : colors.surfaceBorder};
  shadow-color: ${colors.primary};
  shadow-opacity: ${({ selected }) => (selected ? 0.5 : 0)};
  shadow-radius: 10px;
  elevation: ${({ selected }) => (selected ? 6 : 0)};
`;

export const InputCard = styled.View`
  flex-direction: row;
  align-items: center;
  height: ${hp(6.5)}px;
  border-radius: 16px;
  padding-horizontal: 10px;
  background-color: ${colors.surface};
  border-width: 1px;
  border-color: ${colors.surfaceBorder};
  margin-bottom: ${hp(3)}px;
`;

export const PasteButton = styled.TouchableOpacity`
  width: 38px;
  height: 38px;
  border-radius: 12px;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
  background-color: rgba(108, 92, 231, 0.18);
`;

export const StyledInput = styled.TextInput`
  flex: 1;
  color: ${colors.textPrimary};
  font-size: 13.5px;
  height: 100%;
`;

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
  background-color: ${colors.primary};
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
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

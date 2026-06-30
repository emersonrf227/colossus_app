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
  justify-content: space-between;
  margin-top: ${hp(1)}px;
`;

export const HeaderLeft = styled.View`
  flex-direction: row;
  align-items: center;
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

export const IconButton = styled.TouchableOpacity`
  width: 40px;
  height: 40px;
  border-radius: 13px;
  align-items: center;
  justify-content: center;
  background-color: ${colors.surface};
  border-width: 1px;
  border-color: ${colors.surfaceBorder};
`;

export const ScrollContent = styled.ScrollView`
  flex: 1;
`;

// --- Banner de modo visualização ----------------------------------------

export const ViewOnlyBanner = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  border-radius: 14px;
  margin-top: ${hp(2)}px;
  margin-bottom: ${hp(1)}px;
  background-color: rgba(247, 183, 49, 0.12);
  border-width: 1px;
  border-color: rgba(247, 183, 49, 0.3);
`;

export const ViewOnlyBannerText = styled.Text`
  flex: 1;
  color: ${colors.textPrimary};
  font-size: 12px;
  line-height: 17px;
`;

// --- Total consolidado ----------------------------------------------------

export const TotalCard = styled.View`
  align-items: center;
  margin-top: ${hp(2)}px;
  margin-bottom: ${hp(3)}px;
`;

export const TotalLabel = styled.Text`
  color: ${colors.textMuted};
  font-size: 12.5px;
  font-weight: 600;
  letter-spacing: 1.2px;
  margin-bottom: 6px;
`;

export const TotalValue = styled.Text`
  color: ${colors.textPrimary};
  font-size: 36px;
  font-weight: 800;
`;

export const TotalSubvalue = styled.Text`
  color: ${colors.textMuted};
  font-size: 13px;
  margin-top: 4px;
`;

// --- Cards de saldo por rede ----------------------------------------------

export const SectionLabel = styled.Text`
  color: ${colors.textMuted};
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1.1px;
  margin-bottom: ${hp(1.2)}px;
`;

export const NetworkBalanceCard = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 14px;
  border-radius: 16px;
  margin-bottom: 10px;
  background-color: ${colors.surface};
  border-width: 1px;
  border-color: ${colors.surfaceBorder};
`;

export const NetworkIconWrapper = styled.View`
  width: 42px;
  height: 42px;
  border-radius: 13px;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  background-color: rgba(108, 92, 231, 0.18);
`;

export const NetworkInfo = styled.View`
  flex: 1;
`;

export const NetworkName = styled.Text`
  color: ${colors.textPrimary};
  font-size: 14.5px;
  font-weight: 700;
`;

export const NetworkGasWarning = styled.Text`
  color: ${colors.danger};
  font-size: 11px;
  margin-top: 2px;
`;

export const NetworkBalanceValue = styled.Text`
  color: ${colors.textPrimary};
  font-size: 16px;
  font-weight: 700;
`;

export const NetworkBalanceUnit = styled.Text`
  color: ${colors.textMuted};
  font-size: 11px;
  text-align: right;
`;

// --- Endereço --------------------------------------------------------------

export const AddressCard = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 13px 14px;
  border-radius: 14px;
  margin-top: ${hp(0.5)}px;
  margin-bottom: ${hp(3)}px;
  background-color: ${colors.surface};
  border-width: 1px;
  border-color: ${colors.surfaceBorder};
`;

export const AddressText = styled.Text`
  flex: 1;
  color: ${colors.textMuted};
  font-size: 12px;
  margin-right: 10px;
`;

// --- Ações (somente modo completo) ---------------------------------------

export const ActionsRow = styled.View`
  flex-direction: row;
  gap: 12px;
  margin-bottom: ${hp(3)}px;
`;

export const ActionButton = styled.TouchableOpacity<{ accentColor?: string }>`
  flex: 1;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding-vertical: 16px;
  border-radius: 16px;
  background-color: ${({ accentColor }) =>
    accentColor ? `${accentColor}1A` : colors.surface};
  border-width: 1px;
  border-color: ${({ accentColor }) => accentColor ?? colors.surfaceBorder};
`;

export const ActionIconWrapper = styled.View<{ accentColor?: string }>`
  width: 40px;
  height: 40px;
  border-radius: 13px;
  align-items: center;
  justify-content: center;
  background-color: ${({ accentColor }) =>
    accentColor ? `${accentColor}22` : colors.surface};
`;

export const ActionButtonText = styled.Text<{ accentColor?: string }>`
  color: ${({ accentColor }) => accentColor ?? colors.textPrimary};
  font-size: 12.5px;
  font-weight: 700;
`;

export const CenteredState = styled.View`
  align-items: center;
  justify-content: center;
  padding-top: ${hp(8)}px;
  gap: 12px;
`;

export const StateText = styled.Text`
  color: ${colors.textMuted};
  font-size: 13.5px;
  text-align: center;
  padding-horizontal: 20px;
`;

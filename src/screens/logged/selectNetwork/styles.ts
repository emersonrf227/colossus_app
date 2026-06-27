import styled from "styled-components/native";
import { Platform, StatusBar as RNStatusBar } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { colors } from "../dashboard/styles"; // reaproveita a paleta já definida

const STATUSBAR_HEIGHT =
  Platform.OS === "android" ? (RNStatusBar.currentHeight ?? 24) : 0;

export const Container = styled.View`
  flex: 1;
  background-color: ${colors.bgDark};
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

// Resumo do valor que será cobrado, exibido no topo da tela
export const AmountSummary = styled.View`
  align-items: center;
  margin-top: ${hp(2)}px;
  margin-bottom: ${hp(3)}px;
`;

export const AmountSummaryLabel = styled.Text`
  color: ${colors.textMuted};
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 1.5px;
  margin-bottom: 6px;
`;

export const AmountSummaryValue = styled.Text`
  color: ${colors.textPrimary};
  font-size: 36px;
  font-weight: 700;
`;

export const SectionLabel = styled.Text`
  color: ${colors.textMuted};
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 1.5px;
  margin-bottom: ${hp(1.5)}px;
`;

// Grid dos cards de rede
export const NetworkGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
`;

interface NetworkCardProps {
  selected?: boolean;
}

// Card quadrado e bem destacado — usa aspect-ratio para se manter
// quadrado em qualquer largura de tela.
export const NetworkCard = styled.TouchableOpacity<NetworkCardProps>`
  width: 31%;
  aspect-ratio: 1;
  border-radius: 20px;
  align-items: center;
  justify-content: center;
  margin-bottom: ${hp(2)}px;
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

export const NetworkIconWrapper = styled.View`
  width: 56px;
  height: 56px;
  border-radius: 28px;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
  background-color: #ffffff;
  shadow-color: #000000;
  shadow-opacity: 0.15;
  shadow-radius: 4px;
  shadow-offset: 0px 2px;
  elevation: 3;
`;

export const NetworkCardLabel = styled.Text<NetworkCardProps>`
  color: ${({ selected }) =>
    selected ? colors.textPrimary : colors.textMuted};
  font-size: 13px;
  font-weight: 700;
`;

// Selo de "check" no canto do card selecionado
export const SelectedBadge = styled.View`
  position: absolute;
  top: 8px;
  right: 8px;
  width: 22px;
  height: 22px;
  border-radius: 11px;
  align-items: center;
  justify-content: center;
  background-color: ${colors.primary};
`;

export const CenteredState = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  gap: 12px;
`;

export const StateText = styled.Text`
  color: ${colors.textMuted};
  font-size: 14px;
  text-align: center;
`;

export const RetryButton = styled.TouchableOpacity`
  padding-horizontal: 20px;
  padding-vertical: 10px;
  border-radius: 12px;
  background-color: ${colors.surface};
  border-width: 1px;
  border-color: ${colors.surfaceBorder};
  margin-top: 8px;
`;

export const RetryButtonText = styled.Text`
  color: ${colors.textPrimary};
  font-weight: 600;
`;

export const Footer = styled.View`
  padding-bottom: ${hp(3)}px;
  padding-top: ${hp(1.5)}px;
`;

export const ConversionHint = styled.Text`
  color: ${colors.textMuted};
  font-size: 12.5px;
  text-align: center;
  margin-bottom: ${hp(1.5)}px;
`;

interface ProceedButtonProps {
  disabled?: boolean;
}

export const ProceedButton = styled.TouchableOpacity<ProceedButtonProps>`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 10px;
  height: ${hp(7)}px;
  border-radius: 18px;
  background-color: ${colors.primary};
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
  shadow-color: ${colors.primary};
  shadow-opacity: 0.4;
  shadow-radius: 12px;
  shadow-offset: 0px 6px;
  elevation: 8;
`;

export const ProceedButtonText = styled.Text`
  color: ${colors.textPrimary};
  font-size: 17px;
  font-weight: 700;
  letter-spacing: 0.3px;
`;

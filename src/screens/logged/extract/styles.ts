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

// --- Filtro de período (chips rápidos) ----------------------------------

export const SectionLabel = styled.Text`
  color: ${colors.textMuted};
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1.1px;
  margin-bottom: ${hp(1)}px;
`;

export const ChipsRow = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: ${hp(1.5)}px;
`;

interface ChipProps {
  selected?: boolean;
}

export const Chip = styled.TouchableOpacity<ChipProps>`
  padding: 8px 14px;
  border-radius: 14px;
  background-color: ${({ selected }) =>
    selected ? "rgba(108,92,231,0.20)" : colors.surface};
  border-width: 1px;
  border-color: ${({ selected }) =>
    selected ? colors.primary : colors.surfaceBorder};
`;

export const ChipText = styled.Text<ChipProps>`
  color: ${({ selected }) =>
    selected ? colors.textPrimary : colors.textMuted};
  font-size: 12.5px;
  font-weight: 600;
`;

export const CustomRangeRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
  margin-bottom: ${hp(2)}px;
`;

export const CustomRangeButton = styled.TouchableOpacity`
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px;
  border-radius: 14px;
  background-color: ${colors.surface};
  border-width: 1px;
  border-color: ${colors.surfaceBorder};
`;

export const CustomRangeButtonText = styled.Text`
  color: ${colors.textMuted};
  font-size: 12.5px;
  font-weight: 600;
`;

// --- Status ----------------------------------------------------------------

interface StatusChipProps {
  selected?: boolean;
  statusColor?: string;
}

export const StatusChip = styled.TouchableOpacity<StatusChipProps>`
  flex-direction: row;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 14px;
  background-color: ${({ selected, statusColor }) =>
    selected ? `${statusColor}22` : colors.surface};
  border-width: 1px;
  border-color: ${({ selected, statusColor }) =>
    selected ? statusColor : colors.surfaceBorder};
`;

export const StatusDot = styled.View<{ dotColor?: string }>`
  width: 7px;
  height: 7px;
  border-radius: 3.5px;
  background-color: ${({ dotColor }) => dotColor ?? colors.textMuted};
`;

export const StatusChipText = styled.Text<StatusChipProps>`
  color: ${({ selected }) =>
    selected ? colors.textPrimary : colors.textMuted};
  font-size: 12.5px;
  font-weight: 600;
`;

// --- Lista de invoices -------------------------------------------------

export const ListContentContainer = styled.View`
  padding-bottom: 24px;
`;

export const InvoiceCard = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 14px;
  border-radius: 16px;
  margin-bottom: 10px;
  background-color: ${colors.surface};
  border-width: 1px;
  border-color: ${colors.surfaceBorder};
`;

export const InvoiceIconWrapper = styled.View<{ dotColor?: string }>`
  width: 42px;
  height: 42px;
  border-radius: 13px;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  background-color: ${({ dotColor }) =>
    dotColor ? `${dotColor}1F` : colors.surface};
`;

export const InvoiceInfo = styled.View`
  flex: 1;
`;

export const InvoiceAmount = styled.Text`
  color: ${colors.textPrimary};
  font-size: 16px;
  font-weight: 700;
`;

export const InvoiceMeta = styled.Text`
  color: ${colors.textMuted};
  font-size: 12px;
  margin-top: 2px;
`;

export const InvoiceStatusBadge = styled.View<{ dotColor?: string }>`
  flex-direction: row;
  align-items: center;
  gap: 5px;
  padding: 4px 9px;
  border-radius: 10px;
  margin-top: 6px;
  align-self: flex-start;
  background-color: ${({ dotColor }) =>
    dotColor ? `${dotColor}1F` : colors.surface};
`;

export const InvoiceStatusText = styled.Text<{ dotColor?: string }>`
  color: ${({ dotColor }) => dotColor ?? colors.textMuted};
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 0.4px;
`;

export const ReceiptButton = styled.TouchableOpacity`
  width: 38px;
  height: 38px;
  border-radius: 12px;
  align-items: center;
  justify-content: center;
  background-color: rgba(108, 92, 231, 0.18);
  margin-left: 8px;
`;

// --- Estados vazios / loading -------------------------------------------

export const CenteredState = styled.View`
  align-items: center;
  justify-content: center;
  padding-top: ${hp(8)}px;
  gap: 10px;
`;

export const StateText = styled.Text`
  color: ${colors.textMuted};
  font-size: 13.5px;
  text-align: center;
`;

export const FooterLoader = styled.View`
  padding-vertical: 16px;
  align-items: center;
`;

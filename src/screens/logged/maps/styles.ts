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

export const MapWrapper = styled.View`
  flex: 1;
`;

// --- Header flutuante sobre o mapa ---------------------------------------

export const FloatingHeader = styled.View`
  position: absolute;
  top: ${STATUSBAR_HEIGHT + 12}px;
  left: ${wp(5)}px;
  right: ${wp(5)}px;
  z-index: 10;
`;

export const HeaderRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 10px;
`;

export const BackButton = styled.TouchableOpacity`
  width: 44px;
  height: 44px;
  border-radius: 14px;
  align-items: center;
  justify-content: center;
  background-color: ${colors.bgDark};
  border-width: 1px;
  border-color: ${colors.surfaceBorder};
  shadow-color: #000;
  shadow-opacity: 0.3;
  shadow-radius: 8px;
  shadow-offset: 0px 4px;
  elevation: 6;
`;

export const HeaderTitle = styled.Text`
  color: ${colors.textPrimary};
  font-size: 17px;
  font-weight: 700;
  margin-left: 12px;
  shadow-color: #000;
  shadow-opacity: 0.4;
  shadow-radius: 4px;
`;

export const ChipsScroll = styled.ScrollView`
  flex-grow: 0;
`;

interface ChipProps {
  selected?: boolean;
  chipColor?: string;
}

export const FilterChip = styled.TouchableOpacity<ChipProps>`
  flex-direction: row;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 16px;
  margin-right: 8px;
  background-color: ${({ selected, chipColor }) =>
    selected ? (chipColor ?? colors.primary) : colors.bgDark};
  border-width: 1px;
  border-color: ${({ selected, chipColor }) =>
    selected ? (chipColor ?? colors.primary) : colors.surfaceBorder};
  shadow-color: #000;
  shadow-opacity: 0.25;
  shadow-radius: 6px;
  shadow-offset: 0px 3px;
  elevation: 4;
`;

export const FilterChipDot = styled.View<{ dotColor?: string }>`
  width: 7px;
  height: 7px;
  border-radius: 3.5px;
  background-color: ${({ dotColor }) => dotColor ?? colors.textMuted};
`;

export const FilterChipText = styled.Text<ChipProps>`
  color: ${({ selected }) => (selected ? "#FFFFFF" : colors.textMuted)};
  font-size: 12.5px;
  font-weight: 600;
`;

// --- Marker customizado ----------------------------------------------------

export const MarkerPin = styled.View<{ pinColor?: string }>`
  width: 36px;
  height: 36px;
  border-radius: 12px;
  align-items: center;
  justify-content: center;
  background-color: ${({ pinColor }) => pinColor ?? colors.primary};
  border-width: 2px;
  border-color: #ffffff;
  shadow-color: #000;
  shadow-opacity: 0.3;
  shadow-radius: 4px;
  shadow-offset: 0px 2px;
  elevation: 5;
`;

// --- Estados de loading/erro sobre o mapa ---------------------------------

export const CenteredOverlay = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  align-items: center;
  justify-content: center;
  background-color: ${colors.bgDark};
  gap: 12px;
`;

export const StateText = styled.Text`
  color: ${colors.textMuted};
  font-size: 14px;
  text-align: center;
  padding-horizontal: 30px;
`;

export const RetryButton = styled.TouchableOpacity`
  padding-horizontal: 22px;
  padding-vertical: 11px;
  border-radius: 14px;
  background-color: ${colors.surface};
  border-width: 1px;
  border-color: ${colors.surfaceBorder};
`;

export const RetryButtonText = styled.Text`
  color: ${colors.textPrimary};
  font-weight: 600;
`;

// --- Modal central de detalhe ---------------------------------------------

export const ModalOverlay = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding-horizontal: ${wp(6)}px;
  background-color: rgba(0, 0, 0, 0.6);
`;

export const ModalBackdropTouchable = styled.TouchableOpacity`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

export const ModalCard = styled.View`
  width: 100%;
  max-height: ${hp(80)}px;
  border-radius: 22px;
  background-color: ${colors.bgDark};
  border-width: 1px;
  border-color: ${colors.surfaceBorder};
  overflow: hidden;
`;

export const ModalCloseButton = styled.TouchableOpacity`
  position: absolute;
  top: 12px;
  right: 12px;
  width: 32px;
  height: 32px;
  border-radius: 16px;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.45);
  z-index: 5;
`;

export const ModalScroll = styled.ScrollView``;

// Cabeçalho do card: foto de capa (se houver) ou bloco de cor sólida com logo
export const CoverWrapper = styled.View`
  width: 100%;
  height: ${hp(16)}px;
  background-color: ${colors.surface};
`;

export const CoverImage = styled.Image`
  width: 100%;
  height: 100%;
`;

export const CoverFallback = styled.View<{ accentColor?: string }>`
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  background-color: ${({ accentColor }) =>
    accentColor ? `${accentColor}22` : colors.surface};
`;

export const ModalContent = styled.View`
  padding: 18px;
`;

export const ModalHeaderRow = styled.View`
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 10px;
`;

export const ModalTitleBlock = styled.View`
  flex: 1;
  margin-right: 10px;
`;

export const ModalTitle = styled.Text`
  color: ${colors.textPrimary};
  font-size: 18px;
  font-weight: 700;
`;

export const SegmentBadge = styled.View<{ badgeColor?: string }>`
  flex-direction: row;
  align-items: center;
  gap: 5px;
  align-self: flex-start;
  margin-top: 6px;
  padding: 4px 10px;
  border-radius: 10px;
  background-color: ${({ badgeColor }) =>
    badgeColor ? `${badgeColor}22` : colors.surface};
`;

export const SegmentBadgeText = styled.Text<{ badgeColor?: string }>`
  color: ${({ badgeColor }) => badgeColor ?? colors.textMuted};
  font-size: 11.5px;
  font-weight: 700;
`;

export const VerifiedBadge = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 4px;
`;

export const VerifiedBadgeText = styled.Text`
  color: ${colors.success};
  font-size: 11px;
  font-weight: 700;
`;

export const Description = styled.Text`
  color: ${colors.textMuted};
  font-size: 13.5px;
  line-height: 20px;
  margin-bottom: ${hp(2)}px;
`;

export const SectionLabel = styled.Text`
  color: ${colors.textMuted};
  font-size: 11.5px;
  font-weight: 700;
  letter-spacing: 1px;
  margin-bottom: 8px;
  margin-top: ${hp(1.5)}px;
`;

// Ações de contato (telefone, telegram, site) como botões em linha
export const ActionsRow = styled.View`
  flex-direction: row;
  gap: 10px;
`;

export const ActionButton = styled.TouchableOpacity<{ accentColor?: string }>`
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 42px;
  border-radius: 13px;
  background-color: ${({ accentColor }) =>
    accentColor ? `${accentColor}1F` : colors.surface};
  border-width: 1px;
  border-color: ${({ accentColor }) => accentColor ?? colors.surfaceBorder};
`;

export const ActionButtonText = styled.Text<{ accentColor?: string }>`
  color: ${({ accentColor }) => accentColor ?? colors.textPrimary};
  font-size: 12.5px;
  font-weight: 700;
`;

export const AddressText = styled.Text`
  color: ${colors.textPrimary};
  font-size: 13.5px;
  line-height: 19px;
`;

export const HoursRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding-vertical: 5px;
`;

export const HoursDay = styled.Text`
  color: ${colors.textMuted};
  font-size: 12.5px;
`;

export const HoursTime = styled.Text`
  color: ${colors.textPrimary};
  font-size: 12.5px;
  font-weight: 600;
`;

export const TagsRow = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: 6px;
`;

export const TagPill = styled.View`
  padding: 5px 10px;
  border-radius: 10px;
  background-color: ${colors.surface};
  border-width: 1px;
  border-color: ${colors.surfaceBorder};
`;

export const TagPillText = styled.Text`
  color: ${colors.textMuted};
  font-size: 11px;
  font-weight: 600;
`;

export const PaymentMethodsRow = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: ${hp(2)}px;
`;

export const PaymentMethodPill = styled.View<{ highlight?: boolean }>`
  padding: 5px 10px;
  border-radius: 10px;
  background-color: ${({ highlight }) =>
    highlight ? "rgba(46,204,113,0.15)" : colors.surface};
  border-width: 1px;
  border-color: ${({ highlight }) =>
    highlight ? colors.success : colors.surfaceBorder};
`;

export const PaymentMethodPillText = styled.Text<{ highlight?: boolean }>`
  color: ${({ highlight }) => (highlight ? colors.success : colors.textMuted)};
  font-size: 11px;
  font-weight: 700;
`;

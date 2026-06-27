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
  background-color: rgba(5, 4, 10, 0.78);
`;

export const SafeArea = styled.SafeAreaView`
  flex: 1;
  padding-horizontal: ${wp(5)}px;
  padding-top: ${STATUSBAR_HEIGHT}px;
`;

export const ScrollContent = styled.ScrollView`
  flex: 1;
`;

export const cardLogo = styled.View`
  align-items: center;
  margin-top: ${hp(1)}px;
  margin-bottom: ${hp(1)}px;
`;

// --- Selo de sucesso, acima do recibo ---------------------------------

export const SuccessBadge = styled.View`
  align-items: center;
  margin-bottom: ${hp(2)}px;
`;

export const SuccessIconCircle = styled.View`
  width: 64px;
  height: 64px;
  border-radius: 32px;
  align-items: center;
  justify-content: center;
  background-color: ${colors.success};
  margin-bottom: 10px;
  shadow-color: ${colors.success};
  shadow-opacity: 0.5;
  shadow-radius: 14px;
  shadow-offset: 0px 4px;
  elevation: 8;
`;

export const SuccessTitle = styled.Text`
  color: ${colors.textPrimary};
  font-size: 18px;
  font-weight: 700;
`;

export const SuccessSubtitle = styled.Text`
  color: ${colors.textMuted};
  font-size: 13px;
  margin-top: 2px;
`;

// --- Card do recibo, estilo "papel" -----------------------------------

export const ReceiptCard = styled.View`
  background-color: #ffffff;
  border-radius: 18px;
  padding: 22px 20px 0px 20px;
  width: 100%;
  shadow-color: #000;
  shadow-offset: 0px 8px;
  shadow-opacity: 0.3;
  shadow-radius: 20px;
  elevation: 10;
  overflow: hidden;
`;

export const ReceiptHeader = styled.View`
  align-items: center;
  margin-bottom: 18px;
`;

export const ReceiptBrand = styled.Text`
  font-size: 16px;
  font-weight: 800;
  color: #1a1a2e;
  letter-spacing: 0.5px;
`;

export const ReceiptBrandSubtitle = styled.Text`
  font-size: 11px;
  color: #8a8a9a;
  margin-top: 2px;
`;

// Linha do valor pago — o destaque visual principal do recibo
export const AmountHighlight = styled.View`
  align-items: center;
  padding-vertical: 16px;
  margin-bottom: 16px;
  border-radius: 14px;
  background-color: rgba(108, 92, 231, 0.07);
`;

export const AmountHighlightLabel = styled.Text`
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1.2px;
  color: #8a8a9a;
  margin-bottom: 4px;
`;

export const AmountHighlightValue = styled.Text`
  font-size: 30px;
  font-weight: 800;
  color: #1a1a2e;
`;

// Linha pontilhada, separando seções (efeito clássico de cupom fiscal)
export const DottedDivider = styled.View`
  border-bottom-width: 1.5px;
  border-style: dashed;
  border-bottom-color: #d8d8e0;
  margin-bottom: 14px;
`;

export const DetailRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 14px;
`;

export const DetailBlock = styled.View`
  flex: 1;
`;

export const DetailLabel = styled.Text`
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.5px;
  color: #8a8a9a;
  margin-bottom: 3px;
`;

export const DetailValue = styled.Text`
  font-size: 13px;
  font-weight: 600;
  color: #1a1a2e;
`;

export const DetailValueMono = styled.Text`
  font-size: 11.5px;
  font-weight: 500;
  color: #1a1a2e;
  font-family: ${Platform.select({ ios: "Menlo", android: "monospace" })};
`;

// Borda serrilhada no rodapé do recibo (efeito "rasgo de cupom fiscal")
export const TornEdgeWrapper = styled.View`
  height: 14px;
  width: 100%;
  flex-direction: row;
  overflow: hidden;
`;

export const TornEdgeNotch = styled.View`
  width: 14px;
  height: 14px;
  border-radius: 7px;
  background-color: ${colors.bgDark};
  margin-left: -7px;
`;

// --- Ações ---------------------------------------------------------------

export const ActionsContainer = styled.View`
  margin-top: ${hp(3)}px;
  gap: 12px;
`;

interface ButtonProps {
  disabled?: boolean;
}

export const ButtonPrint = styled.TouchableOpacity<ButtonProps>`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 10px;
  height: ${hp(6.5)}px;
  border-radius: 16px;
  background-color: ${colors.primary};
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
  shadow-color: ${colors.primary};
  shadow-opacity: 0.4;
  shadow-radius: 12px;
  shadow-offset: 0px 6px;
  elevation: 8;
`;

export const ButtonReturn = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 10px;
  height: ${hp(6.5)}px;
  border-radius: 16px;
  background-color: ${colors.surface};
  border-width: 1px;
  border-color: ${colors.surfaceBorder};
`;

export const ButtonText = styled.Text`
  color: ${colors.textPrimary};
  font-size: 15px;
  font-weight: 700;
`;

export const ButtonReturnText = styled.Text`
  color: ${colors.textPrimary};
  font-size: 15px;
  font-weight: 700;
`;

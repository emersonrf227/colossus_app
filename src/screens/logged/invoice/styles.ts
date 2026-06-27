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
  margin-top: ${hp(1)}px;
`;

// Selo da rede escolhida (ícone + nome), logo abaixo do logo do app
export const NetworkBadge = styled.View`
  flex-direction: row;
  align-items: center;
  align-self: center;
  gap: 8px;
  margin-top: ${hp(1.5)}px;
  padding-horizontal: 14px;
  padding-vertical: 8px;
  border-radius: 14px;
  background-color: ${colors.surface};
  border-width: 1px;
  border-color: ${colors.surfaceBorder};
`;

export const NetworkBadgeIconWrapper = styled.View`
  width: 22px;
  height: 22px;
  border-radius: 11px;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
`;

export const NetworkBadgeText = styled.Text`
  color: ${colors.textMuted};
  font-size: 13px;
  font-weight: 600;
`;

export const ScrollContent = styled.ScrollView`
  flex: 1;
`;

export const ScrollContentContainer = styled.View`
  align-items: center;
  padding-bottom: ${hp(3)}px;
`;

// Card central com o valor a ser pago
export const AmountCard = styled.View`
  align-items: center;
  margin-top: ${hp(2.5)}px;
  margin-bottom: ${hp(2)}px;
`;

export const AmountLabel = styled.Text`
  color: ${colors.textMuted};
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 1.5px;
  margin-bottom: 6px;
`;

export const AmountRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

export const AmountValue = styled.Text`
  color: ${colors.textPrimary};
  font-size: 38px;
  font-weight: 700;
`;

export const TokenIcon = styled.Image`
  width: 30px;
  height: 30px;
`;

// Card branco do QR Code — precisa de fundo claro para o QR ser legível
// e escanear corretamente
export const QrCard = styled.View`
  width: ${wp(58)}px;
  height: ${wp(58)}px;
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

// Card com o endereço de pagamento + botão de copiar
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

// Timer de expiração — fica vermelho/alerta quando está acabando
interface TimerCardProps {
  urgent?: boolean;
}

export const TimerCard = styled.View<TimerCardProps>`
  flex-direction: row;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  border-radius: 14px;
  margin-bottom: ${hp(2.5)}px;
  background-color: ${({ urgent }) =>
    urgent ? "rgba(255,107,107,0.12)" : colors.surface};
  border-width: 1px;
  border-color: ${({ urgent }) =>
    urgent ? "rgba(255,107,107,0.3)" : colors.surfaceBorder};
`;

export const TimerText = styled.Text<TimerCardProps>`
  color: ${({ urgent }) => (urgent ? colors.danger : colors.textPrimary)};
  font-size: 15px;
  font-weight: 700;
`;

export const CancelButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  height: ${hp(6.5)}px;
  border-radius: 16px;
  background-color: transparent;
  border-width: 1.5px;
  border-color: rgba(255, 107, 107, 0.4);
`;

export const CancelButtonText = styled.Text`
  color: ${colors.danger};
  font-size: 15px;
  font-weight: 700;
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
`;

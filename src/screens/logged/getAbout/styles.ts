import styled from "styled-components/native";
import { Platform, StatusBar as RNStatusBar } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { colors } from "../dashboard/styles";

const STATUSBAR_HEIGHT =
  Platform.OS === "android" ? (RNStatusBar.currentHeight ?? 24) : 0;

// Verde e amarelo só para o destaque "Feito no Brasil" desta tela —
// não entra na paleta global porque é um toque pontual, não algo
// reutilizado pelo resto do app.
const brazil = {
  green: "#009C3B",
  yellow: "#FFDF00",
};

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
`;

export const ScrollContent = styled.ScrollView`
  flex: 1;
`;

// --- Logo / marca ---------------------------------------------------------

export const BrandImageWrapper = styled.View`
  align-items: center;
  margin-top: ${hp(2)}px;
  margin-bottom: ${hp(1.5)}px;
`;

export const BrandImage = styled.Image`
  width: ${wp(32)}px;
  height: ${wp(32)}px;
`;

export const BrandName = styled.Text`
  color: ${colors.textPrimary};
  font-size: 20px;
  font-weight: 800;
  letter-spacing: 0.5px;
  margin-top: ${hp(1)}px;
`;

export const VersionBadge = styled.View`
  margin-top: 6px;
  padding: 4px 12px;
  border-radius: 12px;
  background-color: ${colors.surface};
  border-width: 1px;
  border-color: ${colors.surfaceBorder};
`;

export const VersionBadgeText = styled.Text`
  color: ${colors.textMuted};
  font-size: 11.5px;
  font-weight: 600;
  letter-spacing: 0.5px;
`;

// --- Destaque "Feito no Brasil" ------------------------------------------

export const BrazilCard = styled.View`
  border-radius: 20px;
  padding: 20px;
  margin-top: ${hp(3)}px;
  margin-bottom: ${hp(2.5)}px;
  background-color: ${colors.surface};
  border-width: 1px;
  border-color: ${colors.surfaceBorder};
  overflow: hidden;
`;

// Faixa decorativa verde-amarela no topo do card, como um "selo" sutil
export const BrazilStripe = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  flex-direction: row;
`;

export const BrazilStripeGreen = styled.View`
  flex: 1;
  background-color: ${brazil.green};
`;

export const BrazilStripeYellow = styled.View`
  flex: 1;
  background-color: ${brazil.yellow};
`;

export const BrazilHeaderRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
`;

export const BrazilIconWrapper = styled.View`
  width: 40px;
  height: 40px;
  border-radius: 13px;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 156, 59, 0.18);
`;

export const BrazilTitle = styled.Text`
  color: ${colors.textPrimary};
  font-size: 15.5px;
  font-weight: 700;
  flex: 1;
`;

export const BrazilDescription = styled.Text`
  color: ${colors.textMuted};
  font-size: 13px;
  line-height: 19.5px;
`;

export const BrazilHighlight = styled.Text`
  color: ${brazil.yellow};
  font-weight: 700;
`;

// --- Dados da empresa -------------------------------------------------

export const SectionLabel = styled.Text`
  color: ${colors.textMuted};
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1.1px;
  margin-bottom: ${hp(1.2)}px;
`;

export const CompanyCard = styled.View`
  border-radius: 16px;
  overflow: hidden;
  background-color: ${colors.surface};
  border-width: 1px;
  border-color: ${colors.surfaceBorder};
  margin-bottom: ${hp(2)}px;
`;

interface FieldRowProps {
  isLast?: boolean;
}

export const FieldRow = styled.View<FieldRowProps>`
  padding: 13px 16px;
  border-bottom-width: ${({ isLast }) => (isLast ? 0 : 1)}px;
  border-bottom-color: ${colors.surfaceBorder};
`;

export const FieldLabel = styled.Text`
  color: ${colors.textMuted};
  font-size: 11.5px;
  font-weight: 600;
  letter-spacing: 0.5px;
  margin-bottom: 3px;
`;

export const FieldValue = styled.Text`
  color: ${colors.textPrimary};
  font-size: 14.5px;
  font-weight: 600;
`;

export const FooterNote = styled.Text`
  color: ${colors.textMuted};
  font-size: 11.5px;
  text-align: center;
  margin-bottom: ${hp(4)}px;
`;

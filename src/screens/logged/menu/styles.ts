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

export const SectionLabel = styled.Text`
  color: ${colors.textMuted};
  font-size: 12.5px;
  font-weight: 700;
  letter-spacing: 1.2px;
  margin-bottom: ${hp(1.5)}px;
  margin-top: ${hp(1)}px;
`;

// Grid de cards do menu principal
export const ButtonGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
`;

interface MenuCardProps {
  accentColor?: string;
}

export const MenuCard = styled.TouchableOpacity<MenuCardProps>`
  width: 31%;
  aspect-ratio: 1;
  border-radius: 18px;
  align-items: center;
  justify-content: center;
  margin-bottom: ${hp(1.6)}px;
  background-color: ${colors.surface};
  border-width: 1px;
  border-color: ${colors.surfaceBorder};
`;

export const MenuCardIconWrapper = styled.View<MenuCardProps>`
  width: 42px;
  height: 42px;
  border-radius: 14px;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
  background-color: ${({ accentColor }) =>
    accentColor ? `${accentColor}22` : "rgba(108,92,231,0.18)"};
`;

export const MenuCardText = styled.Text`
  color: ${colors.textPrimary};
  font-size: 11.5px;
  font-weight: 600;
  text-align: center;
  padding-horizontal: 4px;
`;

// Card "destaque" (ex: Idioma e Moeda) — ocupa a largura toda, em formato
// de linha, para se diferenciar dos cards quadrados do grid comum
export const HighlightCard = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  width: 100%;
  padding: 16px;
  border-radius: 18px;
  margin-bottom: ${hp(1.5)}px;
  background-color: ${colors.surface};
  border-width: 1px;
  border-color: ${colors.surfaceBorder};
`;

export const HighlightIconWrapper = styled.View`
  width: 44px;
  height: 44px;
  border-radius: 14px;
  align-items: center;
  justify-content: center;
  margin-right: 14px;
  background-color: rgba(108, 92, 231, 0.18);
`;

export const HighlightTextWrapper = styled.View`
  flex: 1;
`;

export const HighlightTitle = styled.Text`
  color: ${colors.textPrimary};
  font-size: 15px;
  font-weight: 700;
`;

export const HighlightSubtitle = styled.Text`
  color: ${colors.textMuted};
  font-size: 12.5px;
  margin-top: 2px;
`;

// Botão de logout — visualmente separado, estilo "destrutivo"
export const LogoutButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  height: ${hp(6.5)}px;
  border-radius: 16px;
  margin-top: ${hp(1)}px;
  margin-bottom: ${hp(3)}px;
  background-color: transparent;
  border-width: 1.5px;
  border-color: rgba(255, 107, 107, 0.35);
`;

export const LogoutButtonText = styled.Text`
  color: ${colors.danger};
  font-size: 15px;
  font-weight: 700;
`;

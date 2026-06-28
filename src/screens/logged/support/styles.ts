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
  margin-bottom: ${hp(0.5)}px;
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

// --- Card de contato via WhatsApp ---------------------------------------

export const ContactCard = styled.View`
  align-items: center;
  padding: 24px 20px;
  border-radius: 20px;
  margin-bottom: ${hp(3)}px;
  background-color: ${colors.surface};
  border-width: 1px;
  border-color: ${colors.surfaceBorder};
`;

export const ContactIconWrapper = styled.View`
  width: 64px;
  height: 64px;
  border-radius: 32px;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
  background-color: rgba(46, 204, 113, 0.15);
`;

export const ContactTitle = styled.Text`
  color: ${colors.textPrimary};
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 4px;
`;

export const ContactSubtitle = styled.Text`
  color: ${colors.textMuted};
  font-size: 13px;
  text-align: center;
  margin-bottom: 18px;
`;

export const WhatsAppButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  height: ${hp(6.5)}px;
  border-radius: 16px;
  background-color: ${colors.success};
  shadow-color: ${colors.success};
  shadow-opacity: 0.35;
  shadow-radius: 12px;
  shadow-offset: 0px 6px;
  elevation: 8;
`;

export const WhatsAppButtonText = styled.Text`
  color: #ffffff;
  font-size: 15px;
  font-weight: 700;
`;

// --- Seção de FAQ ---------------------------------------------------------

export const SectionLabel = styled.Text`
  color: ${colors.textMuted};
  font-size: 12.5px;
  font-weight: 700;
  letter-spacing: 1.2px;
  margin-bottom: ${hp(1.5)}px;
`;

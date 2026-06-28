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
  background-color: rgba(5, 4, 10, 0.7);
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

// --- Cabeçalho do documento --------------------------------------------

export const DocHeader = styled.View`
  align-items: center;
  margin-bottom: ${hp(2)}px;
`;

export const DocTitle = styled.Text`
  color: ${colors.textPrimary};
  font-size: 19px;
  font-weight: 700;
  text-align: center;
`;

export const DocUpdatedAt = styled.Text`
  color: ${colors.textMuted};
  font-size: 12.5px;
  margin-top: 4px;
`;

export const IntroCard = styled.View`
  background-color: ${colors.surface};
  border-width: 1px;
  border-color: ${colors.surfaceBorder};
  border-radius: 16px;
  padding: 16px;
  margin-bottom: ${hp(2.5)}px;
`;

export const IntroText = styled.Text`
  color: ${colors.textMuted};
  font-size: 13.5px;
  line-height: 20px;
`;

// --- Seções numeradas ----------------------------------------------------

export const SectionCard = styled.View`
  background-color: ${colors.surface};
  border-width: 1px;
  border-color: ${colors.surfaceBorder};
  border-radius: 16px;
  padding: 16px;
  margin-bottom: ${hp(1.6)}px;
`;

export const SectionHeader = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 10px;
`;

export const SectionNumberBadge = styled.View`
  width: 28px;
  height: 28px;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  background-color: rgba(108, 92, 231, 0.18);
`;

export const SectionNumberText = styled.Text`
  color: ${colors.primary};
  font-size: 13px;
  font-weight: 700;
`;

export const SectionTitle = styled.Text`
  color: ${colors.textPrimary};
  font-size: 15px;
  font-weight: 700;
  flex: 1;
`;

export const SectionBody = styled.Text`
  color: ${colors.textMuted};
  font-size: 13.5px;
  line-height: 21px;
`;

export const SectionBullet = styled.Text`
  color: ${colors.textMuted};
  font-size: 13.5px;
  line-height: 21px;
  margin-left: 6px;
  margin-top: 4px;
`;

export const FooterNote = styled.Text`
  color: ${colors.textMuted};
  font-size: 12px;
  text-align: center;
  margin-top: ${hp(1)}px;
  margin-bottom: ${hp(4)}px;
`;

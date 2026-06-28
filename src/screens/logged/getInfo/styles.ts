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
`;

export const ScrollContent = styled.ScrollView`
  flex: 1;
`;

// --- Cabeçalho do perfil: avatar + nome + tipo --------------------------

export const ProfileHeader = styled.View`
  align-items: center;
  margin-top: ${hp(1)}px;
  margin-bottom: ${hp(3)}px;
`;

export const AvatarCircle = styled.View`
  width: 76px;
  height: 76px;
  border-radius: 38px;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
  background-color: rgba(108, 92, 231, 0.18);
  border-width: 1.5px;
  border-color: ${colors.surfaceBorder};
`;

export const AvatarInitials = styled.Text`
  color: ${colors.primary};
  font-size: 26px;
  font-weight: 700;
`;

export const ProfileName = styled.Text`
  color: ${colors.textPrimary};
  font-size: 18px;
  font-weight: 700;
  text-align: center;
`;

export const ProfileTypeBadge = styled.View`
  margin-top: 6px;
  padding: 4px 12px;
  border-radius: 12px;
  background-color: ${colors.surface};
  border-width: 1px;
  border-color: ${colors.surfaceBorder};
`;

export const ProfileTypeBadgeText = styled.Text`
  color: ${colors.textMuted};
  font-size: 11.5px;
  font-weight: 600;
  letter-spacing: 0.5px;
`;

// --- Seções de informação -------------------------------------------------

export const SectionLabel = styled.Text`
  color: ${colors.textMuted};
  font-size: 12.5px;
  font-weight: 700;
  letter-spacing: 1.2px;
  margin-bottom: ${hp(1.2)}px;
  margin-top: ${hp(2)}px;
`;

export const SectionCard = styled.View`
  border-radius: 16px;
  overflow: hidden;
  background-color: ${colors.surface};
  border-width: 1px;
  border-color: ${colors.surfaceBorder};
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
  font-weight: 500;
`;

// --- Estado de erro --------------------------------------------------------

export const CenteredState = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  gap: 14px;
  padding-bottom: ${hp(10)}px;
`;

export const ErrorIconWrapper = styled.View`
  width: 64px;
  height: 64px;
  border-radius: 32px;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 107, 107, 0.12);
`;

export const ErrorText = styled.Text`
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

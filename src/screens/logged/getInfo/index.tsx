import React, { useEffect, useState, useCallback } from "react";
import { StatusBar, Clipboard, Share } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ArrowLeft, Copy, Share2, AlertCircle } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import QRCode from "react-native-qrcode-svg";
import styled from "styled-components/native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Platform, StatusBar as RNStatusBar } from "react-native";
import { useToast } from "@/hook/Toast";
import { getStoredWalletAddress } from "../../../components/wallet/walletStorage";
import { colors } from "../dashboard/styles";
import LogoSvg from "@/assets/logov2.svg";

const STATUSBAR_HEIGHT =
  Platform.OS === "android" ? (RNStatusBar.currentHeight ?? 24) : 0;

const Container = styled.View`
  flex: 1;
  background-color: ${colors.bgDark};
`;
const Background = styled.ImageBackground`
  flex: 1;
  width: 100%;
`;
const Overlay = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(5, 4, 10, 0.65);
`;
const SafeArea = styled.SafeAreaView`
  flex: 1;
  padding-horizontal: ${wp(5)}px;
  padding-top: ${STATUSBAR_HEIGHT}px;
`;
const Header = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: ${hp(1)}px;
  margin-bottom: ${hp(3)}px;
`;
const BackButton = styled.TouchableOpacity`
  width: 44px;
  height: 44px;
  border-radius: 14px;
  align-items: center;
  justify-content: center;
  background-color: ${colors.surface};
  border-width: 1px;
  border-color: ${colors.surfaceBorder};
`;
const HeaderTitle = styled.Text`
  color: ${colors.textPrimary};
  font-size: 18px;
  font-weight: 700;
  margin-left: 14px;
`;
const CardLogo = styled.View`
  align-items: center;
  margin-bottom: ${hp(2)}px;
`;
const Content = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding-bottom: ${hp(6)}px;
`;

// QR Code card
const QRCard = styled.View`
  background-color: #ffffff;
  border-radius: 24px;
  padding: 20px;
  align-items: center;
  justify-content: center;
  margin-bottom: ${hp(3)}px;
  shadow-color: #000;
  shadow-opacity: 0.25;
  shadow-radius: 12px;
  shadow-offset: 0px 6px;
  elevation: 10;
`;
const NetworkBadge = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 6px;
  margin-bottom: 14px;
  padding: 5px 12px;
  border-radius: 20px;
  background-color: rgba(108, 92, 231, 0.12);
  border-width: 1px;
  border-color: rgba(108, 92, 231, 0.3);
`;
const NetworkBadgeText = styled.Text`
  color: ${colors.primary};
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.5px;
`;

// Endereço
const AddressCard = styled.View`
  width: 100%;
  border-radius: 16px;
  padding: 16px;
  margin-bottom: ${hp(2)}px;
  background-color: ${colors.surface};
  border-width: 1px;
  border-color: ${colors.surfaceBorder};
`;
const AddressLabel = styled.Text`
  color: ${colors.textMuted};
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1px;
  margin-bottom: 8px;
`;
const AddressText = styled.Text`
  color: ${colors.textPrimary};
  font-size: 13px;
  font-family: monospace;
  line-height: 20px;
`;

// Botões
const ActionsRow = styled.View`
  flex-direction: row;
  gap: 12px;
  width: 100%;
`;
const ActionButton = styled.TouchableOpacity<{ accent?: boolean }>`
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: ${hp(6.2)}px;
  border-radius: 16px;
  background-color: ${({ accent }) =>
    accent ? colors.primary : colors.surface};
  border-width: ${({ accent }) => (accent ? 0 : 1)}px;
  border-color: ${colors.surfaceBorder};
  elevation: ${({ accent }) => (accent ? 6 : 0)};
`;
const ActionButtonText = styled.Text<{ accent?: boolean }>`
  color: ${({ accent }) => (accent ? "#fff" : colors.textPrimary)};
  font-size: 14px;
  font-weight: 700;
`;

// Estado de erro
const CenteredState = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  gap: 14px;
`;
const ErrorText = styled.Text`
  color: ${colors.textMuted};
  font-size: 14px;
  text-align: center;
  padding-horizontal: 30px;
`;

export default function WalletReceive() {
  const navigation = useNavigation();
  const { showToast } = useToast();
  const { t } = useTranslation();

  const [address, setAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStoredWalletAddress()
      .then(setAddress)
      .finally(() => setLoading(false));
  }, []);

  const handleCopy = useCallback(() => {
    if (!address) return;
    Clipboard.setString(address);
    showToast({ message: t("walletReceive.copied"), type: "success" });
  }, [address, showToast, t]);

  const handleShare = useCallback(async () => {
    if (!address) return;
    await Share.share({ message: address });
  }, [address]);

  return (
    <Container>
      <Background source={require("@/assets/background.png")}>
        <Overlay />
        <StatusBar
          barStyle="light-content"
          backgroundColor="transparent"
          translucent
        />
        <SafeArea>
          <Header>
            <BackButton onPress={() => navigation.goBack()} activeOpacity={0.7}>
              <ArrowLeft size={22} color="#FFFFFF" strokeWidth={2.2} />
            </BackButton>
            <HeaderTitle>{t("walletReceive.title")}</HeaderTitle>
          </Header>

          <CardLogo>
            <LogoSvg width={wp(34)} height={hp(19)} />
          </CardLogo>

          {!loading && !address ? (
            <CenteredState>
              <AlertCircle size={28} color="#FF6B6B" strokeWidth={2.2} />
              <ErrorText>{t("walletReceive.noAddress")}</ErrorText>
            </CenteredState>
          ) : address ? (
            <Content>
              {/* QR Code */}
              <NetworkBadge>
                <NetworkBadgeText>POLYGON · PLASMA</NetworkBadgeText>
              </NetworkBadge>
              <QRCard>
                <QRCode
                  value={address}
                  size={wp(56)}
                  color="#000000"
                  backgroundColor="#FFFFFF"
                />
              </QRCard>

              {/* Endereço */}
              <AddressCard>
                <AddressLabel>{t("walletReceive.addressLabel")}</AddressLabel>
                <AddressText>{address}</AddressText>
              </AddressCard>

              {/* Botões */}
              <ActionsRow>
                <ActionButton onPress={handleCopy} activeOpacity={0.75}>
                  <Copy
                    size={16}
                    color={colors.textPrimary}
                    strokeWidth={2.2}
                  />
                  <ActionButtonText>{t("walletReceive.copy")}</ActionButtonText>
                </ActionButton>
                <ActionButton accent onPress={handleShare} activeOpacity={0.85}>
                  <Share2 size={16} color="#FFF" strokeWidth={2.2} />
                  <ActionButtonText accent>
                    {t("walletReceive.share")}
                  </ActionButtonText>
                </ActionButton>
              </ActionsRow>
            </Content>
          ) : null}
        </SafeArea>
      </Background>
    </Container>
  );
}

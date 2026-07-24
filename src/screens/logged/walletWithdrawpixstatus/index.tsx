import React, { useEffect, useRef, useCallback } from "react";
import {
  StatusBar,
  ActivityIndicator,
  Clipboard,
  TouchableOpacity,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Clock, Copy } from "lucide-react-native";
import styled from "styled-components/native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Platform, StatusBar as RNStatusBar } from "react-native";
import { useTranslation } from "react-i18next";
import { useToast } from "@/hook/Toast";
import {
  getPixTransactionStatus,
  WalletNetwork,
  PixKeyType,
} from "../../../components/pix/pixService";
import { colors } from "../dashboard/styles";
import LogoSvg from "@/assets/logov2.svg";
import VirtualLogo from "@/assets/logo-virtual.png";

const STATUSBAR_HEIGHT =
  Platform.OS === "android" ? (RNStatusBar.currentHeight ?? 24) : 0;
const POLL_INTERVAL_MS = 5000;
const MAX_POLLS = 60;

const Container = styled.View`
  flex: 1;
  background-color: ${colors.bgDark};
`;
const Background = styled.ImageBackground`
  flex: 1;
  width: 100%;
  height: 100%;
`;
const Overlay = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(5, 4, 10, 0.72);
`;
const SafeArea = styled.SafeAreaView`
  flex: 1;
  padding-horizontal: ${wp(5)}px;
  padding-top: ${STATUSBAR_HEIGHT}px;
  align-items: center;
  justify-content: center;
`;
const Content = styled.View`
  align-items: center;
  padding-horizontal: ${wp(6)}px;
`;
const IconWrapper = styled.View`
  width: 80px;
  height: 80px;
  border-radius: 40px;
  align-items: center;
  justify-content: center;
  margin-bottom: ${hp(3)}px;
  background-color: rgba(108, 92, 231, 0.18);
`;
const Title = styled.Text`
  color: ${colors.textPrimary};
  font-size: 20px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 10px;
`;
const Subtitle = styled.Text`
  color: ${colors.textMuted};
  font-size: 13.5px;
  text-align: center;
  line-height: 20px;
`;
const StatusCard = styled.View`
  width: 100%;
  border-radius: 16px;
  padding: 16px;
  margin-top: ${hp(3)}px;
  background-color: ${colors.surface};
  border-width: 1px;
  border-color: ${colors.surfaceBorder};
`;
const StatusRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-vertical: 6px;
`;
const StatusLabel = styled.Text`
  color: ${colors.textMuted};
  font-size: 12.5px;
`;
const StatusValue = styled.Text`
  color: ${colors.textPrimary};
  font-size: 13px;
  font-weight: 700;
`;
const TxidRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-vertical: 6px;
`;
const TxidLabel = styled.Text`
  color: ${colors.textMuted};
  font-size: 12.5px;
`;
const TxidRight = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;
const TxidText = styled.Text`
  color: ${colors.textPrimary};
  font-size: 12px;
  font-weight: 700;
  font-family: monospace;
`;
const CopyButton = styled.TouchableOpacity`
  padding: 4px;
`;
const CardLogo = styled.View`
  position: absolute;
  top: ${hp(1) + STATUSBAR_HEIGHT}px;
  align-self: center;
`;

const Footer = styled.View`
  padding-vertical: ${hp(2)}px;
  padding-horizontal: ${wp(1)}px;
  align-items: center;
  gap: 6px;
`;

const FooterLogoWrapper = styled.View`
  height: 32px;
  width: 200px;
  background-color: #ffffff;
  border-radius: 8px;
  align-items: center;
  justify-content: center;
  padding: 4px;
`;

const FooterLogoImage = styled.Image`
  height: 100%;
  width: 100%;
  resize-mode: contain;
`;

const FooterText = styled.Text`
  color: ${colors.textMuted};
  font-size: 11px;
  text-align: center;
`;

function truncateTxid(txid: string): string {
  if (!txid || txid.length <= 20) return txid;
  return `${txid.slice(0, 8)}...${txid.slice(-6)}`;
}

interface RouteParams {
  uuid: string;
  txid: string;
  explorerUrl: string;
  network: WalletNetwork;
  pixKey: string;
  keyType: PixKeyType;
  amountBrl: number;
}

export default function WalletWithdrawPixStatus() {
  const navigation = useNavigation();
  const { navigate } = navigation;
  const route = useRoute();
  const { showToast } = useToast();
  const { t } = useTranslation();
  const { uuid, txid, explorerUrl, network, pixKey, keyType, amountBrl } =
    route.params as RouteParams;
  const pollCount = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isMounted = useRef(true);

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const statusMessages: Record<string, string> = {
    FAILED: t("walletWithdrawPixStatus.errorFailed"),
    EXPIRED: t("walletWithdrawPixStatus.errorExpired"),
    ERROR: t("walletWithdrawPixStatus.errorGeneric"),
  };

  const poll = useCallback(async () => {
    if (!isMounted.current) return;
    pollCount.current += 1;
    try {
      const status = await getPixTransactionStatus(uuid);
      if (status.status === "SUCCESS") {
        stopPolling();
        navigate(
          "Walletwithdrawpixsuccess" as never,
          { txid, explorerUrl, pixTransaction: status } as never,
        );
        return;
      }
      if (["FAILED", "EXPIRED", "ERROR"].includes(status.status)) {
        stopPolling();
        showToast({
          message:
            statusMessages[status.status] ??
            t("walletWithdrawPixStatus.errorGeneric"),
          type: "error",
        });
        navigation.goBack();
        return;
      }
      if (pollCount.current >= MAX_POLLS) {
        stopPolling();
        showToast({
          message: t("walletWithdrawPixStatus.errorTimeout"),
          type: "error",
        });
        navigation.goBack();
      }
    } catch {
      if (pollCount.current >= MAX_POLLS) {
        stopPolling();
        navigation.goBack();
      }
    }
  }, [
    uuid,
    txid,
    explorerUrl,
    navigate,
    navigation,
    showToast,
    stopPolling,
    t,
  ]);

  useEffect(() => {
    isMounted.current = true;
    poll();
    intervalRef.current = setInterval(poll, POLL_INTERVAL_MS);
    return () => {
      isMounted.current = false;
      stopPolling();
    };
  }, [poll, stopPolling]);

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
          <Content>
            <IconWrapper>
              <Clock size={36} color={colors.primary} strokeWidth={1.8} />
            </IconWrapper>
            <Title>{t("walletWithdrawPixStatus.title")}</Title>
            <Subtitle>{t("walletWithdrawPixStatus.subtitle")}</Subtitle>
            <ActivityIndicator
              color={colors.primary}
              size="large"
              style={{ marginTop: hp(3) }}
            />
            <StatusCard>
              <StatusRow>
                <StatusLabel>
                  {t("walletWithdrawPixStatus.network")}
                </StatusLabel>
                <StatusValue>{network}</StatusValue>
              </StatusRow>
              <StatusRow>
                <StatusLabel>{t("walletWithdrawPixStatus.pixKey")}</StatusLabel>
                <StatusValue numberOfLines={1}>{pixKey}</StatusValue>
              </StatusRow>
              <StatusRow>
                <StatusLabel>{t("walletWithdrawPixStatus.type")}</StatusLabel>
                <StatusValue>{keyType}</StatusValue>
              </StatusRow>
              <StatusRow>
                <StatusLabel>
                  {t("walletWithdrawPixStatus.amountBrl")}
                </StatusLabel>
                <StatusValue>R$ {Number(amountBrl).toFixed(2)}</StatusValue>
              </StatusRow>
              <TxidRow>
                <TxidLabel>{t("walletWithdrawPixStatus.txid")}</TxidLabel>
                <TxidRight>
                  <TxidText>{truncateTxid(txid)}</TxidText>
                  <CopyButton
                    onPress={() => {
                      Clipboard.setString(txid);
                      showToast({
                        message: t("walletWithdrawPixStatus.txidCopied"),
                        type: "success",
                      });
                    }}
                    activeOpacity={0.7}
                  >
                    <Copy size={14} color={colors.primary} strokeWidth={2.2} />
                  </CopyButton>
                </TxidRight>
              </TxidRow>
            </StatusCard>
          </Content>
          <Footer>
            <FooterLogoWrapper>
              <FooterLogoImage source={VirtualLogo} />
            </FooterLogoWrapper>
            <FooterText>Fornecido por Virtual Tokenizadora</FooterText>
          </Footer>
        </SafeArea>
      </Background>
    </Container>
  );
}

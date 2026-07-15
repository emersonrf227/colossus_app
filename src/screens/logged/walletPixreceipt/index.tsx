import React, { useEffect, useState, useCallback } from "react";
import { StatusBar, ActivityIndicator, Linking, Share } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  ArrowLeft,
  Share2,
  ExternalLink,
  CheckCircle,
  AlertTriangle,
} from "lucide-react-native";
import styled from "styled-components/native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Platform, StatusBar as RNStatusBar } from "react-native";
import { useTranslation } from "react-i18next";
import {
  getPixProof,
  PixTransaction,
} from "../../../components/pix/pixService";
import { colors } from "../dashboard/styles";
import LogoSvg from "@/assets/logov2.svg";
import moment from "moment";

const STATUSBAR_HEIGHT =
  Platform.OS === "android" ? (RNStatusBar.currentHeight ?? 24) : 0;
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
`;
const Header = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: ${hp(1)}px;
  margin-bottom: ${hp(2)}px;
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
  margin-bottom: ${hp(1)}px;
`;
const ScrollContent = styled.ScrollView`
  flex: 1;
`;
const StatusBadge = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px;
  border-radius: 14px;
  margin-bottom: ${hp(2)}px;
  background-color: rgba(46, 204, 113, 0.12);
  border-width: 1px;
  border-color: rgba(46, 204, 113, 0.3);
`;
const StatusText = styled.Text`
  color: ${colors.success};
  font-size: 14px;
  font-weight: 700;
`;
const SectionLabel = styled.Text`
  color: ${colors.textMuted};
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1px;
  margin-bottom: ${hp(1)}px;
  margin-top: ${hp(2)}px;
`;
const ReceiptCard = styled.View`
  border-radius: 16px;
  padding: 16px;
  background-color: ${colors.surface};
  border-width: 1px;
  border-color: ${colors.surfaceBorder};
  margin-bottom: ${hp(1.5)}px;
`;
const ReceiptRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  padding-vertical: 9px;
  border-bottom-width: 1px;
  border-bottom-color: ${colors.surfaceBorder};
`;
const LastReceiptRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  padding-vertical: 9px;
`;
const ReceiptLabel = styled.Text`
  color: ${colors.textMuted};
  font-size: 12.5px;
  flex: 1;
`;
const ReceiptValue = styled.Text`
  color: ${colors.textPrimary};
  font-size: 13px;
  font-weight: 700;
  flex: 1.5;
  text-align: right;
`;
const HighlightCard = styled.View`
  border-radius: 16px;
  padding: 16px;
  margin-bottom: ${hp(2)}px;
  background-color: rgba(46, 204, 113, 0.1);
  border-width: 1px;
  border-color: rgba(46, 204, 113, 0.3);
`;
const HighlightRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;
const HighlightLabel = styled.Text`
  color: ${colors.textMuted};
  font-size: 13px;
`;
const HighlightValue = styled.Text`
  color: ${colors.success};
  font-size: 22px;
  font-weight: 800;
`;
const ActionsRow = styled.View`
  gap: 10px;
  margin-bottom: ${hp(4)}px;
`;
const SecondaryButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: ${hp(6)}px;
  border-radius: 16px;
  background-color: ${colors.surface};
  border-width: 1px;
  border-color: ${colors.surfaceBorder};
`;
const SecondaryButtonText = styled.Text`
  color: ${colors.textPrimary};
  font-size: 14px;
  font-weight: 600;
`;
const CenteredState = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  gap: 14px;
`;
const StateText = styled.Text`
  color: ${colors.textMuted};
  font-size: 13.5px;
  text-align: center;
  padding-horizontal: 20px;
`;

interface RouteParams {
  pixTransaction: PixTransaction;
  txid: string;
  proofKey?: string;
  explorerUrl?: string;
}

export default function WalletPixReceipt() {
  const navigation = useNavigation();
  const { goBack } = navigation;
  const route = useRoute();
  const { t } = useTranslation();
  const {
    pixTransaction: initialTx,
    txid,
    proofKey,
    explorerUrl,
  } = route.params as RouteParams;

  const [tx, setTx] = useState<PixTransaction | null>(initialTx ?? null);
  const [loading, setLoading] = useState(!initialTx && !!proofKey);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (initialTx || !proofKey || !txid) return;
    setLoading(true);
    getPixProof({ proofKey, txid })
      .then((result) => {
        if (result) setTx(result);
        else setError(true);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const handleShare = useCallback(async () => {
    if (!tx) return;
    try {
      await Share.share({
        message:
          `${t("walletPixReceipt.shareHeader")}\n\n` +
          `${t("walletPixReceipt.beneficiary")}: ${tx.displayDestination ?? tx.destinarionAddress}\n` +
          `${t("walletPixReceipt.pixKey")}: ${tx.destinarionAddress} (${tx.typeDestinationKey})\n` +
          `${t("walletPixReceipt.valueSent")}: R$ ${tx.send_brl}\n` +
          `E2E: ${tx.endtoend ?? "-"}\n` +
          `${t("walletPixReceipt.date")}: ${moment(tx.updatedAt).format("DD/MM/YYYY HH:mm")}\n` +
          (explorerUrl ? `\nBlockchain: ${explorerUrl}` : ""),
      });
    } catch {}
  }, [tx, explorerUrl, t]);

  const handleOpenExplorer = useCallback(() => {
    if (!explorerUrl) return;
    Linking.openURL(explorerUrl).catch(() => {});
  }, [explorerUrl]);

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
            <BackButton onPress={() => goBack()} activeOpacity={0.7}>
              <ArrowLeft size={22} color="#FFFFFF" strokeWidth={2.2} />
            </BackButton>
            <HeaderTitle>{t("walletPixReceipt.title")}</HeaderTitle>
          </Header>
          <CardLogo>
            <LogoSvg width={wp(34)} height={hp(19)} />
          </CardLogo>

          {loading ? (
            <CenteredState>
              <ActivityIndicator color={colors.primary} size="large" />
              <StateText>{t("walletPixReceipt.loading")}</StateText>
            </CenteredState>
          ) : error || !tx ? (
            <CenteredState>
              <AlertTriangle
                size={28}
                color={colors.textMuted}
                strokeWidth={1.8}
              />
              <StateText>{t("walletPixReceipt.error")}</StateText>
            </CenteredState>
          ) : (
            <ScrollContent
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 24 }}
            >
              <StatusBadge>
                <CheckCircle
                  size={16}
                  color={colors.success}
                  strokeWidth={2.2}
                />
                <StatusText>{t("walletPixReceipt.confirmed")}</StatusText>
              </StatusBadge>

              <HighlightCard>
                <HighlightRow>
                  <HighlightLabel>
                    {t("walletPixReceipt.valueLabel")}
                  </HighlightLabel>
                  <HighlightValue>R$ {tx.send_brl}</HighlightValue>
                </HighlightRow>
              </HighlightCard>

              <SectionLabel>
                {t("walletPixReceipt.sectionRecipient")}
              </SectionLabel>
              <ReceiptCard>
                {tx.displayDestination && (
                  <ReceiptRow>
                    <ReceiptLabel>{t("walletPixReceipt.name")}</ReceiptLabel>
                    <ReceiptValue>{tx.displayDestination}</ReceiptValue>
                  </ReceiptRow>
                )}
                <ReceiptRow>
                  <ReceiptLabel>{t("walletPixReceipt.pixKey")}</ReceiptLabel>
                  <ReceiptValue numberOfLines={2}>
                    {tx.destinarionAddress}
                  </ReceiptValue>
                </ReceiptRow>
                <LastReceiptRow>
                  <ReceiptLabel>{t("walletPixReceipt.keyType")}</ReceiptLabel>
                  <ReceiptValue>{tx.typeDestinationKey}</ReceiptValue>
                </LastReceiptRow>
              </ReceiptCard>

              <SectionLabel>{t("walletPixReceipt.sectionValues")}</SectionLabel>
              <ReceiptCard>
                <ReceiptRow>
                  <ReceiptLabel>{t("walletPixReceipt.valueSent")}</ReceiptLabel>
                  <ReceiptValue>R$ {tx.send_brl}</ReceiptValue>
                </ReceiptRow>
                <LastReceiptRow>
                  <ReceiptLabel>{t("walletPixReceipt.usdtUsed")}</ReceiptLabel>
                  <ReceiptValue>{tx.amount_usd} USDT</ReceiptValue>
                </LastReceiptRow>
              </ReceiptCard>

              <SectionLabel>{t("walletPixReceipt.sectionId")}</SectionLabel>
              <ReceiptCard>
                {tx.endtoend && (
                  <ReceiptRow>
                    <ReceiptLabel>E2E ID</ReceiptLabel>
                    <ReceiptValue numberOfLines={2} style={{ fontSize: 10 }}>
                      {tx.endtoend}
                    </ReceiptValue>
                  </ReceiptRow>
                )}
                <ReceiptRow>
                  <ReceiptLabel>{t("walletPixReceipt.network")}</ReceiptLabel>
                  <ReceiptValue>{tx.cryptoNetwork}</ReceiptValue>
                </ReceiptRow>
                <ReceiptRow>
                  <ReceiptLabel>{t("walletPixReceipt.txid")}</ReceiptLabel>
                  <ReceiptValue numberOfLines={2} style={{ fontSize: 10 }}>
                    {txid}
                  </ReceiptValue>
                </ReceiptRow>
                <LastReceiptRow>
                  <ReceiptLabel>{t("walletPixReceipt.date")}</ReceiptLabel>
                  <ReceiptValue>
                    {moment(tx.updatedAt).format("DD/MM/YYYY HH:mm")}
                  </ReceiptValue>
                </LastReceiptRow>
              </ReceiptCard>

              <ActionsRow>
                <SecondaryButton onPress={handleShare} activeOpacity={0.75}>
                  <Share2
                    size={16}
                    color={colors.textPrimary}
                    strokeWidth={2.2}
                  />
                  <SecondaryButtonText>
                    {t("walletPixReceipt.share")}
                  </SecondaryButtonText>
                </SecondaryButton>
                {explorerUrl && (
                  <SecondaryButton
                    onPress={handleOpenExplorer}
                    activeOpacity={0.75}
                  >
                    <ExternalLink
                      size={16}
                      color={colors.textPrimary}
                      strokeWidth={2.2}
                    />
                    <SecondaryButtonText>
                      {t("walletPixReceipt.viewBlockchain")}
                    </SecondaryButtonText>
                  </SecondaryButton>
                )}
              </ActionsRow>
            </ScrollContent>
          )}
        </SafeArea>
      </Background>
    </Container>
  );
}

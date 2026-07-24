import React, { useState, useCallback } from "react";
import { StatusBar } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { ArrowLeft, ShieldCheck } from "lucide-react-native";
import styled from "styled-components/native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Platform, StatusBar as RNStatusBar } from "react-native";
import { useTranslation } from "react-i18next";
import { useToast } from "@/hook/Toast";
import Loader from "@/components/loader";
import PinConfirmModal from "../PinConfirmModal";
import {
  createPixTransaction,
  sendPixTxid,
  PixKeyType,
  WalletNetwork,
  SwapQuote,
} from "../../../components/pix/pixService";
import {
  withdrawCrypto,
  WithdrawError,
} from "../../../components/wallet/walletTransactions";
import { ApiWalletRecord } from "../../../components/wallet/walletStatus";
import {
  getStoredWalletAddress,
  getProofKey,
} from "../../../components/wallet/walletStorage";
import { colors } from "../dashboard/styles";
import LogoSvg from "@/assets/logov2.svg";
import VirtualLogo from "@/assets/logo-virtual.png";

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

const Overlay = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(5, 4, 10, 0.68);
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
const ScrollContent = styled.ScrollView`
  flex: 1;
`;
const SectionLabel = styled.Text`
  color: ${colors.textMuted};
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1px;
  margin-bottom: ${hp(1)}px;
  margin-top: ${hp(2)}px;
`;
const DetailCard = styled.View`
  border-radius: 16px;
  padding: 16px;
  background-color: ${colors.surface};
  border-width: 1px;
  border-color: ${colors.surfaceBorder};
  margin-bottom: ${hp(1)}px;
`;
const DetailRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  padding-vertical: 8px;
  border-bottom-width: 1px;
  border-bottom-color: ${colors.surfaceBorder};
`;
const LastDetailRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  padding-vertical: 8px;
`;
const DetailLabel = styled.Text`
  color: ${colors.textMuted};
  font-size: 12.5px;
  flex: 1;
`;
const DetailValue = styled.Text`
  color: ${colors.textPrimary};
  font-size: 13px;
  font-weight: 700;
  flex: 1.5;
  text-align: right;
`;
const TotalCard = styled.View`
  border-radius: 16px;
  padding: 16px;
  background-color: rgba(46, 204, 113, 0.1);
  border-width: 1px;
  border-color: rgba(46, 204, 113, 0.3);
  margin-bottom: ${hp(3)}px;
`;
const TotalRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;
const TotalLabel = styled.Text`
  color: ${colors.textMuted};
  font-size: 13px;
`;
const TotalValue = styled.Text`
  color: ${colors.success};
  font-size: 20px;
  font-weight: 800;
`;
const TotalSub = styled.Text`
  color: ${colors.textMuted};
  font-size: 12px;
  margin-top: 4px;
`;
const PrimaryButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: ${hp(6.8)}px;
  border-radius: 16px;
  margin-bottom: ${hp(4)}px;
  background-color: ${colors.primary};
  opacity: ${(p: any) => (p.disabled ? 0.5 : 1)};
  elevation: 8;
`;
const PrimaryButtonText = styled.Text`
  color: #fff;
  font-size: 15px;
  font-weight: 700;
`;
const CardLogo = styled.View`
  align-items: center;
  margin-top: ${hp(0.5)}px;
  margin-bottom: ${hp(1)}px;
`;

const Footer = styled.View`
  padding-vertical: ${hp(2)}px;
  padding-horizontal: ${wp(1)}px;
  align-items: center;
  gap: 6px;
`;

interface RouteParams {
  record: ApiWalletRecord;
  network: WalletNetwork;
  amountBrl: number;
  usdtNeeded: number;
  quote: SwapQuote;
  pixKey: string;
  keyType: PixKeyType;
  email: string;
  decodedName: string | null;
}

export default function WalletWithdrawPixConfirm() {
  const navigation = useNavigation();
  const { navigate, goBack } = navigation;
  const route = useRoute();
  const { showToast } = useToast();
  const { t } = useTranslation();
  const params = route.params as RouteParams;
  const {
    record,
    network,
    amountBrl,
    usdtNeeded,
    pixKey,
    keyType,
    email,
    decodedName,
  } = params;
  const [pinVisible, setPinVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleConfirmed = useCallback(async () => {
    setPinVisible(false);
    setSubmitting(true);

    try {
      const walletRet =
        record?.address ?? (await getStoredWalletAddress()) ?? "";

      // Monta a proofKey antes de criar a transação
      const proofKey = await getProofKey();

      console.log(proofKey);
      if (!proofKey) {
        showToast({
          message:
            "Não foi possível obter a chave de prova. Verifique sua carteira.",
          type: "error",
        });
        setSubmitting(false);
        return;
      }

      // 1. Cria a transação PIX no backend — agora com proofKey
      const pixTx = await createPixTransaction({
        network,
        key: pixKey,
        typeKey: keyType,
        walletRet,
        email,
        amount: amountBrl,
        proofKey, // 👈 novo campo
      });

      console.log("pixTx ===>", pixTx);

      // 2. Envia o USDT on-chain
      const { txid, explorerUrl } = await withdrawCrypto({
        network: network.toLowerCase() as any,
        toAddress: pixTx.origemAddress,
        amount: pixTx.amount_usd,
      });

      // 3. Registra o txid na transação PIX
      try {
        await sendPixTxid({ proofKey, txid, id: pixTx.id });
      } catch {
        // Não bloqueia o fluxo — o status ainda será consultado via polling
        console.warn("sendPixTxid falhou, continuando para o polling...");
      }

      // 4. Vai para polling de status
      navigate(
        "Walletwithdrawpixstatus" as never,
        {
          uuid: pixTx.uuid,
          txid,
          explorerUrl,
          network,
          pixKey,
          keyType,
          amountBrl,
          proofKey, // passa para o success screen usar no comprovante PIX
        } as never,
      );
    } catch (error: any) {
      const message =
        error instanceof WithdrawError
          ? error.message
          : t("walletWithdrawPixConfirm.errorGeneric");
      showToast({ message, type: "error" });
    } finally {
      setSubmitting(false);
    }
  }, [params, record, navigate, showToast, t]);

  return (
    <Container>
      {submitting && <Loader />}
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
            <HeaderTitle>{t("walletWithdrawPixConfirm.title")}</HeaderTitle>
          </Header>
          <CardLogo>
            <LogoSvg width={wp(34)} height={hp(19)} />
          </CardLogo>

          <ScrollContent
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 24 }}
          >
            <SectionLabel>
              {t("walletWithdrawPixConfirm.detailsLabel")}
            </SectionLabel>
            <DetailCard>
              <DetailRow>
                <DetailLabel>
                  {t("walletWithdrawPixConfirm.network")}
                </DetailLabel>
                <DetailValue>{network}</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>
                  {t("walletWithdrawPixConfirm.keyType")}
                </DetailLabel>
                <DetailValue>{keyType}</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>
                  {t("walletWithdrawPixConfirm.pixKey")}
                </DetailLabel>
                <DetailValue numberOfLines={2}>{pixKey}</DetailValue>
              </DetailRow>
              {decodedName && (
                <DetailRow>
                  <DetailLabel>
                    {t("walletWithdrawPixConfirm.beneficiary")}
                  </DetailLabel>
                  <DetailValue>{decodedName}</DetailValue>
                </DetailRow>
              )}
              <DetailRow>
                <DetailLabel>
                  {t("walletWithdrawPixConfirm.emailReceipt")}
                </DetailLabel>
                <DetailValue>{email}</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>
                  {t("walletWithdrawPixConfirm.youSend")}
                </DetailLabel>
                <DetailValue>{usdtNeeded.toFixed(2)} USDT</DetailValue>
              </DetailRow>
              <LastDetailRow>
                <DetailLabel>{t("walletWithdrawPixConfirm.quote")}</DetailLabel>
                <DetailValue>
                  R$ {parseFloat(params.quote.price_usd).toFixed(4)} / USDT
                </DetailValue>
              </LastDetailRow>
            </DetailCard>

            <TotalCard>
              <TotalRow>
                <TotalLabel>
                  {t("walletWithdrawPixConfirm.receiveLabel")}
                </TotalLabel>
                <TotalValue>R$ {amountBrl.toFixed(2)}</TotalValue>
              </TotalRow>
              <TotalSub>
                {t("walletWithdrawPixConfirm.blockchainNote")}
              </TotalSub>
            </TotalCard>

            <PrimaryButton
              onPress={() => setPinVisible(true)}
              disabled={submitting}
              activeOpacity={0.85}
            >
              <ShieldCheck size={18} color="#FFFFFF" strokeWidth={2.2} />
              <PrimaryButtonText>
                {t("walletWithdrawPixConfirm.confirmButton")}
              </PrimaryButtonText>
            </PrimaryButton>
          </ScrollContent>
          <Footer>
            <FooterLogoWrapper>
              <FooterLogoImage source={VirtualLogo} />
            </FooterLogoWrapper>
            <FooterText>Fornecido por Virtual Tokenizadora</FooterText>
          </Footer>
        </SafeArea>
      </Background>

      <PinConfirmModal
        visible={pinVisible}
        title={t("walletWithdrawPixConfirm.pinTitle")}
        subtitle={t("walletWithdrawPixConfirm.pinSubtitle", {
          usdt: usdtNeeded.toFixed(2),
          brl: amountBrl.toFixed(2),
        })}
        onCancel={() => setPinVisible(false)}
        onConfirmed={handleConfirmed}
      />
    </Container>
  );
}

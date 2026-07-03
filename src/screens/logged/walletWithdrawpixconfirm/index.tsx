import React, { useState, useCallback } from "react";
import { StatusBar } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { ArrowLeft, ShieldCheck, Send } from "lucide-react-native";
import styled from "styled-components/native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Platform, StatusBar as RNStatusBar } from "react-native";
import { useToast } from "@/hook/Toast";
import Loader from "@/components/loader";
import PinConfirmModal from "../PinConfirmModal";
import {
  createPixTransaction,
  PixKeyType,
  WalletNetwork,
  SwapQuote,
} from "../../../components/pix/pixService";

import {
  withdrawCrypto,
  WithdrawError,
} from "../../../components/wallet/walletTransactions";
import { ApiWalletRecord } from "../../../components/wallet/walletStatus";
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
  height: 100%;
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

export const CardLogo = styled.View`
  align-items: center;
  margin-top: ${hp(0.5)}px;
  margin-bottom: ${hp(1)}px;
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
      // 1. Obtém endereço da wallet local para enviar como walletRet
      const walletRet =
        record?.address ?? (await getStoredWalletAddress()) ?? "";

      // 2. Cria a transação PIX no backend
      const pixTx = await createPixTransaction({
        network,
        key: pixKey,
        typeKey: keyType,
        walletRet,
        email,
        amount: amountBrl,
      });

      // 3. Envia o USDT on-chain para o origemAddress retornado
      const { txid, explorerUrl } = await withdrawCrypto({
        network: network.toLowerCase() as any,
        toAddress: pixTx.origemAddress,
        amount: pixTx.amount_usd, // valor exato retornado pela API
      });

      // 4. Vai para tela de polling de status
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
        } as never,
      );
    } catch (error: any) {
      const message =
        error instanceof WithdrawError
          ? error.message
          : (error?.message ?? "Não foi possível processar o saque PIX.");
      showToast({ message, type: "error" });
    } finally {
      setSubmitting(false);
    }
  }, [params, record, navigate, showToast]);

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
            <HeaderTitle>Confirmar PIX</HeaderTitle>
          </Header>

          <CardLogo>
            <LogoSvg width={wp(28)} height={hp(7)} />
          </CardLogo>

          <ScrollContent
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 24 }}
          >
            <SectionLabel>DETALHES DA OPERAÇÃO</SectionLabel>
            <DetailCard>
              <DetailRow>
                <DetailLabel>Rede</DetailLabel>
                <DetailValue>{network}</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>Tipo de chave</DetailLabel>
                <DetailValue>{keyType}</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>Chave PIX</DetailLabel>
                <DetailValue numberOfLines={2}>{pixKey}</DetailValue>
              </DetailRow>
              {decodedName && (
                <DetailRow>
                  <DetailLabel>Beneficiário</DetailLabel>
                  <DetailValue>{decodedName}</DetailValue>
                </DetailRow>
              )}
              <DetailRow>
                <DetailLabel>E-mail comprovante</DetailLabel>
                <DetailValue>{email}</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>Você envia</DetailLabel>
                <DetailValue>{usdtNeeded.toFixed(2)} USDT</DetailValue>
              </DetailRow>
              <LastDetailRow>
                <DetailLabel>Cotação</DetailLabel>
                <DetailValue>
                  R$ {parseFloat(params.quote.price_usd).toFixed(4)} / USDT
                </DetailValue>
              </LastDetailRow>
            </DetailCard>

            <TotalCard>
              <TotalRow>
                <TotalLabel>Você recebe via PIX</TotalLabel>
                <TotalValue>R$ {amountBrl.toFixed(2)}</TotalValue>
              </TotalRow>
              <TotalSub>Sujeito a confirmação da rede blockchain</TotalSub>
            </TotalCard>

            <PrimaryButton
              onPress={() => setPinVisible(true)}
              disabled={submitting}
              activeOpacity={0.85}
            >
              <ShieldCheck size={18} color="#FFFFFF" strokeWidth={2.2} />
              <PrimaryButtonText>Confirmar com PIN</PrimaryButtonText>
            </PrimaryButton>
          </ScrollContent>
        </SafeArea>
      </Background>

      <PinConfirmModal
        visible={pinVisible}
        title="Confirme o PIX"
        subtitle={`Você vai enviar ${usdtNeeded.toFixed(2)} USDT e receber R$ ${amountBrl.toFixed(2)} via PIX.`}
        onCancel={() => setPinVisible(false)}
        onConfirmed={handleConfirmed}
      />
    </Container>
  );
}

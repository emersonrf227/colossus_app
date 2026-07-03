import React, { useCallback } from "react";
import { StatusBar, Linking, Share } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  CheckCircle,
  ExternalLink,
  Share2,
  RefreshCw,
} from "lucide-react-native";
import styled from "styled-components/native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Platform, StatusBar as RNStatusBar } from "react-native";
import { PixTransaction } from "../../../components/pix/pixService";
import { colors } from "../dashboard/styles";

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
const Content = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding-bottom: ${hp(4)}px;
`;
const IconWrapper = styled.View`
  width: 88px;
  height: 88px;
  border-radius: 44px;
  align-items: center;
  justify-content: center;
  margin-bottom: ${hp(2)}px;
  background-color: rgba(46, 204, 113, 0.15);
`;
const Title = styled.Text`
  color: ${colors.textPrimary};
  font-size: 22px;
  font-weight: 800;
  text-align: center;
  margin-bottom: 8px;
`;
const Subtitle = styled.Text`
  color: ${colors.textMuted};
  font-size: 13px;
  text-align: center;
  line-height: 19px;
  padding-horizontal: 16px;
  margin-bottom: ${hp(3)}px;
`;

const ReceiptCard = styled.View`
  width: 100%;
  border-radius: 16px;
  padding: 16px;
  margin-bottom: ${hp(2)}px;
  background-color: ${colors.surface};
  border-width: 1px;
  border-color: ${colors.surfaceBorder};
`;
const ReceiptTitle = styled.Text`
  color: ${colors.textMuted};
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1px;
  margin-bottom: 10px;
`;
const ReceiptRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  padding-vertical: 7px;
  border-bottom-width: 1px;
  border-bottom-color: ${colors.surfaceBorder};
`;
const LastReceiptRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  padding-vertical: 7px;
`;
const ReceiptLabel = styled.Text`
  color: ${colors.textMuted};
  font-size: 12px;
  flex: 1;
`;
const ReceiptValue = styled.Text`
  color: ${colors.textPrimary};
  font-size: 12.5px;
  font-weight: 700;
  flex: 1.5;
  text-align: right;
`;

const HighlightCard = styled.View`
  width: 100%;
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

const ActionsColumn = styled.View`
  width: 100%;
  gap: 10px;
`;
const PrimaryButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: ${hp(6.5)}px;
  border-radius: 16px;
  background-color: ${colors.primary};
  elevation: 8;
`;
const PrimaryButtonText = styled.Text`
  color: #fff;
  font-size: 14.5px;
  font-weight: 700;
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

interface RouteParams {
  txid: string;
  explorerUrl: string;
  pixTransaction: PixTransaction;
}

export default function WalletWithdrawPixSuccess() {
  const navigation = useNavigation();
  const route = useRoute();
  const { txid, explorerUrl, pixTransaction: tx } = route.params as RouteParams;

  const handleOpenExplorer = useCallback(() => {
    Linking.openURL(explorerUrl).catch(() => {});
  }, [explorerUrl]);

  const handleShare = useCallback(async () => {
    try {
      await Share.share({
        message:
          `✅ PIX enviado com sucesso!\n\n` +
          `Beneficiário: ${tx.displayDestination ?? tx.destinarionAddress}\n` +
          `Chave PIX: ${tx.destinarionAddress} (${tx.typeDestinationKey})\n` +
          `Valor: R$ ${tx.send_brl}\n` +
          `End-to-End: ${tx.endtoend ?? "-"}\n` +
          `USDT enviado: ${tx.amount_usd}\n\n` +
          `Blockchain: ${explorerUrl}`,
      });
    } catch {}
  }, [tx, explorerUrl]);

  const handleNewTransaction = useCallback(() => {
    navigation.reset({
      index: 0,
      routes: [{ name: "WalletHome" as never }],
    });
  }, [navigation]);

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
              <CheckCircle size={48} color={colors.success} strokeWidth={1.8} />
            </IconWrapper>

            <Title>PIX enviado!</Title>
            <Subtitle>
              O pagamento foi processado com sucesso. O beneficiário deve
              receber em instantes.
            </Subtitle>

            {/* Valor em destaque */}
            <HighlightCard>
              <HighlightRow>
                <HighlightLabel>Valor recebido via PIX</HighlightLabel>
                <HighlightValue>R$ {tx.send_brl}</HighlightValue>
              </HighlightRow>
            </HighlightCard>

            {/* Comprovante */}
            <ReceiptCard>
              <ReceiptTitle>COMPROVANTE</ReceiptTitle>
              {tx.displayDestination && (
                <ReceiptRow>
                  <ReceiptLabel>Beneficiário</ReceiptLabel>
                  <ReceiptValue>{tx.displayDestination}</ReceiptValue>
                </ReceiptRow>
              )}
              <ReceiptRow>
                <ReceiptLabel>Chave PIX</ReceiptLabel>
                <ReceiptValue numberOfLines={2}>
                  {tx.destinarionAddress}
                </ReceiptValue>
              </ReceiptRow>
              <ReceiptRow>
                <ReceiptLabel>Tipo</ReceiptLabel>
                <ReceiptValue>{tx.typeDestinationKey}</ReceiptValue>
              </ReceiptRow>
              <ReceiptRow>
                <ReceiptLabel>USDT enviado</ReceiptLabel>
                <ReceiptValue>{tx.amount_usd}</ReceiptValue>
              </ReceiptRow>
              <ReceiptRow>
                <ReceiptLabel>Total BRL</ReceiptLabel>
                <ReceiptValue>R$ {tx.total_brl}</ReceiptValue>
              </ReceiptRow>
              {tx.endtoend && (
                <ReceiptRow>
                  <ReceiptLabel>End-to-End</ReceiptLabel>
                  <ReceiptValue numberOfLines={1} style={{ fontSize: 10 }}>
                    {tx.endtoend}
                  </ReceiptValue>
                </ReceiptRow>
              )}
              <LastReceiptRow>
                <ReceiptLabel>TXID Blockchain</ReceiptLabel>
                <ReceiptValue numberOfLines={1} style={{ fontSize: 10 }}>
                  {txid}
                </ReceiptValue>
              </LastReceiptRow>
            </ReceiptCard>

            <ActionsColumn>
              <PrimaryButton
                onPress={handleNewTransaction}
                activeOpacity={0.85}
              >
                <RefreshCw size={16} color="#FFFFFF" strokeWidth={2.2} />
                <PrimaryButtonText>Realizar nova transação</PrimaryButtonText>
              </PrimaryButton>

              <SecondaryButton
                onPress={handleOpenExplorer}
                activeOpacity={0.75}
              >
                <ExternalLink
                  size={16}
                  color={colors.textPrimary}
                  strokeWidth={2.2}
                />
                <SecondaryButtonText>Ver na blockchain</SecondaryButtonText>
              </SecondaryButton>

              <SecondaryButton onPress={handleShare} activeOpacity={0.75}>
                <Share2
                  size={16}
                  color={colors.textPrimary}
                  strokeWidth={2.2}
                />
                <SecondaryButtonText>
                  Compartilhar comprovante
                </SecondaryButtonText>
              </SecondaryButton>
            </ActionsColumn>
          </Content>
        </SafeArea>
      </Background>
    </Container>
  );
}

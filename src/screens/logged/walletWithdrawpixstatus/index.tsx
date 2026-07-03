import React, { useEffect, useRef, useCallback } from "react";
import { StatusBar, ActivityIndicator } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Clock } from "lucide-react-native";
import styled from "styled-components/native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Platform, StatusBar as RNStatusBar } from "react-native";
import { useToast } from "@/hook/Toast";
import {
  getPixTransactionStatus,
  WalletNetwork,
  PixKeyType,
} from "../../../components/pix/pixService";
import { colors } from "../dashboard/styles";

const STATUSBAR_HEIGHT =
  Platform.OS === "android" ? (RNStatusBar.currentHeight ?? 24) : 0;
const POLL_INTERVAL_MS = 5000; // consulta a cada 5 segundos
const MAX_POLLS = 60; // máximo de 5 minutos

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

  const poll = useCallback(async () => {
    if (!isMounted.current) return;
    pollCount.current += 1;

    try {
      const status = await getPixTransactionStatus(uuid);

      if (status.status === "SUCCESS") {
        stopPolling();
        navigate(
          "WalletWithdrawPixSuccess" as never,
          {
            txid,
            explorerUrl,
            pixTransaction: status,
          } as never,
        );
        return;
      }

      if (status.status === "EXPIRED" || status.status === "ERROR") {
        stopPolling();
        showToast({
          message:
            status.status === "EXPIRED"
              ? "A transação expirou. Tente novamente."
              : "Ocorreu um erro na transação. Entre em contato com o suporte.",
          type: "error",
        });
        navigation.goBack();
        return;
      }

      // Atingiu o máximo de tentativas
      if (pollCount.current >= MAX_POLLS) {
        stopPolling();
        showToast({
          message: "Tempo de espera esgotado. Verifique o status em breve.",
          type: "error",
        });
        navigation.goBack();
      }
    } catch {
      // Erro de rede — continua tentando até MAX_POLLS
      if (pollCount.current >= MAX_POLLS) {
        stopPolling();
        navigation.goBack();
      }
    }
  }, [uuid, txid, explorerUrl, navigate, navigation, showToast, stopPolling]);

  useEffect(() => {
    isMounted.current = true;
    // Primeira consulta imediata, depois a cada POLL_INTERVAL_MS
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

            <Title>Aguardando confirmação</Title>
            <Subtitle>
              O USDT foi enviado. Estamos aguardando a confirmação na blockchain
              para processar o PIX.
            </Subtitle>

            <ActivityIndicator
              color={colors.primary}
              size="large"
              style={{ marginTop: hp(3) }}
            />

            <StatusCard>
              <StatusRow>
                <StatusLabel>Rede</StatusLabel>
                <StatusValue>{network}</StatusValue>
              </StatusRow>
              <StatusRow>
                <StatusLabel>Chave PIX</StatusLabel>
                <StatusValue numberOfLines={1}>{pixKey}</StatusValue>
              </StatusRow>
              <StatusRow>
                <StatusLabel>Tipo</StatusLabel>
                <StatusValue>{keyType}</StatusValue>
              </StatusRow>
              <StatusRow>
                <StatusLabel>Valor BRL</StatusLabel>
                <StatusValue>R$ {Number(amountBrl).toFixed(2)}</StatusValue>
              </StatusRow>
              <StatusRow>
                <StatusLabel>TXID</StatusLabel>
                <StatusValue numberOfLines={1} style={{ fontSize: 10 }}>
                  {txid}
                </StatusValue>
              </StatusRow>
            </StatusCard>
          </Content>
        </SafeArea>
      </Background>
    </Container>
  );
}

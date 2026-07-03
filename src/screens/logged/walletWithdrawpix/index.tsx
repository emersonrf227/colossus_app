import React, { useState, useEffect, useCallback, useRef } from "react";
import { StatusBar, ActivityIndicator } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  ArrowLeft,
  RefreshCw,
  ArrowRight,
  AlertTriangle,
  Clock,
} from "lucide-react-native";
import styled from "styled-components/native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Platform, StatusBar as RNStatusBar } from "react-native";
import { useToast } from "@/hook/Toast";
import {
  fetchSwapQuote,
  fetchNetworkTicker,
  calculateUsdtNeeded,
  SwapQuote,
  WalletNetwork,
} from "../../../components/pix/pixService";
import { ApiWalletRecord } from "../../../components/wallet/walletStatus";
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
const QuoteCard = styled.View`
  border-radius: 18px;
  padding: 16px;
  margin-bottom: ${hp(2)}px;
  background-color: ${colors.surface};
  border-width: 1px;
  border-color: ${colors.surfaceBorder};
`;
const QuoteRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
`;
const QuoteLabel = styled.Text`
  color: ${colors.textMuted};
  font-size: 12.5px;
`;
const QuoteValue = styled.Text`
  color: ${colors.textPrimary};
  font-size: 13.5px;
  font-weight: 700;
`;
const TimerRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 6px;
  margin-top: 8px;
  padding-top: 10px;
  border-top-width: 1px;
  border-top-color: ${colors.surfaceBorder};
`;
const TimerText = styled.Text`
  color: ${(p: any) => (p.warn ? colors.danger : colors.textMuted)};
  font-size: 12px;
  font-weight: 600;
`;
const RefreshButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  gap: 4px;
  margin-left: auto;
`;
const RefreshText = styled.Text`
  color: ${colors.primary};
  font-size: 12px;
  font-weight: 600;
`;
const SectionLabel = styled.Text`
  color: ${colors.textMuted};
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1px;
  margin-bottom: ${hp(1)}px;
  margin-top: ${hp(1)}px;
`;
const NetworkRow = styled.View`
  flex-direction: row;
  gap: 10px;
  margin-bottom: ${hp(2)}px;
`;
const NetworkChip = styled.TouchableOpacity`
  flex: 1;
  align-items: center;
  padding-vertical: 12px;
  border-radius: 14px;
  background-color: ${(p: any) =>
    p.selected ? "rgba(108,92,231,0.18)" : colors.surface};
  border-width: 1.5px;
  border-color: ${(p: any) =>
    p.selected ? colors.primary : colors.surfaceBorder};
`;
const NetworkChipText = styled.Text`
  color: ${(p: any) => (p.selected ? colors.textPrimary : colors.textMuted)};
  font-size: 13px;
  font-weight: 700;
`;
const AmountCard = styled.View`
  border-radius: 18px;
  padding: 20px;
  margin-bottom: ${hp(1.5)}px;
  background-color: ${colors.surface};
  border-width: 1px;
  border-color: ${colors.surfaceBorder};
`;
const AmountInputRow = styled.View`
  flex-direction: row;
  align-items: center;
`;
const CurrencyLabel = styled.Text`
  color: ${colors.textMuted};
  font-size: 18px;
  font-weight: 700;
  margin-right: 8px;
`;
const AmountInput = styled.TextInput`
  flex: 1;
  color: ${colors.textPrimary};
  font-size: 32px;
  font-weight: 800;
  padding: 0;
`;
const ConversionCard = styled.View`
  border-radius: 14px;
  padding: 14px;
  margin-bottom: ${hp(3)}px;
  background-color: rgba(108, 92, 231, 0.1);
  border-width: 1px;
  border-color: rgba(108, 92, 231, 0.3);
`;
const ConversionRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;
const ConversionLabel = styled.Text`
  color: ${colors.textMuted};
  font-size: 12.5px;
`;
const ConversionValue = styled.Text`
  color: ${colors.textPrimary};
  font-size: 15px;
  font-weight: 700;
`;
const InsufficientText = styled.Text`
  color: ${colors.danger};
  font-size: 12px;
  margin-top: 6px;
`;
const WarningCard = styled.View`
  flex-direction: row;
  gap: 10px;
  padding: 12px;
  border-radius: 14px;
  margin-bottom: ${hp(2)}px;
  background-color: rgba(255, 107, 107, 0.1);
  border-width: 1px;
  border-color: rgba(255, 107, 107, 0.25);
`;
const WarningText = styled.Text`
  flex: 1;
  color: ${colors.textPrimary};
  font-size: 12px;
  line-height: 17px;
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

interface RouteParams {
  record: ApiWalletRecord;
  network?: WalletNetwork;
  usdtBalance?: number;
}

export default function WalletWithdrawPix() {
  const navigation = useNavigation();
  const { navigate, goBack } = navigation;
  const route = useRoute();
  const { showToast } = useToast();
  const params = (route.params ?? {}) as RouteParams;
  const record = params.record;

  const [selectedNetwork, setSelectedNetwork] = useState<WalletNetwork>(
    params.network ?? "POLYGON",
  );
  const usdtBalance = params.usdtBalance ?? 0;
  const [amountBrl, setAmountBrl] = useState("");
  const [quote, setQuote] = useState<SwapQuote | null>(null);
  const [ticker, setTicker] = useState(2.5);
  const [loadingQuote, setLoadingQuote] = useState(true);
  const [timeLeft, setTimeLeft] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const usdtNeeded = React.useMemo(() => {
    if (!quote || !amountBrl) return 0;
    const brl = parseFloat(amountBrl.replace(",", "."));
    if (!brl || brl <= 0) return 0;
    return calculateUsdtNeeded({
      amountBrl: brl,
      priceUsd: parseFloat(quote.price_usd),
      tickerPercent: ticker,
    });
  }, [quote, amountBrl, ticker]);

  const hasSufficientBalance = usdtNeeded > 0 && usdtBalance >= usdtNeeded;
  const canProceed =
    hasSufficientBalance && !!quote && timeLeft > 0 && !!amountBrl;

  const loadQuote = useCallback(async () => {
    setLoadingQuote(true);
    try {
      const [q, t] = await Promise.all([
        fetchSwapQuote(1),
        fetchNetworkTicker(),
      ]);
      setQuote(q);
      setTimeLeft(q.timeout);
      setTicker(selectedNetwork === "POLYGON" ? t.polygon : t.plasma);
    } catch {
      showToast({
        message: "Não foi possível carregar a cotação.",
        type: "error",
      });
    } finally {
      setLoadingQuote(false);
    }
  }, [selectedNetwork, showToast]);

  useEffect(() => {
    loadQuote();
  }, [loadQuote]);

  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (timeLeft <= 0) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timeLeft]);

  const formatTimer = (s: number) =>
    `${Math.floor(s / 60)
      .toString()
      .padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  const handleProceed = useCallback(() => {
    if (!canProceed || !quote) return;
    navigate(
      "WalletWithdrawPixForm" as never,
      {
        record,
        network: selectedNetwork,
        amountBrl: parseFloat(amountBrl.replace(",", ".")),
        usdtNeeded,
        quote,
      } as never,
    );
  }, [
    canProceed,
    quote,
    amountBrl,
    usdtNeeded,
    selectedNetwork,
    record,
    navigate,
  ]);

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
            <HeaderTitle>Saque PIX</HeaderTitle>
          </Header>

          <ScrollContent
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 24 }}
          >
            <SectionLabel>REDE</SectionLabel>
            <NetworkRow>
              {(["POLYGON", "PLASMA"] as WalletNetwork[]).map((net) => (
                <NetworkChip
                  key={net}
                  selected={selectedNetwork === net}
                  onPress={() => setSelectedNetwork(net)}
                  activeOpacity={0.75}
                >
                  <NetworkChipText selected={selectedNetwork === net}>
                    {net}
                  </NetworkChipText>
                </NetworkChip>
              ))}
            </NetworkRow>

            <SectionLabel>COTAÇÃO ATUAL</SectionLabel>
            {loadingQuote ? (
              <ActivityIndicator
                color={colors.primary}
                style={{ marginBottom: hp(2) }}
              />
            ) : quote ? (
              <QuoteCard>
                <QuoteRow>
                  <QuoteLabel>1 USDT vale</QuoteLabel>
                  <QuoteValue>
                    R$ {parseFloat(quote.price_usd).toFixed(4)}
                  </QuoteValue>
                </QuoteRow>
                <QuoteRow>
                  <QuoteLabel>Taxa da operação</QuoteLabel>
                  <QuoteValue>R$ {quote.fee_brl}</QuoteValue>
                </QuoteRow>
                <QuoteRow>
                  <QuoteLabel>Markup da rede ({selectedNetwork})</QuoteLabel>
                  <QuoteValue>{ticker}%</QuoteValue>
                </QuoteRow>
                <TimerRow>
                  <Clock
                    size={14}
                    color={timeLeft <= 60 ? colors.danger : colors.textMuted}
                    strokeWidth={2.2}
                  />
                  <TimerText warn={timeLeft <= 60}>
                    Cotação expira em {formatTimer(timeLeft)}
                  </TimerText>
                  <RefreshButton onPress={loadQuote} activeOpacity={0.7}>
                    <RefreshCw
                      size={13}
                      color={colors.primary}
                      strokeWidth={2.2}
                    />
                    <RefreshText>Atualizar</RefreshText>
                  </RefreshButton>
                </TimerRow>
              </QuoteCard>
            ) : (
              <WarningCard>
                <AlertTriangle
                  size={16}
                  color={colors.danger}
                  strokeWidth={2.2}
                />
                <WarningText>
                  Não foi possível carregar a cotação. Toque em Atualizar.
                </WarningText>
              </WarningCard>
            )}

            <SectionLabel>QUANTO QUER RECEBER?</SectionLabel>
            <AmountCard>
              <AmountInputRow>
                <CurrencyLabel>R$</CurrencyLabel>
                <AmountInput
                  placeholder="0,00"
                  placeholderTextColor="rgba(255,255,255,0.25)"
                  keyboardType="decimal-pad"
                  value={amountBrl}
                  onChangeText={setAmountBrl}
                />
              </AmountInputRow>
            </AmountCard>

            {usdtNeeded > 0 && (
              <ConversionCard>
                <ConversionRow>
                  <ConversionLabel>Você vai enviar</ConversionLabel>
                  <ConversionValue>
                    {usdtNeeded.toFixed(2)} USDT
                  </ConversionValue>
                </ConversionRow>
                <ConversionRow style={{ marginTop: 6 }}>
                  <ConversionLabel>
                    Seu saldo ({selectedNetwork})
                  </ConversionLabel>
                  <ConversionValue>
                    {usdtBalance.toFixed(2)} USDT
                  </ConversionValue>
                </ConversionRow>
                {!hasSufficientBalance && (
                  <InsufficientText>
                    Saldo insuficiente — faltam{" "}
                    {(usdtNeeded - usdtBalance).toFixed(2)} USDT.
                  </InsufficientText>
                )}
              </ConversionCard>
            )}

            {timeLeft === 0 && quote && (
              <WarningCard>
                <AlertTriangle
                  size={16}
                  color={colors.danger}
                  strokeWidth={2.2}
                />
                <WarningText>
                  Cotação expirada. Atualize antes de continuar.
                </WarningText>
              </WarningCard>
            )}

            <PrimaryButton
              onPress={handleProceed}
              disabled={!canProceed}
              activeOpacity={0.85}
            >
              <PrimaryButtonText>Continuar</PrimaryButtonText>
              <ArrowRight size={18} color="#FFFFFF" strokeWidth={2.2} />
            </PrimaryButton>
          </ScrollContent>
        </SafeArea>
      </Background>
    </Container>
  );
}

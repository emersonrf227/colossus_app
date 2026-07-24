import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  StatusBar,
  ActivityIndicator,
  Clipboard,
  Modal,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import {
  ArrowLeft,
  RefreshCw,
  ArrowRight,
  AlertTriangle,
  Clock,
  QrCode,
  ClipboardPaste,
  X,
  CheckCircle,
} from "lucide-react-native";
import styled from "styled-components/native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Platform, StatusBar as RNStatusBar } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useToast } from "@/hook/Toast";
import {
  fetchSwapQuote,
  fetchNetworkTicker,
  calculateUsdtNeeded,
  decodeBrCode,
  SwapQuote,
  WalletNetwork,
  DecodedBrCode,
} from "../../../components/pix/pixService";
import { ApiWalletRecord } from "../../../components/wallet/walletStatus";
import { colors } from "../dashboard/styles";
import LogoSvg from "@/assets/logov2.svg";
import {
  enabledNetworks,
  fetchPixChains,
} from "@/components/wallet/chainSerives";
import { CardLogo } from "../walletExport";
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

// Copia e Cola
const CopyPasteCard = styled.View`
  border-radius: 16px;
  padding: 14px;
  margin-bottom: ${hp(2)}px;
  background-color: ${colors.surface};
  border-width: 1px;
  border-color: ${colors.surfaceBorder};
`;
const CopyPasteTitle = styled.Text`
  color: ${colors.textMuted};
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1px;
  margin-bottom: 10px;
`;
const CopyPasteActions = styled.View`
  flex-direction: row;
  gap: 10px;
`;
const CopyPasteButton = styled.TouchableOpacity`
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding-vertical: 12px;
  border-radius: 12px;
  background-color: rgba(108, 92, 231, 0.15);
  border-width: 1px;
  border-color: ${colors.primary};
`;
const CopyPasteButtonText = styled.Text`
  color: ${colors.primary};
  font-size: 12.5px;
  font-weight: 700;
`;
const DecodedCard = styled.View`
  border-radius: 14px;
  padding: 12px 14px;
  margin-top: 10px;
  background-color: rgba(46, 204, 113, 0.1);
  border-width: 1px;
  border-color: rgba(46, 204, 113, 0.3);
`;
const DecodedRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3px;
`;
const DecodedLabel = styled.Text`
  color: ${colors.textMuted};
  font-size: 12px;
`;
const DecodedValue = styled.Text`
  color: ${colors.textPrimary};
  font-size: 13px;
  font-weight: 700;
`;
const DecodedAmountNote = styled.Text`
  color: ${colors.success};
  font-size: 11.5px;
  margin-top: 6px;
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

export const cardLogo = styled.View`
  align-items: center;
  margin-top: ${hp(0.5)}px;
  margin-bottom: ${hp(1)}px;
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
  balances?: { POLYGON: number; PLASMA: number };
}

export default function WalletWithdrawPix() {
  const navigation = useNavigation();
  const { navigate, goBack } = navigation;
  const route = useRoute();
  const { showToast } = useToast();
  const { t } = useTranslation();
  const params = (route.params ?? {}) as RouteParams;
  const record = params.record;

  const [selectedNetwork, setSelectedNetwork] = useState<WalletNetwork>(
    params.network ?? "POLYGON",
  );
  const [availableNetworks, setAvailableNetworks] = useState<WalletNetwork[]>([
    "POLYGON",
  ]);

  // Carrega redes habilitadas para PIX via API
  React.useEffect(() => {
    fetchPixChains().then((chains) => {
      const nets = enabledNetworks(chains);
      setAvailableNetworks(nets.length > 0 ? nets : ["POLYGON"]);
      // Se a rede padrão não estiver habilitada, seleciona a primeira disponível
      if (nets.length > 0 && !nets.includes(selectedNetwork)) {
        setSelectedNetwork(nets[0]);
      }
    });
  }, []);
  const usdtBalance = React.useMemo(() => {
    if (params.balances) return params.balances[selectedNetwork] ?? 0;
    return params.usdtBalance ?? 0;
  }, [selectedNetwork, params.balances, params.usdtBalance]);

  const [amountBrl, setAmountBrl] = useState("");
  const [amountLocked, setAmountLocked] = useState(false); // true quando vem do QR com valor fixo
  const [quote, setQuote] = useState<SwapQuote | null>(null);
  const [ticker, setTicker] = useState(2.5);
  const [loadingQuote, setLoadingQuote] = useState(true);
  const [timeLeft, setTimeLeft] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Copia e Cola / QR
  const [decodedPix, setDecodedPix] = useState<DecodedBrCode | null>(null);
  const [emvRaw, setEmvRaw] = useState<string>(""); // string original do QR/copia e cola
  const [decoding, setDecoding] = useState(false);
  const [qrModalVisible, setQrModalVisible] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();

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
        message: t("walletWithdrawPix.quoteLoadError"),
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

  // Decodifica o EMV (copia e cola ou QR) e preenche os campos
  const handleDecodeEmv = useCallback(
    async (emv: string) => {
      if (!emv.trim()) return;
      setDecoding(true);
      setEmvRaw(emv.trim()); // guarda o EMV original para passar para a próxima tela
      try {
        const decoded = await decodeBrCode(emv.trim());
        setDecodedPix(decoded);

        // Se o QR/código tem valor fixo, preenche e bloqueia o campo
        if (decoded.transactionAmount && decoded.transactionAmount > 0) {
          setAmountBrl(decoded.transactionAmount.toFixed(2).replace(".", ","));
          setAmountLocked(true);
        } else {
          setAmountLocked(false);
        }

        showToast({
          message: `PIX identificado: ${decoded.merchantName}`,
          type: "success",
        });
      } catch {
        showToast({
          message: "Código PIX inválido ou não reconhecido.",
          type: "error",
        });
        setDecodedPix(null);
        setEmvRaw("");
        setAmountLocked(false);
      } finally {
        setDecoding(false);
      }
    },
    [showToast],
  );

  const handlePasteEmv = useCallback(async () => {
    try {
      const text = await Clipboard.getString();
      if (!text.trim()) {
        showToast({
          message: t("walletWithdrawPix.clipboardEmpty"),
          type: "error",
        });
        return;
      }
      await handleDecodeEmv(text);
    } catch {
      showToast({
        message: t("walletWithdrawPix.clipboardError"),
        type: "error",
      });
    }
  }, [handleDecodeEmv, showToast]);

  const handleOpenQr = useCallback(async () => {
    if (!permission?.granted) {
      const result = await requestPermission();
      if (!result.granted) {
        showToast({
          message: t("walletWithdrawPix.cameraPermission"),
          type: "error",
        });
        return;
      }
    }
    setScanned(false);
    setQrModalVisible(true);
  }, [permission, requestPermission, showToast]);

  const handleQrScanned = useCallback(
    async ({ data }: { data: string }) => {
      if (scanned) return;
      setScanned(true);
      setQrModalVisible(false);
      await handleDecodeEmv(data);
    },
    [scanned, handleDecodeEmv],
  );

  const handleClearPix = useCallback(() => {
    setDecodedPix(null);
    setEmvRaw("");
    setAmountBrl("");
    setAmountLocked(false);
  }, []);

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
        // Passa o EMV completo com tipo COPYPASTE — a próxima tela
        // usa a string inteira como chave, não a pixKey extraída.
        prefilledPix: decodedPix
          ? {
              pixKey: emvRaw,
              keyType: "COPYPASTE" as const,
              merchantName: decodedPix.merchantName,
            }
          : undefined,
      } as never,
    );
  }, [
    canProceed,
    quote,
    amountBrl,
    usdtNeeded,
    selectedNetwork,
    record,
    decodedPix,
    emvRaw,
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
            <HeaderTitle>{t("walletWithdrawPix.title")}</HeaderTitle>
          </Header>
          <CardLogo>
            <LogoSvg width={wp(34)} height={hp(19)} />
          </CardLogo>
          <ScrollContent
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 24 }}
          >
            <SectionLabel>{t("walletWithdrawPix.networkLabel")}</SectionLabel>
            <NetworkRow>
              {availableNetworks.map((net) => (
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

            <SectionLabel>{t("walletWithdrawPix.quoteLabel")}</SectionLabel>
            {loadingQuote ? (
              <ActivityIndicator
                color={colors.primary}
                style={{ marginBottom: hp(2) }}
              />
            ) : quote ? (
              <QuoteCard>
                <QuoteRow>
                  <QuoteLabel>{t("walletWithdrawPix.usdtValue")}</QuoteLabel>
                  <QuoteValue>
                    R$ {parseFloat(quote.price_usd).toFixed(4)}
                  </QuoteValue>
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
                    <RefreshText>{t("walletWithdrawPix.refresh")}</RefreshText>
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

            {/* Copia e Cola / QR — identifica o PIX e preenche o valor se fixo */}
            <SectionLabel>{t("walletWithdrawPix.pixCodeLabel")}</SectionLabel>
            <CopyPasteCard>
              <CopyPasteTitle>
                {t("walletWithdrawPix.pixCodeTitle")}
              </CopyPasteTitle>
              <CopyPasteActions>
                <CopyPasteButton
                  onPress={handlePasteEmv}
                  activeOpacity={0.75}
                  disabled={decoding}
                >
                  <ClipboardPaste
                    size={16}
                    color={colors.primary}
                    strokeWidth={2.2}
                  />
                  <CopyPasteButtonText>
                    {decoding
                      ? t("walletWithdrawPix.decoding")
                      : t("walletWithdrawPix.pasteButton")}
                  </CopyPasteButtonText>
                </CopyPasteButton>
                <CopyPasteButton
                  onPress={handleOpenQr}
                  activeOpacity={0.75}
                  disabled={decoding}
                >
                  <QrCode size={16} color={colors.primary} strokeWidth={2.2} />
                  <CopyPasteButtonText>
                    {t("walletWithdrawPix.scanButton")}
                  </CopyPasteButtonText>
                </CopyPasteButton>
              </CopyPasteActions>

              {decodedPix && (
                <DecodedCard>
                  <DecodedRow>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      <CheckCircle
                        size={14}
                        color={colors.success}
                        strokeWidth={2.2}
                      />
                      <DecodedLabel>
                        {t("walletWithdrawPix.pixDetected")}
                      </DecodedLabel>
                    </View>
                    <TouchableOpacity
                      onPress={handleClearPix}
                      activeOpacity={0.7}
                    >
                      <X size={14} color={colors.textMuted} strokeWidth={2.2} />
                    </TouchableOpacity>
                  </DecodedRow>
                  <DecodedRow>
                    <DecodedLabel>
                      {t("walletWithdrawPix.beneficiary")}
                    </DecodedLabel>
                    <DecodedValue>{decodedPix.merchantName}</DecodedValue>
                  </DecodedRow>
                  <DecodedRow>
                    <DecodedLabel>{t("walletWithdrawPix.city")}</DecodedLabel>
                    <DecodedValue>{decodedPix.merchantCity}</DecodedValue>
                  </DecodedRow>
                  {amountLocked && (
                    <DecodedAmountNote>
                      ✓ Valor fixo de R${" "}
                      {decodedPix.transactionAmount?.toFixed(2)} preenchido
                      automaticamente
                    </DecodedAmountNote>
                  )}
                </DecodedCard>
              )}
            </CopyPasteCard>

            {/* Valor — bloqueado se o QR já tem valor fixo */}
            <SectionLabel>{t("walletWithdrawPix.amountLabel")}</SectionLabel>
            <AmountCard>
              <AmountInputRow>
                <CurrencyLabel>R$</CurrencyLabel>
                <AmountInput
                  placeholder={t("walletWithdrawPix.amountPlaceholder")}
                  placeholderTextColor="rgba(255,255,255,0.25)"
                  keyboardType="decimal-pad"
                  value={amountBrl}
                  onChangeText={amountLocked ? undefined : setAmountBrl}
                  editable={!amountLocked}
                  style={{ opacity: amountLocked ? 0.6 : 1 }}
                />
              </AmountInputRow>
              {amountLocked && (
                <Text
                  style={{
                    color: colors.textMuted,
                    fontSize: 11,
                    marginTop: 4,
                  }}
                >
                  Valor fixo definido pelo QR Code
                </Text>
              )}
            </AmountCard>

            {usdtNeeded > 0 && (
              <ConversionCard>
                <ConversionRow>
                  <ConversionLabel>
                    {t("walletWithdrawPix.youSend")}
                  </ConversionLabel>
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
              <PrimaryButtonText>
                {t("walletWithdrawPix.continueButton")}
              </PrimaryButtonText>
              <ArrowRight size={18} color="#FFFFFF" strokeWidth={2.2} />
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

      {/* Modal câmera QR */}
      <Modal
        visible={qrModalVisible}
        animationType="slide"
        onRequestClose={() => setQrModalVisible(false)}
      >
        <View style={styles.qrContainer}>
          <CameraView
            style={StyleSheet.absoluteFillObject}
            facing="back"
            barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
            onBarcodeScanned={scanned ? undefined : handleQrScanned}
          />
          <View style={styles.overlay}>
            <View style={styles.overlayTop} />
            <View style={styles.overlayMiddle}>
              <View style={styles.overlaySide} />
              <View style={styles.scanArea}>
                <View style={[styles.corner, styles.cornerTL]} />
                <View style={[styles.corner, styles.cornerTR]} />
                <View style={[styles.corner, styles.cornerBL]} />
                <View style={[styles.corner, styles.cornerBR]} />
              </View>
              <View style={styles.overlaySide} />
            </View>
            <View style={styles.overlayBottom}>
              <Text style={styles.hint}>{t("walletWithdrawPix.qrHint")}</Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => setQrModalVisible(false)}
            style={styles.closeButton}
          >
            <X size={22} color="#FFFFFF" strokeWidth={2.2} />
          </TouchableOpacity>
        </View>
      </Modal>
    </Container>
  );
}

const SCAN_SIZE = 240;
const styles = StyleSheet.create({
  qrContainer: { flex: 1, backgroundColor: "#000" },
  overlay: { ...StyleSheet.absoluteFillObject, flexDirection: "column" },
  overlayTop: { flex: 1, backgroundColor: "rgba(0,0,0,0.6)" },
  overlayMiddle: { flexDirection: "row", height: SCAN_SIZE },
  overlaySide: { flex: 1, backgroundColor: "rgba(0,0,0,0.6)" },
  scanArea: { width: SCAN_SIZE, height: SCAN_SIZE },
  overlayBottom: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    alignItems: "center",
    paddingTop: 28,
  },
  hint: { color: "#FFFFFF", fontSize: 14, opacity: 0.8 },
  corner: {
    position: "absolute",
    width: 24,
    height: 24,
    borderColor: "#6C5CE7",
    borderWidth: 3,
  },
  cornerTL: { top: 0, left: 0, borderRightWidth: 0, borderBottomWidth: 0 },
  cornerTR: { top: 0, right: 0, borderLeftWidth: 0, borderBottomWidth: 0 },
  cornerBL: { bottom: 0, left: 0, borderRightWidth: 0, borderTopWidth: 0 },
  cornerBR: { bottom: 0, right: 0, borderLeftWidth: 0, borderTopWidth: 0 },
  closeButton: {
    position: "absolute",
    top: 52,
    left: 20,
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.15)",
  },
});

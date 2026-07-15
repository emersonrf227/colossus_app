import React, { useState, useCallback, useMemo } from "react";
import {
  Clipboard,
  StatusBar,
  Modal,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  ArrowLeft,
  ClipboardPaste,
  Send,
  Network as NetworkIcon,
  QrCode,
  X,
} from "lucide-react-native";
import { isAddress } from "ethers";
import { useTranslation } from "react-i18next";
import { CameraView, useCameraPermissions } from "expo-camera";

import * as S from "./styles";
import PinConfirmModal from "../PinConfirmModal";
import { useToast } from "@/hook/Toast";
import Loader from "@/components/loader";
import {
  withdrawCrypto,
  WithdrawError,
} from "../../../components/wallet/walletTransactions";
import {
  fetchAllNetworkBalances,
  NetworkBalance,
} from "../../../components/wallet/walletBalances";
import {
  ALL_WALLET_NETWORKS,
  getNetworkConfig,
  WalletNetworkKey,
} from "../../../components/wallet/walletProviders";
import { ApiWalletRecord } from "../../../components/wallet/walletStatus";
import { colors } from "../dashboard/styles";
import LogoSvg from "@/assets/logov2.svg";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

interface RouteParams {
  record: ApiWalletRecord;
}

const SCAN_SIZE = 240;

export default function WalletWithdraw() {
  const navigation = useNavigation();
  const { navigate, goBack } = navigation;
  const route = useRoute();
  const { showToast } = useToast();
  const { t } = useTranslation();
  const { record } = route.params as RouteParams;

  const [selectedNetwork, setSelectedNetwork] =
    useState<WalletNetworkKey>("polygon");
  const [toAddress, setToAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [memo, setMemo] = useState("");
  const [balances, setBalances] = useState<NetworkBalance[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [pinModalVisible, setPinModalVisible] = useState(false);
  const [qrVisible, setQrVisible] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();

  React.useEffect(() => {
    fetchAllNetworkBalances(record.address).then(({ balances: fetched }) =>
      setBalances(fetched),
    );
  }, [record.address]);

  const selectedBalance = useMemo(
    () => balances.find((b) => b.network === selectedNetwork),
    [balances, selectedNetwork],
  );

  const handlePasteAddress = useCallback(async () => {
    try {
      const text = await Clipboard.getString();
      setToAddress(text.trim());
    } catch {
      showToast({ message: t("walletWithdraw.clipboardError"), type: "error" });
    }
  }, [showToast, t]);

  const handleOpenQr = useCallback(async () => {
    if (!permission?.granted) {
      const result = await requestPermission();
      if (!result.granted) {
        showToast({
          message: t("walletWithdraw.cameraPermission"),
          type: "error",
        });
        return;
      }
    }
    setScanned(false);
    setQrVisible(true);
  }, [permission, requestPermission, showToast, t]);

  const handleQrScanned = useCallback(
    ({ data }: { data: string }) => {
      if (scanned) return;
      setScanned(true);
      setQrVisible(false);

      // Suporte a URIs tipo: ethereum:0x...?amount=1.0&memo=texto
      let address = data.trim();
      if (address.toLowerCase().startsWith("ethereum:")) {
        address = address.replace(/^ethereum:/i, "").split("?")[0];
      }

      if (isAddress(address)) {
        setToAddress(address);
        showToast({ message: t("walletWithdraw.qrSuccess"), type: "success" });
      } else {
        showToast({ message: t("walletWithdraw.qrInvalid"), type: "error" });
      }
    },
    [scanned, showToast, t],
  );

  const handleMax = useCallback(() => {
    if (selectedBalance) setAmount(selectedBalance.usdtBalance);
  }, [selectedBalance]);

  const validateForm = useCallback((): string | null => {
    if (!isAddress(toAddress)) return t("walletWithdraw.invalidAddress");
    const numericAmount = parseFloat(amount.replace(",", "."));
    if (!numericAmount || numericAmount <= 0)
      return t("walletWithdraw.invalidAmount");
    if (
      selectedBalance &&
      numericAmount > parseFloat(selectedBalance.usdtBalance)
    )
      return t("walletWithdraw.insufficientBalance");
    return null;
  }, [toAddress, amount, selectedBalance, t]);

  const handleSubmitPress = useCallback(() => {
    const error = validateForm();
    if (error) {
      showToast({ message: error, type: "error" });
      return;
    }
    setPinModalVisible(true);
  }, [validateForm, showToast]);

  const handlePinConfirmed = useCallback(async () => {
    setPinModalVisible(false);
    setSubmitting(true);
    try {
      const result = await withdrawCrypto({
        network: selectedNetwork,
        toAddress,
        amount,
        memo: memo.trim() || undefined,
      });
      showToast({ message: t("walletWithdraw.successToast"), type: "success" });
      navigate(
        "WalletWithdrawSuccess" as never,
        { txid: result.txid, explorerUrl: result.explorerUrl } as never,
      );
    } catch (error: any) {
      const message =
        error instanceof WithdrawError
          ? error.message
          : t("walletWithdraw.errorToast");
      showToast({ message, type: "error" });
    } finally {
      setSubmitting(false);
    }
  }, [selectedNetwork, toAddress, amount, memo, showToast, navigate, t]);

  return (
    <S.Container>
      {submitting && <Loader />}
      <S.Background source={require("@/assets/background.png")}>
        <S.BackgroundOverlay />
        <StatusBar
          barStyle="light-content"
          backgroundColor="transparent"
          translucent
        />
        <S.SafeArea>
          <S.Header>
            <S.BackButton onPress={() => goBack()} activeOpacity={0.7}>
              <ArrowLeft size={22} color="#FFFFFF" strokeWidth={2.2} />
            </S.BackButton>
            <S.HeaderTitle>{t("walletWithdraw.title")}</S.HeaderTitle>
          </S.Header>
          <S.cardLogo>
            <LogoSvg width={wp(34)} height={hp(19)} />
          </S.cardLogo>

          <S.ScrollContent
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 24 }}
          >
            {/* Rede */}
            <S.SectionLabel>{t("walletWithdraw.networkLabel")}</S.SectionLabel>
            <S.NetworkRow>
              {ALL_WALLET_NETWORKS.map((networkKey) => {
                const config = getNetworkConfig(networkKey);
                const balance = balances.find((b) => b.network === networkKey);
                const isSelected = selectedNetwork === networkKey;
                return (
                  <S.NetworkChip
                    key={networkKey}
                    selected={isSelected}
                    onPress={() => setSelectedNetwork(networkKey)}
                    activeOpacity={0.75}
                  >
                    <NetworkIcon
                      size={18}
                      color={isSelected ? colors.primary : colors.textMuted}
                      strokeWidth={2.2}
                    />
                    <S.NetworkChipText selected={isSelected}>
                      {config.label}
                    </S.NetworkChipText>
                    {balance && (
                      <S.NetworkChipBalance>
                        {parseFloat(balance.usdtBalance).toFixed(2)} USDT
                      </S.NetworkChipBalance>
                    )}
                  </S.NetworkChip>
                );
              })}
            </S.NetworkRow>

            {/* Endereço */}
            <S.SectionLabel>{t("walletWithdraw.addressLabel")}</S.SectionLabel>
            <S.InputWrapper>
              <S.StyledInput
                placeholder={t("walletWithdraw.addressPlaceholder")}
                placeholderTextColor="rgba(255,255,255,0.35)"
                value={toAddress}
                onChangeText={setToAddress}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <S.PasteButton onPress={handlePasteAddress} activeOpacity={0.7}>
                <ClipboardPaste
                  size={18}
                  color={colors.primary}
                  strokeWidth={2.2}
                />
              </S.PasteButton>
              <S.PasteButton
                onPress={handleOpenQr}
                activeOpacity={0.7}
                style={{ marginLeft: 4 }}
              >
                <QrCode size={18} color={colors.primary} strokeWidth={2.2} />
              </S.PasteButton>
            </S.InputWrapper>

            {/* Valor */}
            <S.SectionLabel>{t("walletWithdraw.amountLabel")}</S.SectionLabel>
            <S.AmountRow>
              <S.AmountInput
                placeholder={t("walletWithdraw.amountPlaceholder")}
                placeholderTextColor="rgba(255,255,255,0.3)"
                keyboardType="decimal-pad"
                value={amount}
                onChangeText={setAmount}
              />
              <S.AmountSuffix>USDT</S.AmountSuffix>
              <S.MaxButton onPress={handleMax} activeOpacity={0.7}>
                <S.MaxButtonText>
                  {t("walletWithdraw.maxButton")}
                </S.MaxButtonText>
              </S.MaxButton>
            </S.AmountRow>
            {selectedBalance && (
              <S.AvailableText>
                {t("walletWithdraw.available", {
                  amount: parseFloat(selectedBalance.usdtBalance).toFixed(2),
                })}
              </S.AvailableText>
            )}
            {selectedBalance?.lowGasWarning && (
              <S.WarningText>
                {t("walletWithdraw.lowGas", {
                  symbol: selectedBalance.nativeCurrencySymbol,
                })}
              </S.WarningText>
            )}

            {/* Memo */}
            <S.SectionLabel>{t("walletWithdraw.memoLabel")}</S.SectionLabel>
            <S.InputWrapper>
              <S.StyledInput
                placeholder={t("walletWithdraw.memoPlaceholder")}
                placeholderTextColor="rgba(255,255,255,0.3)"
                value={memo}
                onChangeText={setMemo}
                autoCapitalize="none"
                autoCorrect={false}
                maxLength={120}
              />
            </S.InputWrapper>
            <S.AvailableText>{t("walletWithdraw.memoNote")}</S.AvailableText>

            <S.SubmitButton
              onPress={handleSubmitPress}
              disabled={submitting}
              activeOpacity={0.85}
            >
              <Send size={18} color="#FFFFFF" strokeWidth={2.2} />
              <S.SubmitButtonText>
                {t("walletWithdraw.submitButton")}
              </S.SubmitButtonText>
            </S.SubmitButton>
          </S.ScrollContent>
        </S.SafeArea>
      </S.Background>

      {/* Modal QR Reader */}
      <Modal
        visible={qrVisible}
        animationType="slide"
        onRequestClose={() => setQrVisible(false)}
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
              <Text style={styles.hint}>{t("walletWithdraw.qrHint")}</Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => setQrVisible(false)}
            style={styles.closeButton}
          >
            <X size={22} color="#FFFFFF" strokeWidth={2.2} />
          </TouchableOpacity>
        </View>
      </Modal>

      <PinConfirmModal
        visible={pinModalVisible}
        title={t("walletWithdraw.pinTitle")}
        subtitle={t("walletWithdraw.pinSubtitle", { amount: amount || "0" })}
        onCancel={() => setPinModalVisible(false)}
        onConfirmed={handlePinConfirmed}
      />
    </S.Container>
  );
}

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

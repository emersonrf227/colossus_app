import React, { useState, useCallback, useMemo } from "react";
import { Clipboard, Modal, StatusBar, View, StyleSheet } from "react-native";
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
import { CameraView, useCameraPermissions } from "expo-camera";

import * as S from "./styles";
import PinConfirmModal from "../PinConfirmModal";
import { useToast } from "@/hook/Toast";
import Loader from "@/components/loader";
import {
  withdrawCrypto,
  WithdrawError,
} from "../../../components/wallet/walletTransactions_contransfer";
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

interface RouteParams {
  record: ApiWalletRecord;
}

export default function WalletWithdraw() {
  const navigation = useNavigation();
  const { navigate, goBack } = navigation;
  const route = useRoute();
  const { showToast } = useToast();

  const { record } = route.params as RouteParams;

  const [selectedNetwork, setSelectedNetwork] =
    useState<WalletNetworkKey>("polygon");
  const [toAddress, setToAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [balances, setBalances] = useState<NetworkBalance[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [pinModalVisible, setPinModalVisible] = useState(false);
  const [qrModalVisible, setQrModalVisible] = useState(false);
  const [scanned, setScanned] = useState(false);

  const [permission, requestPermission] = useCameraPermissions();

  React.useEffect(() => {
    fetchAllNetworkBalances(record.address).then(({ balances: fetched }) => {
      setBalances(fetched);
    });
  }, [record.address]);

  const selectedBalance = useMemo(
    () => balances.find((b) => b.network === selectedNetwork),
    [balances, selectedNetwork],
  );

  const handleOpenQr = useCallback(async () => {
    if (!permission?.granted) {
      const result = await requestPermission();
      if (!result.granted) {
        showToast({
          message: "Permissão de câmera necessária para ler QR codes.",
          type: "error",
        });
        return;
      }
    }
    setScanned(false);
    setQrModalVisible(true);
  }, [permission, requestPermission, showToast]);

  const handleQrScanned = useCallback(
    ({ data }: { data: string }) => {
      if (scanned) return;
      setScanned(true);
      setQrModalVisible(false);

      // Endereços EVM podem vir no formato "ethereum:0x..." ou só "0x..."
      let address = data.trim();
      if (address.toLowerCase().startsWith("ethereum:")) {
        address = address.split(":")[1].split("?")[0];
      }

      if (isAddress(address)) {
        setToAddress(address);
        showToast({ message: "Endereço lido com sucesso!", type: "success" });
      } else {
        showToast({
          message: "QR code não contém um endereço válido.",
          type: "error",
        });
      }
    },
    [scanned, showToast],
  );

  const handlePasteAddress = useCallback(async () => {
    try {
      const text = await Clipboard.getString();
      setToAddress(text.trim());
    } catch {
      showToast({
        message: "Não foi possível acessar a área de transferência",
        type: "error",
      });
    }
  }, [showToast]);

  const handleMax = useCallback(() => {
    if (selectedBalance) setAmount(selectedBalance.usdtBalance);
  }, [selectedBalance]);

  const validateForm = useCallback((): string | null => {
    if (!isAddress(toAddress)) return "Endereço de destino inválido.";
    const numericAmount = parseFloat(amount.replace(",", "."));
    if (!numericAmount || numericAmount <= 0) return "Informe um valor válido.";
    if (
      selectedBalance &&
      numericAmount > parseFloat(selectedBalance.usdtBalance)
    ) {
      return "Saldo insuficiente nesta rede.";
    }
    return null;
  }, [toAddress, amount, selectedBalance]);

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
      });
      showToast({ message: "Saque enviado com sucesso!", type: "success" });
      navigate(
        "WalletWithdrawSuccess" as never,
        {
          txid: result.txid,
          explorerUrl: result.explorerUrl,
        } as never,
      );
    } catch (error: any) {
      const message =
        error instanceof WithdrawError
          ? error.message
          : "Não foi possível concluir o saque.";
      showToast({ message, type: "error" });
    } finally {
      setSubmitting(false);
    }
  }, [selectedNetwork, toAddress, amount, showToast, navigate]);

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
            <S.HeaderTitle>Sacar USDT</S.HeaderTitle>
          </S.Header>

          <S.ScrollContent
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 24 }}
          >
            <S.SectionLabel>REDE</S.SectionLabel>
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

            <S.SectionLabel>ENDEREÇO DE DESTINO</S.SectionLabel>
            <S.InputWrapper>
              <S.StyledInput
                placeholder="0x..."
                placeholderTextColor="rgba(255,255,255,0.35)"
                value={toAddress}
                onChangeText={setToAddress}
                autoCapitalize="none"
                autoCorrect={false}
              />
              {/* Botão de QR */}
              <S.PasteButton onPress={handleOpenQr} activeOpacity={0.7}>
                <QrCode size={18} color={colors.primary} strokeWidth={2.2} />
              </S.PasteButton>
              {/* Botão de colar */}
              <S.PasteButton onPress={handlePasteAddress} activeOpacity={0.7}>
                <ClipboardPaste
                  size={18}
                  color={colors.textMuted}
                  strokeWidth={2.2}
                />
              </S.PasteButton>
            </S.InputWrapper>

            <S.SectionLabel>VALOR</S.SectionLabel>
            <S.AmountRow>
              <S.AmountInput
                placeholder="0.00"
                placeholderTextColor="rgba(255,255,255,0.3)"
                keyboardType="decimal-pad"
                value={amount}
                onChangeText={setAmount}
              />
              <S.AmountSuffix>USDT</S.AmountSuffix>
              <S.MaxButton onPress={handleMax} activeOpacity={0.7}>
                <S.MaxButtonText>MÁX.</S.MaxButtonText>
              </S.MaxButton>
            </S.AmountRow>
            {selectedBalance && (
              <S.AvailableText>
                Disponível: {parseFloat(selectedBalance.usdtBalance).toFixed(2)}{" "}
                USDT
              </S.AvailableText>
            )}
            {selectedBalance?.lowGasWarning && (
              <S.WarningText>
                Saldo de {selectedBalance.nativeCurrencySymbol} baixo — pode não
                ser suficiente para pagar a taxa da rede.
              </S.WarningText>
            )}

            <S.SubmitButton
              onPress={handleSubmitPress}
              disabled={submitting}
              activeOpacity={0.85}
            >
              <Send size={18} color="#FFFFFF" strokeWidth={2.2} />
              <S.SubmitButtonText>Revisar e sacar</S.SubmitButtonText>
            </S.SubmitButton>
          </S.ScrollContent>
        </S.SafeArea>
      </S.Background>

      {/* Modal de QR Code */}
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

          {/* Overlay com recorte central */}
          <View style={styles.overlay}>
            <View style={styles.overlayTop} />
            <View style={styles.overlayMiddle}>
              <View style={styles.overlaySide} />
              <View style={styles.scanArea}>
                {/* Cantos do recorte */}
                <View style={[styles.corner, styles.cornerTL]} />
                <View style={[styles.corner, styles.cornerTR]} />
                <View style={[styles.corner, styles.cornerBL]} />
                <View style={[styles.corner, styles.cornerBR]} />
              </View>
              <View style={styles.overlaySide} />
            </View>
            <View style={styles.overlayBottom}>
              <View style={styles.qrHint}></View>
            </View>
          </View>

          {/* Botão fechar */}
          <S.BackButton
            onPress={() => setQrModalVisible(false)}
            activeOpacity={0.7}
            style={styles.closeButton}
          >
            <X size={22} color="#FFFFFF" strokeWidth={2.2} />
          </S.BackButton>
        </View>
      </Modal>

      <PinConfirmModal
        visible={pinModalVisible}
        title="Confirme o saque"
        subtitle={`Você está enviando ${amount || "0"} USDT. Confirme o PIN para prosseguir.`}
        onCancel={() => setPinModalVisible(false)}
        onConfirmed={handlePinConfirmed}
      />
    </S.Container>
  );
}

const SCAN_SIZE = 240;

const styles = StyleSheet.create({
  qrContainer: {
    flex: 1,
    backgroundColor: "#000",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: "column",
  },
  overlayTop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  overlayMiddle: {
    flexDirection: "row",
    height: SCAN_SIZE,
  },
  overlaySide: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  scanArea: {
    width: SCAN_SIZE,
    height: SCAN_SIZE,
  },
  overlayBottom: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    alignItems: "center",
    paddingTop: 28,
  },
  qrHint: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.12)",
  },
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
  },
});

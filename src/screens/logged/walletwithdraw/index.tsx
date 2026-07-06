import React, { useState, useCallback, useMemo } from "react";
import { Clipboard, StatusBar } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  ArrowLeft,
  ClipboardPaste,
  Send,
  Network as NetworkIcon,
} from "lucide-react-native";
import { isAddress } from "ethers";
import { useTranslation } from "react-i18next";

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
  const [balances, setBalances] = useState<NetworkBalance[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [pinModalVisible, setPinModalVisible] = useState(false);

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
  }, [selectedNetwork, toAddress, amount, showToast, navigate, t]);

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
            <LogoSvg width={wp(38)} height={hp(11)} />
          </S.cardLogo>

          <S.ScrollContent
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 24 }}
          >
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
            </S.InputWrapper>

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

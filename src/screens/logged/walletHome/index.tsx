import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Clipboard,
  ActivityIndicator,
  StatusBar,
  RefreshControl,
} from "react-native";
import {
  useNavigation,
  useRoute,
  useFocusEffect,
} from "@react-navigation/native";
import {
  ArrowLeft,
  Eye,
  AlertTriangle,
  Send,
  Banknote,
  KeyRound,
  Copy,
  Network,
} from "lucide-react-native";
import { useTranslation } from "react-i18next";
import * as S from "./styles";
import { useToast } from "@/hook/Toast";
import {
  fetchAllNetworkBalances,
  NetworkBalance,
} from "../../../components/wallet/walletBalances";
import {
  getWalletStatus,
  WalletAccessMode,
  ApiWalletRecord,
} from "../../../components/wallet/walletStatus";
import {
  getNetworkConfig,
  WalletNetworkKey,
} from "../../../components/wallet/walletProviders";
import { colors } from "../dashboard/styles";
import LogoSvg from "@/assets/logov2.svg";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

interface RouteParams {
  mode: WalletAccessMode;
  record: ApiWalletRecord;
}

export default function WalletHome() {
  const navigation = useNavigation();
  const { navigate, goBack } = navigation;
  const route = useRoute();
  const { showToast } = useToast();
  const { t } = useTranslation();

  const params = (route.params ?? {}) as Partial<RouteParams>;
  const [mode, setMode] = useState<WalletAccessMode>(params.mode ?? "none");
  const [record, setRecord] = useState<ApiWalletRecord | null>(
    params.record ?? null,
  );
  const [loadingStatus, setLoadingStatus] = useState(
    !params.mode || !params.record,
  );
  const [balances, setBalances] = useState<NetworkBalance[]>([]);
  const [loadingBalances, setLoadingBalances] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [hasBalanceError, setHasBalanceError] = useState(false);
  const isFullAccess = mode === "full";

  const loadBalances = useCallback(
    async (isRefresh = false) => {
      if (!record?.address) return;
      if (isRefresh) setRefreshing(true);
      else setLoadingBalances(true);
      setHasBalanceError(false);
      try {
        const { balances: fetched, errors } = await fetchAllNetworkBalances(
          record.address,
        );
        setBalances(fetched);
        if (errors.length > 0 && fetched.length === 0) setHasBalanceError(true);
      } catch {
        setHasBalanceError(true);
      } finally {
        setLoadingBalances(false);
        setRefreshing(false);
      }
    },
    [record?.address],
  );

  useEffect(() => {
    if (loadingStatus) {
      getWalletStatus()
        .then((status) => {
          setMode(status.mode);
          if (status.record) setRecord(status.record);
          setLoadingStatus(false);
        })
        .catch(() => setLoadingStatus(false));
      return;
    }
    loadBalances();
  }, [loadingStatus, loadBalances]);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      getWalletStatus().then((status) => {
        if (!isActive) return;
        setMode(status.mode);
        if (status.record) setRecord(status.record);
      });
      loadBalances();
      return () => {
        isActive = false;
      };
    }, []),
  );

  const totalUsdt = useMemo(
    () =>
      balances.reduce((sum, b) => sum + parseFloat(b.usdtBalance || "0"), 0),
    [balances],
  );

  const copyAddress = useCallback(async () => {
    if (!record?.address) return;
    await Clipboard.setString(record.address);
    showToast({ message: t("wallet.addressCopied"), type: "success" });
  }, [record?.address, showToast, t]);

  const goToWithdraw = useCallback(() => {
    if (!record) return;
    navigate("WalletWithdraw" as never, { record } as never);
  }, [navigate, record]);

  const goToPix = useCallback(() => {
    if (!record) return;
    const polygonBalance = parseFloat(
      balances.find((b) => b.network === "polygon")?.usdtBalance ?? "0",
    );
    const plasmaBalance = parseFloat(
      balances.find((b) => b.network === "plasma")?.usdtBalance ?? "0",
    );
    const defaultNetwork = polygonBalance > 0 ? "POLYGON" : "PLASMA";
    const defaultBalance =
      defaultNetwork === "POLYGON" ? polygonBalance : plasmaBalance;
    navigate(
      "Walletwithdrawpix" as never,
      {
        record,
        network: defaultNetwork,
        usdtBalance: defaultBalance,
        balances: { POLYGON: polygonBalance, PLASMA: plasmaBalance },
      } as never,
    );
  }, [navigate, record, balances]);

  const goToExport = useCallback(() => {
    navigate("WalletExport" as never);
  }, [navigate]);

  return (
    <S.Container>
      <S.Background source={require("@/assets/background.png")}>
        <S.BackgroundOverlay />
        <StatusBar
          barStyle="light-content"
          backgroundColor="transparent"
          translucent
        />
        <S.SafeArea>
          <S.Header>
            <S.HeaderLeft>
              <S.BackButton onPress={() => goBack()} activeOpacity={0.7}>
                <ArrowLeft size={22} color="#FFFFFF" strokeWidth={2.2} />
              </S.BackButton>
              <S.HeaderTitle>{t("wallet.title")}</S.HeaderTitle>
            </S.HeaderLeft>
            {isFullAccess && (
              <S.IconButton onPress={goToExport} activeOpacity={0.7}>
                <KeyRound size={18} color="#FFFFFF" strokeWidth={2.2} />
              </S.IconButton>
            )}
          </S.Header>
          <S.cardLogo>
            <LogoSvg width={wp(38)} height={hp(11)} />
          </S.cardLogo>

          <S.ScrollContent
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 32 }}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => loadBalances(true)}
                tintColor={colors.primary}
              />
            }
          >
            {loadingStatus ? (
              <S.CenteredState>
                <ActivityIndicator color={colors.primary} size="large" />
              </S.CenteredState>
            ) : (
              <>
                {!isFullAccess && mode !== "none" && (
                  <S.ViewOnlyBanner>
                    <Eye size={16} color="#F7B731" strokeWidth={2.2} />
                    <S.ViewOnlyBannerText>
                      {t("wallet.viewOnly")}
                    </S.ViewOnlyBannerText>
                  </S.ViewOnlyBanner>
                )}
                <S.TotalCard>
                  <S.TotalLabel>{t("wallet.totalBalance")}</S.TotalLabel>
                  {loadingBalances ? (
                    <ActivityIndicator color={colors.primary} />
                  ) : (
                    <>
                      <S.TotalValue>{totalUsdt.toFixed(2)}</S.TotalValue>
                      <S.TotalSubvalue>
                        {t("wallet.allNetworks")}
                      </S.TotalSubvalue>
                    </>
                  )}
                </S.TotalCard>
                <S.AddressCard onPress={copyAddress} activeOpacity={0.7}>
                  <S.AddressText numberOfLines={1}>
                    {record?.address ?? ""}
                  </S.AddressText>
                  <Copy size={16} color={colors.primary} strokeWidth={2.2} />
                </S.AddressCard>
                {isFullAccess && (
                  <S.ActionsRow>
                    <S.ActionButton
                      accentColor={colors.primary}
                      onPress={goToWithdraw}
                      activeOpacity={0.75}
                    >
                      <S.ActionIconWrapper accentColor={colors.primary}>
                        <Send
                          size={18}
                          color={colors.primary}
                          strokeWidth={2.2}
                        />
                      </S.ActionIconWrapper>
                      <S.ActionButtonText accentColor={colors.primary}>
                        {t("wallet.withdraw")}
                      </S.ActionButtonText>
                    </S.ActionButton>
                    <S.ActionButton
                      accentColor={colors.success}
                      onPress={goToPix}
                      activeOpacity={0.75}
                    >
                      <S.ActionIconWrapper accentColor={colors.success}>
                        <Banknote
                          size={18}
                          color={colors.success}
                          strokeWidth={2.2}
                        />
                      </S.ActionIconWrapper>
                      <S.ActionButtonText accentColor={colors.success}>
                        {t("wallet.pix")}
                      </S.ActionButtonText>
                    </S.ActionButton>
                  </S.ActionsRow>
                )}
                <S.SectionLabel>{t("wallet.balanceByNetwork")}</S.SectionLabel>
                {hasBalanceError ? (
                  <S.CenteredState>
                    <AlertTriangle
                      size={24}
                      color={colors.textMuted}
                      strokeWidth={1.8}
                    />
                    <S.StateText>{t("wallet.balanceError")}</S.StateText>
                  </S.CenteredState>
                ) : (
                  balances.map((balance) => {
                    const config = getNetworkConfig(balance.network);
                    return (
                      <S.NetworkBalanceCard key={balance.network}>
                        <S.NetworkIconWrapper>
                          <Network
                            size={20}
                            color={colors.primary}
                            strokeWidth={2.2}
                          />
                        </S.NetworkIconWrapper>
                        <S.NetworkInfo>
                          <S.NetworkName>{config.label}</S.NetworkName>
                          {balance.lowGasWarning && isFullAccess && (
                            <S.NetworkGasWarning>
                              {t("wallet.lowGas", {
                                symbol: config.nativeCurrencySymbol,
                              })}
                            </S.NetworkGasWarning>
                          )}
                        </S.NetworkInfo>
                        <S.NetworkBalanceValue>
                          {parseFloat(balance.usdtBalance).toFixed(2)}
                        </S.NetworkBalanceValue>
                      </S.NetworkBalanceCard>
                    );
                  })
                )}
              </>
            )}
          </S.ScrollContent>
        </S.SafeArea>
      </S.Background>
    </S.Container>
  );
}

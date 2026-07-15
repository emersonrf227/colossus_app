import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Clipboard,
  ActivityIndicator,
  StatusBar,
  RefreshControl,
  View,
  Image,
  TouchableOpacity,
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
  QrCode,
  ArrowDownToLine,
  KeyRound,
  Copy,
  Network,
  History,
  Menu,
} from "lucide-react-native";
import styled from "styled-components/native";
import { useTranslation } from "react-i18next";

// SubTexto dos botões de ação (Blockchain / via PIX)
const ActionButtonSubText = styled.Text<{ accentColor?: string }>`
  color: ${({ accentColor }) => accentColor ?? colors.textMuted};
  font-size: 10px;
  font-weight: 600;
  opacity: 0.8;
  margin-top: 1px;
`;

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
import { fetchWalletChains } from "@/components/wallet/chainSerives";
import {
  isWalletSessionUnlocked,
  setWalletSessionUnlocked,
} from "@/components/wallet/walletSession";
import LogoSvg from "@/assets/logov2.svg";
import TetherLogo from "@/assets/networks/tether.png";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import GasSponsorModal from "../walletGasmodal";
import { needsGasSponsorship } from "@/components/gas/gasService";
import PinConfirmModal from "../PinConfirmModal";

const TetherBadge = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 5px;
  background-color: rgba(38, 161, 123, 0.15);
  border-width: 1px;
  border-color: rgba(38, 161, 123, 0.4);
  border-radius: 8px;
  padding: 3px 8px;
`;
const TetherLabel = styled.Text`
  color: #26a17b;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.3px;
`;
const CardLogoWrapper = styled.View`
  align-items: center;
  margin-bottom: 8px;
`;

function UsdtBadge({ size = "sm" }: { size?: "sm" | "md" }) {
  const imgSize = size === "md" ? 20 : 14;
  return (
    <TetherBadge
      style={size === "md" ? { paddingHorizontal: 10, paddingVertical: 5 } : {}}
    >
      <Image
        source={TetherLogo}
        style={{ width: imgSize, height: imgSize, resizeMode: "contain" }}
      />
      <TetherLabel style={size === "md" ? { fontSize: 13 } : {}}>
        USDT
      </TetherLabel>
    </TetherBadge>
  );
}

interface RouteParams {
  mode: WalletAccessMode;
  record: ApiWalletRecord;
}

export default function WalletHome() {
  const [pinVisible, setPinVisible] = useState(false);
  // Se o PIN já foi digitado nesta sessão, entra desbloqueado direto
  const [unlocked, setUnlocked] = useState(isWalletSessionUnlocked());
  const [blurred, setBlurred] = useState(true);

  const navigation = useNavigation();
  const { navigate, goBack } = navigation;
  const route = useRoute();
  const { showToast } = useToast();
  const { t } = useTranslation();
  const [showGasModal, setShowGasModal] = useState(false);

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
  const [enabledNetworkKeys, setEnabledNetworkKeys] = useState<string[]>([
    "polygon",
    "plasma",
  ]);

  const handlePinConfirmed = useCallback(async () => {
    setPinVisible(false);
    try {
      setUnlocked(true);
      setWalletSessionUnlocked(true);
      setBlurred(true);
    } catch {
      showToast({ message: t("walletExport.errorRecover"), type: "error" });
    }
  }, [showToast, t]);

  useEffect(() => {
    fetchWalletChains().then((chains) => {
      const nets: string[] = [];
      if (chains.polygon) nets.push("polygon");
      if (chains.plasma) nets.push("plasma");
      if (nets.length > 0) setEnabledNetworkKeys(nets);
    });
  }, []);

  // Roda o check de gás quando o endereço da wallet estiver disponível
  // (record é carregado de forma assíncrona — no mount ele pode ser null).
  useEffect(() => {
    if (record?.address) checkGas();
  }, [record?.address]);

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

  const toggleMenu = useCallback(() => {
    navigate("MenuScreen" as never);
  }, [navigate]);

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

  async function checkGas() {
    if (!record?.address) return;
    if (await needsGasSponsorship(record.address, "polygon")) {
      setShowGasModal(true);
    }
  }

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

  return (
    <S.Container>
      <S.Background source={require("@/assets/background.png")}>
        <S.BackgroundOverlay />
        <StatusBar
          barStyle="light-content"
          backgroundColor="transparent"
          translucent
        />

        {!unlocked ? (
          <S.LockedState>
            <S.IconWrapper>
              <Eye size={28} color={colors.primary} strokeWidth={2} />
            </S.IconWrapper>
            <S.LockedTitle>{t("walletExport.lockedTitle")}</S.LockedTitle>
            <S.LockedSubtitle>{t("wallet.modal.pinTitle")}</S.LockedSubtitle>
            <S.UnlockButton
              onPress={() => setPinVisible(true)}
              activeOpacity={0.85}
            >
              <S.UnlockButtonText>
                {t("walletExport.unlockButton")}
              </S.UnlockButtonText>
            </S.UnlockButton>
          </S.LockedState>
        ) : (
          <S.SafeArea>
            <S.Header>
              <S.HeaderLeft>
                <S.HeaderTitle>{t("wallet.title")}</S.HeaderTitle>
              </S.HeaderLeft>

              <>
                <S.MenuButton onPress={toggleMenu} activeOpacity={0.7}>
                  <Menu size={24} color="#FFFFFF" strokeWidth={2.2} />
                </S.MenuButton>
              </>
            </S.Header>

            <GasSponsorModal
              visible={showGasModal}
              network="polygon"
              backendAddress="0x8F466d0B8239aB675Bc393534dB88Ce2b2497A13"
              onClose={() => setShowGasModal(false)}
              onSuccess={() => loadBalances()}
            />

            <CardLogoWrapper>
              <LogoSvg width={wp(34)} height={hp(19)} />
            </CardLogoWrapper>

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
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: 8,
                      }}
                    >
                      <S.TotalLabel>{t("wallet.totalBalance")}</S.TotalLabel>
                      <UsdtBadge size="sm" />
                    </View>
                    {loadingBalances ? (
                      <ActivityIndicator color={colors.primary} />
                    ) : (
                      <>
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "baseline",
                            gap: 8,
                          }}
                        >
                          <S.TotalValue>{totalUsdt.toFixed(2)}</S.TotalValue>
                          <Image
                            source={TetherLogo}
                            style={{
                              width: 18,
                              height: 18,
                              resizeMode: "contain",
                            }}
                          />
                        </View>
                        <S.TotalSubvalue>
                          {t("wallet.usdtSubtitle")}
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
                        {t("wallet.sendButton")}
                      </S.ActionButtonText>
                      <ActionButtonSubText accentColor={colors.primary}>
                        {t("wallet.sendSubtitle")}
                      </ActionButtonSubText>
                    </S.ActionButton>
                    <S.ActionButton
                      accentColor={colors.accent}
                      onPress={() => navigate("getInfo" as never)}
                      activeOpacity={0.75}
                    >
                      <S.ActionIconWrapper accentColor={colors.accent}>
                        <ArrowDownToLine
                          size={18}
                          color={colors.accent}
                          strokeWidth={2.2}
                        />
                      </S.ActionIconWrapper>
                      <S.ActionButtonText accentColor={colors.accent}>
                        {t("wallet.receiveButton")}
                      </S.ActionButtonText>
                      <ActionButtonSubText accentColor={colors.accent}>
                        {t("wallet.receiveSubtitle")}
                      </ActionButtonSubText>
                    </S.ActionButton>
                    <S.ActionButton
                      accentColor={colors.success}
                      onPress={goToPix}
                      activeOpacity={0.75}
                    >
                      <S.ActionIconWrapper accentColor={colors.success}>
                        <QrCode
                          size={18}
                          color={colors.success}
                          strokeWidth={2.2}
                        />
                      </S.ActionIconWrapper>
                      <S.ActionButtonText accentColor={colors.success}>
                        {t("wallet.pixButton")}
                      </S.ActionButtonText>
                      <ActionButtonSubText accentColor={colors.success}>
                        {t("wallet.pixSubtitle")}
                      </ActionButtonSubText>
                    </S.ActionButton>
                  </S.ActionsRow>

                  <S.SectionLabel>
                    {t("wallet.balanceByNetwork")}
                  </S.SectionLabel>

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
                    balances
                      .filter((b) => enabledNetworkKeys.includes(b.network))
                      .map((balance) => {
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
                                <TouchableOpacity
                                  onPress={() => setShowGasModal(true)}
                                  activeOpacity={0.7}
                                >
                                  <S.NetworkGasWarning>
                                    {t("wallet.lowGas", {
                                      symbol: config.nativeCurrencySymbol,
                                    })}
                                    {"  ▸"}
                                  </S.NetworkGasWarning>
                                </TouchableOpacity>
                              )}
                            </S.NetworkInfo>
                            <View style={{ alignItems: "flex-end", gap: 4 }}>
                              <View
                                style={{
                                  flexDirection: "row",
                                  alignItems: "baseline",
                                  gap: 4,
                                }}
                              >
                                <S.NetworkBalanceValue>
                                  {parseFloat(balance.usdtBalance).toFixed(2)}
                                </S.NetworkBalanceValue>
                                <Image
                                  source={TetherLogo}
                                  style={{
                                    width: 14,
                                    height: 14,
                                    resizeMode: "contain",
                                  }}
                                />
                              </View>
                              <UsdtBadge size="sm" />
                            </View>
                          </S.NetworkBalanceCard>
                        );
                      })
                  )}
                </>
              )}
            </S.ScrollContent>
          </S.SafeArea>
        )}
      </S.Background>
      <PinConfirmModal
        visible={pinVisible}
        title={t("walletExport.pinTitle")}
        subtitle={t("wallet.modal.pinTitleModal")}
        onCancel={() => setPinVisible(false)}
        onConfirmed={handlePinConfirmed}
      />
    </S.Container>
  );
}

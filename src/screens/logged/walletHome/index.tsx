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
  History,
} from "lucide-react-native";

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

interface RouteParams {
  mode: WalletAccessMode;
  record: ApiWalletRecord;
}

export default function WalletHome() {
  const navigation = useNavigation();
  const { navigate, goBack } = navigation;
  const route = useRoute();
  const { showToast } = useToast();

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

  // Carrega redes habilitadas para wallet via API
  useEffect(() => {
    fetchWalletChains().then((chains) => {
      const nets: string[] = [];
      if (chains.polygon) nets.push("polygon");
      if (chains.plasma) nets.push("plasma");
      if (nets.length > 0) setEnabledNetworkKeys(nets);
    });
  }, []);

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
        if (errors.length > 0 && fetched.length === 0) {
          setHasBalanceError(true);
        }
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
    // Se veio sem params (ex: fluxo pós-criação de wallet), busca o
    // status real da API antes de carregar os saldos.
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

  // Sempre que a tela ganha foco de novo (ex: voltando de um saque
  // concluído), revalida o status — o modo pode ter mudado (improvável,
  // mas se o usuário trocar de wallet em outra aba/fluxo) e os saldos
  // certamente devem ser atualizados.
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
      // eslint-disable-next-line react-hooks/exhaustive-deps
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
    showToast({ message: "Endereço copiado!", type: "success" });
  }, [record?.address, showToast]);

  const goToWithdraw = useCallback(() => {
    if (!record) return;
    navigate("WalletWithdraw" as never, { record } as never);
  }, [navigate, record]);

  const goToPix = useCallback(() => {
    if (!record) return;

    // Passa o saldo de cada rede separadamente para que a tela de PIX
    // consiga mostrar e validar o saldo correto ao trocar de rede.
    const polygonBalance = parseFloat(
      balances.find((b) => b.network === "polygon")?.usdtBalance ?? "0",
    );
    const plasmaBalance = parseFloat(
      balances.find((b) => b.network === "plasma")?.usdtBalance ?? "0",
    );

    // Usa Polygon como rede padrão se tiver saldo, senão Plasma
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

  const goToHistory = useCallback(() => {
    if (!record) return;
    navigate("WalletHistory" as never, { record } as never);
  }, [navigate, record]);

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
              <S.HeaderTitle>Carteira</S.HeaderTitle>
            </S.HeaderLeft>

            {isFullAccess && (
              <>
                <S.IconButton onPress={goToHistory} activeOpacity={0.7}>
                  <History size={18} color="#FFFFFF" strokeWidth={2.2} />
                </S.IconButton>
                <S.IconButton onPress={goToExport} activeOpacity={0.7}>
                  <KeyRound size={18} color="#FFFFFF" strokeWidth={2.2} />
                </S.IconButton>
              </>
            )}
          </S.Header>

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
                      Você está vendo esta carteira apenas para consulta. A
                      chave de acesso está associada a outro dispositivo —
                      saques só podem ser feitos a partir dele.
                    </S.ViewOnlyBannerText>
                  </S.ViewOnlyBanner>
                )}

                <S.TotalCard>
                  <S.TotalLabel>SALDO TOTAL EM USDT</S.TotalLabel>
                  {loadingBalances ? (
                    <ActivityIndicator color={colors.primary} />
                  ) : (
                    <>
                      <S.TotalValue>{totalUsdt.toFixed(2)}</S.TotalValue>
                      <S.TotalSubvalue>Somando todas as redes</S.TotalSubvalue>
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
                        Sacar
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
                        PIX
                      </S.ActionButtonText>
                    </S.ActionButton>
                  </S.ActionsRow>
                )}

                <S.SectionLabel>SALDO POR REDE</S.SectionLabel>

                {hasBalanceError ? (
                  <S.CenteredState>
                    <AlertTriangle
                      size={24}
                      color={colors.textMuted}
                      strokeWidth={1.8}
                    />
                    <S.StateText>
                      Não foi possível consultar os saldos agora. Arraste para
                      baixo para tentar de novo.
                    </S.StateText>
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
                              <S.NetworkGasWarning>
                                Saldo de {config.nativeCurrencySymbol} baixo
                                para taxas
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

import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  StatusBar,
  FlatList,
  ActivityIndicator,
  Linking,
  TouchableOpacity,
  RefreshControl,
  View,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  ArrowLeft,
  ArrowDownLeft,
  ArrowUpRight,
  ExternalLink,
  Network as NetworkIcon,
  FileText,
} from "lucide-react-native";
import styled from "styled-components/native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Platform, StatusBar as RNStatusBar } from "react-native";
import moment from "moment";
import { useTranslation } from "react-i18next";
import {
  fetchOnChainHistory,
  OnChainTransaction,
  WalletNetworkKey,
} from "../../../components/wallet/blockchainHistory";
import {
  getPixProof,
  PixTransaction,
} from "../../../components/pix/pixService";
import { getProofKey } from "../../../components/wallet/walletStorage";
import { ApiWalletRecord } from "../../../components/wallet/walletStatus";
import { colors } from "../dashboard/styles";
import LogoSvg from "@/assets/logov2.svg";

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
  margin-bottom: ${hp(2)}px;
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
const CardLogo = styled.View`
  align-items: center;
  margin-bottom: ${hp(1)}px;
`;
const NetworkRow = styled.View`
  flex-direction: row;
  gap: 10px;
  margin-bottom: ${hp(2)}px;
`;
const NetworkChip = styled.TouchableOpacity<{ selected?: boolean }>`
  flex: 1;
  align-items: center;
  padding-vertical: 11px;
  border-radius: 14px;
  background-color: ${({ selected }) =>
    selected ? "rgba(108,92,231,0.18)" : colors.surface};
  border-width: 1.5px;
  border-color: ${({ selected }) =>
    selected ? colors.primary : colors.surfaceBorder};
`;
const NetworkChipText = styled.Text<{ selected?: boolean }>`
  color: ${({ selected }) =>
    selected ? colors.textPrimary : colors.textMuted};
  font-size: 13px;
  font-weight: 700;
`;

const TxCard = styled.View`
  border-radius: 16px;
  margin-bottom: 10px;
  background-color: ${colors.surface};
  border-width: 1px;
  border-color: ${colors.surfaceBorder};
  overflow: hidden;
`;
const TxMain = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding: 14px;
`;
const TxIconWrapper = styled.View<{ incoming?: boolean }>`
  width: 40px;
  height: 40px;
  border-radius: 13px;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  background-color: ${({ incoming }) =>
    incoming ? "rgba(46,204,113,0.15)" : "rgba(255,107,107,0.15)"};
`;
const TxInfo = styled.View`
  flex: 1;
`;
const TxTitle = styled.Text`
  color: ${colors.textPrimary};
  font-size: 13.5px;
  font-weight: 700;
`;
const TxDate = styled.Text`
  color: ${colors.textMuted};
  font-size: 11.5px;
  margin-top: 2px;
`;
const TxHash = styled.Text`
  color: ${colors.textMuted};
  font-size: 10.5px;
  margin-top: 2px;
`;
const TxRight = styled.View`
  align-items: flex-end;
`;
const TxAmount = styled.Text<{ incoming?: boolean }>`
  color: ${({ incoming }) => (incoming ? colors.success : colors.danger)};
  font-size: 14px;
  font-weight: 700;
`;
const TxSymbol = styled.Text`
  color: ${colors.textMuted};
  font-size: 11px;
  margin-top: 2px;
`;

// Área de botões do PIX — aparece só em transações OUT confirmadas como PIX
const PixActionsRow = styled.View`
  flex-direction: row;
  gap: 8px;
  padding: 10px 14px;
  border-top-width: 1px;
  border-top-color: ${colors.surfaceBorder};
`;
const PixButton = styled.TouchableOpacity<{ accent?: boolean }>`
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 5px;
  padding-vertical: 9px;
  border-radius: 10px;
  background-color: ${({ accent }) =>
    accent ? "rgba(108,92,231,0.15)" : "rgba(255,255,255,0.05)"};
  border-width: 1px;
  border-color: ${({ accent }) =>
    accent ? colors.primary : colors.surfaceBorder};
`;
const PixButtonText = styled.Text<{ accent?: boolean }>`
  color: ${({ accent }) => (accent ? colors.primary : colors.textPrimary)};
  font-size: 11.5px;
  font-weight: 700;
`;
const PixBadge = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 4px;
  padding: 3px 8px;
  border-radius: 6px;
  margin: 0 14px 10px;
  background-color: rgba(108, 92, 231, 0.12);
  align-self: flex-start;
`;
const PixBadgeText = styled.Text`
  color: ${colors.primary};
  font-size: 10px;
  font-weight: 700;
`;

const CenteredState = styled.View`
  align-items: center;
  justify-content: center;
  padding-top: ${hp(8)}px;
  gap: 12px;
`;
const StateText = styled.Text`
  color: ${colors.textMuted};
  font-size: 13.5px;
  text-align: center;
  padding-horizontal: 20px;
`;
const FooterLoader = styled.View`
  padding-vertical: 20px;
  align-items: center;
`;
const DateSeparator = styled.View`
  padding-vertical: 8px;
`;
const DateSeparatorText = styled.Text`
  color: ${colors.textMuted};
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1px;
`;

interface RouteParams {
  record: ApiWalletRecord;
  network?: WalletNetworkKey;
}

function truncateHash(hash: string): string {
  if (!hash || hash.length <= 16) return hash;
  return `${hash.slice(0, 8)}...${hash.slice(-6)}`;
}

function groupByDate(
  txs: OnChainTransaction[],
): { date: string; items: OnChainTransaction[] }[] {
  const groups: Record<string, OnChainTransaction[]> = {};
  txs.forEach((tx) => {
    const date = moment.unix(tx.timestamp).format("DD/MM/YYYY");
    if (!groups[date]) groups[date] = [];
    groups[date].push(tx);
  });
  return Object.entries(groups).map(([date, items]) => ({ date, items }));
}

// Cache de proofs consultados nesta sessão para não repetir requests
const proofCache: Record<string, PixTransaction | null> = {};

export default function WalletHistory() {
  const navigation = useNavigation();
  const { goBack } = navigation;
  const route = useRoute();
  const params = (route.params ?? {}) as RouteParams;
  const record = params.record;

  const [network, setNetwork] = useState<WalletNetworkKey>(
    params.network ?? "polygon",
  );
  const [transactions, setTransactions] = useState<OnChainTransaction[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(false);

  // Mapa de txid → PixTransaction (ou null se não for PIX)
  const [pixProofs, setPixProofs] = useState<
    Record<string, PixTransaction | null>
  >({});

  const [proofKey, setProofKey] = useState<string | null>(null);

  const isLeavingRef = useRef(false);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    // Carrega a proofKey uma vez
    getProofKey().then(setProofKey);
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Consulta sell/proof para transações OUT de USDT que ainda não foram verificadas
  const checkPixProofs = useCallback(
    async (txs: OnChainTransaction[]) => {
      if (!proofKey) return;
      const outUsdtTxs = txs.filter(
        (tx) =>
          !tx.isIncoming && tx.type === "usdt" && !(tx.hash in proofCache),
      );
      if (outUsdtTxs.length === 0) return;

      // Consulta em paralelo com limite de 3 simultâneas para não sobrecarregar
      const chunks = [];
      for (let i = 0; i < outUsdtTxs.length; i += 3) {
        chunks.push(outUsdtTxs.slice(i, i + 3));
      }

      for await (const chunk of chunks) {
        if (!isMountedRef.current || isLeavingRef.current) return;
        await Promise.all(
          chunk.map(async (tx) => {
            try {
              const result = await getPixProof({ proofKey, txid: tx.hash });
              proofCache[tx.hash] = result;
              if (isMountedRef.current) {
                setPixProofs((prev) => ({ ...prev, [tx.hash]: result }));
              }
            } catch {
              proofCache[tx.hash] = null;
            }
          }),
        );
      }
    },
    [proofKey],
  );

  const loadPage = useCallback(
    async (targetPage: number, reset = false) => {
      if (!record?.address || isLeavingRef.current) return;
      if (reset) setLoading(true);
      else setLoadingMore(true);
      setError(false);

      try {
        const result = await fetchOnChainHistory({
          address: record.address,
          network,
          page: targetPage,
        });
        if (!isMountedRef.current || isLeavingRef.current) return;

        setTransactions((prev) =>
          reset ? result.transactions : [...prev, ...result.transactions],
        );
        setHasMore(result.hasMore);
        setPage(result.nextPage);

        // Consulta PIX proof para as novas transações OUT
        checkPixProofs(result.transactions);
      } catch {
        if (isMountedRef.current) setError(true);
      } finally {
        if (isMountedRef.current) {
          setLoading(false);
          setLoadingMore(false);
          setRefreshing(false);
        }
      }
    },
    [record?.address, network, checkPixProofs],
  );

  useEffect(() => {
    setTransactions([]);
    setPixProofs({});
    setPage(1);
    setHasMore(true);
    loadPage(1, true);
  }, [network]);

  // FIX: quando a proofKey chega depois das transações já terem sido
  // carregadas (race condition), reprocessa as transações pendentes.
  // checkPixProofs já filtra por proofCache, então não duplica requests.
  useEffect(() => {
    if (proofKey && transactions.length > 0) {
      checkPixProofs(transactions);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [proofKey]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setTransactions([]);
    setPixProofs({});
    setPage(1);
    setHasMore(true);
    loadPage(1, true);
  }, [loadPage]);

  const handleLoadMore = useCallback(() => {
    if (!loadingMore && hasMore && !isLeavingRef.current) loadPage(page);
  }, [loadingMore, hasMore, page, loadPage]);

  const handleGoBack = useCallback(() => {
    if (isLeavingRef.current) return;
    isLeavingRef.current = true;
    setTransactions([]);
    requestAnimationFrame(() => goBack());
  }, [goBack]);

  const handleOpenPixReceipt = useCallback(
    (tx: OnChainTransaction, pixTx: PixTransaction) => {
      navigation.navigate(
        "Walletpixreceipt" as never,
        {
          pixTransaction: pixTx,
          txid: tx.hash,
          proofKey,
          explorerUrl: tx.explorerUrl,
        } as never,
      );
    },
    [navigation, proofKey],
  );

  type ListItem =
    | { type: "date"; date: string; key: string }
    | { type: "tx"; tx: OnChainTransaction; key: string };

  const listItems = React.useMemo<ListItem[]>(() => {
    const groups = groupByDate(transactions);
    const items: ListItem[] = [];
    groups.forEach(({ date, items: txs }) => {
      items.push({ type: "date", date, key: `date-${date}` });
      txs.forEach((tx) =>
        items.push({ type: "tx", tx, key: tx.hash + tx.type }),
      );
    });
    return items;
  }, [transactions]);

  const renderItem = useCallback(
    ({ item }: { item: ListItem }) => {
      if (item.type === "date") {
        return (
          <DateSeparator>
            <DateSeparatorText>{item.date}</DateSeparatorText>
          </DateSeparator>
        );
      }

      const { tx } = item;
      const pixTx = pixProofs[tx.hash]; // undefined = ainda consultando, null = não é PIX, PixTransaction = é PIX
      // FIX: `pixTx != null` já cobre undefined e null; removida checagem redundante
      const isPixOut = !tx.isIncoming && tx.type === "usdt" && pixTx != null;

      return (
        <TxCard>
          <TxMain
            onPress={() => Linking.openURL(tx.explorerUrl).catch(() => {})}
            activeOpacity={0.75}
          >
            <TxIconWrapper incoming={tx.isIncoming}>
              {tx.isIncoming ? (
                <ArrowDownLeft
                  size={18}
                  color={colors.success}
                  strokeWidth={2.2}
                />
              ) : (
                <ArrowUpRight
                  size={18}
                  color={colors.danger}
                  strokeWidth={2.2}
                />
              )}
            </TxIconWrapper>

            <TxInfo>
              <TxTitle>
                {tx.isIncoming ? "Recebido" : "Enviado"} · {tx.symbol}
              </TxTitle>
              <TxDate>{moment.unix(tx.timestamp).format("HH:mm")}</TxDate>
              <TxHash>{truncateHash(tx.hash)}</TxHash>
            </TxInfo>

            <TxRight>
              <TxAmount incoming={tx.isIncoming}>
                {tx.isIncoming ? "+" : "-"}
                {tx.valueFormatted}
              </TxAmount>
              <TxSymbol>{tx.symbol}</TxSymbol>
            </TxRight>
          </TxMain>

          {/* Badge PIX + botões — aparece só quando confirmado como PIX off-ramp */}
          {isPixOut && (
            <>
              <PixBadge>
                <PixBadgeText>PIX OFF-RAMP</PixBadgeText>
              </PixBadge>
              <PixActionsRow>
                <PixButton
                  accent
                  onPress={() => handleOpenPixReceipt(tx, pixTx!)}
                  activeOpacity={0.8}
                >
                  <FileText
                    size={13}
                    color={colors.primary}
                    strokeWidth={2.2}
                  />
                  <PixButtonText accent>Comprovante PIX</PixButtonText>
                </PixButton>
                <PixButton
                  onPress={() =>
                    Linking.openURL(tx.explorerUrl).catch(() => {})
                  }
                  activeOpacity={0.8}
                >
                  <ExternalLink
                    size={13}
                    color={colors.textPrimary}
                    strokeWidth={2.2}
                  />
                  <PixButtonText>Blockchain</PixButtonText>
                </PixButton>
              </PixActionsRow>
            </>
          )}
        </TxCard>
      );
    },
    [pixProofs, handleOpenPixReceipt],
  );

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
            <BackButton onPress={handleGoBack} activeOpacity={0.7}>
              <ArrowLeft size={22} color="#FFFFFF" strokeWidth={2.2} />
            </BackButton>
            <HeaderTitle>Extrato Blockchain</HeaderTitle>
          </Header>
          <CardLogo>
            <LogoSvg width={wp(28)} height={hp(7)} />
          </CardLogo>

          <NetworkRow>
            {(["polygon", "plasma"] as WalletNetworkKey[]).map((net) => (
              <NetworkChip
                key={net}
                selected={network === net}
                onPress={() => setNetwork(net)}
                activeOpacity={0.75}
              >
                <NetworkChipText selected={network === net}>
                  {net === "polygon" ? "Polygon" : "Plasma"}
                </NetworkChipText>
              </NetworkChip>
            ))}
          </NetworkRow>

          {loading ? (
            <CenteredState>
              <ActivityIndicator color={colors.primary} size="large" />
              <StateText>Buscando transações na blockchain...</StateText>
            </CenteredState>
          ) : error ? (
            <CenteredState>
              <NetworkIcon
                size={28}
                color={colors.textMuted}
                strokeWidth={1.8}
              />
              <StateText>
                Não foi possível carregar o extrato. Verifique sua conexão e
                tente novamente.
              </StateText>
              <TouchableOpacity
                onPress={handleRefresh}
                activeOpacity={0.7}
                style={{ marginTop: 8, padding: 12 }}
              >
                <StateText style={{ color: colors.primary }}>
                  Tentar novamente
                </StateText>
              </TouchableOpacity>
            </CenteredState>
          ) : listItems.length === 0 ? (
            <CenteredState>
              <NetworkIcon
                size={28}
                color={colors.textMuted}
                strokeWidth={1.8}
              />
              <StateText>
                Nenhuma transação encontrada para este endereço na rede{" "}
                {network === "polygon" ? "Polygon" : "Plasma"}.
              </StateText>
            </CenteredState>
          ) : (
            <FlatList
              data={listItems}
              renderItem={renderItem}
              keyExtractor={(item) => item.key}
              onEndReached={handleLoadMore}
              onEndReachedThreshold={0.3}
              removeClippedSubviews={false}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 24 }}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={handleRefresh}
                  tintColor={colors.primary}
                />
              }
              ListFooterComponent={
                loadingMore ? (
                  <FooterLoader>
                    <ActivityIndicator color={colors.primary} />
                  </FooterLoader>
                ) : null
              }
            />
          )}
        </SafeArea>
      </Background>
    </Container>
  );
}

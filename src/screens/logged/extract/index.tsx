import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { FlatList, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ArrowLeft, Receipt, CalendarRange } from "lucide-react-native";
import moment from "moment";

import * as S from "./styles";
import rstruther from "@/infraestructure/http/nodeApi";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import LogoSvg from "@/assets/logov2.svg";
import DatePickerModal from "@/components/datapicker";
import { colors } from "../dashboard/styles";
import { useTranslation } from "react-i18next";

interface Invoice {
  id: string | number;
  amount: string | number;
  status: "OPEN" | "CANCEL" | "CONFIRMED" | string;
  confirmDate: string;
}

type StatusFilter = "OPEN" | "CANCEL" | "CONFIRMED";
type PeriodPreset = "today" | "7d" | "30d" | "custom";

const STATUS_OPTIONS: {
  value: StatusFilter;
  labelKey: string;
  color: string;
}[] = [
  { value: "OPEN", labelKey: "extract.statusOptions.open", color: "#F7B731" },
  {
    value: "CONFIRMED",
    labelKey: "extract.statusOptions.confirmed",
    color: "#007d30",
  },
  {
    value: "CANCEL",
    labelKey: "extract.statusOptions.cancelled",
    color: colors.danger,
  },
];

const PERIOD_PRESETS: { value: PeriodPreset; labelKey: string }[] = [
  { value: "today", labelKey: "extract.periods.today" },
  { value: "7d", labelKey: "extract.periods.sevenDays" },
  { value: "30d", labelKey: "extract.periods.thirtyDays" },
  { value: "custom", labelKey: "extract.periods.custom" },
];

function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

function getRangeForPreset(preset: PeriodPreset): { from: string; to: string } {
  const today = new Date();
  const from = new Date();

  if (preset === "today") {
    // from = to = hoje
  } else if (preset === "7d") {
    from.setDate(today.getDate() - 7);
  } else if (preset === "30d") {
    from.setDate(today.getDate() - 30);
  }

  return { from: formatDate(from), to: formatDate(today) };
}

function statusMeta(status: string) {
  return (
    STATUS_OPTIONS.find((s) => s.value === status) ?? {
      labelKey: status, // fallback: mostra o status puro se não achar
      color: colors.textMuted,
    }
  );
}

const PAGE_SIZE = 10;

export default function Extract() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { navigate } = useNavigation();

  const initialRange = useMemo(() => getRangeForPreset("7d"), []);

  const [periodPreset, setPeriodPreset] = useState<PeriodPreset>("7d");
  const [dataInicial, setDataInicial] = useState(initialRange.from);
  const [dataFinal, setDataFinal] = useState(initialRange.to);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("CONFIRMED");

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [campoSelecionado, setCampoSelecionado] = useState<
    "inicial" | "final" | null
  >(null);

  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingPage, setLoadingPage] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // --- Fix do crash "cannot remove child at index N from parent ViewGroup" ---
  //
  // Esse erro nativo do Android acontece quando a árvore de views da
  // FlatList ainda está sendo atualizada (ex: uma resposta de API
  // chegou e está prestes a chamar setInvoices) no exato momento em que
  // a navegação começa a desmontar a tela. O React tenta remover/inserir
  // views nativas numa árvore que o Android já está desmontando por
  // outro lado, e o ViewGroup nativo quebra.
  //
  // Resolvido em duas camadas:
  // 1. isMountedRef: nenhum setState de uma resposta assíncrona roda
  //    depois que a tela começou a sair.
  // 2. isLeavingRef + esconder a FlatList antes do goBack(): garante que
  //    nenhum re-render da lista aconteça durante a transição de saída.
  const isMountedRef = useRef(true);
  const isLeavingRef = useRef(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const handleGoBack = useCallback(() => {
    if (isLeavingRef.current) return;
    isLeavingRef.current = true;
    // Desmonta a FlatList primeiro (vira null no próximo render) e só
    // navega para trás depois que esse render terminou de fato — isso
    // evita que a navegação comece a desmontar a árvore nativa enquanto
    // a FlatList ainda está presente.
    setIsLeaving(true);
    requestAnimationFrame(() => {
      navigation.goBack();
    });
  }, [navigation]);

  const buscarFaturas = useCallback(
    async (targetPage: number, resetting = false) => {
      if (isLeavingRef.current) return;
      if (loadingPage) return;
      if (!resetting && !hasMore) return;

      setLoadingPage(true);
      try {
        const response = await rstruther.get("saller/invoice/list", {
          params: {
            dateFrom: dataInicial,
            dateTo: dataFinal,
            status: statusFilter,
            page: targetPage,
            limitPerPage: PAGE_SIZE,
          },
        });

        // A tela pode ter sido desmontada (ou estar saindo) enquanto a
        // requisição estava em voo — não toca em nenhum state nesse caso.
        if (!isMountedRef.current || isLeavingRef.current) return;

        const newInvoices: Invoice[] = response.data?.invoice ?? [];
        const pagination = response.data?.pagination;

        setInvoices((prev) =>
          resetting ? newInvoices : [...prev, ...newInvoices],
        );

        if (pagination?.count != null && pagination?.perPage) {
          const totalPages = Math.ceil(pagination.count / pagination.perPage);
          setHasMore(targetPage < totalPages);
        } else {
          // Sem metadados de paginação confiáveis: assume que não há mais
          // páginas se a página atual veio com menos itens que o tamanho pedido.
          setHasMore(newInvoices.length === PAGE_SIZE);
        }

        setPage(targetPage + 1);
      } catch (err) {
        console.error("Erro ao buscar invoices:", err);
      } finally {
        if (isMountedRef.current && !isLeavingRef.current) {
          setLoadingPage(false);
          setInitialLoading(false);
        }
      }
    },
    [dataInicial, dataFinal, statusFilter, loadingPage, hasMore],
  );

  // Sempre que o filtro (período ou status) muda, reseta a paginação e
  // busca a página 1 do zero — em vez de concatenar com a lista anterior.
  useEffect(() => {
    if (isLeavingRef.current) return;
    setInvoices([]);
    setHasMore(true);
    setInitialLoading(true);
    buscarFaturas(1, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataInicial, dataFinal, statusFilter]);

  const handleSelectPreset = useCallback((preset: PeriodPreset) => {
    setPeriodPreset(preset);
    if (preset === "custom") {
      setCampoSelecionado("inicial");
      setShowDatePicker(true);
      return;
    }
    const range = getRangeForPreset(preset);
    setDataInicial(range.from);
    setDataFinal(range.to);
  }, []);

  const handleOpenCustomField = useCallback((field: "inicial" | "final") => {
    setPeriodPreset("custom");
    setCampoSelecionado(field);
    setShowDatePicker(true);
  }, []);

  const handleLoadMore = useCallback(() => {
    if (!loadingPage && hasMore && !isLeavingRef.current) {
      buscarFaturas(page);
    }
  }, [buscarFaturas, loadingPage, hasMore, page]);

  const renderItem = useCallback(
    ({ item }: { item: Invoice }) => {
      const meta = statusMeta(item.status);
      return (
        <S.InvoiceCard>
          <S.InvoiceIconWrapper dotColor={meta.color}>
            <Receipt size={18} color={meta.color} strokeWidth={2.2} />
          </S.InvoiceIconWrapper>

          <S.InvoiceInfo>
            <S.InvoiceAmount>{item.amount} USDT</S.InvoiceAmount>
            <S.InvoiceMeta>
              {item.confirmDate
                ? moment(item.confirmDate).format("DD/MM/YYYY HH:mm")
                : t("extract.noConfirmationDate")}
            </S.InvoiceMeta>
            <S.InvoiceStatusBadge dotColor={meta.color}>
              <S.StatusDot dotColor={meta.color} />
              <S.InvoiceStatusText dotColor={meta.color}>
                {t(meta.labelKey)}
              </S.InvoiceStatusText>
            </S.InvoiceStatusBadge>
          </S.InvoiceInfo>

          {item.status === "CONFIRMED" && (
            <S.ReceiptButton
              onPress={() =>
                navigate("proofExtract" as never, { data: item } as never)
              }
              activeOpacity={0.7}
            >
              <Receipt size={17} color={colors.primary} strokeWidth={2.2} />
            </S.ReceiptButton>
          )}
        </S.InvoiceCard>
      );
    },
    [navigate],
  );

  return (
    <S.Container>
      <S.Background source={require("@/assets/background.png")}>
        <S.BackgroundOverlay />

        <S.SafeArea>
          <S.Header>
            <S.BackButton onPress={handleGoBack} activeOpacity={0.7}>
              <ArrowLeft size={22} color="#FFFFFF" strokeWidth={2.2} />
            </S.BackButton>
            <S.HeaderTitle> {t("extract.title")}</S.HeaderTitle>
          </S.Header>

          <S.cardLogo>
            <LogoSvg width={wp(34)} height={hp(9)} />
          </S.cardLogo>

          <S.SectionLabel> {t("extract.period")}</S.SectionLabel>
          <S.ChipsRow>
            {PERIOD_PRESETS.map(({ value, labelKey }) => (
              <S.Chip
                key={value}
                selected={periodPreset === value}
                activeOpacity={0.75}
                onPress={() => handleSelectPreset(value)}
              >
                <S.ChipText selected={periodPreset === value}>
                  {t(labelKey)}
                </S.ChipText>
              </S.Chip>
            ))}
          </S.ChipsRow>

          {periodPreset === "custom" && (
            <S.CustomRangeRow>
              <S.CustomRangeButton
                onPress={() => handleOpenCustomField("inicial")}
                activeOpacity={0.75}
              >
                <CalendarRange
                  size={14}
                  color={colors.textMuted}
                  strokeWidth={2.2}
                />
                <S.CustomRangeButtonText>{dataInicial}</S.CustomRangeButtonText>
              </S.CustomRangeButton>
              <S.CustomRangeButton
                onPress={() => handleOpenCustomField("final")}
                activeOpacity={0.75}
              >
                <CalendarRange
                  size={14}
                  color={colors.textMuted}
                  strokeWidth={2.2}
                />
                <S.CustomRangeButtonText>{dataFinal}</S.CustomRangeButtonText>
              </S.CustomRangeButton>
            </S.CustomRangeRow>
          )}

          <S.SectionLabel> {t("extract.status")}</S.SectionLabel>
          <S.ChipsRow>
            {STATUS_OPTIONS.map(({ value, labelKey, color }) => {
              const isSelected = statusFilter === value;
              return (
                <S.StatusChip
                  key={value}
                  selected={isSelected}
                  statusColor={color}
                  activeOpacity={0.75}
                  onPress={() => setStatusFilter(value)}
                >
                  <S.StatusDot dotColor={color} />
                  <S.StatusChipText selected={isSelected}>
                    {t(labelKey)}
                  </S.StatusChipText>
                </S.StatusChip>
              );
            })}
          </S.ChipsRow>

          {isLeaving ? null : initialLoading ? (
            <S.CenteredState>
              <ActivityIndicator color={colors.primary} size="large" />
              <S.StateText>{t("extract.loading")}</S.StateText>
            </S.CenteredState>
          ) : invoices.length === 0 ? (
            <S.CenteredState>
              <Receipt size={28} color={colors.textMuted} strokeWidth={1.8} />
              <S.StateText>{t("extract.empty")}</S.StateText>
            </S.CenteredState>
          ) : (
            <FlatList
              data={invoices}
              renderItem={renderItem}
              keyExtractor={(item, index) => String(item.id ?? index)}
              onEndReached={handleLoadMore}
              onEndReachedThreshold={0.3}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 24 }}
              removeClippedSubviews={false}
              ListFooterComponent={
                loadingPage ? (
                  <S.FooterLoader>
                    <ActivityIndicator color={colors.primary} />
                  </S.FooterLoader>
                ) : null
              }
            />
          )}

          <DatePickerModal
            visible={showDatePicker}
            selectedDate={
              campoSelecionado === "inicial" ? dataInicial : dataFinal
            }
            onClose={() => setShowDatePicker(false)}
            onDateSelect={(date: string) => {
              if (campoSelecionado === "inicial") {
                setDataInicial(date);
              } else if (campoSelecionado === "final") {
                setDataFinal(date);
              }
              setCampoSelecionado(null);
              setShowDatePicker(false);
            }}
          />
        </S.SafeArea>
      </S.Background>
    </S.Container>
  );
}

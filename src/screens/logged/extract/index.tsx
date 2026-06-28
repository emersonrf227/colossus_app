import React, { useEffect, useState, useCallback, useMemo } from "react";
import { FlatList, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  ArrowLeft,
  Receipt,
  CheckCircle2,
  XCircle,
  Clock,
  CalendarRange,
} from "lucide-react-native";
import moment from "moment";

import * as S from "./styles";
import Loader from "@/components/loader";
import rstruther from "@/infraestructure/http/nodeApi";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import LogoSvg from "@/assets/logov2.svg";
import DatePickerModal from "@/components/datapicker";
import { colors } from "../dashboard/styles";

interface Invoice {
  id: string | number;
  amount: string | number;
  status: "OPEN" | "CANCEL" | "CONFIRMED" | string;
  confirmDate: string;
}

type StatusFilter = "OPEN" | "CANCEL" | "CONFIRMED";
type PeriodPreset = "today" | "7d" | "30d" | "custom";

const STATUS_OPTIONS: { value: StatusFilter; label: string; color: string }[] =
  [
    { value: "OPEN", label: "Aberta", color: "#F7B731" },
    { value: "CONFIRMED", label: "Confirmada", color: "#007d30" },
    { value: "CANCEL", label: "Cancelada", color: colors.danger },
  ];

const PERIOD_PRESETS: { value: PeriodPreset; label: string }[] = [
  { value: "today", label: "Hoje" },
  { value: "7d", label: "7 dias" },
  { value: "30d", label: "30 dias" },
  { value: "custom", label: "Personalizado" },
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
      label: status,
      color: colors.textMuted,
    }
  );
}

const PAGE_SIZE = 10;

export default function Extract() {
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

  const buscarFaturas = useCallback(
    async (targetPage: number, resetting = false) => {
      if (loadingPage) return;
      if (!resetting && !hasMore) return;

      setLoadingPage(true);
      try {
        console.log({
          dateFrom: dataInicial,
          dateTo: dataFinal,
          ...(statusFilter !== "ALL" && { status: statusFilter }),
          page: targetPage,
          limitPerPage: PAGE_SIZE,
        });
        const response = await rstruther.get("saller/invoice/list", {
          params: {
            dateFrom: dataInicial,
            dateTo: dataFinal,
            ...(statusFilter !== "ALL" && { status: statusFilter }),
            page: targetPage,
            limitPerPage: PAGE_SIZE,
          },
        });

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
        setLoadingPage(false);
        setInitialLoading(false);
      }
    },
    [dataInicial, dataFinal, statusFilter, loadingPage, hasMore],
  );

  // Sempre que o filtro (período ou status) muda, reseta a paginação e
  // busca a página 1 do zero — em vez de concatenar com a lista anterior.
  useEffect(() => {
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
    if (!loadingPage && hasMore) {
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
                : "Sem data de confirmação"}
            </S.InvoiceMeta>
            <S.InvoiceStatusBadge dotColor={meta.color}>
              <S.StatusDot dotColor={meta.color} />
              <S.InvoiceStatusText dotColor={meta.color}>
                {meta.label}
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
            <S.BackButton
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
            >
              <ArrowLeft size={22} color="#FFFFFF" strokeWidth={2.2} />
            </S.BackButton>
            <S.HeaderTitle>Cobranças</S.HeaderTitle>
          </S.Header>

          <S.cardLogo>
            <LogoSvg width={wp(34)} height={hp(9)} />
          </S.cardLogo>

          <S.SectionLabel>PERÍODO</S.SectionLabel>
          <S.ChipsRow>
            {PERIOD_PRESETS.map(({ value, label }) => (
              <S.Chip
                key={value}
                selected={periodPreset === value}
                activeOpacity={0.75}
                onPress={() => handleSelectPreset(value)}
              >
                <S.ChipText selected={periodPreset === value}>
                  {label}
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

          <S.SectionLabel>STATUS</S.SectionLabel>
          <S.ChipsRow>
            {STATUS_OPTIONS.map(({ value, label, color }) => {
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
                    {label}
                  </S.StatusChipText>
                </S.StatusChip>
              );
            })}
          </S.ChipsRow>

          {initialLoading ? (
            <S.CenteredState>
              <ActivityIndicator color={colors.primary} size="large" />
              <S.StateText>Carregando cobranças...</S.StateText>
            </S.CenteredState>
          ) : invoices.length === 0 ? (
            <S.CenteredState>
              <Receipt size={28} color={colors.textMuted} strokeWidth={1.8} />
              <S.StateText>
                Nenhuma cobrança encontrada para esse período e status.
              </S.StateText>
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

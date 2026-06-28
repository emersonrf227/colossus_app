import React, { useEffect, useState, useCallback, useMemo } from "react";
import { ActivityIndicator } from "react-native";
import * as S from "./styles";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SvgUri } from "react-native-svg";
import { ArrowLeft, ArrowRight, Check } from "lucide-react-native";

import rstruther from "@/infraestructure/http/nodeApi";
import { useToast } from "@/hook/Toast";
import Loader from "@/components/loader";
import {
  resolveCurrency,
  convertToUsdt,
  fetchUsdtQuotes,
  QuoteFetchError,
} from "../../../components/currency";
import {
  fetchAvailableNetworks,
  getNetworkLabel,
  NetworkOption,
} from "../../../components/networks";

interface RouteParams {
  amount: string; // valor digitado na tela anterior, já formatado (ex: "150.00")
  currencyCode: string; // código da moeda escolhida (ex: "BRL", "USD", "PYG")
}

export default function SelectNetwork() {
  const { navigate, goBack } = useNavigation();
  const route = useRoute();
  const { amount, currencyCode } = (route.params ?? {}) as RouteParams;

  const currency = resolveCurrency(currencyCode);
  const { showToast } = useToast();

  // Lista de redes vinda da API
  const [networks, setNetworks] = useState<NetworkOption[]>([]);
  const [networksLoading, setNetworksLoading] = useState(true);
  const [networksError, setNetworksError] = useState(false);

  const [selectedNetwork, setSelectedNetwork] = useState<string | null>(null);

  // Loading separado: um para carregar a lista de redes, outro para a
  // submissão final (cotação + criação da invoice)
  const [submitting, setSubmitting] = useState(false);

  const loadNetworks = useCallback(async () => {
    setNetworksLoading(true);
    setNetworksError(false);
    try {
      const data = await fetchAvailableNetworks();
      setNetworks(data);
    } catch {
      setNetworksError(true);
    } finally {
      setNetworksLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNetworks();
  }, [loadNetworks]);

  const handleSelectNetwork = useCallback((network: string) => {
    setSelectedNetwork(network);
  }, []);

  const handleBack = useCallback(() => {
    goBack();
  }, [goBack]);

  const handleProceed = useCallback(async () => {
    if (!selectedNetwork) return;

    setSubmitting(true);
    try {
      // 1. Converte o valor digitado para USDT, de acordo com a moeda.
      //    USD é 1:1 (passthrough). BRL/PYG precisam da cotação da CoinGecko.
      let amountInUsdt: string;

      if (currency.code === "USD") {
        amountInUsdt = convertToUsdt(amount, currency);
      } else {
        const quotes = await fetchUsdtQuotes();
        amountInUsdt = convertToUsdt(amount, currency, quotes);
      }

      // 2. Cria a invoice já com o valor convertido em USDT.
      const obj = {
        amount: amountInUsdt,
        originalAmount: amount,
        originalCurrency: currency.code,
        network: selectedNetwork,
        reference: new Date(),
        token: "usdt",
        memo: "pay ",
        split: [],
      };

      const response = await rstruther.post(`saller/invoice`, obj);

      if (response.status === 200 || response.status === 201) {
        const selectedNetworkData = networks.find(
          (n) => n.network === selectedNetwork,
        );
        navigate(
          "Invoice" as never,
          {
            data: response.data,
            network: selectedNetwork,
            networkIcon: selectedNetworkData?.icon,
          } as never,
        );
      }
    } catch (error: any) {
      if (error instanceof QuoteFetchError) {
        showToast({ message: error.message, type: "error" });
        return;
      }

      const message = error?.response?.data?.message;

      if (
        message ===
        "Forward Wallet not found put an forward wallet in POST v1/saller/wallet."
      ) {
        showToast({ message, type: "error" });
        navigate("CadWallet" as never);
        return;
      }

      showToast({
        message:
          message ?? "Não foi possível criar a cobrança. Tente novamente.",
        type: "error",
      });
    } finally {
      setSubmitting(false);
    }
  }, [selectedNetwork, amount, currency, navigate, showToast]);

  const canProceed = useMemo(
    () => !!selectedNetwork && !submitting,
    [selectedNetwork, submitting],
  );

  return (
    <S.Container>
      {submitting && <Loader />}
      <S.SafeArea>
        <S.Header>
          <S.BackButton onPress={handleBack} activeOpacity={0.7}>
            <ArrowLeft size={22} color="#FFFFFF" strokeWidth={2.2} />
          </S.BackButton>
          <S.HeaderTitle>Escolha a rede</S.HeaderTitle>
        </S.Header>

        <S.AmountSummary>
          <S.AmountSummaryLabel>VALOR DA COBRANÇA</S.AmountSummaryLabel>
          <S.AmountSummaryValue>
            {currency.label} {amount}
          </S.AmountSummaryValue>
        </S.AmountSummary>

        <S.SectionLabel>REDES DISPONÍVEIS</S.SectionLabel>

        {networksLoading ? (
          <S.CenteredState>
            <ActivityIndicator color="#6C5CE7" size="large" />
            <S.StateText>Carregando redes...</S.StateText>
          </S.CenteredState>
        ) : networksError ? (
          <S.CenteredState>
            <S.StateText>Não foi possível carregar as redes.</S.StateText>
            <S.RetryButton onPress={loadNetworks} activeOpacity={0.7}>
              <S.RetryButtonText>Tentar novamente</S.RetryButtonText>
            </S.RetryButton>
          </S.CenteredState>
        ) : (
          <S.NetworkGrid>
            {networks.map(({ network, icon }) => {
              const isSelected = selectedNetwork === network;
              return (
                <S.NetworkCard
                  key={network}
                  selected={isSelected}
                  activeOpacity={0.8}
                  onPress={() => handleSelectNetwork(network)}
                >
                  {isSelected && (
                    <S.SelectedBadge>
                      <Check size={13} color="#FFFFFF" strokeWidth={3} />
                    </S.SelectedBadge>
                  )}
                  <S.NetworkIconWrapper>
                    <SvgUri width={34} height={34} uri={icon} />
                  </S.NetworkIconWrapper>
                  <S.NetworkCardLabel selected={isSelected}>
                    {getNetworkLabel(network)}
                  </S.NetworkCardLabel>
                </S.NetworkCard>
              );
            })}
          </S.NetworkGrid>
        )}

        <S.Footer>
          {currency.code !== "USD" && (
            <S.ConversionHint>
              O valor será convertido para USDT com base na cotação atual
            </S.ConversionHint>
          )}
          <S.ProceedButton
            disabled={!canProceed}
            onPress={handleProceed}
            activeOpacity={0.85}
          >
            <S.ProceedButtonText>Prosseguir</S.ProceedButtonText>
            <ArrowRight size={18} color="#FFFFFF" strokeWidth={2.2} />
          </S.ProceedButton>
        </S.Footer>
      </S.SafeArea>
    </S.Container>
  );
}

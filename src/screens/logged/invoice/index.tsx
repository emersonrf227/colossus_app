import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { Clipboard } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SvgUri } from "react-native-svg";
import { ArrowLeft, Copy, Clock, X } from "lucide-react-native";

import * as S from "./styles";
import { StatusBar } from "react-native";
import LogoSvg from "@/assets/logov2.svg";

import rstruther from "@/infraestructure/http/nodeApi";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Loader from "@/components/loader";
import { useToast } from "@/hook/Toast";
import { getNetworkLabel } from "../../../components/networks";

interface InvoiceData {
  data: {
    invoice: {
      amount: string;
      autheId: number;
      block: string;
      confirmDate: string;
      createdAt: string;
      deletedAt: string;
      expireIn: string;
      id: string;
      memo: string;
      networkId: number;
      paymentAddress: string;
      poolWalletId: number;
      reference: string;
      status: string;
      txid: string;
      updatedAt: string;
      uuid: string;
      walletId: number;
    };
    msg: string;
    status: number;
    wallet: string;
  };
}

interface RouteParams extends InvoiceData {
  network?: string;
  networkIcon?: string;
}

const EXPIRATION_SECONDS = 1800; // 30 minutos
const URGENT_THRESHOLD_SECONDS = 120; // últimos 2 minutos = visual de alerta

export default function Invoice() {
  const route = useRoute();
  const navigation = useNavigation();
  const { navigate } = useNavigation();
  const { showToast } = useToast();

  const logoIlike = require("@/assets/ilikepb.png");

  const params = (route.params ?? {}) as RouteParams;
  const { network, networkIcon } = params;

  const timerRef = useRef(EXPIRATION_SECONDS);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const tickRef = useRef<NodeJS.Timeout | null>(null);

  const [timeLeft, setTimeLeft] = useState(timerRef.current);
  const [qrString, setQrString] = useState("");
  const [amount, setAmount] = useState("");
  const [invoiceId, setInvoiceId] = useState("");
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);

  const clearAllIntervals = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (tickRef.current) {
      clearInterval(tickRef.current);
      tickRef.current = null;
    }
  }, []);

  const removeInvoice = useCallback(async () => {
    setLoading(true);
    try {
      const response = await rstruther.delete(`saller/invoice?id=${invoiceId}`);
      if (response.status === 200 || response.status === 201) {
        clearAllIntervals();
        navigate("Dashboard" as never);
        return;
      }
    } catch {
      clearAllIntervals();
      navigate("Dashboard" as never);
      return;
    } finally {
      setLoading(false);
    }
  }, [invoiceId, clearAllIntervals, navigate]);

  const getStatus = useCallback(async () => {
    const { invoice, wallet } = params.data ?? {};
    if (!invoice) return;

    setQrString(String(wallet));
    setAmount(invoice.amount);
    setInvoiceId(invoice.id);
    setInitializing(false);

    try {
      const response = await rstruther.get(`saller/invoice?id=${invoice.id}`);
      if (response.status === 200 || response.status === 201) {
        const status = response.data?.invoice?.status;

        if (status === "CANCEL") {
          showToast({ message: "Cobrança expirada", type: "error" });
          clearAllIntervals();
          navigate("Dashboard" as never);
          return;
        }

        if (status === "CONFIRMED") {
          clearAllIntervals();
          navigate("proofConfirm" as never, { data: response.data } as never);
          return;
        }
      }
    } catch (error) {
      console.error("Erro ao consultar status da invoice:", error);
    }
  }, [params, showToast, clearAllIntervals, navigate]);

  useEffect(() => {
    tickRef.current = setInterval(() => {
      if (timerRef.current <= 0) {
        showToast({ message: "Tempo esgotado. Voltando...", type: "error" });
        clearAllIntervals();
        navigation.goBack();
        return;
      }
      timerRef.current -= 1;
      setTimeLeft(timerRef.current);
    }, 1000);

    intervalRef.current = setInterval(() => {
      getStatus();
    }, 5000);

    getStatus();

    return clearAllIntervals;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
  };

  const copyToClipboard = useCallback(async () => {
    await Clipboard.setString(qrString);
    showToast({ message: "Endereço copiado!", type: "success" });
  }, [qrString, showToast]);

  const isUrgent = useMemo(
    () => timeLeft <= URGENT_THRESHOLD_SECONDS,
    [timeLeft],
  );

  return (
    <S.Container>
      {loading && <Loader />}

      <S.Background source={require("@/assets/background.png")}>
        <S.BackgroundOverlay />
        <StatusBar
          barStyle="light-content"
          backgroundColor="transparent"
          translucent
        />

        {initializing ? (
          <S.CenteredState>
            <Loader />
            <S.StateText>Carregando cobrança...</S.StateText>
          </S.CenteredState>
        ) : (
          <S.SafeArea>
            <S.Header>
              <S.BackButton onPress={removeInvoice} activeOpacity={0.7}>
                <ArrowLeft size={22} color="#FFFFFF" strokeWidth={2.2} />
              </S.BackButton>
              <S.HeaderTitle>Cobrança</S.HeaderTitle>
            </S.Header>

            <S.cardLogo>
              <LogoSvg width={wp(40)} height={hp(12)} />
            </S.cardLogo>

            {network && (
              <S.NetworkBadge>
                {networkIcon ? (
                  <S.NetworkBadgeIconWrapper>
                    <SvgUri width={14} height={14} uri={networkIcon} />
                  </S.NetworkBadgeIconWrapper>
                ) : null}
                <S.NetworkBadgeText>
                  {getNetworkLabel(network)}
                </S.NetworkBadgeText>
              </S.NetworkBadge>
            )}

            <S.ScrollContent
              contentContainerStyle={{
                alignItems: "center",
                paddingBottom: 24,
              }}
              showsVerticalScrollIndicator={false}
            >
              <S.AmountCard>
                <S.AmountLabel>VALOR A PAGAR</S.AmountLabel>
                <S.AmountRow>
                  <S.AmountValue>{amount}</S.AmountValue>
                  <S.TokenIcon
                    source={require("@/assets/networks/tether.png")}
                    resizeMode="contain"
                  />
                </S.AmountRow>
              </S.AmountCard>

              <S.QrCard>
                {qrString ? (
                  <QRCode
                    value={qrString}
                    size={wp(48)}
                    logo={logoIlike}
                    logoSize={28}
                    logoBackgroundColor="white"
                    logoMargin={0}
                    color="black"
                    backgroundColor="white"
                  />
                ) : null}
              </S.QrCard>

              <S.AddressCard onPress={copyToClipboard} activeOpacity={0.7}>
                <S.AddressText numberOfLines={1}>{qrString}</S.AddressText>
                <S.CopyIconWrapper>
                  <Copy size={16} color="#6C5CE7" strokeWidth={2.2} />
                </S.CopyIconWrapper>
              </S.AddressCard>

              <S.TimerCard urgent={isUrgent}>
                <Clock
                  size={16}
                  color={isUrgent ? "#FF6B6B" : "#FFFFFF"}
                  strokeWidth={2.2}
                />
                <S.TimerText urgent={isUrgent}>
                  Expira em {formatTime(timeLeft)}
                </S.TimerText>
              </S.TimerCard>

              <S.CancelButton onPress={removeInvoice} activeOpacity={0.7}>
                <X size={16} color="#FF6B6B" strokeWidth={2.2} />
                <S.CancelButtonText>Cancelar cobrança</S.CancelButtonText>
              </S.CancelButton>
            </S.ScrollContent>
          </S.SafeArea>
        )}
      </S.Background>
    </S.Container>
  );
}

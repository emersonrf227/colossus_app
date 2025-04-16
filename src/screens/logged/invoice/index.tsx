import React, { useEffect, useState, useRef } from "react";
import { View, Alert, Clipboard } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { useNavigation, useRoute } from "@react-navigation/native";

import * as S from "./styles";
import { StatusBar } from "react-native";
import LogoSvg from "@/assets/logov2.svg";

import PolLogo from "@/assets/networks/polygon.svg";

import rstruther from "@/infraestructure/http/nodeApi";
import { Ionicons } from "@expo/vector-icons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Loader from "@/components/loader";
import { useToast } from "@/hook/Toast";
interface invoiceData {
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

export default function Invoice() {
  const route = useRoute();
  const navigation = useNavigation();
  const { navigate } = useNavigation();
  const logoIlike = require("@/assets/ilikepb.png");
  const timerRef = useRef(1800);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [timeLeft, setTimeLeft] = useState(timerRef.current);
  const [qrString, setQrString] = useState("teste");
  const [amount, setAmount] = useState("teste");
  const [invoiceId, setInvoiceId] = useState("");
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const removeInvoice = async () => {
    setLoading(true);
    try {
      const response = await rstruther.delete(`saller/invoice?id=${invoiceId}`);
      if (response.status === 200 || response.status === 201) {
        clearAllIntervals();
        navigate("Dashboard");
        return;
      }
    } catch (e) {
      clearAllIntervals();
      navigate("Dashboard");
      return;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (timerRef.current === 0) {
        Alert.alert("Tempo esgotado", "Voltando para a tela anterior...");
        navigation.goBack();
        clearInterval(interval);
        return;
      }

      timerRef.current -= 1;
      setTimeLeft(timerRef.current);
    }, 1000);

    intervalRef.current = setInterval(() => {
      getStatus();
    }, 5000);

    getStatus();

    return () => {
      clearInterval(interval);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [navigation]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

  const getStatus = async () => {
    const obj: invoiceData = route.params;
    console.log("obj", obj);
    const { wallet, invoice } = obj.data;
    setQrString(String(wallet));
    setAmount(invoice.amount);
    setInvoiceId(invoice.id);

    try {
      const response = await rstruther.get(`saller/invoice?id=${invoice.id}`);
      if (response.status === 200 || response.status === 201) {
        console.log("response data ==>", response.data);

        if (response.data.invoice.status === "CANCEL") {
          alert("Invoice expired");
          clearAllIntervals();
          navigate("Dashboard");
          return;
        }

        if (response.data.invoice.status === "CONFIRMED") {
          clearAllIntervals();
          navigate("proofConfirm", { data: response.data });
          return;
        }
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
    }
  };

  const clearAllIntervals = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const copyToClipboard = async () => {
    await Clipboard.setString(qrString);
    showToast({
      message: `Copy Success.`,
      type: "success",
    });
    return;
  };

  return (
    <S.Container>
      {loading && <Loader />}

      <S.Background source={require("@/assets/background.png")}>
        <StatusBar
          barStyle="default"
          backgroundColor="transparent"
          translucent
        />
        {qrString ? (
          <>
            <S.SafeArea>
              <S.Header>
                <S.BackButton onPress={() => removeInvoice()}>
                  <Ionicons name="arrow-back" size={32} color="white" />
                </S.BackButton>
              </S.Header>
              <S.cardLogo>
                <LogoSvg width={wp(45)} height={hp(15)} />
              </S.cardLogo>
              <S.cardPay>
                <PolLogo width={wp(10)} height={hp(10)} />
              </S.cardPay>
              <S.QRCodeContainer>
                <S.cardBalance>
                  <S.TextAmount>{amount}</S.TextAmount>
                  <S.imageToken
                    source={require("@/assets/networks/tether.png")}
                    resizeMode="contain"
                  />
                </S.cardBalance>
                <S.CardQrCode>
                  <QRCode
                    value={`${qrString}`}
                    size={wp(50)}
                    logo={logoIlike}
                    logoSize={30}
                    logoBackgroundColor="white"
                    logoMargin={0}
                    color="black"
                    backgroundColor="white"
                  />
                </S.CardQrCode>
                <S.cardAddress>
                  <S.TextWallet>
                    {" "}
                    {qrString}{" "}
                    <Ionicons
                      onPress={() => copyToClipboard()}
                      name="copy"
                      size={22}
                      color="white"
                    />
                  </S.TextWallet>
                </S.cardAddress>
                <S.TimerText>Expire in: {formatTime(timeLeft)} </S.TimerText>
                <S.FooterButton onPress={() => removeInvoice()}>
                  <S.ButtonText>Cancel</S.ButtonText>
                </S.FooterButton>
              </S.QRCodeContainer>
            </S.SafeArea>
          </>
        ) : (
          <>
            <S.TimerText> Carregando </S.TimerText>
          </>
        )}
      </S.Background>
    </S.Container>
  );
}

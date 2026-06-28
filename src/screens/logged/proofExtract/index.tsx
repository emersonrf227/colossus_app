import React, { useCallback, useState } from "react";
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import * as S from "./styles";
import { StatusBar } from "react-native";
import LogoSvg from "@/assets/logov2.svg";
import ThermalPrinterModule from "react-native-thermal-printer";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Check, Printer, ArrowRight } from "lucide-react-native";
import Loader from "@/components/loader";

interface invoiceData {
  data: {
    amount: string;
    updatedAt: string;
    paymentAddress: string;
    reference: string;
    txid: string;
  };
}

export default function proofExtract() {
  const route = useRoute();
  const navigation = useNavigation();
  const obj: invoiceData = route.params;
  const invoice = obj.data;
  const [selected, setSelected] = useState<string | null>(null);
  const [printing, setPrinting] = useState(false);

  const handleReturn = useCallback(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate("Dashboard" as never);
    }
  }, [navigation]);
  const formattedDate = invoice?.updatedAt
    ? new Date(invoice.updatedAt).toLocaleString("pt-BR")
    : "—";

  const print = async () => {
    const printerModel = await AsyncStorage.getItem("printerModel");
    setSelected(printerModel);
    ThermalPrinterModule.defaultConfig = {
      ...ThermalPrinterModule.defaultConfig,
      ip: "192.168.100.246",
      port: 9100,
      autoCut: false,
      timeout: 30000, // in milliseconds (version >= 2.2.0)
    };

    try {
      const lineWidth = printerModel === "80mm" ? 47 : 32;
      const divider = "-".repeat(lineWidth);
      const doubleDivider = "=".repeat(lineWidth);

      const formattedDate = new Date(invoice.updatedAt).toLocaleString(
        "pt-BR",
        {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        },
      );

      await ThermalPrinterModule.printBluetooth({
        payload:
          // `[L]<img>https://iliketechnology.com.br/img/logo.png</img>\n` +
          `[L]\n` +
          `[L]\n` +
          `[C]<b>Proof Colossus Crypto</b>\n` +
          `[C]${doubleDivider}\n` +
          `[L]\n` +
          `[C]<b>PAGAMENTO CONFIRMADO</b>\n` +
          `[L]\n` +
          `[C]${divider}\n` +
          `[L]<b>Valor</b>[R]<b>${invoice.amount} USDT</b>\n` +
          `[L]Data/Hora[R]${formattedDate}\n` +
          `[C]${divider}\n` +
          `[L]\n` +
          `[L]<b>Destinatário:</b>\n` +
          `[L]${invoice.paymentAddress}\n` +
          `[L]\n` +
          `[L]<b>Referência:</b> ${invoice.reference}\n` +
          `[L]<b>TXID:</b> ${invoice.txid}\n` +
          `[L]\n` +
          `[C]${divider}\n` +
          `[L]<qrcode size='20'>https://polygonscan.com/tx/${invoice.txid}</qrcode>\n` +
          `[L]\n` +
          `[C]<font size='normal'>Escaneie para ver no Polygonscan</font>\n` +
          `[C]${doubleDivider}\n` +
          `[L]\n` +
          `[C]support@iliketechnology.com.br\n` +
          `[C]support@colossuscrypto.com.br\n` +
          `[L]\n` +
          `[L]\n`,
        printerNbrCharactersPerLine: lineWidth,
      });
    } catch (err) {
      //error handling
      console.log(err);
    }
  };

  ThermalPrinterModule.defaultConfig = {
    ...ThermalPrinterModule.defaultConfig,
    ip: "192.168.100.246",
    port: 9100,
    autoCut: false,
    timeout: 30000, // in milliseconds (version >= 2.2.0)
  };

  useFocusEffect(
    React.useCallback(() => {
      (async () => {
        const printerModel = await AsyncStorage.getItem("printerModel");
        console.log("Modelo salvo:", printerModel);
        setSelected(printerModel);
        // print();
      })();
    }, []),
  );

  const tornNotches = Array.from({ length: 16 });

  return (
    <S.Container>
      {printing && <Loader />}
      <S.Background source={require("@/assets/background.png")}>
        <S.BackgroundOverlay />
        <StatusBar
          barStyle="light-content"
          backgroundColor="transparent"
          translucent
        />

        <S.SafeArea>
          <S.cardLogo>
            <LogoSvg width={wp(38)} height={hp(11)} />
          </S.cardLogo>

          <S.ScrollContent showsVerticalScrollIndicator={false}>
            <S.SuccessBadge>
              <S.SuccessIconCircle>
                <Check size={30} color="#FFFFFF" strokeWidth={3} />
              </S.SuccessIconCircle>
              <S.SuccessTitle>Pagamento confirmado</S.SuccessTitle>
              <S.SuccessSubtitle>
                A transação foi validada na blockchain
              </S.SuccessSubtitle>
            </S.SuccessBadge>

            <S.ReceiptCard>
              <S.ReceiptHeader>
                <S.ReceiptBrand>COLOSSUS CRYPTO</S.ReceiptBrand>
                <S.ReceiptBrandSubtitle>
                  Comprovante de pagamento
                </S.ReceiptBrandSubtitle>
              </S.ReceiptHeader>

              <S.AmountHighlight>
                <S.AmountHighlightLabel>VALOR RECEBIDO</S.AmountHighlightLabel>
                <S.AmountHighlightValue>
                  {invoice.amount} USDT
                </S.AmountHighlightValue>
              </S.AmountHighlight>

              <S.DottedDivider />

              <S.DetailRow>
                <S.DetailBlock>
                  <S.DetailLabel>DATA DA CONFIRMAÇÃO</S.DetailLabel>
                  <S.DetailValue>{formattedDate}</S.DetailValue>
                </S.DetailBlock>
              </S.DetailRow>

              <S.DetailRow>
                <S.DetailBlock>
                  <S.DetailLabel>DESTINATÁRIO</S.DetailLabel>
                  <S.DetailValueMono>
                    {invoice.paymentAddress}
                  </S.DetailValueMono>
                </S.DetailBlock>
              </S.DetailRow>

              <S.DetailRow>
                <S.DetailBlock>
                  <S.DetailLabel>REFERÊNCIA</S.DetailLabel>
                  <S.DetailValueMono>{invoice.reference}</S.DetailValueMono>
                </S.DetailBlock>
              </S.DetailRow>

              <S.DetailRow>
                <S.DetailBlock>
                  <S.DetailLabel>TXID</S.DetailLabel>
                  <S.DetailValueMono>{invoice.txid}</S.DetailValueMono>
                </S.DetailBlock>
              </S.DetailRow>

              <S.TornEdgeWrapper>
                {tornNotches.map((_, index) => (
                  <S.TornEdgeNotch key={index} />
                ))}
              </S.TornEdgeWrapper>
            </S.ReceiptCard>

            <S.ActionsContainer>
              <S.ButtonPrint
                onPress={print}
                disabled={printing}
                activeOpacity={0.85}
              >
                <Printer size={18} color="#FFFFFF" strokeWidth={2.2} />
                <S.ButtonText>Imprimir comprovante</S.ButtonText>
              </S.ButtonPrint>

              <S.ButtonReturn onPress={handleReturn} activeOpacity={0.7}>
                <S.ButtonReturnText>Voltar</S.ButtonReturnText>
                <ArrowRight size={16} color="#FFFFFF" strokeWidth={2.2} />
              </S.ButtonReturn>
            </S.ActionsContainer>
          </S.ScrollContent>
        </S.SafeArea>
      </S.Background>
    </S.Container>
  );
}

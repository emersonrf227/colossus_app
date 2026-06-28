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

    // const text =
    //   "[C]<img>https://via.placeholder.com/300.jpg</img>\n" +
    //   "[L]\n" +
    //   "[C]<u><font size='big'>ORDER N°045</font></u>\n" +
    //   "[L]\n" +
    //   "[C]================================\n" +
    //   "[L]\n" +
    //   "[L]<b>BEAUTIFUL SHIRT</b>[R]9.99e\n" +
    //   "[L]  + Size : S\n" +
    //   "[L]\n" +
    //   "[L]<b>AWESOME HAT</b>[R]24.99e\n" +
    //   "[L]  + Size : 57/58\n" +
    //   "[L]\n" +
    //   "[C]--------------------------------\n" +
    //   "[R]TOTAL PRICE :[R]34.98e\n" +
    //   "[R]TAX :[R]4.23e\n" +
    //   "[L]\n" +
    //   "[C]================================\n" +
    //   "[L]\n" +
    //   "[L]<font size='tall'>Customer :</font>\n" +
    //   "[L]Raymond DUPONT\n" +
    //   "[L]5 rue des girafes\n" +
    //   "[L]31547 PERPETES\n" +
    //   "[L]Tel : +33801201456\n" +
    //   "[L]\n" +
    //   "[C]<barcode type='ean13' height='10'>831254784551</barcode>\n" +
    //   "[C]<qrcode size='20'>http://www.developpeur-web.dantsu.com/</qrcode>\n" +
    //   "[L]\n" +
    //   "[L]\n" +
    //   "[L]\n" +
    //   "[L]\n" +
    //   "[L]\n";
    try {
      console.log(printerModel === "50mm" ? 32 : 80);
      await ThermalPrinterModule.printBluetooth({
        payload:
          `[C]Proof Colossus Crypto\n` +
          `[C]--------------------------------\n` +
          `[L]AMOUNT:[R] ${invoice?.amount}USDT\n` +
          `[L]DATE CONFIRMATION:[R]${invoice?.updatedAt}\n` +
          `[L]RECEIVER: ${invoice?.paymentAddress}\n` +
          `[L]\n` +
          `[C]--------------------------------\n` +
          `[L]\n` +
          `[L]REFERENCE: ${invoice?.reference}\n` +
          `[L]TXID : ${invoice?.txid}\n` +
          `[C]<qrcode size='20'>https://polygonscan.com/tx/${invoice.txid}</qrcode>\n` +
          `[C]--------------------------------\n` +
          `[L]support@iliketechnology.com.br\n` +
          `[L]support@colossuscrypto.com.br\n`,
        printerNbrCharactersPerLine: printerModel === "80mm" ? 47 : 32,
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
        print();
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

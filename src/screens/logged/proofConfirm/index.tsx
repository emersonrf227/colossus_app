import React, { useCallback, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as S from "./styles";
import { StatusBar } from "react-native";
import LogoSvg from "@/assets/logov2.svg";
import ThermalPrinterModule from "react-native-thermal-printer";
import { Check, Printer, ArrowRight } from "lucide-react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useToast } from "@/hook/Toast";
import Loader from "@/components/loader";

interface InvoiceData {
  data: {
    invoice: {
      amount: string;
      updatedAt: string;
      paymentAddress: string;
      reference: string;
      txid: string;
    };
    wallet: string;
  };
}

const PRINTER_IP = "192.168.100.246";
const PRINTER_PORT = 9100;

export default function ProofConfirm() {
  const route = useRoute();
  const navigation = useNavigation();
  const { showToast } = useToast();
  const [printing, setPrinting] = useState(false);

  const params = route.params as InvoiceData | undefined;
  const invoice = params?.data?.invoice;

  const formattedDate = invoice?.updatedAt
    ? new Date(invoice.updatedAt).toLocaleString("pt-BR")
    : "—";

  const print = useCallback(async () => {
    if (!invoice) return;

    const printerModel = await AsyncStorage.getItem("printerModel");

    if (!printerModel) {
      showToast({
        message: "Nenhuma impressora configurada. Acesse as configurações.",
        type: "error",
      });
      return;
    }

    setPrinting(true);
    try {
      ThermalPrinterModule.defaultConfig = {
        ...ThermalPrinterModule.defaultConfig,
        ip: PRINTER_IP,
        port: PRINTER_PORT,
        autoCut: false,
        timeout: 30000,
      };

      await ThermalPrinterModule.printBluetooth({
        payload:
          `[C]Proof Colossus Crypto\n` +
          `[C]--------------------------------\n` +
          `[L]AMOUNT:[R] ${invoice.amount}USDT\n` +
          `[L]DATE CONFIRMATION:[R]${invoice.updatedAt}\n` +
          `[L]RECEIVER: ${invoice.paymentAddress}\n` +
          `[L]\n` +
          `[C]--------------------------------\n` +
          `[L]\n` +
          `[L]REFERENCE: ${invoice.reference}\n` +
          `[L]TXID : ${invoice.txid}\n` +
          `[C]<qrcode size='20'>https://polygonscan.com/tx/${invoice.txid}</qrcode>\n` +
          `[L]support@iliketechnology.com.br\n` +
          `[L]support@colossuscrypto.com.br`,
        printerNbrCharactersPerLine: printerModel === "80mm" ? 47 : 32,
      });

      showToast({ message: "Comprovante impresso!", type: "success" });
    } catch (err) {
      console.log(err);
      showToast({
        message: "Não foi possível imprimir. Verifique a impressora.",
        type: "error",
      });
    } finally {
      setPrinting(false);
    }
  }, [invoice, showToast]);

  const handleReturn = useCallback(() => {
    navigation.navigate("Dashboard" as never);
  }, [navigation]);

  // Borda serrilhada do rodapé do recibo (efeito "rasgo de cupom fiscal")
  const tornNotches = Array.from({ length: 16 });

  if (!invoice) {
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
            <S.SuccessSubtitle>Comprovante não encontrado.</S.SuccessSubtitle>
          </S.SafeArea>
        </S.Background>
      </S.Container>
    );
  }

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
                <S.ButtonReturnText>Voltar ao início</S.ButtonReturnText>
                <ArrowRight size={16} color="#FFFFFF" strokeWidth={2.2} />
              </S.ButtonReturn>
            </S.ActionsContainer>
          </S.ScrollContent>
        </S.SafeArea>
      </S.Background>
    </S.Container>
  );
}

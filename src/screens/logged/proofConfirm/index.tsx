import React, { useCallback, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as S from "./styles";
import { StatusBar } from "react-native";
import LogoSvg from "@/assets/logov2.svg";
import ThermalPrinterModule from "react-native-thermal-printer";
import { Check, Printer, ArrowRight } from "lucide-react-native";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
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
        message: t("receipt.toastNoPrinter"),
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
          // `[C]<img>https://seusite.com.br/logo-recibo.png</img>\n` +
          `[L]\n` +
          `[C]<font size='big'><b>${t("receipt.print.headerTitle")}</b></font>\n` +
          `[C]${doubleDivider}\n` +
          `[L]\n` +
          `[C]<b>${t("receipt.print.statusConfirmed")}</b>\n` +
          `[L]\n` +
          `[C]${divider}\n` +
          `[L]<b>${t("receipt.print.amountLabel")}</b>[R]<b>${invoice.amount} USDT</b>\n` +
          `[L]${t("receipt.print.dateTimeLabel")}[R]${formattedDate}\n` +
          `[C]${divider}\n` +
          `[L]\n` +
          `[L]<b>${t("receipt.print.recipientLabel")}</b>\n` +
          `[L]${invoice.paymentAddress}\n` +
          `[L]\n` +
          `[L]<b>${t("receipt.print.referenceLabel")}</b> ${invoice.reference}\n` +
          `[L]<b>${t("receipt.print.txidLabel")}</b> ${invoice.txid}\n` +
          `[L]\n` +
          `[C]${divider}\n` +
          `[C]<qrcode size='20'>https://polygonscan.com/tx/${invoice.txid}</qrcode>\n` +
          `[L]\n` +
          `[C]<font size='normal'>${t("receipt.print.scanHint")}</font>\n` +
          `[C]${doubleDivider}\n` +
          `[L]\n` +
          `[C]support@iliketechnology.com.br\n` +
          `[C]support@colossuscrypto.com.br\n` +
          `[L]\n` +
          `[L]\n`,
        printerNbrCharactersPerLine: lineWidth,
      });
      showToast({
        message: t("receipt.toastPrintSuccess"),
        type: "success",
      });
    } catch (err) {
      console.log(err);
      showToast({
        message: t("receipt.toastPrintError"),
        type: "error",
      });
    } finally {
      setPrinting(false);
    }
  }, [invoice, showToast, t]);

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
            <S.SuccessSubtitle>{t("receipt.notFound")}</S.SuccessSubtitle>
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
              <S.SuccessTitle>{t("receipt.paymentConfirmed")}</S.SuccessTitle>
              <S.SuccessSubtitle>
                {t("receipt.validatedOnBlockchain")}
              </S.SuccessSubtitle>
            </S.SuccessBadge>

            <S.ReceiptCard>
              <S.ReceiptHeader>
                <S.ReceiptBrand>COLOSSUS CRYPTO</S.ReceiptBrand>
                <S.ReceiptBrandSubtitle>
                  {t("receipt.receiptSubtitle")}
                </S.ReceiptBrandSubtitle>
              </S.ReceiptHeader>

              <S.AmountHighlight>
                <S.AmountHighlightLabel>
                  {t("receipt.amountReceived")}
                </S.AmountHighlightLabel>
                <S.AmountHighlightValue>
                  {invoice.amount} USDT
                </S.AmountHighlightValue>
              </S.AmountHighlight>

              <S.DottedDivider />

              <S.DetailRow>
                <S.DetailBlock>
                  <S.DetailLabel>{t("receipt.confirmationDate")}</S.DetailLabel>
                  <S.DetailValue>{formattedDate}</S.DetailValue>
                </S.DetailBlock>
              </S.DetailRow>

              <S.DetailRow>
                <S.DetailBlock>
                  <S.DetailLabel>{t("receipt.recipient")}</S.DetailLabel>
                  <S.DetailValueMono>
                    {invoice.paymentAddress}
                  </S.DetailValueMono>
                </S.DetailBlock>
              </S.DetailRow>

              <S.DetailRow>
                <S.DetailBlock>
                  <S.DetailLabel>{t("receipt.reference")}</S.DetailLabel>
                  <S.DetailValueMono>{invoice.reference}</S.DetailValueMono>
                </S.DetailBlock>
              </S.DetailRow>

              <S.DetailRow>
                <S.DetailBlock>
                  <S.DetailLabel>{t("receipt.txid")}</S.DetailLabel>
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
                <S.ButtonText>{t("receipt.printButton")}</S.ButtonText>
              </S.ButtonPrint>

              <S.ButtonReturn onPress={handleReturn} activeOpacity={0.7}>
                <S.ButtonReturnText>
                  {t("receipt.backButton")}
                </S.ButtonReturnText>
                <ArrowRight size={16} color="#FFFFFF" strokeWidth={2.2} />
              </S.ButtonReturn>
            </S.ActionsContainer>
          </S.ScrollContent>
        </S.SafeArea>
      </S.Background>
    </S.Container>
  );
}

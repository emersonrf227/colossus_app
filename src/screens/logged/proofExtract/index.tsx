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
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
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
        // `[L]<img>https://iliketechnology.com.br/img/logo.png</img>\n` +
        // `[L]\n` +
        // `[L]\n` +
        // `[C]<b>${t("receipt.print.headerTitle")}</b>\n` +
        // `[C]${doubleDivider}\n` +
        // `[L]\n` +
        // `[C]<b>${t("receipt.print.statusConfirmed")}</b>\n` +
        // `[L]\n` +
        // `[C]${divider}\n` +
        // `[L]<b>${t("receipt.print.amountLabel")}</b>[R]<b>${invoice.amount} USDT</b>\n` +
        // `[L]${t("receipt.print.dateTimeLabel")}[R]${formattedDate}\n` +
        // `[C]${divider}\n` +
        // `[L]\n` +
        // `[L]<b>${t("receipt.print.recipientLabel")}</b>\n` +
        // `[L]${invoice.paymentAddress}\n` +
        // `[L]\n` +
        // `[L]<b>${t("receipt.print.referenceLabel")}</b> ${invoice.reference}\n` +
        // `[L]<b>${t("receipt.print.txidLabel")}</b> ${invoice.txid}\n` +
        // `[L]\n` +
        // `[C]${divider}\n` +
        // `[L]<qrcode size='20'>https://polygonscan.com/tx/${invoice.txid}</qrcode>\n` +
        // `[L]\n` +
        // `[C]<font size='normal'>${t("receipt.print.scanHint")}</font>\n` +
        // `[C]${doubleDivider}\n` +
        // `[L]\n` +
        // `[C]support@iliketechnology.com.br\n` +
        // `[C]support@colossuscrypto.com.br\n` +
        // `[L]\n` +
        // `[L]\n`,
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
                  {t("proofExtract.backButton")}
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

import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
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

interface invoiceData {
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

export default function proofConfirm() {
  const route = useRoute();
  const navigation = useNavigation();
  const obj: invoiceData = route.params;
  const { invoice, wallet } = obj.data;
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const printerModel = await AsyncStorage.getItem("printerModel");
      console.log("Modelo salvo:", printerModel);
      setSelected(printerModel);
    })();
  }, []);

  const print = async () => {
    ThermalPrinterModule.defaultConfig = {
      ...ThermalPrinterModule.defaultConfig,
      ip: "192.168.100.246",
      port: 9100,
      autoCut: false,
      timeout: 30000, // in milliseconds (version >= 2.2.0)
    };

    const text =
      "[C]<img>https://via.placeholder.com/300.jpg</img>\n" +
      "[L]\n" +
      "[C]<u><font size='big'>ORDER N°045</font></u>\n" +
      "[L]\n" +
      "[C]================================\n" +
      "[L]\n" +
      "[L]<b>BEAUTIFUL SHIRT</b>[R]9.99e\n" +
      "[L]  + Size : S\n" +
      "[L]\n" +
      "[L]<b>AWESOME HAT</b>[R]24.99e\n" +
      "[L]  + Size : 57/58\n" +
      "[L]\n" +
      "[C]--------------------------------\n" +
      "[R]TOTAL PRICE :[R]34.98e\n" +
      "[R]TAX :[R]4.23e\n" +
      "[L]\n" +
      "[C]================================\n" +
      "[L]\n" +
      "[L]<font size='tall'>Customer :</font>\n" +
      "[L]Raymond DUPONT\n" +
      "[L]5 rue des girafes\n" +
      "[L]31547 PERPETES\n" +
      "[L]Tel : +33801201456\n" +
      "[L]\n" +
      "[C]<barcode type='ean13' height='10'>831254784551</barcode>\n" +
      "[C]<qrcode size='20'>http://www.developpeur-web.dantsu.com/</qrcode>\n" +
      "[L]\n" +
      "[L]\n" +
      "[L]\n" +
      "[L]\n" +
      "[L]\n";
    try {
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
          `[L]support@iliketechnology.com.br\n` +
          `[L]support@colossuscrypto.com.br`,

        printerNbrCharactersPerLine: selected === "50" ? 32 : 80,
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
      print();
    }, [])
  );

  return (
    <S.Container>
      <S.Background source={require("@/assets/background.png")}>
        <StatusBar
          barStyle="default"
          backgroundColor="transparent"
          translucent
        />
        <S.SafeArea>
          <S.Header></S.Header>
          <S.cardLogo>
            <LogoSvg width={wp(45)} height={hp(15)} />
          </S.cardLogo>
          <S.ReceiptContainer>
            <S.Title>Proof</S.Title>

            <S.DetailRow>
              <S.DetailColumn>
                <S.DetailLabel>Amount:</S.DetailLabel>
                <S.DetailValue>{invoice.amount} USDT</S.DetailValue>
              </S.DetailColumn>
              <S.DetailColumn>
                <S.DetailLabel>Date Confirmation:</S.DetailLabel>
                <S.DetailValue>{invoice.updatedAt}</S.DetailValue>
              </S.DetailColumn>
            </S.DetailRow>

            <S.DetailColumn>
              <S.DetailLabel>Receive:</S.DetailLabel>
              <S.DetailValue>{invoice.paymentAddress}</S.DetailValue>
            </S.DetailColumn>

            <S.DetailColumn>
              <S.DetailLabel>Reference:</S.DetailLabel>
              <S.DetailValue>{invoice.reference}</S.DetailValue>
            </S.DetailColumn>

            <S.DetailColumn>
              <S.DetailLabel>Txid:</S.DetailLabel>
              <S.DetailValue>{invoice.txid}</S.DetailValue>
            </S.DetailColumn>

            <S.ButtonContainer>
              <S.ButtonPrint onPress={() => print()}>
                <S.ButtonText>Print</S.ButtonText>
              </S.ButtonPrint>
            </S.ButtonContainer>
            <S.ButtonContainer>
              <S.ButtonReturn onPress={() => navigation.navigate("Dashboard")}>
                <S.ButtonText>Return</S.ButtonText>
              </S.ButtonReturn>
            </S.ButtonContainer>
          </S.ReceiptContainer>
        </S.SafeArea>
      </S.Background>
    </S.Container>
  );
}

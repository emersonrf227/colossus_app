import React, { useEffect, useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "react-native";
import * as S from "./styles";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Loader from "@/components/loader";
import LogoSvg from "@/assets/logov2.svg";
import LogoAbount from "@/assets/logoAbout.svg";
import Wblogo from "@/assets/wb.svg";
import { Linking } from "react-native";

import rstruther from "@/infraestructure/http/nodeApi";
import { AccordionItem } from "@/components/faq";

export default function supportScren() {
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  const faqData = [
    {
      question: "Como usar o WhatsApp Colossus?",
      answer: "Basta clicar no botão 'Help Me' para abrir o suporte via WhatsApp.",
    },
    {
      question: "O suporte está disponível 24/7?",
      answer: "Nosso suporte funciona das 8h às 20h, de segunda a sábado.",
    },
    {
      question: "Preciso de cadastro para usar?",
      answer: "Não, o acesso ao suporte é imediato e sem necessidade de cadastro.",
    },
    {
      question: "Como usar o WhatsApp Colossus?",
      answer: "Basta clicar no botão 'Help Me' para abrir o suporte via WhatsApp.",
    },
    {
      question: "O suporte está disponível 24/7?",
      answer: "Nosso suporte funciona das 8h às 20h, de segunda a sábado.",
    },
    {
      question: "Preciso de cadastro para usar?",
      answer: "Não, o acesso ao suporte é imediato e sem necessidade de cadastro.",
    },
    {
      question: "Como usar o WhatsApp Colossus?",
      answer: "Basta clicar no botão 'Help Me' para abrir o suporte via WhatsApp.",
    },
    {
      question: "O suporte está disponível 24/7?",
      answer: "Nosso suporte funciona das 8h às 20h, de segunda a sábado.",
    },
    {
      question: "Preciso de cadastro para usar?",
      answer: "Não, o acesso ao suporte é imediato e sem necessidade de cadastro.",
    },
  ];
  

  useEffect(() => {}, []);

  const openWhatsApp = () => {
    const phoneNumber = "+5511973223571"; // Substitua com o número desejado
    const message = "Olá, preciso de ajuda!";
    const url = `https://wa.me/${phoneNumber.replace(
      "+",
      ""
    )}?text=${encodeURIComponent(message)}`;

    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(url);
        } else {
          alert("Não foi possível abrir o WhatsApp");
        }
      })
      .catch((err) => console.error("Erro ao abrir o WhatsApp:", err));
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
        <S.SafeArea>
          <S.Header>
            <S.BackButton onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={32} color="white" />
            </S.BackButton>
          </S.Header>

          <S.cardLogo>
            <LogoSvg width={wp(45)} height={hp(15)} />
          </S.cardLogo>

          <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
            <S.InfoBox>
              <Wblogo width={wp(20)} height={hp(10)} />
              <S.Label>WHATSAPP COLOSSUS</S.Label>
              <S.LoginButton onPress={() => openWhatsApp()}>
                <S.ButtonText>Help Me</S.ButtonText>
              </S.LoginButton>
            </S.InfoBox>
            {faqData.map((item, index) => (
            <AccordionItem
              key={index}
              question={item.question}
              answer={item.answer}
              />
            ))}
          </ScrollView>
        </S.SafeArea>
      </S.Background>
    </S.Container>
  );
}

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
import Wblogo from "@/assets/wb.svg";
import { Linking } from "react-native";
import { AccordionItem } from "@/components/faq";

export default function supportScren() {
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  const faqData = [
    {
      question: "1. O que é a Colossus Crypto?",
      answer:
        "A Colossus Crypto é uma solução de pagamentos digitais desenvolvida pela I Like Technology, que permite que comércios de todos os portes aceitem pagamentos em USDT (Tether) – uma das criptomoedas mais estáveis e utilizadas do mundo – por meio de aplicativo, sistema web e maquininha de cartão.",
    },
    {
      question: "2. Quem pode utilizar a Colossus Crypto?",
      answer:
        "A plataforma é voltada para comerciantes (pessoas físicas ou jurídicas) que desejam oferecer uma alternativa moderna e segura de pagamento aos seus clientes, além de contar com taxas mais atrativas e liquidez imediata.",
    },
    {
      question: "3. Como funciona o recebimento em USDT?",
      answer:
        "Ao realizar uma venda, o comerciante gera um QR Code ou link de pagamento via aplicativo, sistema ou maquininha. O cliente faz o pagamento em USDT, e o valor é recebido instantaneamente na carteira digital do comerciante vinculada à Colossus Crypto.",
    },
    {
      question: "4. Quais são as taxas cobradas pela Colossus Crypto?",
      answer:
        "A Colossus Crypto cobra uma taxa fixa de 1.95% por transação, inferior à média praticada por operadoras tradicionais de cartão de crédito.",
    },
    {
      question: "5. Preciso entender de criptomoedas para usar a plataforma?",
      answer:
        "Não. A plataforma foi projetada para ser intuitiva e simples, com interface amigável e suporte dedicado, mesmo para quem nunca utilizou criptomoedas antes.",
    },
    {
      question: "6. Onde posso usar a Colossus Crypto?",
      answer:
        "A solução pode ser utilizada em lojas físicas, e-commerces, serviços delivery ou autônomos, através de: \n• Aplicativo mobile; \n• Sistema web; \n• Maquininha de pagamento compatível.",
    },
    {
      question: "7. É seguro receber pagamentos em USDT?",
      answer:
        "Sim. O USDT é uma stablecoin lastreada em dólar, com estabilidade e liquidez elevadas. Além disso, a Colossus Crypto adota tecnologias de segurança, criptografia e autenticação para garantir total proteção nas transações.",
    },
    {
      question:
        "8. Quais os benefícios de aceitar criptomoedas no meu negócio?",
      answer:
        "Além da visibilidade como empresa moderna, os comerciantes se beneficiam com: \n • Taxas menores; \n• Liquidação instantânea; \n• Acesso a um novo perfil de consumidores; \n• Isenção de burocracias bancárias tradicionais.",
    },

    {
      question: "9. Preciso de cadastro para usar?",
      answer:
        "Baixe o app, realize seu cadastro junto a um consultor da Colossus Crypto e, após verificação, sua empresa já estará pronta para aceitar pagamentos em USDT.",
    },
  ];

  useEffect(() => {}, []);

  const openWhatsApp = () => {
    const phoneNumber = "+551129089826"; // Substitua com o número desejado
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

          <S.Card>
            <S.InfoBox>
              <Wblogo width={wp(15)} height={hp(10)} />
              <S.Label>WHATSAPP COLOSSUS</S.Label>
              <S.LoginButton onPress={() => openWhatsApp()}>
                <S.ButtonText>Help Me</S.ButtonText>
              </S.LoginButton>
            </S.InfoBox>
            <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
              <S.FaqBox>
                {faqData.map((item, index) => (
                  <AccordionItem
                    key={index}
                    question={item.question}
                    answer={item.answer}
                  />
                ))}
              </S.FaqBox>
            </ScrollView>
          </S.Card>
        </S.SafeArea>
      </S.Background>
    </S.Container>
  );
}

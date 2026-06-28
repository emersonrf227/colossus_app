import React, { useState, useCallback } from "react";
import { Linking, StatusBar } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ArrowLeft, MessageCircle } from "lucide-react-native";
import * as S from "./styles";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Loader from "@/components/loader";
import LogoSvg from "@/assets/logov2.svg";
import { AccordionItem } from "@/components/faq";
import { useToast } from "@/hook/Toast";

const WHATSAPP_NUMBER = "+551129089826";
const WHATSAPP_MESSAGE = "Olá, preciso de ajuda!";

const FAQ_DATA = [
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
      "A solução pode ser utilizada em lojas físicas, e-commerces, serviços delivery ou autônomos, através de aplicativo mobile, sistema web ou maquininha de pagamento compatível.",
  },
  {
    question: "7. É seguro receber pagamentos em USDT?",
    answer:
      "Sim. O USDT é uma stablecoin lastreada em dólar, com estabilidade e liquidez elevadas. Além disso, a Colossus Crypto adota tecnologias de segurança, criptografia e autenticação para garantir total proteção nas transações.",
  },
  {
    question: "8. Quais os benefícios de aceitar criptomoedas no meu negócio?",
    answer:
      "Além da visibilidade como empresa moderna, os comerciantes se beneficiam com taxas menores, liquidação instantânea, acesso a um novo perfil de consumidores e isenção de burocracias bancárias tradicionais.",
  },
  {
    question: "9. Preciso de cadastro para usar?",
    answer:
      "Baixe o app, realize seu cadastro junto a um consultor da Colossus Crypto e, após verificação, sua empresa já estará pronta para aceitar pagamentos em USDT.",
  },
];

export default function SupportScreen() {
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const { showToast } = useToast();

  const openWhatsApp = useCallback(async () => {
    const url = `https://wa.me/${WHATSAPP_NUMBER.replace(
      "+",
      "",
    )}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        showToast({
          message: "Não foi possível abrir o WhatsApp",
          type: "error",
        });
      }
    } catch {
      showToast({
        message: "Não foi possível abrir o WhatsApp",
        type: "error",
      });
    }
  }, [showToast]);

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

        <S.SafeArea>
          <S.Header>
            <S.BackButton
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
            >
              <ArrowLeft size={22} color="#FFFFFF" strokeWidth={2.2} />
            </S.BackButton>
            <S.HeaderTitle>Suporte</S.HeaderTitle>
          </S.Header>

          <S.cardLogo>
            <LogoSvg width={wp(36)} height={hp(10)} />
          </S.cardLogo>

          <S.ScrollContent
            contentContainerStyle={{ paddingBottom: 32 }}
            showsVerticalScrollIndicator={false}
          >
            <S.ContactCard>
              <S.ContactIconWrapper>
                <MessageCircle size={28} color="#2ECC71" strokeWidth={2.2} />
              </S.ContactIconWrapper>
              <S.ContactTitle>Precisa de ajuda?</S.ContactTitle>
              <S.ContactSubtitle>
                Fale direto com nosso time pelo WhatsApp
              </S.ContactSubtitle>
              <S.WhatsAppButton onPress={openWhatsApp} activeOpacity={0.85}>
                <MessageCircle size={18} color="#FFFFFF" strokeWidth={2.2} />
                <S.WhatsAppButtonText>Falar no WhatsApp</S.WhatsAppButtonText>
              </S.WhatsAppButton>
            </S.ContactCard>

            <S.SectionLabel>PERGUNTAS FREQUENTES</S.SectionLabel>

            {FAQ_DATA.map((item, index) => (
              <AccordionItem
                key={index}
                question={item.question}
                answer={item.answer}
              />
            ))}
          </S.ScrollContent>
        </S.SafeArea>
      </S.Background>
    </S.Container>
  );
}

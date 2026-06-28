import React from "react";
import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "react-native";
import { ArrowLeft } from "lucide-react-native";
import * as S from "./styles";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import LogoSvg from "@/assets/logov2.svg";

interface TermsSection {
  number: number;
  title: string;
  paragraphs?: string[];
  bullets?: string[];
}

const TERMS_SECTIONS: TermsSection[] = [
  {
    number: 1,
    title: "Objeto",
    paragraphs: [
      "A presente plataforma tem por finalidade disponibilizar soluções tecnológicas para que comerciantes e usuários aceitem e realizem pagamentos por meio de ativos digitais, especialmente a stablecoin USDT (Tether), em ambiente seguro, eficiente e transparente, por meio de aplicativo, sistema web, APIs e dispositivos físicos (maquininhas).",
    ],
  },
  {
    number: 2,
    title: "Cadastro e Elegibilidade",
    paragraphs: [
      "2.1. Para utilizar os serviços, o Usuário deverá realizar cadastro prévio, fornecendo informações verídicas, completas e atualizadas.",
      "2.2. A I Like Technology reserva-se o direito de verificar a veracidade das informações, podendo, inclusive, recusar ou suspender cadastros em caso de inconsistências ou uso indevido.",
    ],
  },
  {
    number: 3,
    title: "Condições de Uso",
    paragraphs: [
      "3.1. O Usuário compromete-se a utilizar a Plataforma exclusivamente para fins lícitos, responsabilizando-se civil e criminalmente por quaisquer atos praticados.",
      "3.2. É vedada a utilização da Plataforma para:",
    ],
    bullets: [
      "Transações fraudulentas ou que envolvam atividades ilegais",
      "Lavagem de dinheiro ou financiamento ao terrorismo",
      "Comércio de produtos ou serviços proibidos por lei",
    ],
  },
  {
    number: 4,
    title: "Remuneração e Taxas",
    paragraphs: [
      "4.1. A utilização da Plataforma poderá implicar na incidência de taxas, atualmente fixadas em 2% (dois por cento) sobre cada transação realizada.",
      "4.2. A I Like Technology reserva-se o direito de alterar os valores mediante aviso prévio com antecedência mínima de 15 (quinze) dias.",
    ],
  },
  {
    number: 5,
    title: "Propriedade Intelectual",
    paragraphs: [
      "Todos os elementos da Colossus Crypto, incluindo logotipos, sistemas, códigos, conteúdos e marcas, são de propriedade exclusiva da I Like Technology, sendo vedada qualquer reprodução ou uso não autorizado.",
    ],
  },
  {
    number: 6,
    title: "Responsabilidades",
    paragraphs: ["6.1. A I Like Technology não se responsabiliza por:"],
    bullets: [
      "Erros causados por má utilização da plataforma",
      "Falhas decorrentes de terceiros (ex: operadoras de internet)",
      "Perdas financeiras decorrentes de transações indevidas realizadas por terceiros com acesso à conta ou wallet do usuário",
    ],
  },
  {
    number: 7,
    title: "Modificações e Atualizações",
    paragraphs: [
      "Este Termo poderá ser alterado a qualquer momento. O uso contínuo da plataforma após a publicação das alterações implicará aceitação tácita dos novos termos.",
    ],
  },
];

export default function TermsOfUse() {
  const navigation = useNavigation();

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
          <S.Header>
            <S.BackButton
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
            >
              <ArrowLeft size={22} color="#FFFFFF" strokeWidth={2.2} />
            </S.BackButton>
            <S.HeaderTitle>Termos de Uso</S.HeaderTitle>
          </S.Header>

          <S.cardLogo>
            <LogoSvg width={wp(36)} height={hp(10)} />
          </S.cardLogo>

          <S.ScrollContent
            contentContainerStyle={{ paddingBottom: 32 }}
            showsVerticalScrollIndicator={false}
          >
            <S.DocHeader>
              <S.DocTitle>Termos de Uso – Colossus Crypto</S.DocTitle>
              <S.DocUpdatedAt>Última atualização: 06/04/2025</S.DocUpdatedAt>
            </S.DocHeader>

            <S.IntroCard>
              <S.IntroText>
                Este Termo de Uso regula a utilização da plataforma Colossus
                Crypto, doravante denominada "Plataforma", de titularidade da I
                Like Technology, inscrita sob o CNPJ nº 45.123.168/0001-22.
                {"\n\n"}
                Ao acessar ou utilizar qualquer funcionalidade disponibilizada
                na Plataforma, o Usuário declara ter lido, compreendido e
                concordado integralmente com as disposições aqui previstas.
              </S.IntroText>
            </S.IntroCard>

            {TERMS_SECTIONS.map((section) => (
              <S.SectionCard key={section.number}>
                <S.SectionHeader>
                  <S.SectionNumberBadge>
                    <S.SectionNumberText>{section.number}</S.SectionNumberText>
                  </S.SectionNumberBadge>
                  <S.SectionTitle>{section.title}</S.SectionTitle>
                </S.SectionHeader>

                {section.paragraphs?.map((paragraph, index) => (
                  <S.SectionBody key={index}>{paragraph}</S.SectionBody>
                ))}

                {section.bullets?.map((bullet, index) => (
                  <S.SectionBullet key={index}>• {bullet}</S.SectionBullet>
                ))}
              </S.SectionCard>
            ))}

            <S.FooterNote>
              Colossus Crypto · I Like Technology{"\n"}
              CNPJ 45.123.168/0001-22
            </S.FooterNote>
          </S.ScrollContent>
        </S.SafeArea>
      </S.Background>
    </S.Container>
  );
}

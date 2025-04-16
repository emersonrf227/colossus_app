import React from "react";
import { ScrollView, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "react-native";
import * as S from "./styles";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import LogoSvg from "@/assets/logov2.svg";

export default function TermsOfUse() {
  const navigation = useNavigation();

  return (
    <S.Container>
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

          <S.CardCenter>
            <ScrollView
              contentContainerStyle={{ padding: 20, paddingBottom: 150 }}
            >
              <S.Label
                style={{
                  fontSize: wp("4.5%"),
                  textAlign: "center",
                  marginBottom: 10,
                }}
              >
                Termos de Uso – Colossus Crypto
              </S.Label>
              <S.Label style={{ fontWeight: "normal" }}>
                Última atualização: 06/04/2025
              </S.Label>

              <S.Label>
                {"\n"}Este Termo de Uso regula a utilização da plataforma
                Colossus Crypto, doravante denominada “Plataforma”, de
                titularidade da I Like Technology, inscrita sob o CNPJ nº
                45.123.168/0001-22.
              </S.Label>

              <S.Label>
                {"\n"}Ao acessar ou utilizar qualquer funcionalidade
                disponibilizada na Plataforma, o Usuário declara ter lido,
                compreendido e concordado integralmente com as disposições aqui
                previstas.
              </S.Label>

              <S.Label>
                {"\n"}1. Objeto{"\n"}A presente plataforma tem por finalidade
                disponibilizar soluções tecnológicas para que comerciantes e
                usuários aceitem e realizem pagamentos por meio de ativos
                digitais, especialmente a stablecoin USDT (Tether), em ambiente
                seguro, eficiente e transparente, por meio de aplicativo,
                sistema web, API’s e dispositivos físicos (maquininhas).
              </S.Label>

              <S.Label>
                {"\n"}2. Cadastro e Elegibilidade{"\n"}2.1. Para utilizar os
                serviços, o Usuário deverá realizar cadastro prévio, fornecendo
                informações verídicas, completas e atualizadas.{"\n"}2.2. A I
                Like Technology reserva-se o direito de verificar a veracidade
                das informações, podendo, inclusive, recusar ou suspender
                cadastros em caso de inconsistências ou uso indevido.
              </S.Label>

              <S.Label>
                {"\n"}3. Condições de Uso{"\n"}3.1. O Usuário compromete-se a
                utilizar a Plataforma exclusivamente para fins lícitos,
                responsabilizando-se civil e criminalmente por quaisquer atos
                praticados.{"\n"}3.2. É vedada a utilização da Plataforma
                para:\n• Transações fraudulentas ou que envolvam atividades
                ilegais;\n• Lavagem de dinheiro ou financiamento ao
                terrorismo;\n• Comércio de produtos ou serviços proibidos por
                lei.
              </S.Label>

              <S.Label>
                {"\n"}4. Remuneração e Taxas{"\n"}4.1. A utilização da
                Plataforma poderá implicar na incidência de taxas, atualmente
                fixadas em 2% (dois por cento) sobre cada transação realizada.
                {"\n"}4.2. A I Like Technology reserva-se o direito de alterar
                os valores mediante aviso prévio com antecedência mínima de 15
                (quinze) dias.
              </S.Label>

              <S.Label>
                {"\n"}5. Propriedade Intelectual{"\n"}Todos os elementos da
                Colossus Crypto, incluindo logotipos, sistemas, códigos,
                conteúdos e marcas, são de propriedade exclusiva da I Like
                Technology, sendo vedada qualquer reprodução ou uso não
                autorizado.
              </S.Label>

              <S.Label>
                {"\n"}6. Responsabilidades{"\n"}6.1. A I Like Technology não se
                responsabiliza por:\n• Erros causados por má utilização da
                plataforma;\n• Falhas decorrentes de terceiros (ex: operadoras
                de internet);\n• Perdas financeiras decorrentes de transações
                indevidas realizadas por terceiros com acesso à conta ou wallet
                do usuário.
              </S.Label>

              <S.Label>
                {"\n"}7. Modificações e Atualizações{"\n"}Este Termo poderá ser
                alterado a qualquer momento. O uso contínuo da plataforma após a
                publicação das alterações implicará aceitação tácita dos novos
                termos.
              </S.Label>
            </ScrollView>
          </S.CardCenter>
        </S.SafeArea>
      </S.Background>
    </S.Container>
  );
}

import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Alert, StatusBar } from "react-native";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import LogoSvg from "@/assets/logov2.svg";
import * as S from "./styles";
import { Printer } from "lucide-react-native"; // Importe os ícones
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SelectPrinterScreen() {
  const navigation = useNavigation();
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const savedOption = await AsyncStorage.getItem("printerModel");
      if (savedOption) {
        setSelected(savedOption);
      }
    })();
  }, []);

  const saveSelection = async (model: string) => {
    try {
      await AsyncStorage.setItem("printerModel", model);
      setSelected(model);
      Alert.alert("Sucesso", `Modelo ${model} salvo!`);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível salvar a seleção.");
    }
  };

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

          <S.CardPad>
            <TitleText>Escolha o modelo da impressora</TitleText>
            <S.ButtonGrid>
              <S.MenuButton
                onPress={() => saveSelection("50mm")}
                style={{
                  backgroundColor: selected === "50mm" ? "#00ffcc" : "#FFF",
                }}
              >
                <Printer />
                <S.ButtonText>50mm</S.ButtonText>
              </S.MenuButton>

              <S.MenuButton
                onPress={() => saveSelection("80mm")}
                style={{
                  backgroundColor: selected === "80mm" ? "#00ffcc" : "#FFF",
                }}
              >
                <Printer />
                <S.ButtonText>80mm</S.ButtonText>
              </S.MenuButton>
            </S.ButtonGrid>
          </S.CardPad>
        </S.SafeArea>
      </S.Background>
    </S.Container>
  );
}

const TitleText = styled.Text`
  font-size: ${wp(5)}px;
  color: white;
  font-weight: bold;
  margin-bottom: ${hp(4)}px;
`;

const PrinterIcon = styled.Image`
  width: ${wp(15)}px;
  height: ${wp(15)}px;
  margin-bottom: ${hp(1)}px;
`;

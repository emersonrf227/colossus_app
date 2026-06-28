import React, { useEffect, useState, useCallback } from "react";
import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "react-native";
import { ArrowLeft, Printer, Check } from "lucide-react-native";
import * as S from "./styles";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import LogoSvg from "@/assets/logov2.svg";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useToast } from "@/hook/Toast";
import { colors } from "../dashboard/styles";

type PrinterModel = "50mm" | "80mm";

const PRINTER_OPTIONS: { model: PrinterModel; subLabel: string }[] = [
  { model: "50mm", subLabel: "Compacta" },
  { model: "80mm", subLabel: "Padrão" },
];

export default function SelectPrinterScreen() {
  const navigation = useNavigation();
  const [selected, setSelected] = useState<PrinterModel | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    (async () => {
      const savedOption = await AsyncStorage.getItem("printerModel");
      setSelected((savedOption as PrinterModel) ?? "50mm");
    })();
  }, []);

  const saveSelection = useCallback(
    async (model: PrinterModel) => {
      try {
        await AsyncStorage.setItem("printerModel", model);
        setSelected(model);
        showToast({ message: `Impressora ${model} salva!`, type: "success" });
      } catch {
        showToast({
          message: "Não foi possível salvar a configuração.",
          type: "error",
        });
      }
    },
    [showToast],
  );

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
            <S.HeaderTitle>Impressora</S.HeaderTitle>
          </S.Header>

          <S.cardLogo>
            <LogoSvg width={wp(38)} height={hp(11)} />
          </S.cardLogo>

          <S.CardPad>
            <S.TitleText>Tamanho da etiqueta</S.TitleText>
            <S.SubtitleText>
              Escolha o modelo compatível com sua impressora térmica
            </S.SubtitleText>

            <S.OptionsRow>
              {PRINTER_OPTIONS.map(({ model, subLabel }) => {
                const isSelected = selected === model;
                return (
                  <S.PrinterCard
                    key={model}
                    selected={isSelected}
                    activeOpacity={0.8}
                    onPress={() => saveSelection(model)}
                  >
                    {isSelected && (
                      <S.SelectedBadge>
                        <Check size={13} color="#FFFFFF" strokeWidth={3} />
                      </S.SelectedBadge>
                    )}
                    <S.PrinterIconWrapper selected={isSelected}>
                      <Printer
                        size={26}
                        color={isSelected ? colors.primary : colors.textMuted}
                        strokeWidth={2.2}
                      />
                    </S.PrinterIconWrapper>
                    <S.PrinterCardLabel selected={isSelected}>
                      {model}
                    </S.PrinterCardLabel>
                    <S.PrinterCardSubLabel selected={isSelected}>
                      {subLabel}
                    </S.PrinterCardSubLabel>
                  </S.PrinterCard>
                );
              })}
            </S.OptionsRow>
          </S.CardPad>
        </S.SafeArea>
      </S.Background>
    </S.Container>
  );
}

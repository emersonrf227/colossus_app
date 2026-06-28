import { StatusBar } from "react-native";
import React, { useState, useCallback, useMemo } from "react";
import * as S from "./styles";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import LogoSvg from "@/assets/logov2.svg";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Menu, Delete, ArrowRight } from "lucide-react-native";
import {
  formatAmount,
  emptyAmount,
  resolveCurrency,
  loadSavedCurrency,
  CurrencyConfig,
} from "../../../components/currency";
import { useTranslation } from "react-i18next";

const KEYPAD_BUTTONS = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "C",
  "0",
  "⌫",
];

export default function Dashboard() {
  const { t } = useTranslation();

  const { navigate } = useNavigation();

  // Moeda configurada pelo usuário (lida do AsyncStorage). Começa com o
  // default síncrono para já renderizar algo, e é atualizada assim que a
  // leitura assíncrona termina — e também sempre que a tela ganha foco
  // (ex: usuário voltou da tela de Idioma e Moeda tendo trocado a moeda).
  const [currency, setCurrency] = useState<CurrencyConfig>(() =>
    resolveCurrency(),
  );
  const [displayValue, setDisplayValue] = useState(() => emptyAmount(currency));

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      loadSavedCurrency().then((saved) => {
        if (!isActive) return;
        setCurrency((prev) => {
          if (prev.code === saved.code) return prev;
          // Moeda mudou: reseta o valor digitado para o "vazio" da nova moeda,
          // já que os decimais/formatação podem ser diferentes.
          setDisplayValue(emptyAmount(saved));
          return saved;
        });
      });

      return () => {
        isActive = false;
      };
    }, []),
  );

  const handleKeyPress = useCallback(
    (value: string) => {
      if (value === "C") {
        setDisplayValue(emptyAmount(currency));
      } else if (value === "⌫") {
        setDisplayValue((prev) => formatAmount(prev.slice(0, -1), currency));
      } else {
        setDisplayValue((prev) => formatAmount(prev + value, currency));
      }
    },
    [currency],
  );

  const toggleMenu = useCallback(() => {
    navigate("MenuScreen" as never);
  }, [navigate]);

  const isAmountValid = useMemo(
    () => displayValue !== emptyAmount(currency),
    [displayValue, currency],
  );

  // Avança para a tela de seleção de rede, levando o valor digitado e a
  // moeda escolhida. A tela seguinte guarda isso em memória (via params/state)
  // até o usuário escolher a rede e confirmar.
  const goToSelectNetwork = useCallback(() => {
    if (!isAmountValid) return;

    navigate(
      "SelectNetworks" as never,
      {
        amount: displayValue,
        currencyCode: currency.code,
      } as never,
    );
  }, [isAmountValid, displayValue, currency, navigate]);

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
            <S.MenuButton onPress={toggleMenu} activeOpacity={0.7}>
              <Menu size={24} color="#FFFFFF" strokeWidth={2.2} />
            </S.MenuButton>
          </S.Header>

          <S.cardLogo>
            <LogoSvg width={wp(45)} height={hp(15)} />
          </S.cardLogo>

          <S.CardPad>
            <S.DisplayWrapper>
              <S.DisplayCurrencyLabel>{currency.label}</S.DisplayCurrencyLabel>
              <S.Display>{displayValue}</S.Display>
            </S.DisplayWrapper>

            <S.ButtonContainer>
              {KEYPAD_BUTTONS.map((button) => (
                <S.Button
                  key={button}
                  variant={
                    button === "C" || button === "⌫" ? "action" : "default"
                  }
                  activeOpacity={0.6}
                  onPress={() => handleKeyPress(button)}
                >
                  {button === "⌫" ? (
                    <Delete size={22} color="#FFFFFF" strokeWidth={2} />
                  ) : (
                    <S.ButtonText>{button}</S.ButtonText>
                  )}
                </S.Button>
              ))}
            </S.ButtonContainer>

            <S.ButtonSend
              onPress={goToSelectNetwork}
              disabled={!isAmountValid}
              activeOpacity={0.85}
              style={{ opacity: isAmountValid ? 1 : 0.5 }}
            >
              <S.ButtonTextSend>
                {t("dashboard.generateCharge")}
              </S.ButtonTextSend>
              <ArrowRight size={18} color="#FFFFFF" strokeWidth={2.2} />
            </S.ButtonSend>
          </S.CardPad>
        </S.SafeArea>
      </S.Background>
    </S.Container>
  );
}

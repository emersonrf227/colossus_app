import React, { useCallback, useEffect, useState } from "react";
import { StatusBar } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ArrowLeft, Check } from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";
import * as S from "./styles";
import { useToast } from "@/hook/Toast";
import {
  CURRENCIES,
  CurrencyCode,
  resolveCurrency,
} from "../../../components/currency";
import {
  LANGUAGES,
  LanguageCode,
  resolveLanguage,
} from "../../../components/language";
import i18n from "@/i18n";

const STORAGE_KEY_LANGUAGE = "appLanguage";
const STORAGE_KEY_CURRENCY = "appCurrency";

export default function SettingsLanguageCurrency() {
  const { t } = useTranslation();
  const { goBack } = useNavigation();
  const { showToast } = useToast();

  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode>(
    resolveLanguage().code,
  );
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyCode>(
    resolveCurrency().code,
  );
  const [loaded, setLoaded] = useState(false);

  // Carrega as preferências já salvas, se existirem
  useEffect(() => {
    (async () => {
      try {
        const [savedLanguage, savedCurrency] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEY_LANGUAGE),
          AsyncStorage.getItem(STORAGE_KEY_CURRENCY),
        ]);
        setSelectedLanguage(resolveLanguage(savedLanguage).code);
        setSelectedCurrency(resolveCurrency(savedCurrency).code);
      } catch {
        // Mantém os defaults silenciosamente se a leitura falhar.
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  const handleSelectLanguage = useCallback(
    async (code: LanguageCode) => {
      setSelectedLanguage(code);
      try {
        await AsyncStorage.setItem(STORAGE_KEY_LANGUAGE, code);
        await i18n.changeLanguage(code);
      } catch {
        showToast({
          message: t("settingsLanguage.toastLanguageError"),
          type: "error",
        });
      }
    },
    [showToast, t],
  );

  const handleSelectCurrency = useCallback(
    async (code: CurrencyCode) => {
      setSelectedCurrency(code);
      try {
        await AsyncStorage.setItem(STORAGE_KEY_CURRENCY, code);
      } catch {
        showToast({
          message: t("settingsLanguage.toastCurrencyError"),
          type: "error",
        });
      }
    },
    [showToast, t],
  );

  if (!loaded) {
    return (
      <S.Container>
        <S.Background source={require("@/assets/background.png")}>
          <S.BackgroundOverlay />
        </S.Background>
      </S.Container>
    );
  }

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
            <S.BackButton onPress={() => goBack()} activeOpacity={0.7}>
              <ArrowLeft size={22} color="#FFFFFF" strokeWidth={2.2} />
            </S.BackButton>
            <S.HeaderTitle>{t("settingsLanguage.title")}</S.HeaderTitle>
          </S.Header>

          <S.ScrollContent showsVerticalScrollIndicator={false}>
            <S.SectionLabel>{t("settingsLanguage.appLanguage")}</S.SectionLabel>
            <S.OptionsGroup>
              {Object.values(LANGUAGES).map((language, index) => {
                const isSelected = selectedLanguage === language.code;
                const isLast = index === Object.values(LANGUAGES).length - 1;
                return (
                  <S.OptionRow
                    key={language.code}
                    isLast={isLast}
                    activeOpacity={0.7}
                    onPress={() => handleSelectLanguage(language.code)}
                  >
                    <S.OptionEmoji>{language.flagEmoji}</S.OptionEmoji>
                    <S.OptionLabel>{language.label}</S.OptionLabel>
                    <S.CheckCircle checked={isSelected}>
                      {isSelected && (
                        <Check size={13} color="#FFFFFF" strokeWidth={3} />
                      )}
                    </S.CheckCircle>
                  </S.OptionRow>
                );
              })}
            </S.OptionsGroup>

            <S.SectionLabel>
              {t("settingsLanguage.currencyForBilling")}
            </S.SectionLabel>
            <S.OptionsGroup>
              {Object.values(CURRENCIES).map((currency, index) => {
                const isSelected = selectedCurrency === currency.code;
                const isLast = index === Object.values(CURRENCIES).length - 1;
                return (
                  <S.OptionRow
                    key={currency.code}
                    isLast={isLast}
                    activeOpacity={0.7}
                    onPress={() => handleSelectCurrency(currency.code)}
                  >
                    <S.OptionTextWrapper>
                      <S.OptionLabel>{currency.label}</S.OptionLabel>
                      <S.OptionSubLabel>
                        {t(
                          `settingsLanguage.currencySubLabel.${currency.code}`,
                        )}
                      </S.OptionSubLabel>
                    </S.OptionTextWrapper>
                    <S.CheckCircle checked={isSelected}>
                      {isSelected && (
                        <Check size={13} color="#FFFFFF" strokeWidth={3} />
                      )}
                    </S.CheckCircle>
                  </S.OptionRow>
                );
              })}
            </S.OptionsGroup>
          </S.ScrollContent>
        </S.SafeArea>
      </S.Background>
    </S.Container>
  );
}

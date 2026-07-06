import React, { useState, useCallback } from "react";
import { Clipboard, StatusBar } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { isAddress } from "ethers";
import {
  ArrowLeft,
  Wallet,
  Sparkles,
  ClipboardPaste,
  ShieldAlert,
  KeyRound,
} from "lucide-react-native";
import { useTranslation } from "react-i18next";

import * as S from "./styles";
import { useToast } from "@/hook/Toast";
import { persistExternalWallet } from "../../../components/wallet/walletStorage";
import { colors } from "../dashboard/styles";
import LogoSvg from "@/assets/logov2.svg";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

type Mode = "choice" | "external";

export default function WalletSetup() {
  const navigation = useNavigation();
  const { navigate } = navigation;
  const { showToast } = useToast();
  const { t } = useTranslation();
  const [mode, setMode] = useState<Mode>("choice");
  const [externalAddress, setExternalAddress] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handlePaste = useCallback(async () => {
    try {
      const text = await Clipboard.getString();
      setExternalAddress(text.trim());
    } catch {
      showToast({ message: t("walletSetup.clipboardError"), type: "error" });
    }
  }, [showToast, t]);

  const handleConfirmExternal = useCallback(async () => {
    if (!isAddress(externalAddress)) {
      showToast({ message: t("walletSetup.invalidAddress"), type: "error" });
      return;
    }
    setSubmitting(true);
    try {
      await persistExternalWallet(externalAddress);
      showToast({ message: t("walletSetup.connectSuccess"), type: "success" });
      navigate("WalletHome" as never);
    } catch {
      showToast({ message: t("walletSetup.connectError"), type: "error" });
    } finally {
      setSubmitting(false);
    }
  }, [externalAddress, showToast, navigate, t]);

  const handleCreateNew = useCallback(() => {
    navigate("WalletBackup" as never);
  }, [navigate]);
  const handleImport = useCallback(() => {
    navigate("WalletImport" as never);
  }, [navigate]);

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
            <S.HeaderTitle>{t("walletSetup.title")}</S.HeaderTitle>
          </S.Header>
          <S.CardLogo>
            <LogoSvg width={wp(38)} height={hp(11)} />
          </S.CardLogo>

          <S.IntroWrapper>
            <S.IntroIconWrapper>
              <Wallet size={30} color={colors.primary} strokeWidth={2} />
            </S.IntroIconWrapper>
            <S.IntroTitle>{t("walletSetup.subtitle")}</S.IntroTitle>
            <S.IntroSubtitle>{t("walletSetup.description")}</S.IntroSubtitle>
          </S.IntroWrapper>

          <S.OptionCard onPress={handleCreateNew} activeOpacity={0.8}>
            <S.OptionHeaderRow>
              <S.OptionIconWrapper accentColor={colors.primary}>
                <Sparkles size={20} color={colors.primary} strokeWidth={2.2} />
              </S.OptionIconWrapper>
              <S.OptionTitle>{t("walletSetup.createNew")}</S.OptionTitle>
              <S.RecommendedBadge>
                <S.RecommendedBadgeText>
                  {t("walletSetup.recommended")}
                </S.RecommendedBadgeText>
              </S.RecommendedBadge>
            </S.OptionHeaderRow>
            <S.OptionDescription>
              {t("walletSetup.createDescription")}
            </S.OptionDescription>
          </S.OptionCard>

          <S.OptionCard onPress={handleImport} activeOpacity={0.8}>
            <S.OptionHeaderRow>
              <S.OptionIconWrapper accentColor={colors.accent}>
                <KeyRound size={20} color={colors.accent} strokeWidth={2.2} />
              </S.OptionIconWrapper>
              <S.OptionTitle>{t("walletSetup.import")}</S.OptionTitle>
            </S.OptionHeaderRow>
            <S.OptionDescription>
              {t("walletSetup.importDescription")}
            </S.OptionDescription>
          </S.OptionCard>

          <S.OptionCard
            onPress={() => setMode(mode === "external" ? "choice" : "external")}
            activeOpacity={0.8}
          >
            <S.OptionHeaderRow>
              <S.OptionIconWrapper accentColor={colors.textMuted}>
                <Wallet size={20} color={colors.textMuted} strokeWidth={2.2} />
              </S.OptionIconWrapper>
              <S.OptionTitle>{t("walletSetup.viewOnly")}</S.OptionTitle>
            </S.OptionHeaderRow>
            <S.OptionDescription>
              {t("walletSetup.viewOnlyDescription")}
            </S.OptionDescription>
            {mode === "external" && (
              <S.ExternalFormWrapper>
                <S.InputWrapper>
                  <S.StyledInput
                    placeholder="0x..."
                    placeholderTextColor="rgba(255,255,255,0.35)"
                    value={externalAddress}
                    onChangeText={setExternalAddress}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  <S.PasteButton onPress={handlePaste} activeOpacity={0.7}>
                    <ClipboardPaste
                      size={18}
                      color={colors.textMuted}
                      strokeWidth={2.2}
                    />
                  </S.PasteButton>
                </S.InputWrapper>
                <S.ConfirmButton
                  onPress={handleConfirmExternal}
                  disabled={submitting || !externalAddress}
                  activeOpacity={0.85}
                >
                  <S.ConfirmButtonText>
                    {t("walletSetup.connectAddress")}
                  </S.ConfirmButtonText>
                </S.ConfirmButton>
              </S.ExternalFormWrapper>
            )}
          </S.OptionCard>

          <S.WarningNote>
            <ShieldAlert size={11} color={colors.textMuted} />{" "}
            {t("walletSetup.warning")}
          </S.WarningNote>
        </S.SafeArea>
      </S.Background>
    </S.Container>
  );
}

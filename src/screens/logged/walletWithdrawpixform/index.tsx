import React, { useState, useCallback, useRef } from "react";
import {
  StatusBar,
  Modal,
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  ScrollView,
  Switch,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { ArrowLeft, QrCode, X, ChevronDown } from "lucide-react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styled from "styled-components/native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Platform, StatusBar as RNStatusBar } from "react-native";
import { useTranslation } from "react-i18next";
import { useToast } from "@/hook/Toast";
import {
  decodeBrCode,
  PixKeyType,
  WalletNetwork,
  SwapQuote,
} from "../../../components/pix/pixService";
import { ApiWalletRecord } from "../../../components/wallet/walletStatus";
import { colors } from "../dashboard/styles";
import LogoSvg from "@/assets/logov2.svg";
import VirtualLogo from "@/assets/logo-virtual.png";

export const CardLogo = styled.View`
  align-items: center;
  margin-top: ${hp(0.5)}px;
  margin-bottom: ${hp(1)}px;
`;
const STATUSBAR_HEIGHT =
  Platform.OS === "android" ? (RNStatusBar.currentHeight ?? 24) : 0;
const SAVED_EMAIL_KEY = "pix_saved_email";
const Container = styled.View`
  flex: 1;
  background-color: ${colors.bgDark};
`;
const Background = styled.ImageBackground`
  flex: 1;
  width: 100%;
  height: 100%;
`;
const Overlay = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(5, 4, 10, 0.68);
`;
const SafeArea = styled.SafeAreaView`
  flex: 1;
  padding-horizontal: ${wp(5)}px;
  padding-top: ${STATUSBAR_HEIGHT}px;
`;
const Header = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: ${hp(1)}px;
  margin-bottom: ${hp(2)}px;
`;
const BackButton = styled.TouchableOpacity`
  width: 44px;
  height: 44px;
  border-radius: 14px;
  align-items: center;
  justify-content: center;
  background-color: ${colors.surface};
  border-width: 1px;
  border-color: ${colors.surfaceBorder};
`;
const HeaderTitle = styled.Text`
  color: ${colors.textPrimary};
  font-size: 18px;
  font-weight: 700;
  margin-left: 14px;
`;
const SectionLabel = styled.Text`
  color: ${colors.textMuted};
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1px;
  margin-bottom: ${hp(1)}px;
  margin-top: ${hp(2)}px;
`;
const SummaryCard = styled.View`
  border-radius: 14px;
  padding: 14px;
  margin-bottom: ${hp(1)}px;
  background-color: ${colors.surface};
  border-width: 1px;
  border-color: ${colors.surfaceBorder};
`;
const SummaryRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 4px;
`;
const SummaryLabel = styled.Text`
  color: ${colors.textMuted};
  font-size: 12.5px;
`;
const SummaryValue = styled.Text`
  color: ${colors.textPrimary};
  font-size: 13px;
  font-weight: 700;
`;
const TypeSelectorButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  height: ${hp(6.2)}px;
  border-radius: 14px;
  padding-horizontal: 14px;
  background-color: ${colors.surface};
  border-width: 1px;
  border-color: ${colors.surfaceBorder};
  margin-bottom: 12px;
`;
const TypeSelectorText = styled.Text`
  color: ${colors.textPrimary};
  font-size: 14px;
`;
const TypeModalOverlay = styled.View`
  flex: 1;
  justify-content: flex-end;
  background-color: rgba(0, 0, 0, 0.6);
`;
const TypeModalCard = styled.View`
  border-radius: 20px 20px 0 0;
  padding: 20px;
  background-color: ${colors.bgDark};
  border-width: 1px;
  border-color: ${colors.surfaceBorder};
`;
const TypeOption = styled.TouchableOpacity`
  padding-vertical: 14px;
  border-bottom-width: 1px;
  border-bottom-color: ${colors.surfaceBorder};
`;
const TypeOptionText = styled.Text`
  color: ${colors.textPrimary};
  font-size: 15px;
`;
const InputWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  height: ${hp(6.2)}px;
  border-radius: 14px;
  padding-horizontal: 14px;
  background-color: ${colors.surface};
  border-width: 1px;
  border-color: ${colors.surfaceBorder};
  margin-bottom: 12px;
`;
const StyledInput = styled.TextInput`
  flex: 1;
  color: ${colors.textPrimary};
  font-size: 14px;
  height: 100%;
`;
const EmailToggleRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
  border-radius: 14px;
  background-color: ${colors.surface};
  border-width: 1px;
  border-color: ${colors.surfaceBorder};
  margin-top: 6px;
`;
const EmailToggleLabel = styled.Text`
  color: ${colors.textMuted};
  font-size: 13px;
`;
const PrimaryButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: ${hp(6.8)}px;
  border-radius: 16px;
  margin-top: ${hp(2)}px;
  margin-bottom: ${hp(4)}px;
  background-color: ${colors.primary};
  opacity: ${(p: any) => (p.disabled ? 0.5 : 1)};
  elevation: 8;
`;
const PrimaryButtonText = styled.Text`
  color: #fff;
  font-size: 15px;
  font-weight: 700;
`;

const FooterLogoWrapper = styled.View`
  height: 32px;
  width: 200px;
  background-color: #ffffff;
  border-radius: 8px;
  align-items: center;
  justify-content: center;
  padding: 4px;
`;

const FooterLogoImage = styled.Image`
  height: 100%;
  width: 100%;
  resize-mode: contain;
`;

const Footer = styled.View`
  padding-vertical: ${hp(2)}px;
  padding-horizontal: ${wp(1)}px;
  align-items: center;
  gap: 6px;
`;

const FooterText = styled.Text`
  color: ${colors.textMuted};
  font-size: 11px;
  text-align: center;
`;

interface RouteParams {
  record: ApiWalletRecord;
  network: WalletNetwork;
  amountBrl: number;
  usdtNeeded: number;
  quote: SwapQuote;
  prefilledPix?: {
    pixKey: string;
    keyType: PixKeyType;
    merchantName: string | null;
  };
}

export default function WalletWithdrawPixForm() {
  const navigation = useNavigation();
  const { navigate, goBack } = navigation;
  const route = useRoute();
  const { showToast } = useToast();
  const { t } = useTranslation();
  const params = route.params as RouteParams;
  const { record, network, amountBrl, usdtNeeded, quote, prefilledPix } =
    params;

  const KEY_TYPES: { value: PixKeyType; label: string; placeholder: string }[] =
    [
      { value: "CPF", label: "CPF", placeholder: "000.000.000-00" },
      { value: "CNPJ", label: "CNPJ", placeholder: "00.000.000/0000-00" },
      {
        value: "PHONE",
        label: t("walletWithdrawPixForm.typePhone"),
        placeholder: "+55 (00) 00000-0000",
      },
      {
        value: "EMAIL",
        label: "E-mail",
        placeholder: t("walletWithdrawPixForm.emailPlaceholder"),
      },
      {
        value: "EVP",
        label: t("walletWithdrawPixForm.typeEvp"),
        placeholder: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
      },
      {
        value: "COPYPASTE",
        label: t("walletWithdrawPixForm.typeCopyPaste"),
        placeholder: t("walletWithdrawPixForm.copyPastePlaceholder"),
      },
    ];

  const [keyType, setKeyType] = useState<PixKeyType>(
    prefilledPix?.keyType ?? "CPF",
  );
  const [pixKey, setPixKey] = useState(prefilledPix?.pixKey ?? "");
  const [email, setEmail] = useState("");
  const [saveEmail, setSaveEmail] = useState(false);
  const [typeModalVisible, setTypeModalVisible] = useState(false);
  const [qrModalVisible, setQrModalVisible] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [decoding, setDecoding] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [decodedName, setDecodedName] = useState<string | null>(
    prefilledPix?.merchantName ?? null,
  );
  const [lockedAmount, setLockedAmount] = useState<number | null>(null);
  const pixKeyLocked = !!prefilledPix;
  const selectedType = KEY_TYPES.find((k) => k.value === keyType)!;

  React.useEffect(() => {
    AsyncStorage.getItem(SAVED_EMAIL_KEY).then((saved) => {
      if (saved) {
        setEmail(saved);
        setSaveEmail(true);
      }
    });
  }, []);

  const handleOpenQr = useCallback(async () => {
    if (!permission?.granted) {
      const result = await requestPermission();
      if (!result.granted) {
        showToast({
          message: t("walletWithdrawPixForm.cameraPermission"),
          type: "error",
        });
        return;
      }
    }
    setScanned(false);
    setQrModalVisible(true);
  }, [permission, requestPermission, showToast, t]);

  const handleQrScanned = useCallback(
    async ({ data }: { data: string }) => {
      if (scanned || decoding) return;
      setScanned(true);
      setQrModalVisible(false);
      setDecoding(true);
      try {
        const decoded = await decodeBrCode(data);
        setPixKey(decoded.pixKey);
        setKeyType("EVP");
        setDecodedName(decoded.merchantName ?? null);
        if (decoded.transactionAmount && decoded.transactionAmount > 0) {
          setLockedAmount(decoded.transactionAmount);
          showToast({
            message: t("walletWithdrawPixForm.fixedAmount", {
              amount: decoded.transactionAmount.toFixed(2),
            }),
            type: "success",
          });
        } else {
          setLockedAmount(null);
          showToast({
            message: t("walletWithdrawPixForm.qrSuccess", {
              name: decoded.merchantName ?? decoded.pixKey,
            }),
            type: "success",
          });
        }
      } catch {
        showToast({
          message: t("walletWithdrawPixForm.qrInvalid"),
          type: "error",
        });
        setScanned(false);
      } finally {
        setDecoding(false);
      }
    },
    [scanned, decoding, showToast, t],
  );

  const handleProceed = useCallback(async () => {
    if (!pixKey.trim()) {
      showToast({
        message: t("walletWithdrawPixForm.errorNoKey"),
        type: "error",
      });
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      showToast({
        message: t("walletWithdrawPixForm.errorNoEmail"),
        type: "error",
      });
      return;
    }
    if (saveEmail) {
      await AsyncStorage.setItem(SAVED_EMAIL_KEY, email.trim());
    } else {
      await AsyncStorage.removeItem(SAVED_EMAIL_KEY);
    }
    navigate(
      "Walletwithdrawpixconfirm" as never,
      {
        record,
        network,
        amountBrl: lockedAmount ?? amountBrl,
        usdtNeeded,
        quote,
        pixKey: pixKey.trim(),
        keyType,
        email: email.trim(),
        decodedName,
      } as never,
    );
  }, [
    pixKey,
    email,
    saveEmail,
    keyType,
    record,
    network,
    amountBrl,
    lockedAmount,
    usdtNeeded,
    quote,
    decodedName,
    navigate,
    showToast,
    t,
  ]);

  const canProceed = pixKey.trim().length > 0 && email.trim().length > 0;

  return (
    <Container>
      <Background source={require("@/assets/background.png")}>
        <Overlay />
        <StatusBar
          barStyle="light-content"
          backgroundColor="transparent"
          translucent
        />
        <SafeArea>
          <Header>
            <BackButton onPress={() => goBack()} activeOpacity={0.7}>
              <ArrowLeft size={22} color="#FFFFFF" strokeWidth={2.2} />
            </BackButton>
            <HeaderTitle>{t("walletWithdrawPixForm.title")}</HeaderTitle>
          </Header>
          <CardLogo>
            <LogoSvg width={wp(34)} height={hp(19)} />
          </CardLogo>

          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ paddingBottom: 24 }}
          >
            <SectionLabel>
              {t("walletWithdrawPixForm.summaryLabel")}
            </SectionLabel>
            <SummaryCard>
              <SummaryRow>
                <SummaryLabel>
                  {t("walletWithdrawPixForm.youReceive")}
                </SummaryLabel>
                <SummaryValue>
                  R$ {(lockedAmount ?? amountBrl).toFixed(2)}
                </SummaryValue>
              </SummaryRow>
              <SummaryRow>
                <SummaryLabel>
                  {t("walletWithdrawPixForm.youSend")}
                </SummaryLabel>
                <SummaryValue>{usdtNeeded.toFixed(2)} USDT</SummaryValue>
              </SummaryRow>
              <SummaryRow>
                <SummaryLabel>
                  {t("walletWithdrawPixForm.network")}
                </SummaryLabel>
                <SummaryValue>{network}</SummaryValue>
              </SummaryRow>
            </SummaryCard>

            <SectionLabel>
              {t("walletWithdrawPixForm.keyTypeLabel")}
            </SectionLabel>
            <TypeSelectorButton
              onPress={() => !pixKeyLocked && setTypeModalVisible(true)}
              activeOpacity={pixKeyLocked ? 1 : 0.75}
              style={{ opacity: pixKeyLocked ? 0.7 : 1 }}
            >
              <TypeSelectorText>{selectedType.label}</TypeSelectorText>
              {!pixKeyLocked && (
                <ChevronDown
                  size={18}
                  color={colors.textMuted}
                  strokeWidth={2.2}
                />
              )}
            </TypeSelectorButton>

            <SectionLabel>
              {t("walletWithdrawPixForm.pixKeyLabel")}
            </SectionLabel>
            <InputWrapper>
              <StyledInput
                placeholder={
                  keyType === "COPYPASTE"
                    ? t("walletWithdrawPixForm.copyPastePlaceholder")
                    : selectedType.placeholder
                }
                placeholderTextColor="rgba(255,255,255,0.3)"
                value={pixKey}
                onChangeText={
                  pixKeyLocked
                    ? undefined
                    : (v) => {
                        setPixKey(v);
                        setDecodedName(null);
                      }
                }
                editable={!pixKeyLocked}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType={
                  keyType === "PHONE"
                    ? "phone-pad"
                    : keyType === "EMAIL"
                      ? "email-address"
                      : "default"
                }
                style={{ opacity: pixKeyLocked ? 0.7 : 1 }}
              />
              {keyType === "COPYPASTE" && !pixKeyLocked && (
                <TouchableOpacity
                  onPress={handleOpenQr}
                  activeOpacity={0.7}
                  style={{ padding: 4 }}
                >
                  <QrCode size={20} color={colors.primary} strokeWidth={2.2} />
                </TouchableOpacity>
              )}
            </InputWrapper>

            {decodedName && (
              <SummaryCard style={{ marginBottom: hp(1) }}>
                <SummaryRow>
                  <SummaryLabel>
                    {t("walletWithdrawPixForm.beneficiary")}
                  </SummaryLabel>
                  <SummaryValue>{decodedName}</SummaryValue>
                </SummaryRow>
              </SummaryCard>
            )}

            <SectionLabel>{t("walletWithdrawPixForm.emailLabel")}</SectionLabel>
            <InputWrapper>
              <StyledInput
                placeholder={t("walletWithdrawPixForm.emailPlaceholder")}
                placeholderTextColor="rgba(255,255,255,0.3)"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                autoCorrect={false}
              />
            </InputWrapper>

            <EmailToggleRow>
              <EmailToggleLabel>
                {t("walletWithdrawPixForm.saveEmail")}
              </EmailToggleLabel>
              <Switch
                value={saveEmail}
                onValueChange={setSaveEmail}
                trackColor={{
                  false: colors.surfaceBorder,
                  true: colors.primary,
                }}
                thumbColor="#FFFFFF"
              />
            </EmailToggleRow>

            <PrimaryButton
              onPress={handleProceed}
              disabled={!canProceed}
              activeOpacity={0.85}
            >
              <PrimaryButtonText>
                {t("walletWithdrawPixForm.proceedButton")}
              </PrimaryButtonText>
            </PrimaryButton>
          </ScrollView>
          <Footer>
            <FooterLogoWrapper>
              <FooterLogoImage source={VirtualLogo} />
            </FooterLogoWrapper>
            <FooterText>Fornecido por Virtual Tokenizadora</FooterText>
          </Footer>
        </SafeArea>
      </Background>

      <Modal
        visible={typeModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setTypeModalVisible(false)}
      >
        <TypeModalOverlay>
          <TouchableOpacity
            style={{ flex: 1 }}
            activeOpacity={1}
            onPress={() => setTypeModalVisible(false)}
          />
          <TypeModalCard>
            {KEY_TYPES.map((k) => (
              <TypeOption
                key={k.value}
                onPress={() => {
                  setKeyType(k.value);
                  setPixKey("");
                  setDecodedName(null);
                  setTypeModalVisible(false);
                }}
                activeOpacity={0.75}
              >
                <TypeOptionText>{k.label}</TypeOptionText>
              </TypeOption>
            ))}
          </TypeModalCard>
        </TypeModalOverlay>
      </Modal>

      <Modal
        visible={qrModalVisible}
        animationType="slide"
        onRequestClose={() => setQrModalVisible(false)}
      >
        <View style={styles.qrContainer}>
          <CameraView
            style={StyleSheet.absoluteFillObject}
            facing="back"
            barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
            onBarcodeScanned={scanned ? undefined : handleQrScanned}
          />
          <View style={styles.overlay}>
            <View style={styles.overlayTop} />
            <View style={styles.overlayMiddle}>
              <View style={styles.overlaySide} />
              <View style={styles.scanArea}>
                <View style={[styles.corner, styles.cornerTL]} />
                <View style={[styles.corner, styles.cornerTR]} />
                <View style={[styles.corner, styles.cornerBL]} />
                <View style={[styles.corner, styles.cornerBR]} />
              </View>
              <View style={styles.overlaySide} />
            </View>
            <View style={styles.overlayBottom}>
              <Text style={styles.hint}>{t("walletWithdrawPix.qrHint")}</Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => setQrModalVisible(false)}
            style={styles.closeButton}
          >
            <X size={22} color="#FFFFFF" strokeWidth={2.2} />
          </TouchableOpacity>
        </View>
      </Modal>
    </Container>
  );
}

const SCAN_SIZE = 240;
const styles = StyleSheet.create({
  qrContainer: { flex: 1, backgroundColor: "#000" },
  overlay: { ...StyleSheet.absoluteFillObject, flexDirection: "column" },
  overlayTop: { flex: 1, backgroundColor: "rgba(0,0,0,0.6)" },
  overlayMiddle: { flexDirection: "row", height: SCAN_SIZE },
  overlaySide: { flex: 1, backgroundColor: "rgba(0,0,0,0.6)" },
  scanArea: { width: SCAN_SIZE, height: SCAN_SIZE },
  overlayBottom: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    alignItems: "center",
    paddingTop: 28,
  },
  hint: { color: "#FFFFFF", fontSize: 14, opacity: 0.8 },
  corner: {
    position: "absolute",
    width: 24,
    height: 24,
    borderColor: "#6C5CE7",
    borderWidth: 3,
  },
  cornerTL: { top: 0, left: 0, borderRightWidth: 0, borderBottomWidth: 0 },
  cornerTR: { top: 0, right: 0, borderLeftWidth: 0, borderBottomWidth: 0 },
  cornerBL: { bottom: 0, left: 0, borderRightWidth: 0, borderTopWidth: 0 },
  cornerBR: { bottom: 0, right: 0, borderLeftWidth: 0, borderTopWidth: 0 },
  closeButton: {
    position: "absolute",
    top: 52,
    left: 20,
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.15)",
  },
});

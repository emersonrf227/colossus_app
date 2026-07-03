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

// Seletor de tipo de chave
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

// Input
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

// Email toggle
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

const KEY_TYPES: {
  value: PixKeyType;
  label: string;
  mask?: string;
  placeholder: string;
}[] = [
  { value: "CPF", label: "CPF", placeholder: "000.000.000-00" },
  { value: "CNPJ", label: "CNPJ", placeholder: "00.000.000/0000-00" },
  { value: "PHONE", label: "Telefone", placeholder: "+55 (00) 00000-0000" },
  { value: "EMAIL", label: "E-mail", placeholder: "email@exemplo.com" },
  {
    value: "EVP",
    label: "Chave aleatória",
    placeholder: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  },
  {
    value: "COPYPASTE",
    label: "Copia e Cola (QR)",
    placeholder: "Cole o código aqui ou escaneie o QR",
  },
];

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
  const params = route.params as RouteParams;
  const { record, network, amountBrl, usdtNeeded, quote, prefilledPix } =
    params;

  // Se veio com PIX pré-decodificado (copia e cola ou QR da tela anterior),
  // inicializa os campos já preenchidos com COPYPASTE como tipo de chave.
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

  // Campo de chave bloqueado se veio pré-preenchido via QR/copia e cola
  const pixKeyLocked = !!prefilledPix;

  // Carrega email salvo
  React.useEffect(() => {
    AsyncStorage.getItem(SAVED_EMAIL_KEY).then((saved) => {
      if (saved) {
        setEmail(saved);
        setSaveEmail(true);
      }
    });
  }, []);

  const selectedType = KEY_TYPES.find((k) => k.value === keyType)!;

  const handleOpenQr = useCallback(async () => {
    if (!permission?.granted) {
      const result = await requestPermission();
      if (!result.granted) {
        showToast({
          message: "Permissão de câmera necessária.",
          type: "error",
        });
        return;
      }
    }
    setScanned(false);
    setQrModalVisible(true);
  }, [permission, requestPermission, showToast]);

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

        // Se o QR já tem valor fixo, usa ele e bloqueia o campo
        if (decoded.transactionAmount && decoded.transactionAmount > 0) {
          setLockedAmount(decoded.transactionAmount);
          showToast({
            message: `QR com valor fixo: R$ ${decoded.transactionAmount.toFixed(2)}`,
            type: "success",
          });
        } else {
          setLockedAmount(null);
          showToast({
            message: `QR lido: ${decoded.merchantName ?? decoded.pixKey}`,
            type: "success",
          });
        }
      } catch {
        showToast({
          message: "QR Code inválido ou não reconhecido.",
          type: "error",
        });
        setScanned(false);
      } finally {
        setDecoding(false);
      }
    },
    [scanned, decoding, showToast],
  );

  const handleProceed = useCallback(async () => {
    if (!pixKey.trim()) {
      showToast({ message: "Informe a chave PIX.", type: "error" });
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      showToast({
        message: "Informe um e-mail válido para o comprovante.",
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
            <HeaderTitle>Dados do PIX</HeaderTitle>
          </Header>

          <CardLogo>
            <LogoSvg width={wp(28)} height={hp(7)} />
          </CardLogo>

          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ paddingBottom: 24 }}
          >
            {/* Resumo da operação */}
            <SectionLabel>RESUMO</SectionLabel>
            <SummaryCard>
              <SummaryRow>
                <SummaryLabel>Você recebe</SummaryLabel>
                <SummaryValue>
                  R$ {(lockedAmount ?? amountBrl).toFixed(2)}
                </SummaryValue>
              </SummaryRow>
              <SummaryRow>
                <SummaryLabel>Você envia</SummaryLabel>
                <SummaryValue>{usdtNeeded.toFixed(2)} USDT</SummaryValue>
              </SummaryRow>
              <SummaryRow>
                <SummaryLabel>Rede</SummaryLabel>
                <SummaryValue>{network}</SummaryValue>
              </SummaryRow>
            </SummaryCard>

            {/* Tipo de chave */}
            <SectionLabel>TIPO DE CHAVE PIX</SectionLabel>
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

            {/* Chave PIX */}
            <SectionLabel>CHAVE PIX</SectionLabel>
            <InputWrapper>
              <StyledInput
                placeholder={
                  keyType === "COPYPASTE"
                    ? "Cole o código ou escaneie"
                    : selectedType.placeholder
                }
                placeholderTextColor="rgba(255,255,255,0.3)"
                value={pixKey}
                onChangeText={
                  pixKeyLocked
                    ? undefined
                    : (t) => {
                        setPixKey(t);
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

            {/* Nome decodificado do QR */}
            {decodedName && (
              <SummaryCard style={{ marginBottom: hp(1) }}>
                <SummaryRow>
                  <SummaryLabel>Beneficiário</SummaryLabel>
                  <SummaryValue>{decodedName}</SummaryValue>
                </SummaryRow>
              </SummaryCard>
            )}

            {/* E-mail para comprovante */}
            <SectionLabel>E-MAIL PARA COMPROVANTE</SectionLabel>
            <InputWrapper>
              <StyledInput
                placeholder="email@exemplo.com"
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
                Salvar e-mail para próximas transações
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
              <PrimaryButtonText>Revisar e confirmar</PrimaryButtonText>
            </PrimaryButton>
          </ScrollView>
        </SafeArea>
      </Background>

      {/* Modal seletor de tipo de chave */}
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

      {/* Modal câmera QR */}
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
              <Text style={styles.hint}>Aponte para o QR Code do PIX</Text>
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

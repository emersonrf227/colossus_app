import React, { useState, useCallback, useEffect } from "react";
import { Modal, ActivityIndicator } from "react-native";
import { Zap, CheckCircle, AlertTriangle } from "lucide-react-native";
import styled from "styled-components/native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useTranslation } from "react-i18next";
import {
  requestGasSponsorship,
  approveAndCollect,
  getGasPendingSession,
  GasSponsorError,
  GasSponsorResult,
} from "../../../components/gas/gasService";
import { colors } from "../dashboard/styles";
import { WalletNetworkKey } from "../../../components/wallet/walletProviders";

const Backdrop = styled.TouchableOpacity`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.7);
  justify-content: flex-end;
`;
const Card = styled.View`
  background-color: ${colors.bgDark};
  border-radius: 24px 24px 0 0;
  padding: 24px;
  border-width: 1px;
  border-color: ${colors.surfaceBorder};
`;
const Handle = styled.View`
  width: 40px;
  height: 4px;
  border-radius: 2px;
  background-color: ${colors.surfaceBorder};
  align-self: center;
  margin-bottom: 20px;
`;
const IconRow = styled.View`
  width: 64px;
  height: 64px;
  border-radius: 20px;
  align-items: center;
  justify-content: center;
  background-color: rgba(108, 92, 231, 0.18);
  align-self: center;
  margin-bottom: 16px;
`;
const Title = styled.Text`
  color: ${colors.textPrimary};
  font-size: 18px;
  font-weight: 800;
  text-align: center;
  margin-bottom: 8px;
`;
const Subtitle = styled.Text`
  color: ${colors.textMuted};
  font-size: 13.5px;
  text-align: center;
  line-height: 20px;
  margin-bottom: 24px;
`;
const InfoCard = styled.View`
  border-radius: 14px;
  padding: 14px;
  margin-bottom: 20px;
  background-color: ${colors.surface};
  border-width: 1px;
  border-color: ${colors.surfaceBorder};
`;
const InfoRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
`;
const InfoLabel = styled.Text`
  color: ${colors.textMuted};
  font-size: 12.5px;
`;
const InfoValue = styled.Text`
  color: ${colors.textPrimary};
  font-size: 13px;
  font-weight: 700;
`;
const CollateralNote = styled.Text`
  color: ${colors.textMuted};
  font-size: 11.5px;
  text-align: center;
  line-height: 17px;
  margin-bottom: 20px;
`;
const CollateralHighlight = styled.Text`
  color: ${colors.primary};
  font-weight: 700;
`;
const PrimaryButton = styled.TouchableOpacity<{ disabled?: boolean }>`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: ${hp(6.5)}px;
  border-radius: 16px;
  margin-bottom: 12px;
  background-color: ${colors.primary};
  opacity: ${(p: any) => (p.disabled ? 0.5 : 1)};
  elevation: 8;
`;
const PrimaryButtonText = styled.Text`
  color: #fff;
  font-size: 15px;
  font-weight: 700;
`;
const SecondaryButton = styled.TouchableOpacity`
  align-items: center;
  justify-content: center;
  height: ${hp(5.5)}px;
  border-radius: 16px;
  margin-bottom: 24px;
`;
const SecondaryButtonText = styled.Text`
  color: ${colors.textMuted};
  font-size: 14px;
`;
const SuccessCard = styled.View`
  border-radius: 14px;
  padding: 16px;
  margin-bottom: 20px;
  background-color: rgba(46, 204, 113, 0.1);
  border-width: 1px;
  border-color: rgba(46, 204, 113, 0.3);
`;
const SuccessRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
`;
const SuccessLabel = styled.Text`
  color: ${colors.textMuted};
  font-size: 12.5px;
`;
const SuccessValue = styled.Text`
  color: ${colors.success};
  font-size: 13.5px;
  font-weight: 700;
`;

type Step = "idle" | "requesting" | "approving" | "success" | "error";

interface Props {
  visible: boolean;
  network: WalletNetworkKey;
  backendAddress: string;
  onClose: () => void;
  onSuccess?: (result: GasSponsorResult) => void;
}

export default function GasSponsorModal({
  visible,
  network,
  backendAddress,
  onClose,
  onSuccess,
}: Props) {
  const { t } = useTranslation();
  const [step, setStep] = useState<Step>("idle");
  const [result, setResult] = useState<GasSponsorResult | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [approveHash, setApproveHash] = useState<string | null>(null);

  useEffect(() => {
    if (!visible) {
      setStep("idle");
      setResult(null);
      setErrorMsg("");
      setApproveHash(null);
      return;
    }

    // Verifica se há uma sessão de gas pendente (app fechou antes do approve)
    // Se sim, pula direto para o passo de approve
    getGasPendingSession().then((session) => {
      if (!session) return;
      if (session.network !== network) return; // sessão de outra rede, ignora
      // Retoma o fluxo a partir do approve
      const waitMs = Math.max(
        0,
        (session.estimatedArrival + 5) * 1000 -
          (Date.now() - session.startedAt * 1000),
      );
      setStep("requesting");
      setTimeout(async () => {
        setStep("approving");
        try {
          await approveAndCollect(session.network, session.backendAddress);
          setStep("success");
          onSuccess?.({
            txid: session.gasTxid,
            amount: "",
            symbol: "",
            estimatedArrival: 0,
          });
        } catch (error: any) {
          setErrorMsg(
            error instanceof GasSponsorError
              ? error.message
              : t("gasSponsor.errorGeneric"),
          );
          setStep("error");
        }
      }, waitMs);
    });
  }, [visible, network]);

  const handleRequest = useCallback(async () => {
    setStep("requesting");
    setErrorMsg("");
    try {
      const res = await requestGasSponsorship(network);
      setResult(res);
      const waitMs = (res.estimatedArrival + 5) * 1000;
      await new Promise((r) => setTimeout(r, waitMs));
      setStep("approving");
      const { approveTxid } = await approveAndCollect(network, backendAddress);
      setApproveHash(approveTxid);
      setStep("success");
      onSuccess?.(res);
    } catch (error: any) {
      setErrorMsg(
        error instanceof GasSponsorError
          ? error.message
          : t("gasSponsor.errorGeneric"),
      );
      setStep("error");
    }
  }, [network, backendAddress, onSuccess, t]);

  const networkLabel = network === "polygon" ? "Polygon (POL)" : "Plasma (XPL)";
  const nativeSymbol = network === "polygon" ? "POL" : "XPL";

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Backdrop
        activeOpacity={1}
        onPress={step === "idle" || step === "error" ? onClose : undefined}
      >
        <Card>
          <Handle />

          {step === "idle" && (
            <>
              <IconRow>
                <Zap size={28} color={colors.primary} strokeWidth={2} />
              </IconRow>
              <Title>{t("gasSponsor.idleTitle")}</Title>
              <Subtitle>
                {t("gasSponsor.idleSubtitle", { symbol: nativeSymbol })}
              </Subtitle>
              <InfoCard>
                <InfoRow>
                  <InfoLabel>{t("gasSponsor.network")}</InfoLabel>
                  <InfoValue>{networkLabel}</InfoValue>
                </InfoRow>
                <InfoRow>
                  <InfoLabel>{t("gasSponsor.gasSent")}</InfoLabel>
                  <InfoValue>~0.01 {nativeSymbol}</InfoValue>
                </InfoRow>
                <InfoRow>
                  <InfoLabel>{t("gasSponsor.cost")}</InfoLabel>
                  <InfoValue style={{ color: colors.success }}>
                    {t("gasSponsor.free")}
                  </InfoValue>
                </InfoRow>
              </InfoCard>
              <CollateralNote>
                {t("gasSponsor.collateralNote1")}
                <CollateralHighlight> 0.5 USDT </CollateralHighlight>
                {t("gasSponsor.collateralNote2")}
              </CollateralNote>
              <PrimaryButton onPress={handleRequest} activeOpacity={0.85}>
                <Zap size={18} color="#FFF" strokeWidth={2.2} />
                <PrimaryButtonText>
                  {t("gasSponsor.requestButton")}
                </PrimaryButtonText>
              </PrimaryButton>
              <SecondaryButton onPress={onClose} activeOpacity={0.7}>
                <SecondaryButtonText>
                  {t("gasSponsor.notNow")}
                </SecondaryButtonText>
              </SecondaryButton>
            </>
          )}

          {step === "requesting" && (
            <>
              <IconRow>
                <ActivityIndicator color={colors.primary} size="large" />
              </IconRow>
              <Title>{t("gasSponsor.requestingTitle")}</Title>
              <Subtitle>{t("gasSponsor.requestingSubtitle")}</Subtitle>
            </>
          )}

          {step === "approving" && (
            <>
              <IconRow>
                <ActivityIndicator color={colors.primary} size="large" />
              </IconRow>
              <Title>{t("gasSponsor.approvingTitle")}</Title>
              <Subtitle>{t("gasSponsor.approvingSubtitle")}</Subtitle>
            </>
          )}

          {step === "success" && result && (
            <>
              <IconRow style={{ backgroundColor: "rgba(46,204,113,0.15)" }}>
                <CheckCircle size={28} color={colors.success} strokeWidth={2} />
              </IconRow>
              <Title>{t("gasSponsor.successTitle")}</Title>
              <Subtitle>
                {t("gasSponsor.successSubtitle", { network: networkLabel })}
              </Subtitle>
              <SuccessCard>
                <SuccessRow>
                  <SuccessLabel>{t("gasSponsor.gasReceived")}</SuccessLabel>
                  <SuccessValue>
                    +{result.amount} {result.symbol}
                  </SuccessValue>
                </SuccessRow>
                <SuccessRow>
                  <SuccessLabel>{t("gasSponsor.collateral")}</SuccessLabel>
                  <SuccessValue>0.5 USDT ✓</SuccessValue>
                </SuccessRow>
              </SuccessCard>
              <PrimaryButton onPress={onClose} activeOpacity={0.85}>
                <PrimaryButtonText>
                  {t("gasSponsor.continue")}
                </PrimaryButtonText>
              </PrimaryButton>
            </>
          )}

          {step === "error" && (
            <>
              <IconRow style={{ backgroundColor: "rgba(255,107,107,0.15)" }}>
                <AlertTriangle
                  size={28}
                  color={colors.danger}
                  strokeWidth={2}
                />
              </IconRow>
              <Title>{t("gasSponsor.errorTitle")}</Title>
              <Subtitle>{errorMsg}</Subtitle>
              <PrimaryButton onPress={handleRequest} activeOpacity={0.85}>
                <PrimaryButtonText>{t("gasSponsor.retry")}</PrimaryButtonText>
              </PrimaryButton>
              <SecondaryButton onPress={onClose} activeOpacity={0.7}>
                <SecondaryButtonText>
                  {t("gasSponsor.close")}
                </SecondaryButtonText>
              </SecondaryButton>
            </>
          )}
        </Card>
      </Backdrop>
    </Modal>
  );
}

import React, { useState, useCallback, useEffect } from "react";
import { Modal, TextInput, TouchableOpacity, View, Text } from "react-native";
import { Delete, ShieldCheck, Eye, EyeOff } from "lucide-react-native";
import styled from "styled-components/native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useNavigation } from "@react-navigation/native";
import { verifyWalletPin } from "../../../components/wallet/walletPin";
import { useAuth } from "@/hook/AuthContext";
import { colors } from "../dashboard/styles";

const PIN_LENGTH = 6;
const KEYPAD = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "⌫"];

const Overlay = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.7);
  padding-horizontal: ${wp(6)}px;
`;
const Card = styled.View`
  width: 100%;
  border-radius: 24px;
  padding: 24px 20px;
  background-color: ${colors.bgDark};
  border-width: 1px;
  border-color: ${colors.surfaceBorder};
`;
const IconWrap = styled.View`
  width: 56px;
  height: 56px;
  border-radius: 28px;
  align-items: center;
  justify-content: center;
  align-self: center;
  margin-bottom: 14px;
  background-color: rgba(108, 92, 231, 0.18);
`;
const Title = styled.Text`
  color: ${colors.textPrimary};
  font-size: 17px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 6px;
`;
const Subtitle = styled.Text`
  color: ${colors.textMuted};
  font-size: 12.5px;
  text-align: center;
  line-height: 17px;
  margin-bottom: ${hp(3)}px;
`;
const DotsRow = styled.View`
  flex-direction: row;
  justify-content: center;
  gap: 14px;
  margin-bottom: ${hp(3)}px;
`;
const Dot = styled.View<{ filled?: boolean; err?: boolean }>`
  width: 13px;
  height: 13px;
  border-radius: 7px;
  background-color: ${({ filled, err }) =>
    err ? colors.danger : filled ? colors.primary : "transparent"};
  border-width: 1.5px;
  border-color: ${({ err }) => (err ? colors.danger : colors.surfaceBorder)};
`;
const Keypad = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;
`;
const KBtn = styled.TouchableOpacity`
  width: 28%;
  aspect-ratio: 1.6;
  align-items: center;
  justify-content: center;
  margin: 3px;
  border-radius: 12px;
  background-color: ${colors.surface};
`;
const KText = styled.Text`
  color: ${colors.textPrimary};
  font-size: 20px;
  font-weight: 600;
`;
const SmallBtn = styled.TouchableOpacity`
  align-self: center;
  margin-top: ${hp(1.5)}px;
`;
const SmallBtnText = styled.Text`
  color: ${colors.textMuted};
  font-size: 12.5px;
`;
const ErrText = styled.Text`
  color: ${colors.danger};
  font-size: 12px;
  text-align: center;
  margin-bottom: 8px;
`;
const InputRow = styled.View`
  flex-direction: row;
  align-items: center;
  height: ${hp(6)}px;
  border-radius: 14px;
  padding-horizontal: 14px;
  margin-vertical: ${hp(2)}px;
  background-color: ${colors.surface};
  border-width: 1px;
  border-color: ${colors.surfaceBorder};
`;
const RecBtn = styled.TouchableOpacity<{ disabled?: boolean }>`
  height: ${hp(6)}px;
  border-radius: 14px;
  align-items: center;
  justify-content: center;
  background-color: ${colors.primary};
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
`;
const RecBtnText = styled.Text`
  color: #fff;
  font-size: 14.5px;
  font-weight: 700;
`;

interface PinConfirmModalProps {
  visible: boolean;
  title?: string;
  subtitle?: string;
  onCancel: () => void;
  onConfirmed: () => void;
}

type View = "pin" | "recovery";

export default function PinConfirmModal({
  visible,
  title = "Digite seu PIN",
  subtitle = "Confirme sua identidade para continuar.",
  onCancel,
  onConfirmed,
}: PinConfirmModalProps) {
  const { navigate } = useNavigation();
  const { verifyPassword } = useAuth();

  const [view, setView] = useState<View>("pin");
  const [pin, setPin] = useState<string[]>([]);
  const [hasError, setHasError] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [recoveryPwd, setRecoveryPwd] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [recVerifying, setRecVerifying] = useState(false);
  const [recError, setRecError] = useState(false);

  useEffect(() => {
    if (!visible) {
      setPin([]);
      setHasError(false);
      setView("pin");
      setRecoveryPwd("");
      setRecError(false);
    }
  }, [visible]);

  const handleKey = useCallback(
    async (key: string) => {
      if (key === "⌫") {
        setPin((p) => p.slice(0, -1));
        setHasError(false);
        return;
      }
      if (!key || pin.length >= PIN_LENGTH) return;
      const next = [...pin, key];
      setPin(next);
      setHasError(false);
      if (next.length < PIN_LENGTH) return;
      await new Promise((r) => setTimeout(r, 120));
      setVerifying(true);
      try {
        const ok = await verifyWalletPin(next.join(""));
        if (!ok) {
          setHasError(true);
          setPin([]);
          return;
        }
        onConfirmed();
      } finally {
        setVerifying(false);
      }
    },
    [pin, onConfirmed],
  );

  const handleRecovery = useCallback(async () => {
    if (!recoveryPwd) {
      setRecError(true);
      return;
    }
    setRecVerifying(true);
    try {
      const ok = await verifyPassword(recoveryPwd);
      if (!ok) {
        setRecError(true);
        return;
      }
      onCancel();
      navigate("WalletPinSetup" as never, { mode: "reset" } as never);
    } finally {
      setRecVerifying(false);
    }
  }, [recoveryPwd, verifyPassword, onCancel, navigate]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <Overlay>
        <Card>
          <IconWrap>
            <ShieldCheck size={26} color={colors.primary} strokeWidth={2.2} />
          </IconWrap>

          {view === "pin" ? (
            <>
              <Title>{title}</Title>
              <Subtitle>{subtitle}</Subtitle>
              <DotsRow>
                {Array.from({ length: PIN_LENGTH }).map((_, i) => (
                  <Dot key={i} filled={i < pin.length} err={hasError} />
                ))}
              </DotsRow>
              {hasError && <ErrText>PIN incorreto. Tente novamente.</ErrText>}
              <Keypad>
                {KEYPAD.map((key, i) => (
                  <KBtn
                    key={i}
                    onPress={() => key && handleKey(key)}
                    activeOpacity={key ? 0.6 : 1}
                    disabled={!key || verifying}
                    style={{ opacity: !key ? 0 : 1 }}
                  >
                    {key === "⌫" ? (
                      <Delete
                        size={20}
                        color={colors.textMuted}
                        strokeWidth={2}
                      />
                    ) : (
                      <KText>{key}</KText>
                    )}
                  </KBtn>
                ))}
              </Keypad>
              <SmallBtn onPress={() => setView("recovery")} activeOpacity={0.7}>
                <SmallBtnText>Esqueci meu PIN</SmallBtnText>
              </SmallBtn>
              <SmallBtn onPress={onCancel} activeOpacity={0.7}>
                <SmallBtnText>Cancelar</SmallBtnText>
              </SmallBtn>
            </>
          ) : (
            <>
              <Title>Confirme sua senha</Title>
              <Subtitle>
                Para redefinir o PIN, confirme a senha de acesso ao app.
              </Subtitle>
              <InputRow>
                <TextInput
                  style={{ flex: 1, color: colors.textPrimary, fontSize: 14 }}
                  placeholder="Senha de login"
                  placeholderTextColor="rgba(255,255,255,0.35)"
                  secureTextEntry={!showPwd}
                  value={recoveryPwd}
                  onChangeText={(t) => {
                    setRecoveryPwd(t);
                    setRecError(false);
                  }}
                  autoFocus
                />
                <TouchableOpacity
                  onPress={() => setShowPwd((p) => !p)}
                  activeOpacity={0.7}
                >
                  {showPwd ? (
                    <EyeOff
                      size={18}
                      color="#FFFFFF"
                      opacity={0.6}
                      strokeWidth={2}
                    />
                  ) : (
                    <Eye
                      size={18}
                      color="#FFFFFF"
                      opacity={0.6}
                      strokeWidth={2}
                    />
                  )}
                </TouchableOpacity>
              </InputRow>
              {recError && <ErrText>Senha incorreta.</ErrText>}
              <RecBtn
                onPress={handleRecovery}
                disabled={recVerifying || !recoveryPwd}
                activeOpacity={0.85}
              >
                <RecBtnText>
                  {recVerifying ? "Verificando..." : "Redefinir PIN"}
                </RecBtnText>
              </RecBtn>
              <SmallBtn onPress={() => setView("pin")} activeOpacity={0.7}>
                <SmallBtnText>← Voltar para o PIN</SmallBtnText>
              </SmallBtn>
            </>
          )}
        </Card>
      </Overlay>
    </Modal>
  );
}

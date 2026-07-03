import React, { useState, useCallback } from "react";
import { StatusBar } from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  AlertTriangle,
  Copy,
} from "lucide-react-native";
import { Clipboard } from "react-native";
import styled from "styled-components/native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Platform, StatusBar as RNStatusBar } from "react-native";
import { useToast } from "@/hook/Toast";
import PinConfirmModal from "../PinConfirmModal";
import { getStoredMnemonic } from "../../../components/wallet/walletStorage";
import { colors } from "../dashboard/styles";
import LogoSvg from "@/assets/logov2.svg";

const STATUSBAR_HEIGHT =
  Platform.OS === "android" ? (RNStatusBar.currentHeight ?? 24) : 0;

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
  background-color: rgba(5, 4, 10, 0.75);
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
  margin-bottom: ${hp(3)}px;
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
const ScrollContent = styled.ScrollView`
  flex: 1;
`;

const WarningCard = styled.View`
  flex-direction: row;
  align-items: flex-start;
  gap: 10px;
  padding: 14px;
  border-radius: 16px;
  margin-bottom: ${hp(2.5)}px;
  background-color: rgba(255, 107, 107, 0.1);
  border-width: 1px;
  border-color: rgba(255, 107, 107, 0.3);
`;
const WarningText = styled.Text`
  flex: 1;
  color: ${colors.textPrimary};
  font-size: 12.5px;
  line-height: 18px;
`;
const WarningHighlight = styled.Text`
  font-weight: 700;
  color: ${colors.danger};
`;

const WordsGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-bottom: ${hp(2)}px;
`;
const WordChip = styled.View`
  width: 31%;
  flex-direction: row;
  align-items: center;
  gap: 6px;
  padding: 10px 8px;
  border-radius: 12px;
  margin-bottom: 10px;
  background-color: ${colors.surface};
  border-width: 1px;
  border-color: ${colors.surfaceBorder};
`;
const WordIndex = styled.Text`
  color: ${colors.textMuted};
  font-size: 10.5px;
  font-weight: 700;
  width: 16px;
`;
const WordText = styled.Text`
  color: ${colors.textPrimary};
  font-size: 13px;
  font-weight: 600;
`;

const BlurOverlay = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 12px;
  background-color: rgba(11, 14, 20, 0.92);
  align-items: center;
  justify-content: center;
`;

const RevealButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 20px;
  border-radius: 14px;
  align-self: center;
  margin-bottom: ${hp(2)}px;
  background-color: ${colors.surface};
  border-width: 1px;
  border-color: ${colors.surfaceBorder};
`;
const RevealButtonText = styled.Text`
  color: ${colors.textMuted};
  font-size: 13px;
  font-weight: 600;
`;

const CopyButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 20px;
  border-radius: 14px;
  align-self: center;
  margin-bottom: ${hp(4)}px;
  background-color: rgba(108, 92, 231, 0.15);
  border-width: 1px;
  border-color: ${colors.primary};
`;
const CopyButtonText = styled.Text`
  color: ${colors.primary};
  font-size: 13px;
  font-weight: 600;
`;

const LockedState = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding-bottom: ${hp(6)}px;
`;
const LockedTitle = styled.Text`
  color: ${colors.textPrimary};
  font-size: 18px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 8px;
  margin-top: 16px;
`;
const LockedSubtitle = styled.Text`
  color: ${colors.textMuted};
  font-size: 13px;
  text-align: center;
  line-height: 19px;
  padding-horizontal: 20px;
  margin-bottom: ${hp(3)}px;
`;
const UnlockButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: ${hp(6.5)}px;
  border-radius: 16px;
  padding-horizontal: 32px;
  background-color: ${colors.primary};
  elevation: 8;
`;
const UnlockButtonText = styled.Text`
  color: #fff;
  font-size: 15px;
  font-weight: 700;
`;
const IconWrapper = styled.View`
  width: 72px;
  height: 72px;
  border-radius: 36px;
  align-items: center;
  justify-content: center;
  background-color: rgba(108, 92, 231, 0.18);
`;

export const CardLogo = styled.View`
  align-items: center;
  margin-top: ${hp(0.5)}px;
  margin-bottom: ${hp(1)}px;
`;

export default function WalletExport() {
  const navigation = useNavigation();
  const { showToast } = useToast();

  const [pinVisible, setPinVisible] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [mnemonic, setMnemonic] = useState<string | null>(null);
  const [blurred, setBlurred] = useState(true);

  const words = mnemonic ? mnemonic.split(" ") : [];

  const handlePinConfirmed = useCallback(async () => {
    setPinVisible(false);
    try {
      const stored = await getStoredMnemonic();
      if (!stored) {
        showToast({
          message:
            "Nenhuma seed phrase encontrada. Esta wallet pode ser externa.",
          type: "error",
        });
        return;
      }
      setMnemonic(stored);
      setUnlocked(true);
      setBlurred(true); // começa borrada mesmo após autenticar
    } catch {
      showToast({
        message: "Não foi possível recuperar a seed phrase.",
        type: "error",
      });
    }
  }, [showToast]);

  const handleCopyAll = useCallback(() => {
    if (!mnemonic) return;
    Clipboard.setString(mnemonic);
    showToast({
      message: "Frase copiada! Guarde em local seguro.",
      type: "success",
    });
  }, [mnemonic, showToast]);

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
            <BackButton onPress={() => navigation.goBack()} activeOpacity={0.7}>
              <ArrowLeft size={22} color="#FFFFFF" strokeWidth={2.2} />
            </BackButton>
            <HeaderTitle>Frase de recuperação</HeaderTitle>
          </Header>
          <CardLogo>
            <LogoSvg width={wp(28)} height={hp(7)} />
          </CardLogo>

          {!unlocked ? (
            // Estado bloqueado — pede PIN antes de mostrar qualquer coisa
            <LockedState>
              <IconWrapper>
                <Eye size={28} color={colors.primary} strokeWidth={2} />
              </IconWrapper>
              <LockedTitle>Conteúdo protegido</LockedTitle>
              <LockedSubtitle>
                Sua frase de recuperação de 12 palavras só pode ser visualizada
                após confirmar seu PIN de segurança.
              </LockedSubtitle>
              <UnlockButton
                onPress={() => setPinVisible(true)}
                activeOpacity={0.85}
              >
                <UnlockButtonText>Confirmar PIN para ver</UnlockButtonText>
              </UnlockButton>
            </LockedState>
          ) : (
            // Estado desbloqueado — mostra as palavras (com blur por padrão)
            <ScrollContent
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 24 }}
            >
              <WarningCard>
                <AlertTriangle
                  size={18}
                  color={colors.danger}
                  strokeWidth={2.2}
                />
                <WarningText>
                  <WarningHighlight>Nunca compartilhe</WarningHighlight> estas
                  palavras com ninguém. Qualquer pessoa com elas pode mover todo
                  o saldo da sua carteira sem reversão possível.
                </WarningText>
              </WarningCard>

              <WordsGrid>
                {words.map((word, index) => (
                  <WordChip key={index}>
                    <WordIndex>{index + 1}.</WordIndex>
                    {!blurred ? (
                      <WordText>{word}</WordText>
                    ) : (
                      // Blur: mostra o chip mas oculta o texto
                      <WordText
                        style={{
                          color: "transparent",
                          backgroundColor: colors.textMuted,
                          borderRadius: 4,
                        }}
                      >
                        {word}
                      </WordText>
                    )}
                  </WordChip>
                ))}
              </WordsGrid>

              <RevealButton
                onPress={() => setBlurred((b) => !b)}
                activeOpacity={0.75}
              >
                {blurred ? (
                  <>
                    <Eye size={16} color={colors.textMuted} strokeWidth={2.2} />
                    <RevealButtonText>Toque para revelar</RevealButtonText>
                  </>
                ) : (
                  <>
                    <EyeOff
                      size={16}
                      color={colors.textMuted}
                      strokeWidth={2.2}
                    />
                    <RevealButtonText>Ocultar palavras</RevealButtonText>
                  </>
                )}
              </RevealButton>

              {!blurred && (
                <CopyButton onPress={handleCopyAll} activeOpacity={0.75}>
                  <Copy size={15} color={colors.primary} strokeWidth={2.2} />
                  <CopyButtonText>Copiar todas as palavras</CopyButtonText>
                </CopyButton>
              )}
            </ScrollContent>
          )}
        </SafeArea>
      </Background>

      <PinConfirmModal
        visible={pinVisible}
        title="Confirme seu PIN"
        subtitle="Autenticação necessária para exibir sua frase de recuperação."
        onCancel={() => setPinVisible(false)}
        onConfirmed={handlePinConfirmed}
      />
    </Container>
  );
}

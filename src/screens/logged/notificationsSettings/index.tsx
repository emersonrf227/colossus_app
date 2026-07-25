import React, { useEffect, useState } from "react";
import { StatusBar, Linking } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ArrowLeft, Bell } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { OneSignal } from "react-native-onesignal";
import styled from "styled-components/native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { colors } from "../dashboard/styles";
import { useToast } from "@/hook/Toast";
import { Platform, StatusBar as RNStatusBar } from "react-native";

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

const ScrollContent = styled.ScrollView`
  flex: 1;
`;

const Card = styled.View`
  background-color: ${colors.surface};
  border-radius: 16px;
  padding: 20px;
  border-width: 1px;
  border-color: ${colors.surfaceBorder};
  margin-bottom: ${hp(2)}px;
`;

const StatusRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${hp(2)}px;
`;

const StatusLabel = styled.Text`
  color: ${colors.textMuted};
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.5px;
`;

const StatusBadge = styled.View<{ granted: boolean }>`
  padding-horizontal: 12px;
  padding-vertical: 6px;
  border-radius: 8px;
  background-color: ${(p) =>
    p.granted ? "rgba(46, 204, 113, 0.15)" : "rgba(255, 107, 107, 0.15)"};
`;

const StatusText = styled.Text<{ granted: boolean }>`
  color: ${(p) => (p.granted ? "#2ecc71" : "#ff6b6b")};
  font-size: 12px;
  font-weight: 700;
`;

const DescriptionText = styled.Text`
  color: ${colors.textMuted};
  font-size: 13px;
  line-height: 20px;
  margin-bottom: ${hp(2)}px;
`;

const ActionButton = styled.TouchableOpacity`
  padding-vertical: 12px;
  border-radius: 12px;
  align-items: center;
  justify-content: center;
  margin-top: ${hp(1)}px;
  background-color: rgba(108, 92, 231, 0.15);
  border-width: 1px;
  border-color: ${colors.primary};
`;

const ActionButtonText = styled.Text`
  color: ${colors.primary};
  font-size: 13px;
  font-weight: 700;
`;

const IconWrapper = styled.View`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background-color: rgba(108, 92, 231, 0.15);
  align-items: center;
  justify-content: center;
  margin-bottom: ${hp(2)}px;
`;

const TokenCard = styled.View`
  background-color: rgba(108, 92, 231, 0.08);
  border-radius: 12px;
  padding: 12px;
  border-width: 1px;
  border-color: rgba(108, 92, 231, 0.3);
  margin-bottom: ${hp(2)}px;
`;

const TokenLabel = styled.Text`
  color: ${colors.textMuted};
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.5px;
  margin-bottom: 6px;
`;

const TokenText = styled.Text`
  color: ${colors.textPrimary};
  font-size: 10px;
  font-family: monospace;
  letter-spacing: 0.3px;
  line-height: 16px;
  word-break: break-all;
`;

export default function NotificationsSettings() {
  const navigation = useNavigation();
  const { goBack } = navigation;
  const { t } = useTranslation();
  const { showToast } = useToast();

  const [permissionStatus, setPermissionStatus] = useState<
    "granted" | "denied" | "loading"
  >("loading");
  const [expoToken, setExpoToken] = useState<string>("");
  const [firebaseError, setFirebaseError] = useState<boolean>(false);

  // Verifica status de notificações ao montar
  useEffect(() => {
    checkNotificationSetup();
  }, []);

  const checkNotificationSetup = async () => {
    try {
      const granted = await OneSignal.Notifications.getPermissionAsync();
      setPermissionStatus(granted ? "granted" : "denied");

      const subscriptionId = await OneSignal.User.pushSubscription.getIdAsync();

      if (subscriptionId) {
        setExpoToken(subscriptionId);
        setFirebaseError(false);
        console.log("✅ OneSignal subscription ID:", subscriptionId);
      } else {
        setExpoToken(
          granted
            ? "Aguardando registro no OneSignal..."
            : "Permissão não concedida",
        );
      }
    } catch (err: any) {
      console.error("❌ Erro ao verificar notificações:", err?.message);
      setFirebaseError(true);
      setExpoToken(`Erro: ${err?.message}`);
      setPermissionStatus("denied");
    }
  };

  const handleEnableNotifications = async () => {
    try {
      const granted = await OneSignal.Notifications.requestPermission(true);
      if (granted) {
        setPermissionStatus("granted");
        await checkNotificationSetup();
        showToast({
          message:
            t("notifications.enabled") || "Notificações ativadas com sucesso!",
          type: "success",
        });
      } else {
        showToast({
          message:
            t("notifications.requiresSettings") ||
            "Abra as configurações do dispositivo para ativar.",
          type: "info",
        });
      }
    } catch (err) {
      console.error("Erro ao ativar notificações:", err);
      showToast({
        message:
          t("notifications.enableError") ||
          "Não foi possível ativar notificações.",
        type: "error",
      });
    }
  };

  const handleOpenSettings = () => {
    // Abre as configurações do app
    Linking.openSettings().catch(() => {
      showToast({
        message:
          t("notifications.settingsError") ||
          "Não foi possível abrir as configurações.",
        type: "error",
      });
    });
  };

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
            <HeaderTitle>
              {t("menu.items.notifications") || "Notificações"}
            </HeaderTitle>
          </Header>

          <ScrollContent
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 24 }}
          >
            {/* Status Card */}
            <Card>
              <IconWrapper>
                <Bell size={24} color={colors.primary} strokeWidth={2} />
              </IconWrapper>

              <StatusRow>
                <StatusLabel>
                  {t("notifications.status") || "STATUS"}
                </StatusLabel>
                <StatusBadge granted={permissionStatus === "granted"}>
                  <StatusText granted={permissionStatus === "granted"}>
                    {permissionStatus === "granted"
                      ? t("notifications.statusGranted") || "Ativadas"
                      : t("notifications.statusDenied") || "Desativadas"}
                  </StatusText>
                </StatusBadge>
              </StatusRow>

              <DescriptionText>
                {permissionStatus === "granted"
                  ? t("notifications.descriptionGranted") ||
                    "Você receberá notificações sobre suas transações, alertas de segurança e atualizações importantes."
                  : t("notifications.descriptionDenied") ||
                    "Ative as notificações para receber atualizações sobre suas transações e alertas importantes."}
              </DescriptionText>

              {permissionStatus === "granted" ? (
                <DescriptionText
                  style={{
                    color: colors.success,
                    marginTop: 12,
                    marginBottom: 0,
                  }}
                >
                  ✓{" "}
                  {t("notifications.everythingReady") ||
                    "Tudo pronto! Você está recebendo notificações."}
                </DescriptionText>
              ) : (
                <>
                  <ActionButton
                    onPress={handleEnableNotifications}
                    activeOpacity={0.75}
                  >
                    <ActionButtonText>
                      {t("notifications.enable") || "Ativar Notificações"}
                    </ActionButtonText>
                  </ActionButton>

                  <ActionButton
                    onPress={handleOpenSettings}
                    activeOpacity={0.75}
                  >
                    <ActionButtonText>
                      {t("notifications.openSettings") || "Abrir Configurações"}
                    </ActionButtonText>
                  </ActionButton>
                </>
              )}
            </Card>

            {/* Expo Token Card - Debug */}
            {/* <TokenCard>
              <TokenLabel>🔔 ONESIGNAL SUBSCRIPTION ID (DEBUG)</TokenLabel>
              {expoToken ? (
                <TokenText style={{ color: firebaseError ? "#ff6b6b" : colors.textPrimary }}>
                  {expoToken}
                </TokenText>
              ) : (
                <TokenText style={{ color: "#ff6b6b" }}>
                  Obtendo token...
                </TokenText>
              )}
              {firebaseError && (
                <DescriptionText style={{ marginTop: 8, color: "#ff6b6b" }}>
                  ⚠️ OneSignal não inicializou. Confira o App ID e rode um build nativo.
                </DescriptionText>
              )}
            </TokenCard> */}

            {/* Info Card */}
            <Card>
              <DescriptionText style={{ marginBottom: 0 }}>
                <StatusLabel>
                  {t("notifications.whyNeeded") || "POR QUE PRECISA?"}
                </StatusLabel>
              </DescriptionText>
              <DescriptionText style={{ marginTop: 12 }}>
                {t("notifications.whyDescription") ||
                  "As notificações ajudam você a ficar informado sobre:\n\n• Novas transações recebidas\n• Confirmação de saques\n• Alertas de segurança\n• Atualizações importantes"}
              </DescriptionText>
            </Card>
          </ScrollContent>
        </SafeArea>
      </Background>
    </Container>
  );
}

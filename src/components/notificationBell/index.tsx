import React, { useMemo } from "react";
import { TouchableOpacity, Modal, ScrollView, StyleSheet } from "react-native";
import { Bell, X, CheckCircle2 } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import styled from "styled-components/native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { colors } from "@/screens/logged/dashboard/styles";
import { Notification } from "@/hook/useNotifications";

interface NotificationBellProps {
  unreadCount: number;
  notifications: Notification[];
  onMarkAsRead: (uuid: string) => void;
  onRefresh?: () => void;
  disabled?: boolean;
}

const BellButton = styled.TouchableOpacity`
  position: relative;
  padding: 8px;
`;

const Badge = styled.View`
  position: absolute;
  top: -4px;
  right: -4px;
  background-color: #ff4757;
  border-radius: 10px;
  width: 20px;
  height: 20px;
  align-items: center;
  justify-content: center;
`;

const BadgeText = styled.Text`
  color: #ffffff;
  font-size: 11px;
  font-weight: 700;
`;

const ModalOverlay = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: flex-end;
`;

const ModalSheet = styled.View`
  background-color: ${colors.bgDark};
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
  padding: 20px;
  max-height: 80%;
`;

const ModalHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const ModalTitle = styled.Text`
  color: ${colors.textPrimary};
  font-size: 18px;
  font-weight: 700;
`;

const CloseButton = styled.TouchableOpacity`
  padding: 8px;
`;

const NotificationItem = styled.TouchableOpacity`
  background-color: ${colors.surface};
  border-radius: 12px;
  padding: 12px;
  margin-bottom: 12px;
  border-width: 1px;
  border-color: ${colors.surfaceBorder};
`;

const NotificationRow = styled.View`
  flex-direction: row;
  align-items: flex-start;
  gap: 12px;
`;

const NotificationContent = styled.View`
  flex: 1;
`;

const NotificationTitle = styled.Text`
  color: ${colors.textPrimary};
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 4px;
`;

const NotificationBody = styled.Text`
  color: ${colors.textMuted};
  font-size: 13px;
  line-height: 19px;
`;

const NotificationTime = styled.Text`
  color: ${colors.textMuted};
  font-size: 12px;
  margin-top: 6px;
`;

const EmptyState = styled.View`
  align-items: center;
  justify-content: center;
  padding-vertical: ${hp(4)}px;
`;

const EmptyText = styled.Text`
  color: ${colors.textMuted};
  font-size: 14px;
  margin-top: 12px;
`;

function formatDate(isoString: string): string {
  try {
    // Converte a string ISO para Date
    const date = new Date(isoString);
    const now = new Date();

    // Correção: Backend está salvando 3h atrás
    // TODO: Remover quando o backend corrigir a timezone
    const BACKEND_OFFSET_MS = 3 * 60 * 60 * 1000; // 3 horas em ms

    // Calcula a diferença em milissegundos (com ajuste de offset)
    let diffMs = now.getTime() - date.getTime() - BACKEND_OFFSET_MS;

    // Garante que não fique negativo (caso a notificação seja recente demais)
    if (diffMs < 0) diffMs = 0;

    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    console.log("⏰ Notificação (ajustada):", {
      isoString,
      diffMins,
      diffHours,
      diffDays,
    });

    if (diffMins < 1) return "Agora";
    if (diffMins < 60) return `${diffMins}m atrás`;
    if (diffHours < 24) return `${diffHours}h atrás`;
    if (diffDays < 7) return `${diffDays}d atrás`;

    // Formato de data para mais de 7 dias
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch (err) {
    console.error("❌ Erro ao formatar data:", err);
    return "Data inválida";
  }
}

export function NotificationBell({
  unreadCount,
  notifications,
  onMarkAsRead,
  onRefresh,
  disabled,
}: NotificationBellProps) {
  const { t } = useTranslation();
  const [modalVisible, setModalVisible] = React.useState(false);

  const sortedNotifications = useMemo(
    () =>
      [...notifications].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ),
    [notifications],
  );

  const handleNotificationPress = React.useCallback(
    (uuid: string, read: boolean) => {
      if (!read) {
        onMarkAsRead(uuid);
      }
    },
    [onMarkAsRead],
  );

  return (
    <>
      <BellButton
        onPress={() => setModalVisible(true)}
        disabled={disabled}
        activeOpacity={0.7}
      >
        <Bell size={22} color={colors.textPrimary} strokeWidth={2} />
        {unreadCount > 0 && (
          <Badge>
            <BadgeText>{unreadCount > 99 ? "99+" : unreadCount}</BadgeText>
          </Badge>
        )}
      </BellButton>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <ModalOverlay>
          <ModalSheet>
            <ModalHeader>
              <ModalTitle>{t("notifications.title")}</ModalTitle>
              <CloseButton onPress={() => setModalVisible(false)}>
                <X size={24} color={colors.textPrimary} />
              </CloseButton>
            </ModalHeader>

            <ScrollView showsVerticalScrollIndicator={false}>
              {sortedNotifications.length === 0 ? (
                <EmptyState>
                  <Bell
                    size={40}
                    color={colors.textMuted}
                    strokeWidth={1.5}
                  />
                  <EmptyText>{t("notifications.empty")}</EmptyText>
                </EmptyState>
              ) : (
                sortedNotifications.map((notification) => (
                  <NotificationItem
                    key={notification.uuid}
                    onPress={() =>
                      handleNotificationPress(
                        notification.uuid,
                        notification.read,
                      )
                    }
                  >
                    <NotificationRow>
                      <NotificationContent>
                        <NotificationTitle>
                          {notification.title}
                        </NotificationTitle>
                        <NotificationBody>
                          {notification.body}
                        </NotificationBody>
                        <NotificationTime>
                          {formatDate(notification.createdAt)}
                        </NotificationTime>
                      </NotificationContent>
                      {!notification.read && (
                        <CheckCircle2
                          size={16}
                          color={colors.primary}
                          strokeWidth={2}
                        />
                      )}
                    </NotificationRow>
                  </NotificationItem>
                ))
              )}
            </ScrollView>
          </ModalSheet>
        </ModalOverlay>
      </Modal>
    </>
  );
}

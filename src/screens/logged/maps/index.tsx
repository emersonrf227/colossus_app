import React, { useState, useEffect, useCallback, useMemo } from "react";
import { StatusBar, Linking, ActivityIndicator, Modal } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import {
  ArrowLeft,
  X,
  Phone,
  MessageCircle,
  Globe,
  MapPin,
  ShieldCheck,
  Store,
} from "lucide-react-native";

import * as S from "./styles";
import {
  fetchCommunityLocations,
  getSegmentColor,
  getWeekdayLabel,
  CommunityLocation,
} from "../../../components/maps";
import { colors } from "../dashboard/styles";
import { useToast } from "@/hook/Toast";

const INITIAL_REGION = {
  latitude: -23.55052,
  longitude: -46.633308,
  latitudeDelta: 0.2,
  longitudeDelta: 0.2,
};

export default function CommunityMap() {
  const navigation = useNavigation();
  const { showToast } = useToast();
  const { t } = useTranslation();

  const [locations, setLocations] = useState<CommunityLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const [selectedSegment, setSelectedSegment] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] =
    useState<CommunityLocation | null>(null);

  const loadLocations = useCallback(async () => {
    setLoading(true);
    setHasError(false);
    try {
      const data = await fetchCommunityLocations();
      setLocations(data);
    } catch {
      setHasError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLocations();
  }, [loadLocations]);

  // Segmentos derivados dos próprios dados — assim, qualquer segmento
  // novo que a API vier a mandar aparece automaticamente no filtro,
  // sem precisar atualizar uma lista fixa no app.
  const segments = useMemo(() => {
    const unique = new Set(
      locations.map((item) => item.segment).filter(Boolean),
    );
    return Array.from(unique);
  }, [locations]);

  const filteredLocations = useMemo(() => {
    if (!selectedSegment) return locations;
    return locations.filter((item) => item.segment === selectedSegment);
  }, [locations, selectedSegment]);

  const handleCall = useCallback(
    async (phone?: string) => {
      if (!phone) return;
      const url = `tel:${phone.replace(/\s/g, "")}`;
      try {
        await Linking.openURL(url);
      } catch {
        showToast({
          message: t("communityMap.errors.call"),
          type: "error",
        });
      }
    },
    [showToast, t],
  );

  const handleWhatsApp = useCallback(
    async (whatsapp?: string) => {
      if (!whatsapp) return;
      const cleaned = whatsapp.replace(/\D/g, "");
      const url = `https://wa.me/${cleaned}`;
      try {
        const supported = await Linking.canOpenURL(url);
        if (supported) {
          await Linking.openURL(url);
        } else {
          showToast({
            message: t("communityMap.errors.whatsapp"),
            type: "error",
          });
        }
      } catch {
        showToast({
          message: t("communityMap.errors.whatsapp"),
          type: "error",
        });
      }
    },
    [showToast, t],
  );

  const handleWebsite = useCallback(
    async (website?: string) => {
      if (!website) return;
      try {
        await Linking.openURL(website);
      } catch {
        showToast({
          message: t("communityMap.errors.website"),
          type: "error",
        });
      }
    },
    [showToast, t],
  );

  return (
    <S.Container>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      <S.MapWrapper>
        {loading ? (
          <S.CenteredOverlay>
            <ActivityIndicator color={colors.primary} size="large" />
            <S.StateText>{t("communityMap.loading")}</S.StateText>
          </S.CenteredOverlay>
        ) : hasError ? (
          <S.CenteredOverlay>
            <S.StateText>{t("communityMap.errorLoad")}</S.StateText>
            <S.RetryButton onPress={loadLocations} activeOpacity={0.7}>
              <S.RetryButtonText>{t("communityMap.retry")}</S.RetryButtonText>
            </S.RetryButton>
          </S.CenteredOverlay>
        ) : (
          <MapView
            provider={PROVIDER_GOOGLE}
            style={{ flex: 1 }}
            initialRegion={INITIAL_REGION}
          >
            {filteredLocations.map((item) => (
              <Marker
                key={item.id}
                coordinate={{
                  latitude: item.location.latitude,
                  longitude: item.location.longitude,
                }}
                onPress={() => setSelectedLocation(item)}
              >
                <S.MarkerPin pinColor={getSegmentColor(item.segment)}>
                  <Store size={16} color="#FFFFFF" strokeWidth={2.2} />
                </S.MarkerPin>
              </Marker>
            ))}
          </MapView>
        )}

        <S.FloatingHeader>
          <S.HeaderRow>
            <S.BackButton
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
            >
              <ArrowLeft size={20} color="#FFFFFF" strokeWidth={2.2} />
            </S.BackButton>
            <S.HeaderTitle>{t("communityMap.headerTitle")}</S.HeaderTitle>
          </S.HeaderRow>

          {!loading && !hasError && segments.length > 0 && (
            <S.ChipsScroll horizontal showsHorizontalScrollIndicator={false}>
              <S.FilterChip
                selected={selectedSegment === null}
                onPress={() => setSelectedSegment(null)}
                activeOpacity={0.75}
              >
                <S.FilterChipText selected={selectedSegment === null}>
                  {t("communityMap.filterAll")}
                </S.FilterChipText>
              </S.FilterChip>

              {segments.map((segment) => {
                const isSelected = selectedSegment === segment;
                const color = getSegmentColor(segment);
                return (
                  <S.FilterChip
                    key={segment}
                    selected={isSelected}
                    chipColor={color}
                    onPress={() => setSelectedSegment(segment)}
                    activeOpacity={0.75}
                  >
                    <S.FilterChipDot
                      dotColor={isSelected ? "#FFFFFF" : color}
                    />
                    <S.FilterChipText selected={isSelected}>
                      {segment}
                    </S.FilterChipText>
                  </S.FilterChip>
                );
              })}
            </S.ChipsScroll>
          )}
        </S.FloatingHeader>
      </S.MapWrapper>

      <Modal
        visible={!!selectedLocation}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedLocation(null)}
      >
        <S.ModalOverlay>
          <S.ModalBackdropTouchable
            activeOpacity={1}
            onPress={() => setSelectedLocation(null)}
          />

          {selectedLocation && (
            <S.ModalCard>
              <S.ModalCloseButton
                onPress={() => setSelectedLocation(null)}
                activeOpacity={0.7}
              >
                <X size={16} color="#FFFFFF" strokeWidth={2.4} />
              </S.ModalCloseButton>

              <S.CoverWrapper>
                {selectedLocation.photos?.[0] ? (
                  <S.CoverImage source={{ uri: selectedLocation.photos[0] }} />
                ) : (
                  <S.CoverFallback
                    accentColor={getSegmentColor(selectedLocation.segment)}
                  >
                    <Store
                      size={36}
                      color={getSegmentColor(selectedLocation.segment)}
                      strokeWidth={1.8}
                    />
                  </S.CoverFallback>
                )}
              </S.CoverWrapper>

              <S.ModalScroll showsVerticalScrollIndicator={false}>
                <S.ModalContent>
                  <S.ModalHeaderRow>
                    <S.ModalTitleBlock>
                      <S.ModalTitle>{selectedLocation.name}</S.ModalTitle>
                      <S.SegmentBadge
                        badgeColor={getSegmentColor(selectedLocation.segment)}
                      >
                        <S.SegmentBadgeText
                          badgeColor={getSegmentColor(selectedLocation.segment)}
                        >
                          {selectedLocation.segment}
                          {selectedLocation.subcategory
                            ? ` · ${selectedLocation.subcategory}`
                            : ""}
                        </S.SegmentBadgeText>
                      </S.SegmentBadge>
                    </S.ModalTitleBlock>

                    {selectedLocation.verified && (
                      <S.VerifiedBadge>
                        <ShieldCheck
                          size={14}
                          color={colors.success}
                          strokeWidth={2.2}
                        />
                        <S.VerifiedBadgeText>
                          {t("communityMap.verified")}
                        </S.VerifiedBadgeText>
                      </S.VerifiedBadge>
                    )}
                  </S.ModalHeaderRow>

                  {selectedLocation.description && (
                    <S.Description>
                      {selectedLocation.description}
                    </S.Description>
                  )}

                  <S.ActionsRow>
                    {selectedLocation.phone && (
                      <S.ActionButton
                        accentColor={colors.primary}
                        onPress={() => handleCall(selectedLocation.phone)}
                        activeOpacity={0.75}
                      >
                        <Phone
                          size={15}
                          color={colors.primary}
                          strokeWidth={2.2}
                        />
                        <S.ActionButtonText accentColor={colors.primary}>
                          {t("communityMap.actions.call")}
                        </S.ActionButtonText>
                      </S.ActionButton>
                    )}
                    {selectedLocation.whatsapp && (
                      <S.ActionButton
                        accentColor={colors.success}
                        onPress={() =>
                          handleWhatsApp(selectedLocation.whatsapp)
                        }
                        activeOpacity={0.75}
                      >
                        <MessageCircle
                          size={15}
                          color={colors.success}
                          strokeWidth={2.2}
                        />
                        <S.ActionButtonText accentColor={colors.success}>
                          {t("communityMap.actions.whatsapp")}
                        </S.ActionButtonText>
                      </S.ActionButton>
                    )}
                    {selectedLocation.website && (
                      <S.ActionButton
                        accentColor={colors.accent}
                        onPress={() => handleWebsite(selectedLocation.website)}
                        activeOpacity={0.75}
                      >
                        <Globe
                          size={15}
                          color={colors.accent}
                          strokeWidth={2.2}
                        />
                        <S.ActionButtonText accentColor={colors.accent}>
                          {t("communityMap.actions.website")}
                        </S.ActionButtonText>
                      </S.ActionButton>
                    )}
                  </S.ActionsRow>

                  {selectedLocation.address?.formatted && (
                    <>
                      <S.SectionLabel>
                        {t("communityMap.address")}
                      </S.SectionLabel>
                      <S.AddressText>
                        <MapPin size={12} color={colors.textMuted} />{" "}
                        {selectedLocation.address.formatted}
                      </S.AddressText>
                    </>
                  )}

                  {selectedLocation.openingHours &&
                    selectedLocation.openingHours.length > 0 && (
                      <>
                        <S.SectionLabel>
                          {t("communityMap.openingHours")}
                        </S.SectionLabel>
                        {selectedLocation.openingHours.map((hour, index) => (
                          <S.HoursRow key={`${hour.day}-${index}`}>
                            <S.HoursDay>{getWeekdayLabel(hour.day)}</S.HoursDay>
                            <S.HoursTime>
                              {hour.open} – {hour.close}
                            </S.HoursTime>
                          </S.HoursRow>
                        ))}
                      </>
                    )}

                  {selectedLocation.paymentMethods &&
                    selectedLocation.paymentMethods.length > 0 && (
                      <>
                        <S.SectionLabel>
                          {t("communityMap.paymentMethods")}
                        </S.SectionLabel>
                        <S.PaymentMethodsRow>
                          {selectedLocation.paymentMethods.map((method) => (
                            <S.PaymentMethodPill
                              key={method}
                              highlight={method === "USDT"}
                            >
                              <S.PaymentMethodPillText
                                highlight={method === "USDT"}
                              >
                                {method}
                              </S.PaymentMethodPillText>
                            </S.PaymentMethodPill>
                          ))}
                        </S.PaymentMethodsRow>
                      </>
                    )}

                  {selectedLocation.tags &&
                    selectedLocation.tags.length > 0 && (
                      <>
                        <S.SectionLabel>
                          {t("communityMap.tags")}
                        </S.SectionLabel>
                        <S.TagsRow>
                          {selectedLocation.tags.map((tag) => (
                            <S.TagPill key={tag}>
                              <S.TagPillText>{tag}</S.TagPillText>
                            </S.TagPill>
                          ))}
                        </S.TagsRow>
                      </>
                    )}
                </S.ModalContent>
              </S.ModalScroll>
            </S.ModalCard>
          )}
        </S.ModalOverlay>
      </Modal>
    </S.Container>
  );
}

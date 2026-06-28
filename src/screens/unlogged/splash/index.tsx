import React, { useEffect, useRef, useState } from "react";
import { StatusBar } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as S from "./styles";
import { useAuth } from "@/hook/AuthContext";
import rstruther from "@/infraestructure/http/nodeApi";

// Pequeno atraso mínimo só para a animação de loading não "piscar"
// caso a validação termine quase instantaneamente.
const MIN_SPLASH_DURATION_MS = 1200;

export default function Splash() {
  const navigation = useNavigation();
  const { isRestoringSession } = useAuth();
  const [statusText, setStatusText] = useState("Iniciando...");
  const hasNavigatedRef = useRef(false);

  useEffect(() => {
    // Espera o AuthContext terminar de ler o token salvo no AsyncStorage
    // antes de tentar qualquer validação — sem isso, token ainda seria
    // null mesmo que exista uma sessão salva.
    if (isRestoringSession || hasNavigatedRef.current) return;

    const startedAt = Date.now();

    const decideRoute = async () => {
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        goToLogin();
        return;
      }

      setStatusText("Verificando sua sessão...");

      try {
        // Chamada leve e real à API. Se o token estiver expirado, o
        // interceptor de 401 do AuthContext já tenta renovar via refresh
        // token automaticamente (e, em último caso, o fallback de
        // re-login salvo) antes desta Promise rejeitar de fato. Se
        // chegar aqui com sucesso, a sessão está genuinamente válida.
        await rstruther.get("saller/account/information");
        goToDashboard();
      } catch {
        // Token inválido e o refresh/fallback também não recuperaram a
        // sessão — não há sessão válida, vai para o login.
        goToLogin();
      }
    };

    const goToDashboard = () =>
      navigateAfterMinDuration("Dashboard", startedAt);
    const goToLogin = () => navigateAfterMinDuration("SingIn", startedAt);

    decideRoute();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRestoringSession]);

  const navigateAfterMinDuration = (
    routeName: "Dashboard" | "SingIn",
    startedAt: number,
  ) => {
    if (hasNavigatedRef.current) return;
    hasNavigatedRef.current = true;

    const elapsed = Date.now() - startedAt;
    const remaining = Math.max(0, MIN_SPLASH_DURATION_MS - elapsed);

    setTimeout(() => {
      navigation.reset({
        index: 0,
        routes: [{ name: routeName as never }],
      });
    }, remaining);
  };

  return (
    <S.Container>
      <S.Background source={require("@/assets/background.png")}>
        <S.BackgroundOverlay />
      </S.Background>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      <S.LoaderWrapper>
        <S.LoaderAnimation
          source={require("@/assets/loadcolossus.gif")}
          resizeMode="contain"
        />
        <S.StatusText>{statusText}</S.StatusText>
      </S.LoaderWrapper>
    </S.Container>
  );
}

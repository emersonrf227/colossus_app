import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { SvgXml } from "react-native-svg";
import { CheckCircle, AlertTriangle, XCircle, Info } from "lucide-react-native"; // Importe os ícones

interface AlertBadgeProps {
  type: "success" | "warn" | "error" | "info";
  duration?: number; // em milissegundos, padrão: 3000
  message: string;
}

const AlertBadge: React.FC<AlertBadgeProps> = ({
  type,
  duration = 3000,
  message,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const fadeAnim = new Animated.Value(0); // Opacidade inicial 0

  // Efeitos colaterais para controlar a visibilidade e animação
  useEffect(() => {
    if (isVisible) {
      // Animação de entrada
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300, // Duração da animação de entrada
        useNativeDriver: true,
      }).start(() => {
        // Temporizador para esconder o badge após o tempo especificado
        if (duration > 0) {
          setTimeout(() => {
            // Animação de saída
            Animated.timing(fadeAnim, {
              toValue: 0,
              duration: 200, // Duração da animação de saída
              useNativeDriver: true,
            }).start(() => {
              setIsVisible(false); // Esconde o componente após a animação
            });
          }, duration);
        }
      });
    }
  }, [isVisible, duration, fadeAnim]); // Depende de isVisible e duration

  // Se não estiver visível, não renderiza nada
  if (!isVisible) {
    return null;
  }

  // Determina o estilo e o ícone com base no tipo
  let backgroundColor = "#38a169"; // success
  let icon = <CheckCircle size={20} color="#fff" />;
  let textColor = "#fff";

  switch (type) {
    case "warn":
      backgroundColor = "#d69e2e"; // warn
      icon = <AlertTriangle size={20} color="#fff" />;
      break;
    case "error":
      backgroundColor = "#e53e3e"; // error
      icon = <XCircle size={20} color="#fff" />;
      break;
    case "info":
      backgroundColor = "#3182ce"; // info
      icon = <Info size={20} color="#fff" />;
      break;
    default:
      break;
  }

  // Estilos do componente
  const styles = StyleSheet.create({
    container: {
      position: "absolute",
      top: 60, // Posição fixa no topo
      left: 20,
      right: 20,
      backgroundColor,
      borderRadius: 8,
      padding: 12,
      flexDirection: "row",
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
      zIndex: 1000, // Garante que o badge fique sobre outros elementos
    },
    text: {
      color: textColor,
      marginLeft: 8,
      fontSize: 14,
      flex: 1, // Permite que o texto preencha o espaço restante
    },
    iconContainer: {
      marginRight: 4,
    },
  });

  // Renderiza o componente Animated.View
  return (
    <Animated.View style={{ ...styles.container, opacity: fadeAnim }}>
      <View style={styles.iconContainer}>{icon}</View>
      <Text style={styles.text} numberOfLines={2}>
        {message}
      </Text>
    </Animated.View>
  );
};

export default AlertBadge;

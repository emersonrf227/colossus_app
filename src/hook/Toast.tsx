import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { getStatusBarHeight } from "react-native-iphone-x-helper";
import {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { Toast } from "@/components/toast";
interface ToastProviderProps {
  children: ReactNode;
}

interface ToastContextData {
  showToast: (data: ShowToastData) => void;
  showToastNeverTime: (data: ShowToastData) => void;
  HideToast: () => void;
}

type Color = "success" | "warn" | "error" | "default";

interface ShowToastData {
  message: string;
  type?: Color;
}

const ToastContext = createContext({} as ToastContextData);

function ToastProvider({ children }: ToastProviderProps) {
  const [message, setMessage] = useState("");

  const [color, setColor] = useState<Color>("default");

  const hiddenToast = -(getStatusBarHeight() + 80);

  const animation = useSharedValue(hiddenToast);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: withTiming(animation.value, {
            duration: 150,
            easing: Easing.linear,
          }),
        },
      ],
    };
  });

  function show() {
    animation.value = 0;
    setTimeout(() => {
      setMessage("");
      animation.value = hiddenToast;
    }, 6000);
  }

  function showNeverTimer() {
    animation.value = 0;
  }

  function showToast({ message, type = "default" }: ShowToastData) {
    setMessage(message);
    setColor(type);
    show();
  }

  function showToastNeverTime({ message, type = "default" }: ShowToastData) {
    setMessage(message);
    setColor(type);
    showNeverTimer();
  }

  function HideToast() {
    setMessage("");
    animation.value = hiddenToast;
  }

  return (
    <ToastContext.Provider value={{ showToast, showToastNeverTime, HideToast }}>
      <Toast animatedStyles={animatedStyles} color={color} message={message} />
      {children}
    </ToastContext.Provider>
  );
}

function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within an ToastProvider");
  }

  return context;
}

export { ToastProvider, useToast };

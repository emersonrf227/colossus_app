import { View } from "react-native";
import { Routes } from "./src/routes";
import { ThemeProvider } from "styled-components";
import theme from "./src/theme";
import { AuthProvider } from "@/hook/AuthContext";
import { ToastProvider } from "@/hook/Toast";
import { NavigationContainer } from "@react-navigation/native";

export default function App() {
  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      <ThemeProvider theme={theme}>
        <ToastProvider>
          <AuthProvider>
            <Routes />
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </View>
  );
}

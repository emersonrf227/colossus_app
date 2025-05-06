import React, { useState } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useNavigation } from "@react-navigation/native";
import {
  Info,
  Wallet,
  FileText,
  LifeBuoy,
  HelpCircle,
  Plus,
  LogOut,
  ReceiptText,
  Printer,
} from "lucide-react-native"; // Importe os ícones
import styled from "styled-components/native";
import * as S from "./styles";
import { StatusBar } from "react-native";
import LogoSvg from "@/assets/logov2.svg";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import Loader from "@/components/loader";

export default function MenuScreen() {
  const [loading, setLoading] = useState(false);
  const { navigate } = useNavigation();

  const navigation = useNavigation();
  const menuFunction = [];
  const menuItems = [
    { label: "Info", icon: Info, route: "getInfo", type: "route" },
    {
      label: "Wallet Forward",
      icon: Wallet,
      route: "CadWallet",
      type: "route",
    },
    { label: "Invoices", icon: FileText, route: "Extract", type: "route" },

    { label: "Support", icon: LifeBuoy, route: "supportScren", type: "route" },
    { label: "About", icon: HelpCircle, route: "getAbout", type: "route" },
    { label: "Terms", icon: ReceiptText, route: "TermsOfUse", type: "route" },
    {
      label: "Print",
      icon: Printer,
      route: "SelectPrinterScreen",
      type: "route",
    },
    {
      label: "Logout",
      icon: LogOut,
      action: async () => {
        try {
          setLoading(true);
          await AsyncStorage.removeItem("token");
          await AsyncStorage.removeItem("refreshToken");
          await AsyncStorage.removeItem("name");
          await AsyncStorage.removeItem("uuid");
          await AsyncStorage.removeItem("typeAuth");
          navigation.navigate("SingIn");
        } catch (error) {
          setLoading(false);
        } finally {
          setLoading(false);
        }
      },
      type: "function",
    },
  ];
  const handleNavigation = (item: (typeof menuItems)[0]) => {
    console.log("Handling navigation for:", item.label, "Type:", item.type);
    if (item.type === "route") {
      if (item.route) {
        navigate(item.route);
        console.log("Navigating to:", item.route);
      } else {
        console.warn("Route is missing for item:", item.label);
      }
    } else if (item.type === "function") {
      if (item.action) {
        item.action();
        console.log("Executing function for:", item.label);
      } else {
        console.warn("Action is missing for item:", item.label);
      }
    } else {
      console.warn("Invalid item type or missing route/action", item);
    }
  };

  return (
    <S.Container>
      {loading && <Loader />}
      <S.Background source={require("@/assets/background.png")}>
        <StatusBar
          barStyle="default"
          backgroundColor="transparent"
          translucent
        />
        <S.SafeArea>
          <S.Header>
            <S.BackButton onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={32} color="white" />
            </S.BackButton>
          </S.Header>
          <S.cardLogo>
            <LogoSvg width={wp(45)} height={hp(15)} />
          </S.cardLogo>

          <S.CardPad>
            <S.ButtonGrid>
              {menuItems.map((item) => (
                <S.MenuButton
                  key={item.label}
                  onPress={() => handleNavigation(item)}
                >
                  <item.icon size={wp(10)} color="#412659" />
                  <S.ButtonText>{item.label}</S.ButtonText>
                </S.MenuButton>
              ))}
            </S.ButtonGrid>

            <S.ButtonShutdown>
              {menuFunction.map((item) => (
                <S.MenuButtonfunction
                  key={item.label}
                  onPress={() => handleNavigation(item)}
                >
                  <item.icon size={wp(10)} color="#412659" />
                  <S.ButtonText>{item.label}</S.ButtonText>
                </S.MenuButtonfunction>
              ))}
            </S.ButtonShutdown>
          </S.CardPad>
        </S.SafeArea>
      </S.Background>
    </S.Container>
  );
}

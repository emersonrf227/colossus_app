import { StatusBar } from "react-native";
import React, { useEffect, useState } from "react";
import { Alert } from "react-native";
import * as S from "./styles";
import { useNavigation } from "@react-navigation/native";
import LogoSvg from "@/assets/logov2.svg";
import PolygonLogo from "@/assets/networks/polygon.svg";
import BscLogo from "@/assets/networks/bsclogo.svg";
import rstruther from "@/infraestructure/http/nodeApi";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useToast } from "@/hook/Toast";
import Loader from "@/components/loader";

export default function Dashboard() {
  const { navigate } = useNavigation();
  const [displayValue, setDisplayValue] = useState("");
  const [selectedNetwork, setSelectedNetwork] = useState("polygon");
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const createInvoice = async () => {
    setLoading(true);
    try {
      const obj = {
        amount: displayValue,
        network: selectedNetwork,
        reference: new Date(),
        token: "usdt",
        memo: "pay ",
        split: [],
      };
      const response = await rstruther.post(`saller/invoice`, obj);
      console.log("Data Invoice ===>", response.status);
      if (response.status === 200 || response.status === 201) {
        await navigate("Invoice", { data: response.data });
      }
    } catch (error: any) {
      if (error?.response?.data?.message) {
        if (
          error?.response?.data?.message ===
          "Forward Wallet not found put an forward wallet in POST v1/saller/wallet."
        ) {
          showToast({
            message: `${error?.response?.data?.message}`,
            type: "error",
          });
          navigate(`CadWallet`);
          return;
        }
      }
      console.log(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const handleNetworkSelection = (network: string) => {
    if (network === "bsc") {
      alert("Comming song!");
      return;
    }
    setSelectedNetwork(network);
    alert(network);
  };

  const toggleMenu = () => {
    navigate("MenuScreen");
  };

  const handleKeyPress = (value: string) => {
    if (value === "C") {
      setDisplayValue("");
    } else if (value === "⌫") {
      setDisplayValue(formatCurrency(displayValue.slice(0, -1)));
    } else {
      setDisplayValue(formatCurrency(displayValue + value));
    }
  };

  const formatCurrency = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, "");

    if (numericValue.length === 0) {
      return "0.00";
    }
    let formattedValue = numericValue;
    while (formattedValue.length < 3) {
      formattedValue = "0" + formattedValue;
    }
    const integerPart = formattedValue.slice(0, -2);
    const decimalPart = formattedValue.slice(-2);
    const formattedIntegerPart = parseInt(integerPart, 10).toString();
    return `${formattedIntegerPart}.${decimalPart}`;
  };

  const buttons = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "C", "0", "⌫"];

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
            <S.MenuButton onPress={toggleMenu}>
              <S.MenuIcon>☰</S.MenuIcon>
            </S.MenuButton>
          </S.Header>
          <S.cardLogo>
            <LogoSvg width={wp(45)} height={hp(15)} />
          </S.cardLogo>

          <S.CardSelectNetwork>
            {/* <S.TextNetwork>Select an Network </S.TextNetwork> */}
            <S.CardNetwork>
              <S.NetworkButton
                onPress={() => handleNetworkSelection("polygon")}
              >
                <PolygonLogo
                  width={selectedNetwork === "polygon" ? wp("14%") : wp(4)}
                  height={selectedNetwork === "polygon" ? wp("14%") : wp(4)}
                />
              </S.NetworkButton>
              {/* <S.NetworkButton onPress={() => handleNetworkSelection("bsc")}>
                <BscLogo
                  width={selectedNetwork === "bsc" ? wp("14%") : wp(4)}
                  height={selectedNetwork === "bsc" ? wp("14%") : wp(4)}
                />
              </S.NetworkButton> */}
            </S.CardNetwork>
          </S.CardSelectNetwork>

          <S.CardPad>
            <S.Display>{displayValue}</S.Display>
            <S.ButtonContainer>
              {buttons.map((button) => (
                <S.Button key={button} onPress={() => handleKeyPress(button)}>
                  <S.ButtonText>{button}</S.ButtonText>
                </S.Button>
              ))}
            </S.ButtonContainer>
            <S.ButtonSend onPress={() => createInvoice()}>
              <S.ButtonTextSend>Create Invoice</S.ButtonTextSend>
            </S.ButtonSend>
          </S.CardPad>
        </S.SafeArea>
      </S.Background>
    </S.Container>
  );
}

import React, { useEffect, useState } from "react";
import { Alert, Clipboard, View } from "react-native";
import * as S from "./styles";
import { useNavigation } from "@react-navigation/native";
import LogoSvg from "@/assets/logov2.svg";
import PolygonLogo from "@/assets/networks/polygon.svg";
import BscLogo from "@/assets/networks/bsclogo.svg";
import { ClipboardPaste as IClipboardPaste } from "lucide-react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useToast } from "@/hook/Toast";
import { isAddress } from "ethers";
import { TouchableOpacity } from "react-native-gesture-handler";
import rstruther from "@/infraestructure/http/nodeApi";
import { StatusBar } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Loader from "@/components/loader";
import QRCode from "react-native-qrcode-svg";

export default function CadWallet() {
  const navigation = useNavigation();
  const { navigate } = useNavigation();
  const [displayValue, setDisplayValue] = useState("");
  const { showToast } = useToast();
  const [selectedNetwork, setSelectedNetwork] = useState("polygon");
  const [wallet, setWallet] = useState("");
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    getWalletForward();
  }, []);

  const getWalletForward = async () => {
    setLoading(true);
    try {
      const response = await rstruther.get(`saller/wallet`);
      console.log();
      if (response.status === 200 || response.status || 201) {
        setAddress(response.data.address);
        const balanceRequest = await rstruther.get(
          `saller/wallet/balance?address=${response.data.address}&currency=usdt&network=polygon`
        );

        if (balanceRequest.status === 200 || balanceRequest.status === 201) {
          setBalance(balanceRequest.data.res.amount);
        }
      }
    } catch (error: any) {
      console.log(error);
      if (error.response) {
        showToast({
          message:
            error.response.data.message ||
            "Undefined Error an create forward wallet.",
          type: "error",
        });
      } else if (error.message) {
        showToast({
          message: error.message,
          type: "error",
        });
      } else {
        showToast({
          message: `Bad Request.`,
          type: "error",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const validateWalletEthAddress = async () => {
    try {
      const validationResult = isAddress(wallet);
      if (validationResult) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  };

  const PutCadWallet = async () => {
    setLoading(true);
    let valid = false;
    if (selectedNetwork === "polygon") {
      valid = await validateWalletEthAddress();
    }

    if (!valid) {
      showToast({
        message: `Address ${selectedNetwork} is invalid.`,
        type: "error",
      });
      setLoading(false);

      return;
    }
    try {
      const data = {
        network: selectedNetwork,
        address: wallet,
      };
      const response = await rstruther.post(`saller/wallet`, data);
      if (response.status === 200 || response.status || 201) {
        showToast({
          message: `Forward wallet create.`,
          type: "success",
        });
        navigate("Dashboard");
      }
    } catch (error: any) {
      console.log(error);
      if (error.response) {
        showToast({
          message:
            error.response.data.message ||
            "Undefined Error an create forward wallet.",
          type: "error",
        });
      } else if (error.message) {
        showToast({
          message: error.message,
          type: "error",
        });
      } else {
        showToast({
          message: `Bad Request.`,
          type: "error",
        });
      }
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

  const handlePaste = () => {
    Clipboard.getString()
      .then((text) => {
        setWallet(text);
      })
      .catch((err) => {
        console.error("Failed to get clipboard text", err);
        showToast({ message: "Failed to access clipboard", type: "error" });
      });
  };

  useEffect(() => {
    console.log("effect");
  }, []);

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

          {address && (
            <>
              <S.walletItsOk>
                <S.QRCodeContainer>
                  <S.CardQrCode>
                    <QRCode
                      value={`${address}`}
                      size={200}
                      logoSize={30}
                      logoBackgroundColor="white"
                      logoMargin={2}
                      color="black"
                      backgroundColor="white"
                    />
                  </S.CardQrCode>

                  <S.TextWallet> {address}</S.TextWallet>
                  <S.cardBalance>
                    <S.TextBalance> {balance} </S.TextBalance>
                    <S.imageToken
                      source={require("@/assets/networks/tether.png")}
                      resizeMode="contain"
                    />
                  </S.cardBalance>
                </S.QRCodeContainer>
              </S.walletItsOk>
            </>
          )}

          {address ?? (
            <>
              <S.walletItsNOk>
                <S.CardSelectNetwork>
                  <S.TextNetwork>+551129089826an Network </S.TextNetwork>
                  <S.CardNetwork>
                    <S.NetworkButton
                      onPress={() => handleNetworkSelection("polygon")}
                    >
                      <PolygonLogo
                        width={
                          selectedNetwork === "polygon" ? wp("14%") : wp(4)
                        }
                        height={
                          selectedNetwork === "polygon" ? wp("14%") : wp(4)
                        }
                      />
                    </S.NetworkButton>
                    <S.NetworkButton
                      onPress={() => handleNetworkSelection("bsc")}
                    >
                      <BscLogo
                        width={selectedNetwork === "bsc" ? wp("14%") : wp(4)}
                        height={selectedNetwork === "bsc" ? wp("14%") : wp(4)}
                      />
                    </S.NetworkButton>
                  </S.CardNetwork>
                </S.CardSelectNetwork>
                <S.CardInput>
                  <S.CopyButton
                    onPress={handlePaste}
                    style={{ marginRight: 8 }}
                  >
                    <IClipboardPaste color="white" size={20} />
                  </S.CopyButton>
                  <S.Input
                    value={wallet}
                    onChangeText={setWallet}
                    style={{ flex: 1 }} // Garante que o input ocupa o espaço restante
                  />
                </S.CardInput>

                <S.FooterButton onPress={() => PutCadWallet()}>
                  <S.ButtonText>Enter</S.ButtonText>
                </S.FooterButton>
              </S.walletItsNOk>
            </>
          )}
        </S.SafeArea>
      </S.Background>
    </S.Container>
  );
}

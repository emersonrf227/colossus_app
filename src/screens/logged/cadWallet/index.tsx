import React, { useEffect, useState, useCallback } from "react";
import { Clipboard, StatusBar } from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  ArrowLeft,
  ClipboardPaste,
  Copy,
  ShieldCheck,
} from "lucide-react-native";
import { isAddress } from "ethers";
import QRCode from "react-native-qrcode-svg";

import * as S from "./styles";
import LogoSvg from "@/assets/logov2.svg";
import PolygonLogo from "@/assets/networks/polygon.svg";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useToast } from "@/hook/Toast";
import Loader from "@/components/loader";
import rstruther from "@/infraestructure/http/nodeApi";

const NETWORK_OPTIONS = [{ key: "polygon", Logo: PolygonLogo, enabled: true }];

export default function CadWallet() {
  const navigation = useNavigation();
  const { navigate } = useNavigation();
  const { showToast } = useToast();

  const [selectedNetwork, setSelectedNetwork] = useState("polygon");
  const [wallet, setWallet] = useState("");
  const [loading, setLoading] = useState(false);

  // null = ainda não sabemos / carregando.
  // "" (string vazia) ou null explícito após a busca = sem wallet configurada.
  // string não-vazia = wallet configurada.
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState(0);
  const [checkingWallet, setCheckingWallet] = useState(true);

  const getWalletForward = useCallback(async () => {
    setCheckingWallet(true);
    try {
      const response = await rstruther.get("saller/wallet");

      if (response.status === 200 || response.status === 201) {
        const fetchedAddress = response.data?.address;
        setAddress(fetchedAddress || null);

        if (fetchedAddress) {
          try {
            const balanceRequest = await rstruther.get(
              `saller/wallet/balance?address=${fetchedAddress}&currency=usdt&network=polygon`,
            );
            if (
              balanceRequest.status === 200 ||
              balanceRequest.status === 201
            ) {
              setBalance(balanceRequest.data?.res?.amount ?? 0);
            }
          } catch {
            // Falha ao buscar saldo não deve impedir a exibição do QR/endereço,
            // só deixa o saldo em 0.
          }
        }
      }
    } catch (error: any) {
      const status = error?.response?.status;

      // 404 é esperado quando o usuário ainda não configurou uma wallet
      // forward — nesse caso o formulário deve aparecer normalmente,
      // sem nenhum toast de erro assustando o usuário.
      if (status === 404) {
        setAddress(null);
      } else {
        showToast({
          message:
            error?.response?.data?.message ??
            "Não foi possível verificar sua carteira. Tente novamente.",
          type: "error",
        });
      }
    } finally {
      setCheckingWallet(false);
    }
  }, [showToast]);

  useEffect(() => {
    getWalletForward();
  }, [getWalletForward]);

  const validateWalletEthAddress = useCallback(async () => {
    try {
      return isAddress(wallet);
    } catch {
      return false;
    }
  }, [wallet]);

  const handleSubmit = useCallback(async () => {
    setLoading(true);
    try {
      let valid = false;
      if (selectedNetwork === "polygon") {
        valid = await validateWalletEthAddress();
      }

      if (!valid) {
        showToast({
          message: `Endereço inválido para a rede ${selectedNetwork}.`,
          type: "error",
        });
        return;
      }

      const response = await rstruther.post("saller/wallet", {
        network: selectedNetwork,
        address: wallet,
      });

      if (response.status === 200 || response.status === 201) {
        showToast({
          message: "Carteira de recebimento cadastrada!",
          type: "success",
        });
        navigate("Dashboard" as never);
      }
    } catch (error: any) {
      const message =
        error?.response?.data?.message ?? error?.message ?? "Bad Request.";
      showToast({ message, type: "error" });
    } finally {
      setLoading(false);
    }
  }, [selectedNetwork, wallet, validateWalletEthAddress, showToast, navigate]);

  const handleNetworkSelection = useCallback(
    (network: string, enabled: boolean) => {
      if (!enabled) {
        showToast({ message: "Em breve!", type: "info" });
        return;
      }
      setSelectedNetwork(network);
    },
    [showToast],
  );

  const handlePaste = useCallback(async () => {
    try {
      const text = await Clipboard.getString();
      setWallet(text);
    } catch {
      showToast({
        message: "Não foi possível acessar a área de transferência",
        type: "error",
      });
    }
  }, [showToast]);

  const copyAddressToClipboard = useCallback(async () => {
    if (!address) return;
    await Clipboard.setString(address);
    showToast({ message: "Endereço copiado!", type: "success" });
  }, [address, showToast]);

  const hasWallet = !checkingWallet && !!address;

  return (
    <S.Container>
      {(loading || checkingWallet) && <Loader />}

      <S.Background source={require("@/assets/background.png")}>
        <S.BackgroundOverlay />
        <StatusBar
          barStyle="light-content"
          backgroundColor="transparent"
          translucent
        />

        <S.SafeArea>
          <S.Header>
            <S.BackButton
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
            >
              <ArrowLeft size={22} color="#FFFFFF" strokeWidth={2.2} />
            </S.BackButton>
            <S.HeaderTitle>Carteira de Recebimento</S.HeaderTitle>
          </S.Header>

          <S.cardLogo>
            <LogoSvg width={wp(36)} height={hp(10)} />
          </S.cardLogo>

          <S.ScrollContent
            contentContainerStyle={{ paddingBottom: 32 }}
            showsVerticalScrollIndicator={false}
          >
            {hasWallet ? (
              <S.WalletConfiguredCard>
                <S.StatusBadge>
                  <ShieldCheck size={14} color="#2ECC71" strokeWidth={2.2} />
                  <S.StatusBadgeText>Carteira configurada</S.StatusBadgeText>
                </S.StatusBadge>

                <S.QrCard>
                  <QRCode
                    value={String(address)}
                    size={wp(46)}
                    logoSize={30}
                    logoBackgroundColor="white"
                    logoMargin={2}
                    color="black"
                    backgroundColor="white"
                  />
                </S.QrCard>

                <S.AddressCard
                  onPress={copyAddressToClipboard}
                  activeOpacity={0.7}
                >
                  <S.AddressText numberOfLines={1}>{address}</S.AddressText>
                  <S.CopyIconWrapper>
                    <Copy size={16} color="#6C5CE7" strokeWidth={2.2} />
                  </S.CopyIconWrapper>
                </S.AddressCard>

                <S.BalanceCard>
                  <S.TokenIcon
                    source={require("@/assets/networks/tether.png")}
                    resizeMode="contain"
                  />
                  <S.BalanceValue>{balance}</S.BalanceValue>
                  <S.BalanceLabel>USDT</S.BalanceLabel>
                </S.BalanceCard>
              </S.WalletConfiguredCard>
            ) : !checkingWallet ? (
              <>
                <S.FormSectionLabel>REDE</S.FormSectionLabel>
                <S.CardSelectNetwork>
                  <S.CardNetwork>
                    {NETWORK_OPTIONS.map(({ key, Logo, enabled }) => {
                      const isSelected = selectedNetwork === key;
                      return (
                        <S.NetworkButton
                          key={key}
                          selected={isSelected}
                          activeOpacity={0.75}
                          onPress={() => handleNetworkSelection(key, enabled)}
                        >
                          <Logo
                            width={isSelected ? wp("10%") : wp(6)}
                            height={isSelected ? wp("10%") : wp(6)}
                          />
                        </S.NetworkButton>
                      );
                    })}
                  </S.CardNetwork>
                </S.CardSelectNetwork>

                <S.FormSectionLabel>ENDEREÇO DA CARTEIRA</S.FormSectionLabel>
                <S.FormIntro>
                  Os pagamentos recebidos serão automaticamente encaminhados
                  para este endereço na rede selecionada.
                </S.FormIntro>

                <S.InputCard>
                  <S.PasteButton onPress={handlePaste} activeOpacity={0.7}>
                    <ClipboardPaste
                      size={18}
                      color="#6C5CE7"
                      strokeWidth={2.2}
                    />
                  </S.PasteButton>
                  <S.StyledInput
                    placeholder="0x..."
                    placeholderTextColor="rgba(255,255,255,0.35)"
                    value={wallet}
                    onChangeText={setWallet}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </S.InputCard>

                <S.SubmitButton
                  onPress={handleSubmit}
                  disabled={loading}
                  activeOpacity={0.85}
                >
                  <S.SubmitButtonText>Cadastrar carteira</S.SubmitButtonText>
                </S.SubmitButton>
              </>
            ) : null}
          </S.ScrollContent>
        </S.SafeArea>
      </S.Background>
    </S.Container>
  );
}

import React, { useCallback } from "react";
import {
  StatusBar,
  Linking,
  Share,
  Platform,
  StatusBar as RNStatusBar,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  CheckCircle,
  ExternalLink,
  Share2,
  ArrowLeft,
} from "lucide-react-native";
import styled from "styled-components/native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { colors } from "../dashboard/styles";

const STATUSBAR_HEIGHT =
  Platform.OS === "android" ? (RNStatusBar.currentHeight ?? 24) : 0;

const Container = styled.View`
  flex: 1;
  background-color: ${colors.bgDark};
`;
const Background = styled.ImageBackground`
  flex: 1;
  width: 100%;
  height: 100%;
`;
const Overlay = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(5, 4, 10, 0.72);
`;
const SafeArea = styled.SafeAreaView`
  flex: 1;
  padding-horizontal: ${wp(6)}px;
  padding-top: ${STATUSBAR_HEIGHT}px;
`;
const Header = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: ${hp(1)}px;
`;
const BackButton = styled.TouchableOpacity`
  width: 44px;
  height: 44px;
  border-radius: 14px;
  align-items: center;
  justify-content: center;
  background-color: ${colors.surface};
  border-width: 1px;
  border-color: ${colors.surfaceBorder};
`;
const Content = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding-bottom: ${hp(6)}px;
`;
const IconWrapper = styled.View`
  width: 88px;
  height: 88px;
  border-radius: 44px;
  align-items: center;
  justify-content: center;
  margin-bottom: ${hp(2.5)}px;
  background-color: rgba(46, 204, 113, 0.15);
`;
const Title = styled.Text`
  color: ${colors.textPrimary};
  font-size: 22px;
  font-weight: 800;
  text-align: center;
  margin-bottom: 8px;
`;
const Subtitle = styled.Text`
  color: ${colors.textMuted};
  font-size: 13.5px;
  text-align: center;
  line-height: 20px;
  padding-horizontal: 16px;
  margin-bottom: ${hp(4)}px;
`;
const TxCard = styled.View`
  width: 100%;
  border-radius: 16px;
  padding: 16px;
  margin-bottom: ${hp(2)}px;
  background-color: ${colors.surface};
  border-width: 1px;
  border-color: ${colors.surfaceBorder};
`;
const TxLabel = styled.Text`
  color: ${colors.textMuted};
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1px;
  margin-bottom: 6px;
`;
const TxValue = styled.Text`
  color: ${colors.textPrimary};
  font-size: 12px;
  font-family: monospace;
  line-height: 18px;
`;
const ActionsColumn = styled.View`
  width: 100%;
  gap: 12px;
  margin-top: ${hp(1)}px;
`;
const PrimaryButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: ${hp(6.8)}px;
  border-radius: 16px;
  background-color: ${colors.primary};
  elevation: 8;
`;
const PrimaryButtonText = styled.Text`
  color: #fff;
  font-size: 15px;
  font-weight: 700;
`;
const SecondaryButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: ${hp(6)}px;
  border-radius: 16px;
  background-color: ${colors.surface};
  border-width: 1px;
  border-color: ${colors.surfaceBorder};
`;
const SecondaryButtonText = styled.Text`
  color: ${colors.textPrimary};
  font-size: 14px;
  font-weight: 600;
`;

interface RouteParams {
  txid: string;
  explorerUrl: string;
}

export default function WalletWithdrawSuccess() {
  const navigation = useNavigation();
  const route = useRoute();
  const { txid, explorerUrl } = route.params as RouteParams;

  const handleOpenExplorer = useCallback(() => {
    Linking.openURL(explorerUrl).catch(() => {});
  }, [explorerUrl]);

  const handleShare = useCallback(async () => {
    try {
      await Share.share({ message: `Transação confirmada:\n${explorerUrl}` });
    } catch {}
  }, [explorerUrl]);

  const handleGoHome = useCallback(() => {
    navigation.reset({
      index: 0,
      routes: [{ name: "WalletHome" as never }],
    });
  }, [navigation]);

  return (
    <Container>
      <Background source={require("@/assets/background.png")}>
        <Overlay />
        <StatusBar
          barStyle="light-content"
          backgroundColor="transparent"
          translucent
        />
        <SafeArea>
          <Header>
            <BackButton onPress={handleGoHome} activeOpacity={0.7}>
              <ArrowLeft size={22} color="#FFFFFF" strokeWidth={2.2} />
            </BackButton>
          </Header>

          <Content>
            <IconWrapper>
              <CheckCircle size={48} color={colors.success} strokeWidth={1.8} />
            </IconWrapper>

            <Title>Saque enviado!</Title>
            <Subtitle>
              A transação foi assinada e enviada à blockchain. A confirmação
              pode levar alguns segundos dependendo da rede.
            </Subtitle>

            <TxCard>
              <TxLabel>TXID</TxLabel>
              <TxValue numberOfLines={2}>{txid}</TxValue>
            </TxCard>

            <ActionsColumn>
              <PrimaryButton onPress={handleOpenExplorer} activeOpacity={0.85}>
                <ExternalLink size={18} color="#FFFFFF" strokeWidth={2.2} />
                <PrimaryButtonText>Ver no Explorer</PrimaryButtonText>
              </PrimaryButton>

              <SecondaryButton onPress={handleShare} activeOpacity={0.75}>
                <Share2
                  size={16}
                  color={colors.textPrimary}
                  strokeWidth={2.2}
                />
                <SecondaryButtonText>Compartilhar</SecondaryButtonText>
              </SecondaryButton>
            </ActionsColumn>
          </Content>
        </SafeArea>
      </Background>
    </Container>
  );
}

import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SingIn from "../screens/unlogged/singin/";
import ProofConfirm from "@/screens/logged/proofConfirm";
import Splash from "@/screens/unlogged/splash";
import MenuScreen from "@/screens/logged/menu";
import Extract from "@/screens/logged/extract";
import ProofExtract from "@/screens/logged/proofExtract";
import GetInfo from "@/screens/logged/getInfo";
import GetAbout from "@/screens/logged/getAbout";
import SupportScren from "@/screens/logged/support";
import TermsOfUse from "@/screens/logged/termsOfUse";
import SelectNetworks from "@/screens/logged/selectNetwork";
import SettingsLanguage from "@/screens/logged/settingsLanguage";
import Maps from "@/screens/logged/maps";
import WalletSetup from "@/screens/logged/walletSetup";
import WalletSecurityIntro from "@/screens/logged/walletSecurityIntro";
import WalletBackup from "@/screens/logged/walletBackup";
import WalletGate from "@/screens/logged/walletGate";
import WalletHome from "@/screens/logged/walletHome";
import WalletPinSetup from "@/screens/logged/walletPinSetup";
import WalletWithdraw from "@/screens/logged/walletwithdraw";
import WalletWithdrawSuccess from "@/screens/logged/walletWithdrawSuccess";
import Walletwithdrawpixsuccess from "@/screens/logged/walletWithdrawpixsuccess";
import WalletWithdrawPixForm from "@/screens/logged/walletWithdrawpixform";
import Walletwithdrawpixconfirm from "@/screens/logged/walletWithdrawpixconfirm";
import Walletwithdrawpixstatus from "@/screens/logged/walletWithdrawpixstatus";
import Walletwithdrawpix from "@/screens/logged/walletWithdrawpix";
import WalletExport from "@/screens/logged/walletExport";
import WalletImport from "@/screens/logged/walletImport";
import WalletHistory from "@/screens/logged/walletHistory";
import Walletpixreceipt from "@/screens/logged/walletPixreceipt";
import NotificationsSettings from "@/screens/logged/notificationsSettings";

const { Navigator, Screen } = createNativeStackNavigator();

export function AppRoutes() {
  return (
    <Navigator screenOptions={{ headerShown: false }}>
      <Screen name="SingIn" component={SingIn} />

      <Screen name="Splash" component={Splash} />
      <Screen name="getAbout" component={GetAbout} />
      <Screen name="supportScren" component={SupportScren} />
      <Screen name="getInfo" component={GetInfo} />
      <Screen name="proofExtract" component={ProofExtract} />
      <Screen name="Extract" component={Extract} />
      <Screen name="MenuScreen" component={MenuScreen} />
      <Screen name="NotificationsSettings" component={NotificationsSettings} />
      <Screen name="proofConfirm" component={ProofConfirm} />
      <Screen name="TermsOfUse" component={TermsOfUse} />
      <Screen name="SelectNetworks" component={SelectNetworks} />
      <Screen name="SettingsLanguage" component={SettingsLanguage} />
      <Screen name="Maps" component={Maps} />
      <Screen name="WalletSetup" component={WalletSetup} />
      <Screen name="WalletSecurityIntro" component={WalletSecurityIntro} />
      <Screen name="WalletBackup" component={WalletBackup} />
      <Screen name="WalletGate" component={WalletGate} />
      <Screen name="WalletHome" component={WalletHome} />
      <Screen name="WalletPinSetup" component={WalletPinSetup} />
      <Screen name="WalletWithdraw" component={WalletWithdraw} />
      <Screen name="WalletWithdrawSuccess" component={WalletWithdrawSuccess} />
      <Screen name="WalletImport" component={WalletImport} />
      <Screen name="Walletwithdrawpix" component={Walletwithdrawpix} />
      <Screen name="WalletWithdrawPixForm" component={WalletWithdrawPixForm} />
      <Screen
        name="Walletwithdrawpixconfirm"
        component={Walletwithdrawpixconfirm}
      />
      <Screen
        name="Walletwithdrawpixstatus"
        component={Walletwithdrawpixstatus}
      />
      <Screen
        name="Walletwithdrawpixsuccess"
        component={Walletwithdrawpixsuccess}
      />
      <Screen name="WalletExport" component={WalletExport} />
      <Screen name="WalletHistory" component={WalletHistory} />
      <Screen name="Walletpixreceipt" component={Walletpixreceipt} />
    </Navigator>
  );
}

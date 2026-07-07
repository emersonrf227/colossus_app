import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SingIn from "../screens/unlogged/singin/";
import ForgetPwd from "../screens/unlogged/forgetpwd";
import Dashboard from "@/screens/logged/dashboard";
import Invoice from "@/screens/logged/invoice";
import proofConfirm from "@/screens/logged/proofConfirm";
import CadWallet from "@/screens/logged/cadWallet";
import Splash from "@/screens/unlogged/splash";
import MenuScreen from "@/screens/logged/menu";
import PinForget from "@/screens/unlogged/pinForget";
import Extract from "@/screens/logged/extract";
import proofExtract from "@/screens/logged/proofExtract";
import getInfo from "@/screens/logged/getInfo";
import getAbout from "@/screens/logged/getAbout";
import supportScren from "@/screens/logged/support";
import TermsOfUse from "@/screens/logged/termsOfUse";
import SelectPrinterScreen from "@/screens/logged/printer";
import SelectNetworks from "@/screens/logged/selectNetwork";
import SettingsLanguage from "@/screens/logged/settingsLanguage";
import Maps from "@/screens/logged/maps";
import WalletSetup from "@/screens/logged/walletSetup";
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

const { Navigator, Screen } = createNativeStackNavigator();

export function AppRoutes() {
  return (
    <Navigator screenOptions={{ headerShown: false }}>
      <Screen name="Splash" component={Splash} />
      <Screen name="getAbout" component={getAbout} />
      <Screen name="supportScren" component={supportScren} />
      <Screen name="getInfo" component={getInfo} />
      <Screen name="proofExtract" component={proofExtract} />
      <Screen name="Extract" component={Extract} />
      <Screen name="PinForget" component={PinForget} />
      <Screen name="MenuScreen" component={MenuScreen} />
      <Screen name="Dashboard" component={Dashboard} />
      <Screen name="SingIn" component={SingIn} />
      <Screen name="CadWallet" component={CadWallet} />
      <Screen name="Invoice" component={Invoice} />
      <Screen name="proofConfirm" component={proofConfirm} />
      <Screen name="ForgetPwd" component={ForgetPwd} />
      <Screen name="TermsOfUse" component={TermsOfUse} />
      <Screen name="SelectPrinterScreen" component={SelectPrinterScreen} />
      <Screen name="SelectNetworks" component={SelectNetworks} />
      <Screen name="SettingsLanguage" component={SettingsLanguage} />
      <Screen name="Maps" component={Maps} />
      <Screen name="WalletSetup" component={WalletSetup} />
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

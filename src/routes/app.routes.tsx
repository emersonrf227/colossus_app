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
    </Navigator>
  );
}

import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SingIn from "../screens/unlogged/singin";

import Splash from "@/screens/unlogged/splash";

const { Navigator, Screen } = createNativeStackNavigator();

export function AppUnlogedRoutes() {
  return (
    <Navigator screenOptions={{ headerShown: false }}>
      <Screen name="SingIn" component={SingIn} />
      <Screen name="Splash" component={Splash} />
    </Navigator>
  );
}

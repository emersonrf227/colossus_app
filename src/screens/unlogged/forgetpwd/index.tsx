import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { Alert } from "react-native";
import * as S from "./styles";
import { useNavigation } from "@react-navigation/native";
import LogoSvg from "@/assets/logov2.svg";
import { useToast } from "@/hook/Toast";
import rstruther from "@/infraestructure/http/nodeApi";
import Loader from "@/components/loader";

export default function ForgetPwd() {
  const [identifier, setIdentifier] = useState("");
  const { navigate } = useNavigation();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const sendResetPassword = async () => {
    setLoading(true);
    try {
      const obj = {
        email: identifier,
      };
      const response = await rstruther.post(`auth/recovery-password`, obj);
      console.log("Data Invoice ===>", response.status);
      if (response.status === 200 || response.status === 201) {
        navigate("PinForget", { email: identifier });
      }
    } catch (error: any) {
      showToast({
        message: `${error?.response?.data?.message}`,
        type: "error",
      });
      console.log(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("effect");
  }, []);

  return (
    <S.Background source={require("@/assets/background.png")}>
      {loading && <Loader />}

      <S.Container>
        <LogoSvg width={200} />
        <S.Input
          placeholder="Enter your E-mail"
          placeholderTextColor="#ccc"
          value={identifier}
          onChangeText={(text) => setIdentifier(text.toLowerCase())}
        />
        <S.LoginButton onPress={() => sendResetPassword()}>
          <S.LoginText>Send</S.LoginText>
        </S.LoginButton>
        <S.ResetButton onPress={() => navigate("SingIn")}>
          <S.ForgotPassword>SingIn</S.ForgotPassword>
        </S.ResetButton>
      </S.Container>
    </S.Background>
  );
}

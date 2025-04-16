import React, { useEffect, useState } from "react";
import {
  TextInput,
  TouchableOpacity,
  Text,
  ImageBackground,
} from "react-native";
import styled from "styled-components/native";
import LogoSvg from "@/assets/logov2.svg";
import * as S from "./styles";
import { useAuth } from "@/hook/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { useToast } from "@/hook/Toast";
import Loader from "@/components/loader";

export default function SingIn() {
  const { signIn, signOut } = useAuth();
  const { showToast } = useToast();
  const [cpf, setCpf] = useState("");
  const [password, setPassword] = useState("");
  const [identifier, setIdentifier] = useState("");
  const { navigate } = useNavigation();
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);

    try {
      if (!identifier || !password) {
        showToast({
          message: `Username and password is not empty.`,
          type: "error",
        });
        return;
      }

      const singin = await signIn(identifier, password);
      if (singin?.error === true) {
        showToast({
          message: singin.msg,
          type: "error",
        });
        setLoading(false);
      } else {
        setLoading(false);
        navigate("Dashboard");
      }
    } catch (error) {
      setLoading(false);
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
          placeholder="Enter your username"
          placeholderTextColor="#ccc"
          value={identifier}
          onChangeText={setIdentifier}
        />
        <S.Input
          placeholder="Enter your password"
          placeholderTextColor="#ccc"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <S.LoginButton onPress={() => handleLogin()}>
          <S.LoginText>Enter</S.LoginText>
        </S.LoginButton>
        <S.ResetButton onPress={() => navigate("ForgetPwd")}>
          <S.ForgotPassword>Forget my password</S.ForgotPassword>
        </S.ResetButton>
      </S.Container>
    </S.Background>
  );
}

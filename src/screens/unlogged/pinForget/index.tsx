import React, { useRef, useState } from "react";
import { TextInput, Alert } from "react-native";
import * as S from "./styles";
import { useNavigation, useRoute } from "@react-navigation/native";
import LogoSvg from "@/assets/logov2.svg";
import rstruther from "@/infraestructure/http/nodeApi";
import { useToast } from "@/hook/Toast";
import Loader from "@/components/loader";

export default function PinForget() {
  const [pin, setPin] = useState(["", "", "", "", "", ""]);
  const inputs = useRef<TextInput[]>([]);
  const { navigate } = useNavigation();
  const [password, setPassword] = useState("");
  const [cpassword, setcPassword] = useState("");
  const { showToast } = useToast();
  const route = useRoute();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  console.log(route);

  const handleChange = (text: string, index: number) => {
    let newPin = [...pin];
    if (text.length > 1) {
      // Se colar, distribui os números nos campos
      const pastedNumbers = text.slice(0, 6).split("");
      setPin([...pastedNumbers, ...Array(6 - pastedNumbers.length).fill("")]);
    } else {
      newPin[index] = text;
      setPin(newPin);

      // Avançar para o próximo campo automaticamente
      if (text !== "" && index < 5) {
        inputs.current[index + 1].focus();
      }
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    const routeObj = route.params;

    try {
      const obj = {
        email: routeObj.email,
        passoword: password,
        cpassword: cpassword,
        pin: pin.join(""),
      };
      console.log(obj);
      const response = await rstruther.post(`auth/reset-password`, obj);
      console.log("Data Invoice ===>", response.status);
      if (response.status === 200 || response.status === 201) {
        navigate("SingIn");
      }
    } catch (error: any) {
      showToast({
        message: `${error?.response?.data?.message}`,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <S.Background source={require("@/assets/background.png")}>
      {loading && <Loader />}

      <S.Container>
        <LogoSvg width={200} />

        <S.Title>Enter with PIN</S.Title>
        <S.InputContainer>
          {pin.map((digit, index) => (
            <S.PinInput
              key={index}
              ref={(ref) => (inputs.current[index] = ref!)}
              keyboardType="numeric"
              maxLength={1}
              value={digit}
              onChangeText={(text) => handleChange(text, index)}
            />
          ))}
        </S.InputContainer>

        <S.viewBoxInput>
          <S.Input
            placeholder="Enter new password"
            placeholderTextColor="#ccc"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <S.Input
            placeholder="Confirm new password"
            placeholderTextColor="#ccc"
            secureTextEntry
            value={cpassword}
            onChangeText={setcPassword}
          />
        </S.viewBoxInput>

        <S.ConfirmButton onPress={handleSubmit}>
          <S.ConfirmText>Confirm</S.ConfirmText>
        </S.ConfirmButton>
        <S.ResetButton onPress={() => navigation.goBack()}>
          <S.ForgotPassword>Back</S.ForgotPassword>
        </S.ResetButton>
      </S.Container>
    </S.Background>
  );
}

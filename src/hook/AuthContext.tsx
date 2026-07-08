import React, { createContext, ReactNode, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AuthContextProps {
  /**
   * Limpa tudo localmente — seed phrase, PIN e qualquer dado
   * salvo no AsyncStorage. Usado em "Redefinir carteira" ou
   * "Apagar tudo". Após isso o WalletGate redireciona para WalletSetup.
   */
  clearSession: () => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

function AuthProvider({ children }: AuthProviderProps) {
  const clearSession = async () => {
    // Remove todas as chaves da wallet explicitamente por nome
    // para garantir que nada fica para trás independente de
    // implementação das funções auxiliares.
    await AsyncStorage.multiRemove([
      // Wallet storage
      "wallet_pin_enc",
      "colossus-crypto-app-v1-pin-key",
      "wallet_mnemonic_enc",
      "wallet_address",
      "wallet_source",
      "wallet_pin_enc",
      "pix_saved_email",
      "wallet_mnemonic_enc",
      "wallet_address",
      "wallet_source",
      "colossus-crypto-app-v1-wallet-key",
    ]);
  };

  return (
    <AuthContext.Provider value={{ clearSession }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}

export { AuthProvider, useAuth };

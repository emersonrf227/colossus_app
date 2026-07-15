import { getStoredWalletAddress } from "./walletStorage";
import { WalletNetworkKey } from "./walletProviders";
import AsyncStorage from "@react-native-async-storage/async-storage";
import swapxApi from "@/infraestructure/http/swapixApi";

export interface ApiWalletRecord {
  id: number;
  uuid: string;
  address: string;
  networkId: number;
  active: boolean;
}

// Mapeia o networkId numérico da API para a chave de rede usada nos
// módulos de blockchain (walletProviders, walletBalances, etc).
// 👉 Confirme/ajuste esse mapeamento conforme os IDs reais da sua API.
const NETWORK_ID_MAP: Record<number, WalletNetworkKey> = {
  1: "polygon",
  2: "plasma",
};

export function networkIdToKey(networkId: number): WalletNetworkKey | null {
  return NETWORK_ID_MAP[networkId] ?? null;
}

export type WalletAccessMode =
  | "none" // nenhuma wallet cadastrada na API ainda
  | "full" // wallet cadastrada E a seed deste device corresponde a ela
  | "view-only"; // wallet cadastrada, mas este device não tem a seed correspondente

export interface WalletStatus {
  mode: WalletAccessMode;
  record: ApiWalletRecord | null;
}

export class WalletStatusFetchError extends Error {
  constructor(message = "Não foi possível verificar sua carteira.") {
    super(message);
    this.name = "WalletStatusFetchError";
  }
}

export async function getWalletStatus(): Promise<WalletStatus> {
  const address = await getStoredWalletAddress();
  const source = await AsyncStorage.getItem("wallet_source");
  if (!address) {
    return { mode: "none", record: null };
  }
  const mode = source === "external" ? "view-only" : "full";

  return {
    mode,
    record: { address } as any,
  };
}

export async function registerWalletAddress(params: {
  address: string;
}): Promise<void> {
  try {
    await swapxApi.post("app/register/wallet", {
      address: params.address,
    });
  } catch (error: any) {
    const message =
      error?.response?.data?.message ??
      "Não foi possível registrar o endereço da carteira.";
    throw new WalletStatusFetchError(message);
  }
}

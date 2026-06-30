import rstruther from "@/infraestructure/http/nodeApi";
import { localSeedMatchesAddress } from "./walletStorage";
import { WalletNetworkKey } from "./walletProviders";

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

/**
 * Consulta a API para saber se já existe uma wallet cadastrada para a
 * conta, e cruza com a seed salva localmente para decidir o modo de
 * acesso:
 *
 * - "none": API não retornou wallet — usuário ainda não configurou
 *   nada, deve ir para a tela de escolha (criar nova / conectar externa).
 * - "full": API retornou uma wallet E este device tem a seed
 *   correspondente — pode operar normalmente (saldo, saque, PIX).
 * - "view-only": API retornou uma wallet, mas este device não tem a
 *   seed (outro device gerou, ou é uma wallet externa) — mostra apenas
 *   saldo, sem nenhuma ação de movimentação.
 */
export async function getWalletStatus(): Promise<WalletStatus> {
  let response;
  try {
    response = await rstruther.get<ApiWalletRecord>("saller/wallet");
  } catch (error: any) {
    const status = error?.response?.status;
    // 404 aqui tem o mesmo significado de "sem wallet ainda" que já
    // vimos no CadWallet original — não é uma falha real, é o estado
    // esperado para quem nunca configurou nada.
    if (status === 404) {
      return { mode: "none", record: null };
    }
    throw new WalletStatusFetchError();
  }

  const record = response?.data;
  if (!record?.address) {
    return { mode: "none", record: null };
  }

  const hasMatchingSeed = await localSeedMatchesAddress(record.address);
  return {
    mode: hasMatchingSeed ? "full" : "view-only",
    record,
  };
}

/**
 * Registra o endereço da wallet na API — chamado tanto ao criar uma
 * wallet nova pelo app (logo após confirmar o backup) quanto ao
 * conectar uma wallet externa.
 */
export async function registerWalletAddress(params: {
  network: WalletNetworkKey;
  address: string;
}): Promise<void> {
  try {
    await rstruther.post("saller/wallet", {
      network: params.network,
      address: params.address,
    });
  } catch (error: any) {
    const message =
      error?.response?.data?.message ??
      "Não foi possível registrar o endereço da carteira.";
    throw new WalletStatusFetchError(message);
  }
}

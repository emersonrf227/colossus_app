// Redes disponíveis para receber a invoice.
// Hoje é um mock local simulando a resposta de uma API (rstruther.get("/networks")),
// mas a estrutura (NetworkOption + fetchAvailableNetworks) já está pronta para
// trocar por uma chamada real — basta substituir o corpo de fetchAvailableNetworks.

import rstruther from "@/infraestructure/http/nodeApi";

export interface NetworkOption {
  network: string;
  icon: string;
}

// 👉 Mock simulando o JSON que a API vai retornar.
const MOCK_NETWORKS_RESPONSE: NetworkOption[] = [
  {
    network: "polygon",
    icon: "https://cryptologos.cc/logos/polygon-matic-logo.svg",
  },
  {
    network: "bsc",
    icon: "https://cryptologos.cc/logos/binance-usd-busd-logo.svg",
  },
  {
    network: "plasma",
    icon: "https://plasmascan.to/assets/plasma/images/svg/logos/token-light.svg?v=26.6.3.3",
  },
];

export async function getNetworkLabel(): Promise<NetworkOption[]> {
  try {
    const { data } = await rstruther.get<NetworkOption[]>("/seller/networks");

    return data;
  } catch (error) {
    console.error("Erro ao buscar redes:", error);
    return [];
  }
}

// Labels amigáveis para exibição (a API só manda o slug da rede).
export const NETWORK_LABELS: Record<string, string> = {
  polygon: "Polygon",
  bsc: "BNB Chain",
  plasma: "Plasma",
};

// export function getNetworkLabel(network: string): string {
//   return NETWORK_LABELS[network] ?? network;
// }

/**
 * Busca as redes disponíveis.
 * Hoje retorna o mock acima com um pequeno delay simulando latência de rede.
 *
 * Troca futura por chamada real, exemplo:
 *   export async function fetchAvailableNetworks(): Promise<NetworkOption[]> {
 *     const response = await rstruther.get("saller/networks");
 *     return response.data;
 *   }
 */
export async function fetchAvailableNetworks(): Promise<NetworkOption[]> {
  await new Promise((resolve) => setTimeout(resolve, 400));
  return MOCK_NETWORKS_RESPONSE;
}

// Redes disponíveis para receber a invoice.
// Busca direto da API: GET saller/networks
//
// A resposta real do backend vem dentro de um envelope, não como array
// puro:
//   { status: 0, msg: "invoices data", res: [{ network, icon }, ...] }

import rstruther from "@/infraestructure/http/nodeApi";

export interface NetworkOption {
  network: string;
  icon: string;
}

interface NetworksApiResponse {
  status: number;
  msg: string;
  res: NetworkOption[];
}

// Labels amigáveis para exibição (a API só manda o slug da rede).
// Mantido como fallback de exibição — se a API adicionar uma rede nova
// que ainda não está aqui, getNetworkLabel cai no próprio slug.
export const NETWORK_LABELS: Record<string, string> = {
  polygon: "Polygon",
  bsc: "BNB Chain",
  plasma: "Plasma",
};

export function getNetworkLabel(network: string): string {
  return NETWORK_LABELS[network] ?? network;
}

export class NetworksFetchError extends Error {
  constructor(message = "Não foi possível carregar as redes disponíveis.") {
    super(message);
    this.name = "NetworksFetchError";
  }
}

/**
 * Busca as redes disponíveis na API.
 * Lança NetworksFetchError em caso de falha de rede ou resposta em
 * formato inesperado (ex: `res` ausente ou não sendo um array).
 */
export async function fetchAvailableNetworks(): Promise<NetworkOption[]> {
  let response;
  try {
    response = await rstruther.get<NetworksApiResponse>("saller/networks");
  } catch {
    throw new NetworksFetchError();
  }

  const networks = response?.data?.res;

  if (!Array.isArray(networks)) {
    throw new NetworksFetchError();
  }

  return networks;
}

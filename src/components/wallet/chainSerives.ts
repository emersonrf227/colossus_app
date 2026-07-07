import rstruther from "@/infraestructure/http/nodeApi";

export type NetworkAvailability = {
  polygon: boolean;
  plasma: boolean;
  tron: boolean;
};

/**
 * Busca quais redes estão habilitadas para operações de WALLET
 * (saldo, saque cripto).
 * GET chain/wallet
 */
export async function fetchWalletChains(): Promise<NetworkAvailability> {
  try {
    const response = await rstruther.get("chain/wallet");
    const res = response.data?.data?.res;

    console.log(res);
    if (!res) throw new Error("Resposta inválida");
    return {
      polygon: !!res.polygon,
      plasma: !!res.plasma,
      tron: !!res.tron,
    };
  } catch (e) {
    console.log(e);
    // Fallback seguro: mantém Polygon habilitado se a API falhar
    return { polygon: true, plasma: false, tron: false };
  }
}

/**
 * Busca quais redes estão habilitadas para operações de PIX off-ramp.
 * GET chain/pix
 */
export async function fetchPixChains(): Promise<NetworkAvailability> {
  try {
    const response = await rstruther.get("chain/pix");
    const res = response.data?.data?.res;
    if (!res) throw new Error("Resposta inválida");
    return {
      polygon: !!res.polygon,
      plasma: !!res.plasma,
      tron: !!res.tron,
    };
  } catch {
    return { polygon: true, plasma: false, tron: false };
  }
}

/**
 * Retorna lista de redes habilitadas como array de strings
 * no formato usado pelas telas ("POLYGON" | "PLASMA").
 */
export function enabledNetworks(
  availability: NetworkAvailability,
): ("POLYGON" | "PLASMA")[] {
  const nets: ("POLYGON" | "PLASMA")[] = [];
  if (availability.polygon) nets.push("POLYGON");
  if (availability.plasma) nets.push("PLASMA");
  return nets;
}

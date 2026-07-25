import helmApi from "@/infraestructure/http/nodeApi";

export interface OpeningHour {
  day: string;
  open: string;
  close: string;
}

export interface CommunityLocation {
  id: string;
  name: string;
  segment: string;
  subcategory?: string;
  description?: string;
  phone?: string;
  telegram?: string;
  email?: string;
  website?: string;
  location: {
    latitude: number;
    longitude: number;
  };
  address?: {
    street?: string;
    number?: string;
    complement?: string;
    district?: string;
    city?: string;
    state?: string;
    country?: string;
    zipcode?: string;
    formatted?: string;
  };
  openingHours?: OpeningHour[];
  paymentMethods?: string[];
  logo?: string;
  photos?: string[];
  tags?: string[];
  active?: boolean;
  verified?: boolean;
}

interface CommunityApiResponse {
  total: number;
  skip: number;
  take: number;
  data: CommunityLocation[];
}

export class CommunityFetchError extends Error {
  constructor(message = "Não foi possível carregar os locais da comunidade.") {
    super(message);
    this.name = "CommunityFetchError";
  }
}

function isValidLocation(item: CommunityLocation): boolean {
  return (
    item?.location &&
    typeof item.location.latitude === "number" &&
    typeof item.location.longitude === "number"
  );
}

/**
 * Busca todos os estabelecimentos da comunidade Colossus.
 *
 * GET /v1/community
 */
export async function fetchCommunityLocations(): Promise<CommunityLocation[]> {
  try {
    const response = await helmApi.get<CommunityApiResponse>("community");
    const locations = response?.data?.data;

    if (!Array.isArray(locations)) {
      throw new CommunityFetchError("Nenhum estabelecimento foi localizado.");
    }

    const filtered = locations.filter(isValidLocation);

    if (filtered.length === 0) {
      throw new CommunityFetchError("Nenhum estabelecimento foi localizado.");
    }

    return filtered;
  } catch (error) {
    if (error instanceof CommunityFetchError) {
      throw error;
    }
    console.error("Erro ao buscar comunidade:", error);
    throw new CommunityFetchError();
  }
}

/**
 * Busca detalhes de um estabelecimento específico da comunidade.
 *
 * GET /v1/community/{id}
 */
/**
 * Busca detalhes de um estabelecimento específico.
 *
 * GET /v1/community/{id}
 */
export async function fetchCommunityLocationDetail(
  id: string,
): Promise<CommunityLocation> {
  try {
    const response = await helmApi.get<CommunityLocation>(`community/${id}`);

    if (!response?.data) {
      throw new CommunityFetchError("Estabelecimento não foi localizado.");
    }

    return response.data;
  } catch (error) {
    if (error instanceof CommunityFetchError) {
      throw error;
    }
    console.error(`Erro ao buscar comunidade ${id}:`, error);
    throw new CommunityFetchError();
  }
}

// Cores por segmento, usadas para colorir os pinos do mapa e os chips de
// filtro. Segmentos não mapeados aqui caem num cinza neutro (ver
// getSegmentColor) — então novos segmentos vindos da API nunca quebram
// o visual, só não têm uma cor "oficial" até serem adicionados aqui.
const SEGMENT_COLORS: Record<string, string> = {
  Alimentação: "#F7B731",
  Moda: "#A55EEA",
  Beleza: "#FD79A8",
  Saúde: "#26DE81",
  Tecnologia: "#3FA9F5",
  Serviços: "#6C5CE7",
  Automotivo: "#FD9644",
  Educação: "#00D2D3",
};

const FALLBACK_SEGMENT_COLOR = "#8A8A9A";

export function getSegmentColor(segment: string): string {
  return SEGMENT_COLORS[segment] ?? FALLBACK_SEGMENT_COLOR;
}

const WEEKDAY_LABELS: Record<string, string> = {
  monday: "Segunda",
  tuesday: "Terça",
  wednesday: "Quarta",
  thursday: "Quinta",
  friday: "Sexta",
  saturday: "Sábado",
  sunday: "Domingo",
};

export function getWeekdayLabel(day: string): string {
  return WEEKDAY_LABELS[day.toLowerCase()] ?? day;
}

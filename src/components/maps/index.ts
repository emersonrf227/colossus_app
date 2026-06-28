// Reative este import quando trocar o mock pela chamada real (ver
// fetchCommunityLocations mais abaixo).
// import rstruther from "@/infraestructure/http/nodeApi";

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

// Usado apenas no exemplo de implementação futura dentro do comentário
// de fetchCommunityLocations — mantido aqui para já existir quando a
// troca pelo endpoint real for feita.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface CommunityApiResponse {
  success: boolean;
  total: number;
  res: CommunityLocation[];
}

export class CommunityFetchError extends Error {
  constructor(message = "Não foi possível carregar os locais da comunidade.") {
    super(message);
    this.name = "CommunityFetchError";
  }
}

// Mock local simulando a resposta da API, para desenvolvimento da tela
// antes do endpoint real estar disponível. A assinatura de
// fetchCommunityLocations() permanece a mesma — quando o endpoint
// existir, basta trocar o corpo da função (ver comentário mais abaixo).
const MOCK_COMMUNITY_RESPONSE: CommunityLocation[] = [
  {
    id: "1",
    name: "Padaria Central",
    segment: "Alimentação",
    subcategory: "Padaria",
    description: "Padaria, confeitaria e cafeteria.",
    phone: "+55 11 99999-9999",
    telegram: "+55 11 99999-9999",
    email: "contato@padariacentral.com.br",
    website: "https://padariacentral.com.br",
    location: { latitude: -23.55052, longitude: -46.633308 },
    address: {
      street: "Av. Paulista",
      number: "1000",
      complement: "Loja 02",
      district: "Bela Vista",
      city: "São Paulo",
      state: "SP",
      country: "Brasil",
      zipcode: "01310-100",
      formatted: "Av. Paulista, 1000 - Bela Vista, São Paulo - SP",
    },
    openingHours: [
      { day: "monday", open: "07:00", close: "19:00" },
      { day: "tuesday", open: "07:00", close: "19:00" },
    ],
    paymentMethods: ["PIX", "Crédito", "Débito", "Dinheiro", "USDT"],
    logo: "https://cdn.site.com/logo.png",
    photos: [
      "https://cdn.site.com/photo1.jpg",
      "https://cdn.site.com/photo2.jpg",
    ],
    tags: ["Café", "Pão", "Confeitaria"],
    active: true,
    verified: true,
  },
  {
    id: "2",
    name: "Studio Moda Bela Vista",
    segment: "Moda",
    subcategory: "Roupas femininas",
    description: "Loja de roupas e acessórios com curadoria própria.",
    phone: "+55 11 98888-7777",
    telegram: "+55 11 98888-7777",
    website: "https://studiomodabv.com.br",
    location: { latitude: -23.5582, longitude: -46.6603 },
    address: {
      street: "Rua Augusta",
      number: "1500",
      district: "Consolação",
      city: "São Paulo",
      state: "SP",
      country: "Brasil",
      zipcode: "01304-001",
      formatted: "Rua Augusta, 1500 - Consolação, São Paulo - SP",
    },
    openingHours: [
      { day: "tuesday", open: "10:00", close: "20:00" },
      { day: "wednesday", open: "10:00", close: "20:00" },
    ],
    paymentMethods: ["Crédito", "Débito", "USDT"],
    photos: [],
    tags: ["Moda feminina", "Acessórios"],
    active: true,
    verified: false,
  },
  {
    id: "3",
    name: "TechFix Assistência",
    segment: "Tecnologia",
    subcategory: "Assistência técnica",
    description: "Conserto de celulares, notebooks e consoles.",
    phone: "+55 11 97777-6666",
    telegram: "+55 11 97777-6666",
    location: { latitude: -23.5489, longitude: -46.6388 },
    address: {
      street: "Rua da Consolação",
      number: "300",
      district: "Consolação",
      city: "São Paulo",
      state: "SP",
      country: "Brasil",
      zipcode: "01302-000",
      formatted: "Rua da Consolação, 300 - Consolação, São Paulo - SP",
    },
    openingHours: [
      { day: "monday", open: "09:00", close: "18:00" },
      { day: "friday", open: "09:00", close: "18:00" },
    ],
    paymentMethods: ["PIX", "USDT"],
    tags: ["Celulares", "Notebooks"],
    active: true,
    verified: true,
  },
  {
    id: "4",
    name: "Espaço Bem-Estar",
    segment: "Beleza",
    subcategory: "Salão de beleza",
    description: "Cabelo, estética e bem-estar em um só lugar.",
    telegram: "+55 11 96666-5555",
    location: { latitude: -23.561, longitude: -46.6558 },
    address: {
      street: "Alameda Santos",
      number: "800",
      district: "Jardim Paulista",
      city: "São Paulo",
      state: "SP",
      country: "Brasil",
      zipcode: "01418-100",
      formatted: "Alameda Santos, 800 - Jardim Paulista, São Paulo - SP",
    },
    paymentMethods: ["Dinheiro", "PIX", "USDT"],
    tags: ["Cabelo", "Estética"],
    active: true,
    verified: false,
  },
];

/**
 * Busca todos os estabelecimentos da comunidade Colossus.
 *
 * 👉 MOCK: retorna os dados acima com um pequeno delay simulando latência
 * de rede. Quando o endpoint real estiver disponível, troque o corpo
 * desta função por algo como:
 *
 *   const response = await rstruther.get<CommunityApiResponse>("saller/community");
 *   const locations = response?.data?.res;
 *   if (!Array.isArray(locations)) throw new CommunityFetchError();
 *   return locations.filter(isValidLocation);
 *
 * A assinatura (retorna Promise<CommunityLocation[]>, lança
 * CommunityFetchError em caso de falha) já está pronta para isso — a
 * tela que consome esta função não precisa mudar nada na troca.
 */
export async function fetchCommunityLocations(): Promise<CommunityLocation[]> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  return MOCK_COMMUNITY_RESPONSE.filter(
    (item) =>
      item?.location &&
      typeof item.location.latitude === "number" &&
      typeof item.location.longitude === "number",
  );
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

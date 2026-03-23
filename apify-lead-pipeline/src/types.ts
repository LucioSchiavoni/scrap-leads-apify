export interface ApifyPlaceResult {
  title?: string;
  categoryName?: string;
  address?: string;
  city?: string;
  countryCode?: string;
  phone?: string;
  website?: string;
  url?: string;
  totalScore?: number;
  reviewsCount?: number;
  location?: { lat: number; lng: number };
  [key: string]: unknown;
}

export interface Lead {
  businessName: string;
  category: string;
  address: string;
  city: string;
  country: string;
  phoneRaw: string;
  phoneNormalized: string;
  whatsappLink: string;
  googleMapsUrl: string;
  rating: number;
  reviewsCount: number;
}

export interface ScrapeJob {
  category: string;
  locations: string[];
  maxResults?: number;
}
export type VenueType =
  | "country"
  | "city"
  | "town"
  | "hall"
  | "conference"
  | "restaurant"
  | "outdoor"
  | "auditorium"
  | "other";

export interface VenueGalleryImage {
  id: number;
  image: string;
  caption?: string;
  order: number;
}

export interface Venue {
  id: number;
  name: string;
  venue_type: VenueType;
  description: string;
  image: string;
  gallery: VenueGalleryImage[];
  address: string;
  city: string;
  region: string;
  country: string;
  postal_code: string;
  latitude: string;
  longitude: string;
  capacity: number;
  amenities: string; // Comma-separated string for now
  price_per_day?: string;
  contact_email?: string;
  contact_phone?: string;
  website?: string;
  available: boolean;
  rating: number;
  tags: string;
  created_at: string;
  updated_at: string;
}

export interface VenueFormInput
  extends Omit<Venue, "id" | "image" | "gallery" | "created_at" | "updated_at"> {
  image?: File | null;
  gallery?: File[];
}

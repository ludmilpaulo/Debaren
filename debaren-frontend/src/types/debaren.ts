// types/debaren.ts

export type VenueType = 'country' | 'city' | 'town';




export interface BookingForm {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  start_date: string;
  end_date: string;
  notes: string;
}

export interface Booking {
  id: number;
  venue_id: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  start_date: string;
  end_date: string;
  notes: string;
  status: string;
  created_at: string;
  updated_at: string;
}


export interface PopupVenue {
  id: number;
  name: string;
  location: string;
  image: string | null;
}

export interface WifiSpot {
  id: number;
  name: string;
  address: string;
}

export interface SchoolProgram {
  id: number;
  name: string;
  description: string;
  image: string | null;
}


export type SocialPlatform = 'linkedin' | 'instagram' | 'facebook' | 'pinterest' | 'tiktok';

export interface FooterSocialLink {
  platform: SocialPlatform;
  url: string;
  icon: string;
  order: number;
}

export interface About {
  id: number;
  title: string;
  description: string;
  highlights?: string[]; // optional, for mission/vision points
  image?: string | null;
}

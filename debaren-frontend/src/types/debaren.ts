// types/debaren.ts

export type VenueType = 'country' | 'city' | 'town';

export interface Venue {
  id: number;
  name: string;
  venue_type: VenueType;
  description: string;
  image: string | null;
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

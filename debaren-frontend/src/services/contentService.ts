import { baseAPI } from "@/utils/variables";
import axios from "axios";
// ------ Types ------
export interface PopupVenue { id: number; name: string; location: string; image: string; }
export interface WifiSpot { id: number; name: string; address: string; }
export interface SchoolProgram { id: number; name: string; description: string; image: string; }
export interface About { title: string; phone: string; address: string; description: string; image?: string; }
export interface FooterSocialLink { id: number; platform: string; url: string; icon: string; order: number; }
export interface HeroSection { title: string; subtitle: string; cta_text: string; cta_url: string; }
export interface ContactMessage { id: number; name: string; email: string; message: string; created_at: string; }

const API_BASE_URL = baseAPI;
// ------ Popup Venues ------
export async function getPopupVenues(): Promise<PopupVenue[]> {
  const { data } = await axios.get(`${baseAPI}/api/popup-venues/`);
  return data;
}
export async function createPopupVenue(data: Omit<PopupVenue, "id" | "image"> & { image?: File | null }): Promise<PopupVenue> {
  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("location", data.location);
  if (data.image) formData.append("image", data.image);
  const res = await axios.post(`${baseAPI}/api/popup-venues/`, formData, { headers: { "Content-Type": "multipart/form-data" } });
  return res.data;
}
export async function updatePopupVenue(id: number, data: Omit<PopupVenue, "id" | "image"> & { image?: File | null }): Promise<PopupVenue> {
  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("location", data.location);
  if (data.image) formData.append("image", data.image);
  const res = await axios.put(`${baseAPI}/api/popup-venues/${id}/`, formData, { headers: { "Content-Type": "multipart/form-data" } });
  return res.data;
}
export async function deletePopupVenue(id: number): Promise<void> {
  await axios.delete(`${baseAPI}/api/popup-venues/${id}/`);
}

// ------ Wifi Spots ------
export async function getWifiSpots(): Promise<WifiSpot[]> {
  const { data } = await axios.get(`${baseAPI}/api/wifi-spots/`);
  return data;
}
export async function createWifiSpot(data: Omit<WifiSpot, "id">): Promise<WifiSpot> {
  const res = await axios.post(`${baseAPI}/api/wifi-spots/`, data);
  return res.data;
}
export async function updateWifiSpot(id: number, data: Omit<WifiSpot, "id">): Promise<WifiSpot> {
  const res = await axios.put(`${baseAPI}/api/wifi-spots/${id}/`, data);
  return res.data;
}
export async function deleteWifiSpot(id: number): Promise<void> {
  await axios.delete(`${baseAPI}/api/wifi-spots/${id}/`);
}

// ------ School Programs ------
export async function getSchoolPrograms(): Promise<SchoolProgram[]> {
  const { data } = await axios.get(`${baseAPI}/api/school-programs/`);
  return data;
}
export async function createSchoolProgram(data: Omit<SchoolProgram, "id" | "image"> & { image?: File | null }): Promise<SchoolProgram> {
  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("description", data.description);
  if (data.image) formData.append("image", data.image);
  const res = await axios.post("/api/school-programs/", formData, { headers: { "Content-Type": "multipart/form-data" } });
  return res.data;
}
export async function updateSchoolProgram(id: number, data: Omit<SchoolProgram, "id" | "image"> & { image?: File | null }): Promise<SchoolProgram> {
  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("description", data.description);
  if (data.image) formData.append("image", data.image);
  const res = await axios.put(`${baseAPI}/api/school-programs/${id}/`, formData, { headers: { "Content-Type": "multipart/form-data" } });
  return res.data;
}
export async function deleteSchoolProgram(id: number): Promise<void> {
  await axios.delete(`${baseAPI}/api/school-programs/${id}/`);
}

// ------ About ------
export async function getAbout(): Promise<About> {
  const { data } = await axios.get(`${baseAPI}/api/about/`);
  return data;
}
export async function updateAbout(data: Omit<About, "image"> & { image?: File | null }): Promise<About> {
  const formData = new FormData();
  formData.append("title", data.title);
  formData.append("phone", data.phone);
  formData.append("address", data.address);
  formData.append("description", data.description);
  if (data.image) formData.append("image", data.image);
  const res = await axios.put(`/api/about/`, formData, { headers: { "Content-Type": "multipart/form-data" } });
  return res.data;
}

// ------ Footer Social Links ------
export async function getFooterSocialLinks(): Promise<FooterSocialLink[]> {
  const { data } = await axios.get(`${baseAPI}/api/footer-social-links/`);
  return data;
}
export async function createFooterSocialLink(data: Omit<FooterSocialLink, "id">): Promise<FooterSocialLink> {
  const res = await axios.post(`${baseAPI}/api/footer-social-links/`, data);
  return res.data;
}
export async function updateFooterSocialLink(id: number, data: Omit<FooterSocialLink, "id">): Promise<FooterSocialLink> {
  const res = await axios.put(`${baseAPI}/api/footer-social-links/${id}/`, data);
  return res.data;
}
export async function deleteFooterSocialLink(id: number): Promise<void> {
  await axios.delete(`${baseAPI}/api/footer-social-links/${id}/`);
}

// ------ Hero Section ------
export async function getHeroSection(): Promise<HeroSection> {
  const { data } = await axios.get(`${baseAPI}/api/hero/`);
  return data;
}
export async function updateHeroSection(data: Omit<HeroSection, never>): Promise<HeroSection> {
  const res = await axios.put(`${baseAPI}/api/hero/`, data);
  return res.data;
}

// ------ Contact Messages ------
export async function getContactMessages(): Promise<ContactMessage[]> {
  const { data } = await axios.get(`${baseAPI}/api/contact-messages/`);
  return data;
}

// ------ Venue CRUD ------
export interface Venue {
  id: number;
  name: string;
  venue_type: VenueType;
  description: string;
  image: string; // path or URL
}
export type VenueType = "country" | "city" | "town";

export async function getVenues(): Promise<Venue[]> {
  const { data } = await axios.get(`${baseAPI}/api/venues/`);
  return data;
}

export async function createVenue(data: Omit<Venue, "id" | "image"> & { image?: File | null }): Promise<Venue> {
  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("venue_type", data.venue_type);
  formData.append("description", data.description);
  if (data.image) formData.append("image", data.image);
  const res = await axios.post(`${baseAPI}/api/venues/`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

export async function updateVenue(id: number, data: Omit<Venue, "id" | "image"> & { image?: File | null }): Promise<Venue> {
  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("venue_type", data.venue_type);
  formData.append("description", data.description);
  if (data.image) formData.append("image", data.image);
  const res = await axios.put(`${baseAPI}/api/venues/${id}/`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

export async function deleteVenue(id: number): Promise<void> {
  await axios.delete(`${baseAPI}/api/venues/${id}/`);
}

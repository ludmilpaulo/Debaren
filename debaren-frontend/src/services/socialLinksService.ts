import { baseAPI } from "@/utils/variables";

// services/socialLinksService.ts
export interface SocialLinkPayload {
  platform: string;
  url: string;
  icon: string;
  order: number;
}

export async function getSocialLinks() {
  const res = await fetch(`${baseAPI}/api/footer-social-links/`);
  if (!res.ok) throw new Error("Failed to fetch social links");
  return res.json();
}

export async function createSocialLink(data: SocialLinkPayload) {
  const res = await fetch(`${baseAPI}/api/footer-social-links/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create social link");
  return res.json();
}

export async function updateSocialLink(id: number, data: SocialLinkPayload) {
  const res = await fetch(`${baseAPI}/api/footer-social-links/${id}/`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update social link");
  return res.json();
}

export async function deleteSocialLink(id: number) {
  const res = await fetch(`${baseAPI}/api/footer-social-links/${id}/`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete social link");
}

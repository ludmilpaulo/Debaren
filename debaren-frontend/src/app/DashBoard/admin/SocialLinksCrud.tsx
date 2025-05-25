"use client";
import React, { useState, useEffect, JSX } from "react";
import { FaLinkedin, FaInstagram, FaFacebook, FaPinterest, FaTiktok } from "react-icons/fa";

import { Transition } from "@headlessui/react";
import { getSocialLinks, updateSocialLink, createSocialLink, deleteSocialLink } from "@/services/socialLinksService";

type SocialPlatform = "linkedin" | "instagram" | "facebook" | "pinterest" | "tiktok";

interface SocialLink {
  id: number;
  platform: SocialPlatform;
  url: string;
  icon: string;
  order: number;
}

const iconMap: Record<SocialPlatform, JSX.Element> = {
  linkedin: <FaLinkedin className="text-blue-600" />,
  instagram: <FaInstagram className="text-pink-500" />,
  facebook: <FaFacebook className="text-blue-500" />,
  pinterest: <FaPinterest className="text-red-600" />,
  tiktok: <FaTiktok className="text-black" />,
};

const platformOptions = [
  { value: "linkedin", label: "LinkedIn", icon: <FaLinkedin className="text-blue-600" /> },
  { value: "instagram", label: "Instagram", icon: <FaInstagram className="text-pink-500" /> },
  { value: "facebook", label: "Facebook", icon: <FaFacebook className="text-blue-500" /> },
  { value: "pinterest", label: "Pinterest", icon: <FaPinterest className="text-red-600" /> },
  { value: "tiktok", label: "TikTok", icon: <FaTiktok className="text-black" /> },
];

const initialForm: Omit<SocialLink, "id"> = {
  platform: "linkedin",
  url: "",
  icon: "FaLinkedin",
  order: 0,
};

const SocialLinksCrud: React.FC = () => {
  const [links, setLinks] = useState<SocialLink[]>([]);
  const [form, setForm] = useState<Omit<SocialLink, "id">>(initialForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Fetch all on mount
  useEffect(() => {
    loadLinks();
  }, []);

  async function loadLinks() {
    setLoading(true);
    setError(null);
    try {
      const data = await getSocialLinks();
      setLinks(data);
    } catch {
      setError("Failed to load links");
    }
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (editingId) {
        await updateSocialLink(editingId, form);
        setSuccess("Social link updated!");
      } else {
        await createSocialLink(form);
        setSuccess("Social link created!");
      }
      setForm(initialForm);
      setEditingId(null);
      loadLinks();
    } catch {
      setError("Failed to save social link");
    }
    setLoading(false);
  }

  function handleEdit(link: SocialLink) {
    setForm({ ...link });
    setEditingId(link.id);
    setSuccess(null);
    setError(null);
  }

  async function handleDelete(id: number) {
    if (!confirm("Are you sure you want to delete this link?")) return;
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await deleteSocialLink(id);
      setSuccess("Social link deleted!");
      loadLinks();
    } catch {
      setError("Failed to delete social link");
    }
    setLoading(false);
  }

function handleChange(
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
) {
  const { name, value } = e.target;
  if (name === "platform") {
    // value must be cast as SocialPlatform
    const platform = value as SocialPlatform;
    const iconName =
      platform === "linkedin"
        ? "FaLinkedin"
        : platform === "instagram"
        ? "FaInstagram"
        : platform === "facebook"
        ? "FaFacebook"
        : platform === "pinterest"
        ? "FaPinterest"
        : platform === "tiktok"
        ? "FaTiktok"
        : "";

    setForm((prev) => ({
      ...prev,
      platform,
      icon: iconName,
    }));
  } else if (name === "order") {
    setForm((prev) => ({ ...prev, order: Number(value) }));
  } else {
    setForm((prev) => ({ ...prev, [name]: value }));
  }
}


  function handleCancel() {
    setEditingId(null);
    setForm(initialForm);
    setError(null);
    setSuccess(null);
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Footer Social Links</h2>

      <form
        className="flex flex-col gap-3 bg-gray-50 rounded-lg p-4 shadow mb-6"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Platform</label>
            <select
              name="platform"
              className="w-full border rounded px-3 py-2"
              value={form.platform}
              onChange={handleChange}
            >
              {platformOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">URL</label>
            <input
              name="url"
              className="w-full border rounded px-3 py-2"
              type="url"
              placeholder="https://"
              value={form.url}
              onChange={handleChange}
              required
            />
          </div>
          <div className="w-32">
            <label className="block text-sm font-medium mb-1">Order</label>
            <input
              name="order"
              className="w-full border rounded px-3 py-2"
              type="number"
              min={0}
              value={form.order}
              onChange={handleChange}
            />
          </div>
        </div>
        <div>
          <button
            type="submit"
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-6 py-2 rounded shadow transition"
            disabled={loading}
          >
            {editingId ? "Update" : "Add"} Social Link
          </button>
          {editingId && (
            <button
              type="button"
              className="ml-3 text-gray-500 hover:text-gray-800"
              onClick={handleCancel}
            >
              Cancel
            </button>
          )}
        </div>
        {error && <div className="text-red-600 font-medium">{error}</div>}
        <Transition
          show={!!success}
          enter="transition-opacity duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          {success && <div className="text-green-600 font-medium">{success}</div>}
        </Transition>
      </form>

      {/* List */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded-lg shadow">
          <thead>
            <tr className="bg-gray-100 text-gray-800 text-sm">
              <th className="px-4 py-2 text-left">Icon</th>
              <th className="px-4 py-2 text-left">Platform</th>
              <th className="px-4 py-2 text-left">URL</th>
              <th className="px-4 py-2 text-left">Order</th>
              <th className="px-4 py-2 text-left"></th>
            </tr>
          </thead>
          <tbody>
            {links.map((link) => (
              <tr key={link.id} className="border-t">
                <td className="px-4 py-2">{iconMap[link.platform]}</td>
                <td className="px-4 py-2">{link.platform.charAt(0).toUpperCase() + link.platform.slice(1)}</td>
                <td className="px-4 py-2">
                  <a
                    href={link.url}
                    className="text-blue-600 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {link.url}
                  </a>
                </td>
                <td className="px-4 py-2">{link.order}</td>
                <td className="px-4 py-2 flex gap-2">
                  <button
                    className="text-yellow-600 hover:text-yellow-800 font-semibold"
                    onClick={() => handleEdit(link)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-600 hover:text-red-800 font-semibold"
                    onClick={() => handleDelete(link.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {links.length === 0 && (
              <tr>
                <td colSpan={5} className="py-8 text-center text-gray-400">
                  No social links found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SocialLinksCrud;

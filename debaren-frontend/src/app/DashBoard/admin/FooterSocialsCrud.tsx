"use client";
import React, { useEffect, useState, FormEvent } from "react";
import {
  getFooterSocialLinks, createFooterSocialLink, updateFooterSocialLink, deleteFooterSocialLink, FooterSocialLink
} from "@/services/contentService";

const initialForm: Omit<FooterSocialLink, "id"> = {
  platform: "linkedin",
  url: "",
  icon: "",
  order: 0,
};

export default function FooterSocialsCrud() {
  const [items, setItems] = useState<FooterSocialLink[]>([]);
  const [form, setForm] = useState(initialForm);
  const [editId, setEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  useEffect(() => { fetchItems(); }, []);
  async function fetchItems() {
    setLoading(true);
    try { setItems(await getFooterSocialLinks()); } catch { setError("Failed to load."); } finally { setLoading(false); }
  }
  function handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }
  function handleEdit(item: FooterSocialLink) {
    setEditId(item.id);
    setForm({ platform: item.platform, url: item.url, icon: item.icon, order: item.order });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  async function handleDelete(id: number) {
    if (!confirm("Are you sure?")) return;
    setLoading(true);
    try { await deleteFooterSocialLink(id); setItems((i) => i.filter((v) => v.id !== id)); } catch { setError("Delete failed."); } finally { setLoading(false); }
  }
  async function handleSubmit(e: FormEvent) {
    e.preventDefault(); setLoading(true); setError("");
    try {
      if (editId) {
        const updated = await updateFooterSocialLink(editId, form);
        setItems((i) => i.map((v) => (v.id === editId ? updated : v)));
        setEditId(null);
      } else {
        const created = await createFooterSocialLink(form);
        setItems((i) => [created, ...i]);
      }
      setForm(initialForm);
    } catch { setError("Submission failed."); } finally { setLoading(false); }
  }
  function handleCancelEdit() { setEditId(null); setForm(initialForm); }

  return (
    <div className="space-y-10">
      <form className="bg-white p-6 rounded-xl shadow mb-8 max-w-2xl mx-auto" onSubmit={handleSubmit}>
        <h2 className="text-xl font-bold mb-3">{editId ? "Edit Social Link" : "Add Social Link"}</h2>
        {error && <div className="text-red-600 mb-2">{error}</div>}
        <div className="grid grid-cols-1 gap-4">
          <select className="border rounded p-2" name="platform" value={form.platform} onChange={handleInputChange}>
            <option value="linkedin">LinkedIn</option>
            <option value="instagram">Instagram</option>
            <option value="facebook">Facebook</option>
            <option value="pinterest">Pinterest</option>
            <option value="tiktok">TikTok</option>
          </select>
          <input className="border rounded p-2" type="text" name="url" placeholder="URL" value={form.url} onChange={handleInputChange} required />
          <input className="border rounded p-2" type="text" name="icon" placeholder="Icon (e.g. FaInstagram)" value={form.icon} onChange={handleInputChange} />
          <input className="border rounded p-2" type="number" name="order" placeholder="Order" value={form.order} onChange={handleInputChange} />
        </div>
        <div className="mt-4 flex gap-3">
          <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold px-6 py-2 rounded shadow" type="submit" disabled={loading}>
            {loading ? "Saving..." : editId ? "Update" : "Add"}
          </button>
          {editId && (
            <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold px-4 py-2 rounded" type="button" onClick={handleCancelEdit} disabled={loading}>
              Cancel
            </button>
          )}
        </div>
      </form>
      <div className="bg-white rounded-xl shadow p-4 overflow-x-auto">
        <h2 className="text-lg font-bold mb-3">All Social Links</h2>
        {items.length === 0 ? (
          <div className="text-gray-500">No links yet.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="py-2">Platform</th>
                <th className="py-2">URL</th>
                <th className="py-2">Icon</th>
                <th className="py-2">Order</th>
                <th className="py-2"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b last:border-0">
                  <td className="py-2 pr-2 font-medium">{item.platform}</td>
                  <td className="py-2 pr-2">{item.url}</td>
                  <td className="py-2 pr-2">{item.icon}</td>
                  <td className="py-2 pr-2">{item.order}</td>
                  <td className="py-2 flex gap-2">
                    <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded" onClick={() => handleEdit(item)} disabled={loading}>Edit</button>
                    <button className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded" onClick={() => handleDelete(item.id)} disabled={loading}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

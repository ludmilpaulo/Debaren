"use client";
import React, { useState, useEffect, FormEvent } from "react";
import Image from "next/image";
import {
  getPopupVenues, createPopupVenue, updatePopupVenue, deletePopupVenue, PopupVenue,
} from "@/services/contentService";

const initialForm = { name: "", location: "", image: null as File | null };

export default function PopupVenuesCrud() {
  const [items, setItems] = useState<PopupVenue[]>([]);
  const [form, setForm] = useState(initialForm);
  const [editId, setEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => { fetchItems(); }, []);
  async function fetchItems() {
    setLoading(true);
    try { setItems(await getPopupVenues()); } catch { setError("Failed to load."); } finally { setLoading(false); }
  }
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null;
    setForm((f) => ({ ...f, image: file }));
    setPreview(file ? URL.createObjectURL(file) : null);
  }
  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }
  function handleEdit(item: PopupVenue) {
    setEditId(item.id);
    setForm({ name: item.name, location: item.location, image: null });
    setPreview(item.image || null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  async function handleDelete(id: number) {
    if (!confirm("Are you sure?")) return;
    setLoading(true);
    try { await deletePopupVenue(id); setItems((i) => i.filter((v) => v.id !== id)); } catch { setError("Delete failed."); } finally { setLoading(false); }
  }
  async function handleSubmit(e: FormEvent) {
    e.preventDefault(); setLoading(true); setError("");
    try {
      if (editId) {
        const updated = await updatePopupVenue(editId, form);
        setItems((i) => i.map((v) => (v.id === editId ? updated : v)));
        setEditId(null);
      } else {
        const created = await createPopupVenue(form);
        setItems((i) => [created, ...i]);
      }
      setForm(initialForm); setPreview(null);
    } catch { setError("Submission failed."); } finally { setLoading(false); }
  }
  function handleCancelEdit() { setEditId(null); setForm(initialForm); setPreview(null); }

  return (
    <div className="space-y-10">
      <form className="bg-white p-6 rounded-xl shadow mb-8 max-w-2xl mx-auto" onSubmit={handleSubmit} encType="multipart/form-data">
        <h2 className="text-xl font-bold mb-3">{editId ? "Edit Popup Venue" : "Add Popup Venue"}</h2>
        {error && <div className="text-red-600 mb-2">{error}</div>}
        <div className="grid grid-cols-1 gap-4">
          <input className="border rounded p-2" type="text" name="name" placeholder="Name" value={form.name} onChange={handleInputChange} required />
          <input className="border rounded p-2" type="text" name="location" placeholder="Location" value={form.location} onChange={handleInputChange} required />
          <input className="border rounded p-2" type="file" accept="image/*" onChange={handleFileChange} />
          {preview && (
            <Image src={preview.startsWith("http") ? preview : `/media/${preview}`} alt="Preview" width={180} height={120} className="rounded mt-2" />
          )}
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
        <h2 className="text-lg font-bold mb-3">All Popup Venues</h2>
        {items.length === 0 ? (
          <div className="text-gray-500">No popup venues yet.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="py-2">Image</th>
                <th className="py-2">Name</th>
                <th className="py-2">Location</th>
                <th className="py-2"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b last:border-0">
                  <td className="py-2 pr-2">
                    {item.image ? (
                      <Image
                        src={item.image.startsWith("http") ? item.image : `/media/${item.image}`}
                        alt={item.name}
                        width={64}
                        height={48}
                        className="rounded"
                      />
                    ) : (
                      <span className="text-gray-300">No image</span>
                    )}
                  </td>
                  <td className="py-2 pr-2 font-medium">{item.name}</td>
                  <td className="py-2 pr-2">{item.location}</td>
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

"use client";
import React, { useState, useEffect, FormEvent } from "react";
import {
  getWifiSpots, createWifiSpot, updateWifiSpot, deleteWifiSpot, WifiSpot,
} from "@/services/contentService";

const initialForm = { name: "", address: "" };

export default function WifiSpotsCrud() {
  const [items, setItems] = useState<WifiSpot[]>([]);
  const [form, setForm] = useState(initialForm);
  const [editId, setEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  useEffect(() => { fetchItems(); }, []);
  async function fetchItems() {
    setLoading(true);
    try { setItems(await getWifiSpots()); } catch { setError("Failed to load."); } finally { setLoading(false); }
  }
  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }
  function handleEdit(item: WifiSpot) {
    setEditId(item.id);
    setForm({ name: item.name, address: item.address });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  async function handleDelete(id: number) {
    if (!confirm("Are you sure?")) return;
    setLoading(true);
    try { await deleteWifiSpot(id); setItems((i) => i.filter((v) => v.id !== id)); } catch { setError("Delete failed."); } finally { setLoading(false); }
  }
  async function handleSubmit(e: FormEvent) {
    e.preventDefault(); setLoading(true); setError("");
    try {
      if (editId) {
        const updated = await updateWifiSpot(editId, form);
        setItems((i) => i.map((v) => (v.id === editId ? updated : v)));
        setEditId(null);
      } else {
        const created = await createWifiSpot(form);
        setItems((i) => [created, ...i]);
      }
      setForm(initialForm);
    } catch { setError("Submission failed."); } finally { setLoading(false); }
  }
  function handleCancelEdit() { setEditId(null); setForm(initialForm); }
  return (
    <div className="space-y-10">
      <form className="bg-white p-6 rounded-xl shadow mb-8 max-w-2xl mx-auto" onSubmit={handleSubmit}>
        <h2 className="text-xl font-bold mb-3">{editId ? "Edit WiFi Spot" : "Add WiFi Spot"}</h2>
        {error && <div className="text-red-600 mb-2">{error}</div>}
        <div className="grid grid-cols-1 gap-4">
          <input className="border rounded p-2" type="text" name="name" placeholder="Name" value={form.name} onChange={handleInputChange} required />
          <input className="border rounded p-2" type="text" name="address" placeholder="Address" value={form.address} onChange={handleInputChange} required />
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
        <h2 className="text-lg font-bold mb-3">All WiFi Spots</h2>
        {items.length === 0 ? (
          <div className="text-gray-500">No WiFi spots yet.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="py-2">Name</th>
                <th className="py-2">Address</th>
                <th className="py-2"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b last:border-0">
                  <td className="py-2 pr-2 font-medium">{item.name}</td>
                  <td className="py-2 pr-2">{item.address}</td>
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

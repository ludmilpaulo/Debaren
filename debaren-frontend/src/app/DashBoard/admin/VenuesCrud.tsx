"use client";
import React, { useState, useEffect, FormEvent } from "react";
import Image from "next/image";
import {
  getVenues,
  createVenue,
  updateVenue,
  deleteVenue,
  Venue,
  VenueType,
} from "@/services/contentService";

const VENUE_TYPE_LABELS: Record<VenueType, string> = {
  country: "Country",
  city: "City",
  town: "Town",
};

const initialForm = {
  name: "",
  venue_type: "country" as VenueType,
  description: "",
  image: null as File | null,
};

export default function VenuesCrud() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [form, setForm] = useState(initialForm);
  const [editId, setEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string>("");

  // Fetch venues
  useEffect(() => {
    fetchVenues();
  }, []);

  async function fetchVenues() {
    setLoading(true);
    try {
      const data = await getVenues();
      setVenues(data);
    } catch {
      setError("Failed to load venues.");
    } finally {
      setLoading(false);
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null;
    setForm((f) => ({ ...f, image: file }));
    setPreview(file ? URL.createObjectURL(file) : null);
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  function handleEdit(venue: Venue) {
    setEditId(venue.id);
    setForm({
      name: venue.name,
      venue_type: venue.venue_type,
      description: venue.description,
      image: null,
    });
    setPreview(venue.image || null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(id: number) {
    if (!confirm("Are you sure you want to delete this venue?")) return;
    setLoading(true);
    try {
      await deleteVenue(id);
      setVenues((v) => v.filter((venue) => venue.id !== id));
    } catch {
      setError("Delete failed.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (editId) {
        const updated = await updateVenue(editId, form);
        setVenues((v) => v.map((venue) => (venue.id === editId ? updated : venue)));
        setEditId(null);
      } else {
        const created = await createVenue(form);
        setVenues((v) => [created, ...v]);
      }
      setForm(initialForm);
      setPreview(null);
    } catch {
      setError("Submission failed. Please check your inputs.");
    } finally {
      setLoading(false);
    }
  }

  function handleCancelEdit() {
    setEditId(null);
    setForm(initialForm);
    setPreview(null);
  }

  return (
    <div className="space-y-10">
      <form
        className="bg-white p-6 rounded-xl shadow mb-8 max-w-2xl mx-auto"
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >
        <h2 className="text-xl font-bold mb-3">{editId ? "Edit Venue" : "Add Venue"}</h2>
        {error && <div className="text-red-600 mb-2">{error}</div>}
        <div className="grid grid-cols-1 gap-4">
          <input
            className="border rounded p-2"
            type="text"
            name="name"
            placeholder="Venue Name"
            value={form.name}
            onChange={handleInputChange}
            required
          />
          <select
            className="border rounded p-2"
            name="venue_type"
            value={form.venue_type}
            onChange={handleInputChange}
            required
          >
            {Object.entries(VENUE_TYPE_LABELS).map(([val, label]) => (
              <option key={val} value={val}>
                {label}
              </option>
            ))}
          </select>
          <textarea
            className="border rounded p-2"
            name="description"
            rows={3}
            placeholder="Description"
            value={form.description}
            onChange={handleInputChange}
            required
          />
          <input
            className="border rounded p-2"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
          {preview && (
            <Image
              src={preview.startsWith("http") ? preview : `/media/${preview}`}
              alt="Preview"
              width={180}
              height={120}
              className="rounded mt-2"
            />
          )}
        </div>
        <div className="mt-4 flex gap-3">
          <button
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold px-6 py-2 rounded shadow"
            type="submit"
            disabled={loading}
          >
            {loading ? "Saving..." : editId ? "Update Venue" : "Add Venue"}
          </button>
          {editId && (
            <button
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold px-4 py-2 rounded"
              type="button"
              onClick={handleCancelEdit}
              disabled={loading}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Venues Table/List */}
      <div className="bg-white rounded-xl shadow p-4 overflow-x-auto">
        <h2 className="text-lg font-bold mb-3">All Venues</h2>
        {venues.length === 0 ? (
          <div className="text-gray-500">No venues yet.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="py-2">Image</th>
                <th className="py-2">Name</th>
                <th className="py-2">Type</th>
                <th className="py-2">Description</th>
                <th className="py-2"></th>
              </tr>
            </thead>
            <tbody>
              {venues.map((venue) => (
                <tr key={venue.id} className="border-b last:border-0">
                  <td className="py-2 pr-2">
                    {venue.image ? (
                      <Image
                        src={
                          venue.image.startsWith("http")
                            ? venue.image
                            : `/media/${venue.image}`
                        }
                        alt={venue.name}
                        width={64}
                        height={48}
                        className="rounded"
                      />
                    ) : (
                      <span className="text-gray-300">No image</span>
                    )}
                  </td>
                  <td className="py-2 pr-2 font-medium">{venue.name}</td>
                  <td className="py-2 pr-2">{VENUE_TYPE_LABELS[venue.venue_type]}</td>
                  <td className="py-2 pr-2 max-w-xs truncate">{venue.description}</td>
                  <td className="py-2 flex gap-2">
                    <button
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                      onClick={() => handleEdit(venue)}
                      disabled={loading}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                      onClick={() => handleDelete(venue.id)}
                      disabled={loading}
                    >
                      Delete
                    </button>
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

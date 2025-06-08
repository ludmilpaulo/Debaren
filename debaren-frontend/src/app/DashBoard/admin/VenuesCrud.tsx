"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  createVenue,
  updateVenue,
  deleteVenue,
  getVenues,
} from "@/services/contentService";
import { Venue, VenueFormInput, VenueType } from "@/types/content";
import { geocodeAddress } from "@/utils/geocode";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";

const VENUE_TYPE_LABELS: Record<VenueType, string> = {
  country: "Country",
  city: "City",
  town: "Town",
  hall: "Hall",
  conference: "Conference Center",
  restaurant: "Restaurant",
  outdoor: "Outdoor",
  auditorium: "Auditorium",
  other: "Other",
};

const initialForm: VenueFormInput = {
  name: "",
  venue_type: "country",
  description: "",
  address: "",
  city: "",
  region: "",
  country: "South Africa",
  postal_code: "",
  capacity: 0,
  amenities: "",
  price_per_day: "",
  contact_email: "",
  contact_phone: "",
  website: "",
  available: true,
  rating: 0,
  tags: "",
  image: null,
  gallery: [],
  latitude: "",
  longitude: "",
};

function parseAmenities(input: string): string[] {
  // Split by comma or whitespace, trim, remove empties
  return input
    .split(/[\s,]+/)
    .map((x) => x.trim())
    .filter(Boolean);
}

export default function VenueCRUD() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [form, setForm] = useState<VenueFormInput>(initialForm);
  const [editId, setEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  const [error, setError] = useState<string>("");

  // Fetch venues on mount
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

  function handleInputChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const { name, value, type } = e.target;
    let v: any = value;
    if (type === "checkbox") v = (e.target as HTMLInputElement).checked;
    setForm((f) => ({ ...f, [name]: v }));
  }

  // Main image
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null;
    setForm((f) => ({ ...f, image: file }));
    setPreview(file ? URL.createObjectURL(file) : null);
  }

  // Gallery
  function handleGalleryChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;
    setForm((prev) => ({
      ...prev,
      gallery: Array.from(files),
    }));
    setGalleryPreviews(Array.from(files).map((f) => URL.createObjectURL(f)));
  }

  function removeGalleryImage(idx: number) {
    setForm((f) => ({
      ...f,
      gallery: (f.gallery || []).filter((_, i) => i !== idx),
    }));
    setGalleryPreviews((p) => p.filter((_, i) => i !== idx));
  }

  function onDragEnd(result: DropResult) {
    if (!result.destination) return;
    const galleryFiles = form.gallery ? Array.from(form.gallery) : [];
    const galleryPrevs = Array.from(galleryPreviews);
    const [removedFile] = galleryFiles.splice(result.source.index, 1);
    const [removedPrev] = galleryPrevs.splice(result.source.index, 1);
    galleryFiles.splice(result.destination.index, 0, removedFile);
    galleryPrevs.splice(result.destination.index, 0, removedPrev);
    setForm((f) => ({ ...f, gallery: galleryFiles }));
    setGalleryPreviews(galleryPrevs);
  }

  function validateForm() {
    if (!form.name || !form.venue_type || !form.description || !form.address) {
      setError("Name, type, description, and address are required.");
      return false;
    }
    return true;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!validateForm()) return;
    setLoading(true);
    try {
      // Geocode address (lat/lng)
      const geo = await geocodeAddress(form.address);
      // Parse/clean amenities
      const amenitiesArray = parseAmenities(form.amenities as string);
      const submitForm: VenueFormInput = {
        ...form,
        amenities: amenitiesArray.join(","),
        latitude: geo?.lat || "",
        longitude: geo?.lng || "",
      };
      if (editId) {
        await updateVenue(editId, submitForm);
      } else {
        await createVenue(submitForm);
      }
      setEditId(null);
      setForm(initialForm);
      setPreview(null);
      setGalleryPreviews([]);
      await fetchVenues();
    } catch {
      setError("Submission failed. Please check your inputs.");
    } finally {
      setLoading(false);
    }
  }

  function handleEdit(venue: Venue) {
    setEditId(venue.id);
    setForm({
      ...venue,
      amenities: Array.isArray(venue.amenities)
        ? venue.amenities.join(", ")
        : venue.amenities ?? "",
      image: null,
      gallery: [],
    });
    setPreview(venue.image || null);
    setGalleryPreviews(venue.gallery ? venue.gallery.map((g) => g.image) : []);
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

  function handleCancelEdit() {
    setEditId(null);
    setForm(initialForm);
    setPreview(null);
    setGalleryPreviews([]);
  }

  // --- RENDER ---
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
            type="text"
            name="address"
            placeholder="Venue Address"
            value={form.address}
            onChange={handleInputChange}
            required
          />
          <input
            className="border rounded p-2"
            type="text"
            name="city"
            placeholder="City"
            value={form.city}
            onChange={handleInputChange}
          />
          <input
            className="border rounded p-2"
            type="text"
            name="region"
            placeholder="Region"
            value={form.region}
            onChange={handleInputChange}
          />
          <input
            className="border rounded p-2"
            type="text"
            name="country"
            placeholder="Country"
            value={form.country}
            onChange={handleInputChange}
          />
          <input
            className="border rounded p-2"
            type="text"
            name="postal_code"
            placeholder="Postal Code"
            value={form.postal_code}
            onChange={handleInputChange}
          />
          <input
            className="border rounded p-2"
            type="number"
            name="capacity"
            placeholder="Capacity"
            value={form.capacity}
            onChange={handleInputChange}
            min={0}
          />
          <input
            className="border rounded p-2"
            type="text"
            name="amenities"
            placeholder="Amenities (comma or space separated)"
            value={form.amenities}
            onChange={handleInputChange}
          />
          {/* Chip preview */}
          {parseAmenities(form.amenities as string).length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {parseAmenities(form.amenities as string).map((am, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 bg-gray-100 border border-gray-300 rounded-full text-xs"
                >
                  {am}
                </span>
              ))}
            </div>
          )}
          <input
            className="border rounded p-2"
            type="text"
            name="price_per_day"
            placeholder="Price Per Day"
            value={form.price_per_day}
            onChange={handleInputChange}
          />
          <input
            className="border rounded p-2"
            type="email"
            name="contact_email"
            placeholder="Contact Email"
            value={form.contact_email}
            onChange={handleInputChange}
          />
          <input
            className="border rounded p-2"
            type="text"
            name="contact_phone"
            placeholder="Contact Phone"
            value={form.contact_phone}
            onChange={handleInputChange}
          />
          <input
            className="border rounded p-2"
            type="text"
            name="website"
            placeholder="Website"
            value={form.website}
            onChange={handleInputChange}
          />
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              name="available"
              checked={form.available}
              onChange={handleInputChange}
              className="mr-2"
            />
            Available
          </label>
          <input
            className="border rounded p-2"
            type="text"
            name="rating"
            placeholder="Rating"
            value={form.rating}
            onChange={handleInputChange}
          />
          <input
            className="border rounded p-2"
            type="text"
            name="tags"
            placeholder="Tags (comma separated)"
            value={form.tags}
            onChange={handleInputChange}
          />

          {/* Main image */}
          <input className="border rounded p-2" type="file" accept="image/*" onChange={handleFileChange} />
          {preview && (
            <Image
              src={preview.startsWith("blob") ? preview : preview}
              alt="Main"
              width={180}
              height={120}
              className="rounded mt-2"
            />
          )}

          {/* Gallery multiple images with drag & drop */}
          <input
            className="border rounded p-2"
            type="file"
            accept="image/*"
            multiple
            onChange={handleGalleryChange}
          />

          {galleryPreviews.length > 0 && (
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="gallery">
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="flex gap-2 mt-2 flex-wrap"
                  >
                    {galleryPreviews.map((url, idx) => (
                      <Draggable key={idx} draggableId={String(idx)} index={idx}>
                        {(prov) => (
                          <div
                            ref={prov.innerRef}
                            {...prov.draggableProps}
                            {...prov.dragHandleProps}
                            className="relative"
                          >
                            <Image
                              src={url}
                              alt={`Gallery ${idx}`}
                              width={80}
                              height={60}
                              className="rounded border"
                            />
                            <button
                              type="button"
                              onClick={() => removeGalleryImage(idx)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                            >
                              ×
                            </button>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
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
                        src={venue.image.startsWith("http") ? venue.image : `/media/${venue.image}`}
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

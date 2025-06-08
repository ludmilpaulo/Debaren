"use client";
import React, { useState, useEffect, FormEvent } from "react";
import Image from "next/image";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import { getVenues, createVenue, updateVenue } from "@/services/contentService";
import { Venue, VenueFormInput, VenueGalleryImage } from "@/types/content";
import { geocodeAddress } from "@/utils/geocode";

const initialForm: VenueFormInput = {
  name: "",
  venue_type: "country",
  description: "",
  image: null,
  gallery: [],
  address: "",
  city: "",
  region: "",
  country: "South Africa",
  postal_code: "",
  latitude: "",
  longitude: "",
  capacity: 0,
  amenities: "",
  price_per_day: "",
  contact_email: "",
  contact_phone: "",
  website: "",
  available: true,
  rating: 0,
  tags: "",
};

export default function VenuesCrud() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [form, setForm] = useState<VenueFormInput>(initialForm);
  const [editId, setEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [galleryPreview, setGalleryPreview] = useState<(File | VenueGalleryImage)[]>([]);
  const [error, setError] = useState<string>("");

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

  function handleGalleryChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    setForm((f) => ({ ...f, gallery: files as File[] }));
    setGalleryPreview(files);
  }

  async function handleRemoveGalleryImage(img: VenueGalleryImage) {
    if (!editId) return;
    if (!confirm("Remove this gallery image?")) return;
    try {
      await fetch(`/api/venues/${editId}/remove-gallery-image/${img.id}/`, { method: "DELETE" });
      setGalleryPreview((prev) =>
        prev.filter(
          (g) =>
            !(typeof g === "object" && "id" in g) ||
            (typeof g === "object" && "id" in g && g.id !== img.id)
        )
      );
      fetchVenues();
    } catch {
      setError("Failed to remove image.");
    }
  }

  function onDragEnd(result: DropResult) {
    if (!result.destination) return;
    const reordered = Array.from(galleryPreview);
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);
    setGalleryPreview(reordered);

    // If editing existing venue, update backend order:
    if (
      editId &&
      reordered.every((g) => typeof g === "object" && "id" in g)
    ) {
      fetch(`/api/venues/${editId}/reorder-gallery/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order: (reordered as VenueGalleryImage[]).map((img) => img.id),
        }),
      });
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      // Geocode the address before submit
      const geo = await geocodeAddress(`${form.address}, ${form.city}, ${form.country}`);
      const formToSend: VenueFormInput = { ...form };
      if (geo) {
        formToSend.latitude = geo.lat;
        formToSend.longitude = geo.lng;
      } else {
        setError("Invalid address. Could not geocode.");
        setLoading(false);
        return;
      }
      // Validation Example
      if (!form.name.trim() || !form.description.trim()) {
        setError("Name and Description are required.");
        setLoading(false);
        return;
      }
      if (editId) {
        await updateVenue(editId, formToSend);
      } else {
        await createVenue(formToSend);
      }
      setForm(initialForm);
      setPreview(null);
      setGalleryPreview([]);
      setEditId(null);
      fetchVenues();
    } catch {
      setError("Submission failed. Please check your inputs.");
    } finally {
      setLoading(false);
    }
  }

  function handleEditVenue(venue: Venue) {
    setEditId(venue.id);
    setForm({
      ...venue,
      image: null, // do not set existing image file
      gallery: [], // do not set existing files; handled in galleryPreview
    });
    setPreview(
      typeof venue.image === "string"
        ? venue.image.startsWith("http")
          ? venue.image
          : `/media/${venue.image}`
        : null
    );
    // Setup galleryPreview for editing (from DB images)
    setGalleryPreview(
      venue.gallery && Array.isArray(venue.gallery) ? venue.gallery : []
    );
  }

  function handleCancelEdit() {
    setEditId(null);
    setForm(initialForm);
    setPreview(null);
    setGalleryPreview([]);
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
          {/* Name */}
          <input
            className="border rounded p-2"
            type="text"
            placeholder="Venue Name"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            required
          />
          {/* Description */}
          <textarea
            className="border rounded p-2"
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            required
          />
          {/* Address fields */}
          <input
            className="border rounded p-2"
            type="text"
            placeholder="Address"
            value={form.address}
            onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
          />
          <input
            className="border rounded p-2"
            type="text"
            placeholder="City"
            value={form.city}
            onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
          />
          <input
            className="border rounded p-2"
            type="text"
            placeholder="Region"
            value={form.region}
            onChange={(e) => setForm((f) => ({ ...f, region: e.target.value }))}
          />
          <input
            className="border rounded p-2"
            type="text"
            placeholder="Postal Code"
            value={form.postal_code}
            onChange={(e) => setForm((f) => ({ ...f, postal_code: e.target.value }))}
          />
          {/* Contact */}
          <input
            className="border rounded p-2"
            type="email"
            placeholder="Contact Email"
            value={form.contact_email}
            onChange={(e) => setForm((f) => ({ ...f, contact_email: e.target.value }))}
          />
          <input
            className="border rounded p-2"
            type="text"
            placeholder="Contact Phone"
            value={form.contact_phone}
            onChange={(e) => setForm((f) => ({ ...f, contact_phone: e.target.value }))}
          />
          {/* Capacity, Price, Rating */}
          <input
            className="border rounded p-2"
            type="number"
            placeholder="Capacity"
            value={form.capacity}
            onChange={(e) => setForm((f) => ({ ...f, capacity: Number(e.target.value) }))}
          />
          <input
            className="border rounded p-2"
            type="text"
            placeholder="Price per Day"
            value={form.price_per_day}
            onChange={(e) => setForm((f) => ({ ...f, price_per_day: e.target.value }))}
          />
          <input
            className="border rounded p-2"
            type="number"
            placeholder="Rating"
            value={form.rating}
            onChange={(e) => setForm((f) => ({ ...f, rating: Number(e.target.value) }))}
            min={0}
            max={5}
            step={0.1}
          />
          {/* Amenities & Tags */}
          <input
            className="border rounded p-2"
            type="text"
            placeholder="Amenities (comma separated)"
            value={form.amenities}
            onChange={(e) => setForm((f) => ({ ...f, amenities: e.target.value }))}
          />
          <input
            className="border rounded p-2"
            type="text"
            placeholder="Tags (comma separated)"
            value={form.tags}
            onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
          />
          {/* Website */}
          <input
            className="border rounded p-2"
            type="url"
            placeholder="Website"
            value={form.website}
            onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))}
          />
          {/* Available */}
          <div>
            <label className="mr-2">Available:</label>
            <input
              type="checkbox"
              checked={form.available}
              onChange={(e) => setForm((f) => ({ ...f, available: e.target.checked }))}
            />
          </div>
          {/* Cover image */}
          <input
            className="border rounded p-2"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
          {preview && (
            <Image
              src={preview}
              alt="Cover Preview"
              width={180}
              height={120}
              className="rounded mt-2"
            />
          )}
          {/* Gallery images */}
          <input
            className="border rounded p-2"
            type="file"
            accept="image/*"
            multiple
            onChange={handleGalleryChange}
          />
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="gallery-list" direction="horizontal">
              {(provided) => (
                <div
                  className="flex gap-2 mt-2 flex-wrap"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {galleryPreview.map((item, idx) => {
                    const isGallery = typeof item === "object" && "image" in item;
                    const key =
                      isGallery && "id" in item
                        ? `g-${(item as VenueGalleryImage).id}`
                        : `f-${idx}`;
                    const draggableId =
                      isGallery && "id" in item
                        ? `g-${(item as VenueGalleryImage).id}`
                        : `f-${idx}`;
                    return (
                      <Draggable key={key} draggableId={draggableId} index={idx}>
                        {(draggableProvided) => (
                          <div
                            className="relative"
                            ref={draggableProvided.innerRef}
                            {...draggableProvided.draggableProps}
                            {...draggableProvided.dragHandleProps}
                          >
                            <Image
                              src={
                                isGallery
                                  ? (item as VenueGalleryImage).image.startsWith("http")
                                    ? (item as VenueGalleryImage).image
                                    : `/media/${(item as VenueGalleryImage).image}`
                                  : URL.createObjectURL(item as File)
                              }
                              alt="Gallery"
                              width={80}
                              height={60}
                              className="rounded border"
                            />
                            {isGallery && "id" in item && (
                              <button
                                type="button"
                                className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1 py-0.5 rounded"
                                onClick={() =>
                                  handleRemoveGalleryImage(item as VenueGalleryImage)
                                }
                              >
                                ×
                              </button>
                            )}
                          </div>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
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

      {/* --- Table/List of Venues --- */}
      <div className="bg-white p-6 rounded-xl shadow max-w-4xl mx-auto">
        <h3 className="text-lg font-semibold mb-4">Venues List</h3>
        {loading ? (
          <div>Loading venues...</div>
        ) : venues.length === 0 ? (
          <div>No venues found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left">
              <thead>
                <tr>
                  <th className="p-2 font-semibold">Name</th>
                  <th className="p-2 font-semibold">Type</th>
                  <th className="p-2 font-semibold">Location</th>
                  <th className="p-2 font-semibold">Capacity</th>
                  <th className="p-2 font-semibold">Available</th>
                  <th className="p-2 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {venues.map((venue) => (
                  <tr key={venue.id} className="border-t">
                    <td className="p-2">{venue.name}</td>
                    <td className="p-2">{venue.venue_type}</td>
                    <td className="p-2">
                      {[venue.city, venue.region, venue.country].filter(Boolean).join(", ")}
                    </td>
                    <td className="p-2">{venue.capacity}</td>
                    <td className="p-2">{venue.available ? "Yes" : "No"}</td>
                    <td className="p-2">
                      <button
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded hover:bg-blue-200 mr-2"
                        onClick={() => handleEditVenue(venue)}
                      >
                        Edit
                      </button>
                      {/* You can add Delete support here if needed */}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

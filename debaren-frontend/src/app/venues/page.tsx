import React, { useState, useEffect, FormEvent } from "react";
import Image from "next/image";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { getVenues, createVenue, updateVenue, deleteVenue } from "@/services/contentService";
import { Venue, VenueType, VenueFormInput, VenueGalleryImage } from "@/types/content";
import { geocodeAddress } from "@/utils/geocode";

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

  useEffect(() => { fetchVenues(); }, []);

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

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value, type } = e.target;
    setForm((f) => ({ ...f, [name]: type === "number" ? Number(value) : value }));
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

  function handleEdit(venue: Venue) {
    setEditId(venue.id);
    setForm({
      ...initialForm,
      ...venue,
      image: null,
      gallery: [],
    });
    setPreview(venue.image || null);
    setGalleryPreview(venue.gallery);
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

  async function handleRemoveGalleryImage(img: VenueGalleryImage) {
    if (!editId) return;
    if (!confirm("Remove this gallery image?")) return;
    try {
      await fetch(`/api/venues/${editId}/remove-gallery-image/${img.id}/`, { method: "DELETE" });
      setGalleryPreview((prev) => prev.filter((g) => !(g as VenueGalleryImage).id || (g as VenueGalleryImage).id !== img.id));
      fetchVenues();
    } catch {
      setError("Failed to remove image.");
    }
  }

  function onDragEnd(result: any) {
    if (!result.destination) return;
    const reordered = Array.from(galleryPreview);
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);
    setGalleryPreview(reordered);

    // If editing existing venue, update backend order:
    if (editId && reordered.every(g => "id" in g)) {
      fetch(`/api/venues/${editId}/reorder-gallery/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: reordered.map((img: any) => img.id) })
      });
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      // Geocode the address before submit
      const geo = await geocodeAddress(`${form.address}, ${form.city}, ${form.country}`);
      let formToSend = { ...form };
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
    } catch (e: any) {
      setError("Submission failed. Please check your inputs.");
    } finally {
      setLoading(false);
    }
  }

  function handleCancelEdit() {
    setEditId(null);
    setForm(initialForm);
    setPreview(null);
    setGalleryPreview([]);
  }

  return (
    <div className="space-y-10">
      <form className="bg-white p-6 rounded-xl shadow mb-8 max-w-2xl mx-auto" onSubmit={handleSubmit} encType="multipart/form-data">
        <h2 className="text-xl font-bold mb-3">{editId ? "Edit Venue" : "Add Venue"}</h2>
        {error && <div className="text-red-600 mb-2">{error}</div>}
        <div className="grid grid-cols-1 gap-4">
          {/* ... all other fields as above ... */}
          <input className="border rounded p-2" type="file" accept="image/*" onChange={handleFileChange} />
          {preview && <Image src={preview} alt="Cover Preview" width={180} height={120} className="rounded mt-2" />}
          {/* Gallery images */}
          <input className="border rounded p-2" type="file" accept="image/*" multiple onChange={handleGalleryChange} />
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="gallery-list" direction="horizontal">
              {(provided) => (
                <div className="flex gap-2 mt-2 flex-wrap" ref={provided.innerRef} {...provided.droppableProps}>
                  {galleryPreview.map((item, idx) => (
                    <Draggable key={"id" in item ? `g-${item.id}` : `f-${idx}`} draggableId={"id" in item ? `g-${item.id}` : `f-${idx}`} index={idx}>
                      {(draggableProvided) => (
                        <div
                          className="relative"
                          ref={draggableProvided.innerRef}
                          {...draggableProvided.draggableProps}
                          {...draggableProvided.dragHandleProps}
                        >
                          <Image
                            src={
                              "image" in item
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
                          {"id" in item && (
                            <button
                              type="button"
                              className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1 py-0.5 rounded"
                              onClick={() => handleRemoveGalleryImage(item as VenueGalleryImage)}
                            >
                              ×
                            </button>
                          )}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
        <div className="mt-4 flex gap-3">
          <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold px-6 py-2 rounded shadow" type="submit" disabled={loading}>
            {loading ? "Saving..." : editId ? "Update Venue" : "Add Venue"}
          </button>
          {editId && (
            <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold px-4 py-2 rounded" type="button" onClick={handleCancelEdit} disabled={loading}>
              Cancel
            </button>
          )}
        </div>
      </form>
      {/* Table/List same as before */}
    </div>
  );
}

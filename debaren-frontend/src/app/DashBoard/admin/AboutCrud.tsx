"use client";
import React, { useEffect, useState, FormEvent } from "react";
import Image from "next/image";
import {
  getAbout, updateAbout, About,
} from "@/services/contentService";

const initialForm = {
  title: "",
  phone: "",
  address: "",
  description: "",
  image: null as File | null,
  image_url: "",
};

export default function AboutCrud() {
  const [form, setForm] = useState(initialForm);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    fetchData();
  }, []);
  async function fetchData() {
    setLoading(true);
    try {
      const about = await getAbout();
      setForm({
        title: about.title,
        phone: about.phone,
        address: about.address,
        description: about.description,
        image: null,
        image_url: about.image || "",
      });
      setPreview(about.image || null);
    } catch {
      setError("Failed to load About info.");
    } finally {
      setLoading(false);
    }
  }
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null;
    setForm((f) => ({ ...f, image: file }));
    setPreview(file ? URL.createObjectURL(file) : form.image_url || null);
  }
  function handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }
  async function handleSubmit(e: FormEvent) {
    e.preventDefault(); setLoading(true); setError("");
    try {
      await updateAbout(form);
      setEditMode(false);
      fetchData();
    } catch {
      setError("Update failed.");
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="bg-white p-8 rounded-xl shadow max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">About Information</h2>
        <button
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded shadow"
          onClick={() => setEditMode((v) => !v)}
        >
          {editMode ? "Cancel" : "Edit"}
        </button>
      </div>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-4">
        <input
          className="border rounded p-2 w-full"
          type="text"
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleInputChange}
          disabled={!editMode}
        />
        <input
          className="border rounded p-2 w-full"
          type="text"
          name="phone"
          placeholder="Phone"
          value={form.phone}
          onChange={handleInputChange}
          disabled={!editMode}
        />
        <input
          className="border rounded p-2 w-full"
          type="text"
          name="address"
          placeholder="Address"
          value={form.address}
          onChange={handleInputChange}
          disabled={!editMode}
        />
        <textarea
          className="border rounded p-2 w-full"
          name="description"
          rows={4}
          placeholder="Description"
          value={form.description}
          onChange={handleInputChange}
          disabled={!editMode}
        />
        <div>
          {preview && <Image src={preview.startsWith("http") ? preview : `/media/${preview}`} alt="About" width={180} height={120} className="rounded mt-2" />}
          {editMode && <input className="border rounded p-2 mt-2" type="file" accept="image/*" onChange={handleFileChange} />}
        </div>
        {editMode && (
          <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold px-6 py-2 rounded shadow" type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </button>
        )}
      </form>
    </div>
  );
}

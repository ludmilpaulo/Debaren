"use client";
import React, { useEffect, useState, FormEvent } from "react";
import {
  getHeroSection, updateHeroSection,
} from "@/services/contentService";

const initialForm = {
  title: "",
  subtitle: "",
  cta_text: "",
  cta_url: "",
};

export default function HeroSectionCrud() {
  const [form, setForm] = useState(initialForm);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    fetchData();
  }, []);
  async function fetchData() {
    setLoading(true);
    try {
      const hero = await getHeroSection();
      setForm({
        title: hero.title,
        subtitle: hero.subtitle,
        cta_text: hero.cta_text,
        cta_url: hero.cta_url,
      });
    } catch {
      setError("Failed to load Hero Section.");
    } finally {
      setLoading(false);
    }
  }
  function handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }
  async function handleSubmit(e: FormEvent) {
    e.preventDefault(); setLoading(true); setError("");
    try {
      await updateHeroSection(form);
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
        <h2 className="text-2xl font-bold">Hero Section</h2>
        <button
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded shadow"
          onClick={() => setEditMode((v) => !v)}
        >
          {editMode ? "Cancel" : "Edit"}
        </button>
      </div>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input className="border rounded p-2 w-full" type="text" name="title" placeholder="Title" value={form.title} onChange={handleInputChange} disabled={!editMode} />
        <textarea className="border rounded p-2 w-full" name="subtitle" rows={2} placeholder="Subtitle" value={form.subtitle} onChange={handleInputChange} disabled={!editMode} />
        <input className="border rounded p-2 w-full" type="text" name="cta_text" placeholder="CTA Text" value={form.cta_text} onChange={handleInputChange} disabled={!editMode} />
        <input className="border rounded p-2 w-full" type="text" name="cta_url" placeholder="CTA URL" value={form.cta_url} onChange={handleInputChange} disabled={!editMode} />
        {editMode && (
          <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold px-6 py-2 rounded shadow" type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </button>
        )}
      </form>
    </div>
  );
}

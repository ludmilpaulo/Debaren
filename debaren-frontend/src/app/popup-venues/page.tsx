"use client";
import { useGetPopupVenuesQuery } from "@/services/debarenApi";

export default function PopupVenuesPage() {
  const { data, isLoading, error } = useGetPopupVenuesQuery();

  if (isLoading) return <p>Loading popup venues...</p>;
  if (error) return <p>Error loading popup venues</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Popup Venues</h1>
      <div className="grid md:grid-cols-3 gap-6">
        {data.map((item) => (
          <div key={item.id} className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-semibold">{item.name}</h2>
            <p className="text-sm text-slate-500">{item.location}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

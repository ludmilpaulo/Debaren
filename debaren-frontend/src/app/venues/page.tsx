"use client";
import { useGetVenuesQuery } from "@/services/debarenApi";

export default function VenuesPage() {
  const { data: venues, isLoading, error } = useGetVenuesQuery();

  if (isLoading) return <p>Loading venues...</p>;
  if (error) return <p>Error loading venues</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Explore Venues</h1>
      <div className="grid md:grid-cols-3 gap-6">
        {venues.map((venue) => (
          <div key={venue.id} className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-semibold">{venue.name}</h2>
            <p className="text-sm text-slate-500">{venue.venue_type}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

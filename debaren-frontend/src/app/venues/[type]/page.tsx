"use client";
import { useGetVenuesByTypeQuery } from "@/services/debarenApi";
import { notFound } from "next/navigation";

const validTypes = ["country", "city", "town"];

export default function VenueTypePage({ params }: { params: { type: string } }) {
  const { type } = params;

  if (!validTypes.includes(type)) return notFound();

  const { data: venues, isLoading, error } = useGetVenuesByTypeQuery(type);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading venues</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold capitalize mb-4">{type} Venues</h1>
      <div className="grid md:grid-cols-2 gap-6">
        {venues.map((venue) => (
          <div key={venue.id} className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-medium">{venue.name}</h2>
            <p className="text-sm text-slate-500">{venue.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

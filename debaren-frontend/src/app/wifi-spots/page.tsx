"use client";
import { useGetWifiSpotsQuery } from "@/services/debarenApi";

export default function WifiSpotsPage() {
  const { data, isLoading, error } = useGetWifiSpotsQuery();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading WiFi spots</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">WiFi Spots</h1>
      <ul className="space-y-4">
        {data.map((spot) => (
          <li key={spot.id} className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-semibold">{spot.name}</h2>
            <p className="text-sm text-slate-500">{spot.address}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

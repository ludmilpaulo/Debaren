"use client";
import { useGetWifiSpotsQuery } from "@/services/debarenApi";
import { FaWifi } from "react-icons/fa";
import WifiShimmerCard from "@/components/WifiShimmerCard";

export default function WifiSpotsPage() {
  const { data, isLoading, error } = useGetWifiSpotsQuery();

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-extrabold mb-8 text-center bg-gradient-to-tr from-cyan-400 to-yellow-400 text-transparent bg-clip-text drop-shadow-sm">
        WiFi Spots
      </h1>

      {/* Shimmer Loading */}
      {isLoading && (
        <div className="space-y-6">
          {[...Array(5)].map((_, i) => <WifiShimmerCard key={i} />)}
        </div>
      )}

      {!isLoading && error && (
        <div className="text-red-500 text-center mt-8 text-lg font-medium">
          Error loading WiFi spots. Please try again.
        </div>
      )}

      {!isLoading && !error && Array.isArray(data) && (
        <ul className="space-y-6">
          {data.map((spot) => (
            <li
              key={spot.id}
              className="bg-white p-5 rounded-2xl shadow-md flex gap-4 items-center border border-yellow-50 hover:shadow-xl hover:-translate-y-1 transition-all duration-200"
            >
              <span className="w-12 h-12 flex items-center justify-center rounded-full bg-cyan-100 shadow-inner">
                <FaWifi size={28} className="text-cyan-500" />
              </span>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-slate-800">{spot.name}</h2>
                <p className="text-sm text-slate-500">{spot.address}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

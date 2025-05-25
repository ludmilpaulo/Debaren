"use client";
import { useGetPopupVenuesQuery } from "@/services/debarenApi";
import Image from "next/image";
import Link from "next/link";
import ShimmerCard from "@/components/ShimmerCard";

export default function PopupVenuesPage() {
  const { data, isLoading, error } = useGetPopupVenuesQuery();

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-extrabold mb-8 text-center text-yellow-700 drop-shadow-sm">
        Popup Venues
      </h1>

      {/* Shimmer Loading */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => <ShimmerCard key={i} />)}
        </div>
      )}

      {!isLoading && error && (
        <div className="text-red-500 text-center mt-8 text-lg font-medium">
          Error loading popup venues. Please try again.
        </div>
      )}

      {/* Venues Grid */}
      {!isLoading && !error && Array.isArray(data) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {data.map((item) => (
            <Link
              href={`/popup-venues/${item.id}`}
              key={item.id}
              className="group bg-white rounded-2xl shadow-lg border border-yellow-50 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
            >
              {/* Image or Fallback with gradient overlay */}
              <div className="relative aspect-w-16 aspect-h-9 rounded-t-2xl overflow-hidden flex items-center justify-center">
                {item.image ? (
                  <>
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover rounded-t-2xl transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                      priority
                    />
                    {/* Gradient overlay for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  </>
                ) : (
                  <span className="text-yellow-700 text-4xl font-bold opacity-30 select-none">
                    {item.name[0]}
                  </span>
                )}
              </div>
              <div className="p-5">
                <span className="inline-block px-3 py-1 mb-3 text-xs font-bold rounded-full bg-yellow-100 text-yellow-800">
                  Popup Venue
                </span>
                <h2 className="text-xl font-semibold mb-1 text-slate-800">{item.name}</h2>
                <p className="text-sm text-slate-600">{item.location}</p>
                <div className="mt-3 flex">
                  <span className="ml-auto">
                    <span className="inline-block px-4 py-1 bg-yellow-400/90 text-white text-xs font-bold rounded-full shadow-sm group-hover:bg-yellow-500 transition">
                      View details
                    </span>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

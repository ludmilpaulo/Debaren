"use client";
import { useGetVenuesByTypeQuery } from "@/services/debarenApi";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Transition } from "@headlessui/react";
import { VenueType } from "@/types/debaren";

const validTypes = ["country", "city", "town"];

export default function VenueTypePage({ params }: { params: { type: string } }) {
  const { type } = params;

  if (!validTypes.includes(type)) return notFound();
const venueType = type as VenueType;
  const { data: venues, isLoading, error } = useGetVenuesByTypeQuery(venueType);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-extrabold mb-8 text-center capitalize text-yellow-700 drop-shadow-sm">
        {type} Venues
      </h1>

      {/* Loading Animation */}
      <Transition
        show={isLoading}
        enter="transition-opacity duration-500"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-300"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="flex justify-center py-16">
          <div className="w-14 h-14 border-4 border-yellow-300 border-dashed rounded-full animate-spin border-t-yellow-600"></div>
        </div>
      </Transition>

      {!isLoading && error && (
        <div className="text-red-500 text-center mt-8 text-lg font-medium">
          Error loading venues. Please try again.
        </div>
      )}

      <Transition
        show={!isLoading && !error && Array.isArray(venues)}
        appear
        enter="transition-opacity duration-700"
        enterFrom="opacity-0"
        enterTo="opacity-100"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {venues?.map((venue) => (
            <div
              key={venue.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border border-yellow-50"
            >
              {/* Image or Fallback */}
              <div className="aspect-w-16 aspect-h-9 bg-gradient-to-tr from-yellow-100 to-cyan-100 rounded-t-2xl flex items-center justify-center overflow-hidden">
                {venue.image ? (
                  <Image
                    src={venue.image}
                    alt={venue.name}
                    fill
                    className="object-cover rounded-t-2xl"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    priority
                  />
                ) : (
                  <span className="text-yellow-700 text-4xl font-bold opacity-40 select-none">
                    {venue.name[0]}
                  </span>
                )}
              </div>
              <div className="p-5">
                <span className={`inline-block px-3 py-1 mb-3 text-xs font-bold rounded-full ${
                  type === "city"
                    ? "bg-cyan-100 text-cyan-800"
                    : type === "country"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-slate-100 text-slate-700"
                }`}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </span>
                <h2 className="text-xl font-semibold mb-1 text-slate-800">{venue.name}</h2>
                <p className="text-sm text-slate-600 line-clamp-3">{venue.description}</p>
              </div>
            </div>
          ))}
        </div>
      </Transition>
    </div>
  );
}

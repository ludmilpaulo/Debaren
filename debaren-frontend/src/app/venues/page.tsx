"use client";

import { useGetVenuesQuery } from "@/services/debarenApi";
import { useState, useMemo } from "react";
import { Transition } from "@headlessui/react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Search } from "lucide-react";

const ITEMS_PER_PAGE = 9;

export default function VenuesPage() {
  const { data: venues = [], isLoading, error } = useGetVenuesQuery();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredVenues = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return venues.filter(
      (venue) =>
        venue.name.toLowerCase().includes(query) ||
        venue.city?.toLowerCase().includes(query) ||
        venue.region?.toLowerCase().includes(query) ||
        venue.country?.toLowerCase().includes(query)
    );
  }, [venues, searchQuery]);

  const paginatedVenues = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredVenues.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredVenues, currentPage]);

  const totalPages = Math.ceil(filteredVenues.length / ITEMS_PER_PAGE);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center text-yellow-700 mb-8">
        Explore Our Venues
      </h1>

      <div className="relative max-w-xl mx-auto mb-8">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="search"
          placeholder="Search venues, cities, countries..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full rounded-full border py-3 pl-12 pr-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
      </div>

      {/* Fixed Transition Wrapper */}
      <Transition
        as="div"
        show={!isLoading && !error}
        appear
        enter="transition-opacity duration-500"
        enterFrom="opacity-0"
        enterTo="opacity-100"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {paginatedVenues.map((venue) => (
            <Link
              key={venue.id}
              href={`/venues/${venue.id}`}
              className="rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <div className="relative h-56">
                {venue.image ? (
                  <Image
                    src={venue.image}
                    alt={venue.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="bg-gradient-to-r from-yellow-200 to-yellow-400 flex items-center justify-center h-full">
                    <span className="text-white text-5xl font-bold">
                      {venue.name.charAt(0)}
                    </span>
                  </div>
                )}
                <span className="absolute top-2 left-2 bg-black bg-opacity-60 text-white px-3 py-1 rounded-full text-xs capitalize">
                  {venue.venue_type}
                </span>
              </div>
              <div className="p-5">
                <h2 className="text-xl font-semibold">{venue.name}</h2>
                <p className="text-gray-600 line-clamp-2">
                  {venue.description || "No description provided."}
                </p>
                <div className="mt-3 flex items-center text-gray-500 text-sm">
                  <MapPin className="h-4 w-4 mr-1" />
                  {venue.city || venue.region || venue.country || "Location not specified"}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="mt-8 flex justify-center space-x-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                className={`px-4 py-2 rounded-full ${
                  currentPage === i + 1
                    ? "bg-yellow-600 text-white"
                    : "bg-gray-100 hover:bg-yellow-100"
                }`}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </Transition>

      {/* Loading State */}
      <Transition
        as="div"
        show={isLoading}
        enter="transition-opacity duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-300"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        className="text-center text-gray-500 py-10"
      >
        Loading venues...
      </Transition>

      {/* Error State */}
      {error && (
        <div className="text-center text-red-500 py-10">
          Failed to load venues. Please try again later.
        </div>
      )}
    </div>
  );
}

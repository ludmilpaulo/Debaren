"use client";
import { useParams } from "next/navigation";
import { useGetVenuesQuery, useBookVenueMutation } from "@/services/debarenApi";
import { useState } from "react";
import Image from "next/image";
import { FaMapMarkerAlt, FaGlobe, FaPhone, FaEnvelope, FaStar, FaHeart, FaRegHeart } from "react-icons/fa";
import { BookingModal } from "@/components/BookingModal";
import type { BookingForm } from "@/types/debaren";

export default function VenueDetailPage() {
  const { id } = useParams();
  const { data: venues } = useGetVenuesQuery();
  const venue = venues?.find((v) => String(v.id) === String(id));
  const [showBooking, setShowBooking] = useState(false);
  const [wishlist, setWishlist] = useState(false);

  const [bookVenue, { isLoading: bookingLoading, isSuccess, error: bookingError }] = useBookVenueMutation();

  const handleBookingSubmit = async (form: BookingForm): Promise<void> => {
    if (!venue) return;
    await bookVenue({ ...form, venue_id: venue.id }).unwrap();
  };

  if (!venue)
    return (
      <div className="text-center py-20 text-gray-500">
        Venue not found.
      </div>
    );

  const mapsUrl = venue.address
    ? `https://maps.google.com/?q=${encodeURIComponent(venue.address)}`
    : `https://maps.google.com/?q=${venue.latitude},${venue.longitude}`;

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <div className="relative h-64 rounded-xl overflow-hidden shadow-lg">
        <Image
          src={venue.image || "/placeholder.jpg"}
          alt={venue.name}
          fill
          className="object-cover"
        />
      </div>

      <div className="flex justify-between items-center mt-6">
        <h1 className="text-3xl font-bold text-yellow-700">{venue.name}</h1>
        <button
          onClick={() => setWishlist(!wishlist)}
          className={`p-2 rounded-full border ${
            wishlist ? "text-red-500 border-red-200 bg-red-50" : "text-gray-700 border-gray-200"
          }`}
        >
          {wishlist ? <FaHeart /> : <FaRegHeart />}
        </button>
      </div>

      <div className="text-sm flex gap-4 my-3 text-gray-600">
        <span className="flex items-center gap-1">
          <FaMapMarkerAlt />
          {venue.city || venue.region || venue.country || "Location not specified"}
        </span>
        <span className="flex items-center gap-1">
          <FaStar className="text-yellow-500" />
          {venue.rating || "No ratings"}
        </span>
      </div>

      <p className="text-gray-700 mb-4">{venue.description}</p>

      <div className="flex gap-4 flex-wrap">
        {venue.contact_email && (
          <a href={`mailto:${venue.contact_email}`} className="flex items-center gap-1 text-blue-600 hover:underline">
            <FaEnvelope /> Email
          </a>
        )}
        {venue.contact_phone && (
          <a href={`tel:${venue.contact_phone}`} className="flex items-center gap-1 text-blue-600 hover:underline">
            <FaPhone /> Phone
          </a>
        )}
        {venue.website && (
          <a href={venue.website} target="_blank" className="flex items-center gap-1 text-blue-600 hover:underline">
            <FaGlobe /> Website
          </a>
        )}
      </div>

      <iframe
        src={mapsUrl}
        className="w-full rounded-lg shadow my-6 border-0"
        height="300"
        loading="lazy"
      ></iframe>

      <button
        className="bg-yellow-600 text-white font-bold rounded-lg py-3 w-full hover:bg-yellow-700 transition"
        onClick={() => setShowBooking(true)}
      >
        Book This Venue
      </button>

      {showBooking && (
        <BookingModal
          isOpen={showBooking}
          onClose={() => setShowBooking(false)}
          onSubmit={handleBookingSubmit}
          venue={venue}
          submitting={bookingLoading}
          success={isSuccess}
          error={
            bookingError && typeof bookingError === "object" && "data" in bookingError
              ? (bookingError.data as string)
              : bookingError
              ? String(bookingError)
              : undefined
          }
        />
      )}
    </div>
  );
}

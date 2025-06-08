"use client";
import { useParams } from "next/navigation";
import { useGetVenuesQuery, useBookVenueMutation } from "@/services/debarenApi";
import { useState } from "react";
import Image from "next/image";
import {
  FaMapMarkerAlt,
  FaGlobe,
  FaPhone,
  FaEnvelope,
  FaStar,
  FaHeart,
  FaRegHeart,
} from "react-icons/fa";
import { BookingModal } from "@/components/BookingModal";
import type { BookingForm } from "@/types/debaren";

// Simulate wishlisting (replace with Redux or backend in real app)
const useWishlist = () => {
  const [ids, setIds] = useState<number[]>([]);
  return {
    isWishlisted: (id: number) => ids.includes(id),
    toggle: (id: number) =>
      setIds((ids) =>
        ids.includes(id) ? ids.filter((i) => i !== id) : [...ids, id]
      ),
  };
};

export default function VenueDetailPage() {
  const { id } = useParams();
  const { data: venues } = useGetVenuesQuery();
  const venue = venues?.find((v) => String(v.id) === String(id));
  const [showBooking, setShowBooking] = useState(false);
  const wishlist = useWishlist();

  // --- Booking mutation
  const [
    bookVenue,
    { isLoading: bookingLoading, isSuccess, error: bookingError },
  ] = useBookVenueMutation();

  // Booking handler
 const handleBookingSubmit = async (form: BookingForm) => {
  if (!venue) return;
  await bookVenue({ ...form, venue: venue.id });
};

  if (!venue)
    return (
      <div className="text-center py-20 text-lg text-slate-400">
        Venue not found.
      </div>
    );

  const mapsUrl =
    venue.latitude && venue.longitude
      ? `https://www.google.com/maps?q=${venue.latitude},${venue.longitude}`
      : venue.address
      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          venue.address
        )}`
      : "";

  return (
    <div className="max-w-3xl mx-auto py-10 px-3">
      {/* Gallery (simple version, you can expand to support multiple images) */}
      <div className="relative w-full aspect-w-16 aspect-h-9 rounded-2xl overflow-hidden mb-4">
        <Image
          src={venue.image || "/placeholder-image.jpg"}
          alt={venue.name}
          fill
          className="object-cover"
          priority
        />
      </div>
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-extrabold text-yellow-700">
          {venue.name}
        </h1>
        <button
          aria-label="Add to Wishlist"
          onClick={() => wishlist.toggle(venue.id)}
          className={`p-2 rounded-full border-2 transition-all ${
            wishlist.isWishlisted(venue.id)
              ? "bg-pink-50 border-pink-300 text-pink-600"
              : "bg-white border-yellow-200 text-yellow-700 hover:bg-yellow-50"
          }`}
        >
          {wishlist.isWishlisted(venue.id) ? <FaHeart /> : <FaRegHeart />}
        </button>
      </div>
      <div className="flex gap-3 text-sm mt-2">
        <span className="flex items-center gap-2 text-cyan-700">
          <FaMapMarkerAlt />
          {venue.city}, {venue.country}
        </span>
        {venue.rating && (
          <span className="flex items-center gap-2 text-yellow-700">
            <FaStar />
            {venue.rating}
          </span>
        )}
        <span className="bg-slate-100 px-3 py-1 rounded-full text-slate-800">
          {venue.venue_type}
        </span>
      </div>
      <p className="my-4 text-slate-700">{venue.description}</p>
      <div className="flex gap-4 flex-wrap text-sm">
        {venue.contact_email && (
          <a
            href={`mailto:${venue.contact_email}`}
            className="flex items-center gap-2 text-cyan-700 hover:underline"
          >
            <FaEnvelope /> {venue.contact_email}
          </a>
        )}
        {venue.contact_phone && (
          <a
            href={`tel:${venue.contact_phone}`}
            className="flex items-center gap-2 text-cyan-700 hover:underline"
          >
            <FaPhone /> {venue.contact_phone}
          </a>
        )}
        {venue.website && (
          <a
            href={venue.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-cyan-700 hover:underline"
          >
            <FaGlobe /> Website
          </a>
        )}
      </div>
      {/* Google Maps Embed */}
      {mapsUrl && (
        <div className="my-6 rounded-xl overflow-hidden border border-yellow-200">
          <iframe
            src={`https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_API_KEY&q=${encodeURIComponent(
              venue.address || `${venue.latitude},${venue.longitude}`
            )}`}
            width="100%"
            height="300"
            allowFullScreen
            loading="lazy"
            style={{ border: 0 }}
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      )}
      <button
        className="bg-cyan-700 text-white font-bold rounded-xl py-3 w-full hover:bg-cyan-800 transition-all mt-6"
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

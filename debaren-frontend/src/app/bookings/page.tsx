"use client";
import { useSelector } from "react-redux";
import { useGetUserBookingsQuery } from "@/services/debarenApi"; // implement this endpoint in your API!
import Link from "next/link";

export default function BookingsPage() {
  // You need to provide the user id or use token from redux state
  const user = useSelector((state: any) => state.auth.user);
  const { data: bookings, isLoading, error } = useGetUserBookingsQuery(user?.id);

  if (!user) return <div className="text-center py-20">Please log in to view your bookings.</div>;

  return (
    <div className="max-w-3xl mx-auto py-10 px-3">
      <h1 className="text-3xl font-bold text-yellow-700 mb-8">My Bookings</h1>
      {isLoading && <div>Loading...</div>}
      {error && <div className="text-red-500">Could not load bookings.</div>}
      {bookings && bookings.length === 0 && <div>No bookings found.</div>}
      {bookings && bookings.map((bk: any) => (
        <div key={bk.id} className="bg-white rounded-xl shadow p-4 mb-4 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <div className="font-semibold">{bk.content_object}</div>
            <div className="text-sm text-gray-500">{bk.start_date} - {bk.end_date}</div>
            <div className="text-sm">{bk.status}</div>
          </div>
          <Link href={`/venues/${bk.object_id}`}>
            <button className="mt-2 md:mt-0 bg-cyan-100 text-cyan-900 px-4 py-2 rounded-lg font-semibold hover:bg-cyan-200">
              View Venue
            </button>
          </Link>
        </div>
      ))}
    </div>
  );
}

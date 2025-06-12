"use client";
import React, { useState, useEffect } from "react";
import { Transition } from "@headlessui/react";
import { FaUser, FaEnvelope, FaPhone, FaCalendarAlt, FaStickyNote } from "react-icons/fa";
import { DateRange, Range, RangeKeyDict } from "react-date-range";
import { addDays, format } from "date-fns";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import type { BookingForm } from "@/types/debaren";
import { Venue } from "@/types/content";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (form: BookingForm) => Promise<void>;
  venue?: Venue;
  submitting: boolean;
  success?: boolean;
  error?: string | null;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  venue,
  submitting,
  success,
  error,
}) => {
  const [form, setForm] = useState<BookingForm>({
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    start_date: "",
    end_date: "",
    notes: "",
  });

  // Date range picker state
  const [range, setRange] = useState<Range[]>([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 1),
      key: "selection",
    },
  ]);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setForm({
        customer_name: "",
        customer_email: "",
        customer_phone: "",
        start_date: "",
        end_date: "",
        notes: "",
      });
      setRange([
        {
          startDate: new Date(),
          endDate: addDays(new Date(), 1),
          key: "selection",
        },
      ]);
    }
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle range selection
  const handleSelect = (ranges: RangeKeyDict) => {
    const sel = ranges.selection;
    setRange([sel]);
    setForm({
      ...form,
      start_date: sel.startDate ? format(sel.startDate, "yyyy-MM-dd") : "",
      end_date: sel.endDate ? format(sel.endDate, "yyyy-MM-dd") : "",
    });
    setShowDatePicker(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(form);
  };

  return (
    <Transition show={isOpen}>
      <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl px-8 py-8 max-w-lg w-full relative">
          <button
            className="absolute top-3 right-3 text-xl font-bold bg-yellow-100 rounded-full px-3 py-1 hover:bg-yellow-200 focus:outline-none"
            onClick={onClose}
            type="button"
            aria-label="Close"
          >
            ×
          </button>
          <h3 className="text-2xl font-bold text-yellow-800 mb-2 text-center">
            Book: {venue?.name}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            {/* Name & Email */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <FaUser className="absolute left-3 top-3 text-yellow-500" />
                <input
                  name="customer_name"
                  value={form.customer_name}
                  onChange={handleChange}
                  required
                  placeholder="Your Name"
                  className="pl-10 flex-1 bg-white rounded-md px-3 py-2 border border-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition peer"
                  autoComplete="off"
                />
                <label className="absolute left-10 -top-3 text-xs bg-white px-1 text-yellow-600 peer-focus:text-yellow-700 transition">Name</label>
              </div>
              <div className="relative flex-1">
                <FaEnvelope className="absolute left-3 top-3 text-yellow-500" />
                <input
                  name="customer_email"
                  type="email"
                  value={form.customer_email}
                  onChange={handleChange}
                  required
                  placeholder="Email"
                  className="pl-10 flex-1 bg-white rounded-md px-3 py-2 border border-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition peer"
                  autoComplete="off"
                />
                <label className="absolute left-10 -top-3 text-xs bg-white px-1 text-yellow-600 peer-focus:text-yellow-700 transition">Email</label>
              </div>
            </div>
            {/* Phone */}
            <div className="relative">
              <FaPhone className="absolute left-3 top-3 text-yellow-500" />
              <input
                name="customer_phone"
                value={form.customer_phone}
                onChange={handleChange}
                placeholder="Phone (optional)"
                className="pl-10 bg-white rounded-md px-3 py-2 border border-yellow-200 w-full focus:outline-none focus:ring-2 focus:ring-yellow-500 transition peer"
              />
              <label className="absolute left-10 -top-3 text-xs bg-white px-1 text-yellow-600 peer-focus:text-yellow-700 transition">Phone</label>
            </div>
            {/* Date Range Picker */}
            <div>
              <div
                className="relative flex gap-3"
                onClick={() => setShowDatePicker(true)}
                tabIndex={0}
              >
                <div className="relative flex-1">
                  <FaCalendarAlt className="absolute left-3 top-3 text-yellow-500" />
                  <input
                    name="start_date"
                    value={form.start_date}
                    onChange={() => {}} // disabled, set via picker
                    readOnly
                    required
                    placeholder="Start date"
                    className="pl-10 bg-white rounded-md px-3 py-2 border border-yellow-200 w-full focus:outline-none focus:ring-2 focus:ring-yellow-500 transition"
                  />
                  <label className="absolute left-10 -top-3 text-xs bg-white px-1 text-yellow-600 transition">Start Date</label>
                </div>
                <div className="relative flex-1">
                  <FaCalendarAlt className="absolute left-3 top-3 text-yellow-500" />
                  <input
                    name="end_date"
                    value={form.end_date}
                    onChange={() => {}} // disabled, set via picker
                    readOnly
                    required
                    placeholder="End date"
                    className="pl-10 bg-white rounded-md px-3 py-2 border border-yellow-200 w-full focus:outline-none focus:ring-2 focus:ring-yellow-500 transition"
                  />
                  <label className="absolute left-10 -top-3 text-xs bg-white px-1 text-yellow-600 transition">End Date</label>
                </div>
              </div>
              {/* Date picker dropdown */}
              {showDatePicker && (
                <div className="absolute z-50 left-0 right-0 mt-2 mx-auto">
                  <DateRange
                    ranges={range}
                    onChange={handleSelect}
                    rangeColors={["#facc15"]}
                    minDate={new Date()}
                    moveRangeOnFirstSelection={false}
                  />
                  <button
                    type="button"
                    className="mt-2 px-3 py-2 bg-yellow-500 text-white font-bold rounded hover:bg-yellow-600"
                    onClick={() => setShowDatePicker(false)}
                  >
                    Done
                  </button>
                </div>
              )}
            </div>
            {/* Notes */}
            <div className="relative">
              <FaStickyNote className="absolute left-3 top-3 text-yellow-500" />
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                placeholder="Additional notes (optional)"
                rows={2}
                className="pl-10 w-full bg-white rounded-md px-3 py-2 border border-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition peer"
              />
              <label className="absolute left-10 -top-3 text-xs bg-white px-1 text-yellow-600 peer-focus:text-yellow-700 transition">Notes</label>
            </div>
            {/* Actions */}
            <div className="flex gap-4 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-yellow-100 text-yellow-900 font-bold rounded-lg py-2 hover:bg-yellow-200 transition-all focus:outline-none focus:ring-2 focus:ring-yellow-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-cyan-700 text-white font-bold rounded-lg py-2 hover:bg-cyan-800 transition-all focus:outline-none focus:ring-2 focus:ring-cyan-700"
              >
                {submitting ? "Booking..." : "Confirm Booking"}
              </button>
            </div>
            {success && (
              <div className="text-green-700 text-center pt-2 font-semibold">
                Booking successful! We’ll be in touch.
              </div>
            )}
            {error && (
              <div className="text-red-600 text-center pt-2 font-semibold">
                {error}
              </div>
            )}
          </form>
        </div>
      </div>
    </Transition>
  );
};

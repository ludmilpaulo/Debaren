// lib/services/debarenApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
 
  PopupVenue,
  WifiSpot,
  SchoolProgram,
  About,
  FooterSocialLink,
  VenueType,
  Booking,
  BookingForm,
} from "@/types/debaren"; // Add Booking and BookingForm to your types!
import { baseAPI } from "@/utils/variables";
import { Venue } from "@/types/content";

export const debarenApi = createApi({
  reducerPath: "debarenApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${baseAPI}/api/` }),
  endpoints: (builder) => ({
    getVenues: builder.query<Venue[], void>({ query: () => "venues/" }),
    getVenuesByType: builder.query<Venue[], VenueType>({
      query: (type) => `venues/?venue_type=${type}`,
    }),
    getPopupVenues: builder.query<PopupVenue[], void>({
      query: () => "popup-venues/",
    }),
    getWifiSpots: builder.query<WifiSpot[], void>({
      query: () => "wifi-spots/",
    }),
    getSchoolPrograms: builder.query<SchoolProgram[], void>({
      query: () => "school-programs/",
    }),
    getAbout: builder.query<About, void>({
      query: () => "about/",
    }),
    getFooterSocialLinks: builder.query<FooterSocialLink[], void>({
      query: () => "footer-social-links/",
    }),
    getHero: builder.query<{
      title: string;
      subtitle: string;
      cta_text: string;
      cta_url: string;
    }, void>({
      query: () => "hero/",
    }),
    /** --- Booking Mutation for Venue (and generic use) --- */
        // ...existing endpoints...
    bookVenue: builder.mutation<Booking, { venue_id: number } & BookingForm>({
      query: (data) => ({
        url: "bookings/",
        method: "POST",
        body: data,
      }),
    }),
    /** --- Get Bookings for Current User --- */
    getUserBookings: builder.query<Booking[], number>({
      query: (userId) => `bookings/?user_id=${userId}`,
    }),

  }),
});

export const {
  useGetVenuesQuery,
  useGetVenuesByTypeQuery,
  useGetPopupVenuesQuery,
  useGetWifiSpotsQuery,
  useGetSchoolProgramsQuery,
  useGetAboutQuery,
  useGetFooterSocialLinksQuery,
  useGetHeroQuery,
   useGetUserBookingsQuery, 
  useBookVenueMutation, // <-- Make sure THIS is exported!
} = debarenApi;

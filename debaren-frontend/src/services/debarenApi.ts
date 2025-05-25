// lib/services/debarenApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  Venue,
  PopupVenue,
  WifiSpot,
  SchoolProgram,
  About,
  FooterSocialLink,
  VenueType,
} from "@/types/debaren";

export const debarenApi = createApi({
  reducerPath: "debarenApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://127.0.0.1:8000/api/" }),
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
} = debarenApi;

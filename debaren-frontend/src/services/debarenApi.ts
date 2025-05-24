import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const debarenApi = createApi({
  reducerPath: "debarenApi",
  baseQuery: fetchBaseQuery({ baseUrl:  "http://127.0.0.1:8000/api/" }),
  endpoints: (builder) => ({
    getVenues: builder.query<any[], void>({ query: () => "venues/" }),
    getVenuesByType: builder.query<any[], string>({
      query: (type) => `venues/?venue_type=${type}`,
    }),
    getPopupVenues: builder.query<any[], void>({
      query: () => "popup-venues/",
    }),
    getWifiSpots: builder.query<any[], void>({
      query: () => "wifi-spots/",
    }),
    getSchoolPrograms: builder.query<any[], void>({
      query: () => "school-programs/",
    }),
    // NEW: About page content
    getAbout: builder.query<any, void>({
      query: () => "about/",
    }),
    // NEW: Footer social links
    getFooterSocialLinks: builder.query<any[], void>({
      query: () => "footer-social-links/",
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
} = debarenApi;

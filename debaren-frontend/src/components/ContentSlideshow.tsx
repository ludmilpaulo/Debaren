"use client";
import React, { useMemo, useRef, useState, useEffect } from "react";
import Image from "next/image";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import {
  useGetVenuesQuery,
  useGetPopupVenuesQuery,
  useGetSchoolProgramsQuery,
} from "@/services/debarenApi";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/solid";

type SlideItem = {
  id: number;
  title: string;
  description?: string;
  subtitle?: string;
  image?: string;
  type: "Venue" | "PopupVenue" | "SchoolProgram";
  location?: string;
  venue_type?: string;
};

function buildSlides(
  venues: any[] = [],
  popupVenues: any[] = [],
  schoolPrograms: any[] = []
): SlideItem[] {
  return [
    ...venues.map((v) => ({
      id: v.id,
      title: v.name,
      description: v.description,
      image: v.image,
      type: "Venue" as const,
      venue_type: v.venue_type,
    })),
    ...popupVenues.map((v) => ({
      id: v.id,
      title: v.name,
      subtitle: v.location,
      image: v.image,
      type: "PopupVenue" as const,
    })),
    ...schoolPrograms.map((p) => ({
      id: p.id,
      title: p.name,
      description: p.description,
      image: p.image,
      type: "SchoolProgram" as const,
    })),
  ];
}

export default function ContentSlideshow() {
  const { data: venues, isLoading: venuesLoading } = useGetVenuesQuery();
  const { data: popupVenues, isLoading: popupLoading } = useGetPopupVenuesQuery();
  const { data: schoolPrograms, isLoading: schoolLoading } = useGetSchoolProgramsQuery();

  const slides: SlideItem[] = useMemo(
    () => buildSlides(venues ?? [], popupVenues ?? [], schoolPrograms ?? []),
    [venues, popupVenues, schoolPrograms]
  );

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);

  // Keen Slider setup
  const [sliderRef, slider] = useKeenSlider<HTMLDivElement>({
    loop: true,
    slides: {
      perView: 1.15,
      spacing: 24,
    },
    breakpoints: {
      "(min-width: 640px)": {
        slides: { perView: 2.2, spacing: 32 },
      },
      "(min-width: 1024px)": {
        slides: { perView: 3.2, spacing: 40 },
      },
    },
    slideChanged: (s) => setCurrentSlide(s.track.details.rel),
  });

  // Autoplay logic
  useEffect(() => {
    if (!slider.current || slides.length <= 1) return;
    if (isHovering) {
      if (autoplayRef.current) clearInterval(autoplayRef.current);
      return;
    }
    autoplayRef.current = setInterval(() => {
      slider.current?.next();
    }, 3400);
    return () => {
      if (autoplayRef.current) clearInterval(autoplayRef.current);
    };
  }, [slider, slides.length, isHovering]);

  if (venuesLoading || popupLoading || schoolLoading) {
    return (
      <div className="w-full flex justify-center py-16">
        <div className="animate-spin w-12 h-12 border-4 border-yellow-300 border-t-transparent rounded-full"></div>
      </div>
    );
  }
  if (!slides.length) return null;

  return (
    <section className="mt-12 mb-8 px-2 relative">
      <h2 className="text-2xl font-extrabold text-slate-800 mb-8 text-center tracking-tight">
        Explore Our Featured Spaces
      </h2>
      {/* Arrow Navigation */}
      <button
        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-yellow-100 border border-yellow-300 p-2 rounded-full shadow transition hidden md:block"
        onClick={() => slider.current?.prev()}
        aria-label="Previous"
        tabIndex={0}
        type="button"
      >
        <ArrowLeftIcon className="w-5 h-5 text-yellow-600" />
      </button>
      <button
        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-yellow-100 border border-yellow-300 p-2 rounded-full shadow transition hidden md:block"
        onClick={() => slider.current?.next()}
        aria-label="Next"
        tabIndex={0}
        type="button"
      >
        <ArrowRightIcon className="w-5 h-5 text-yellow-600" />
      </button>
      {/* Slider */}
      <div
        ref={sliderRef}
        className="keen-slider group"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onTouchStart={() => setIsHovering(true)}
        onTouchEnd={() => setIsHovering(false)}
      >
        {slides.map((slide, idx) => (
          <div
            key={`${slide.type}-${slide.id}`}
            className="keen-slider__slide"
            tabIndex={0}
            aria-label={slide.title}
          >
            <div className="bg-white/80 rounded-2xl shadow-xl overflow-hidden group-hover:scale-105 hover:scale-105 transition-transform duration-300 relative border border-yellow-100">
              {/* Image */}
              {slide.image ? (
                <div className="relative w-full aspect-[16/10] bg-gray-100">
                  <Image
                    src={
                      slide.image.startsWith("http")
                        ? slide.image
                        : `/media/${slide.image}`
                    }
                    alt={slide.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                    priority={idx < 3}
                  />
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-yellow-400/30 via-transparent to-transparent pointer-events-none" />
                </div>
              ) : (
                <div className="w-full aspect-[16/10] bg-gradient-to-br from-cyan-100 to-yellow-100 flex items-center justify-center">
                  <span className="text-lg text-slate-400">No image</span>
                </div>
              )}
              {/* Card Body */}
              <div className="p-4 relative">
                <div className="text-xs font-bold uppercase tracking-wide text-yellow-700 mb-1">
                  {slide.type === "Venue"
                    ? slide.venue_type ?? "Venue"
                    : slide.type === "PopupVenue"
                    ? "Popup Venue"
                    : "School Program"}
                </div>
                <div className="text-lg font-semibold text-slate-900 mb-1 truncate">
                  {slide.title}
                </div>
                {slide.subtitle && (
                  <div className="text-sm text-slate-500 mb-1">{slide.subtitle}</div>
                )}
                {slide.description && (
                  <div className="text-xs text-slate-500 mt-1 line-clamp-2">{slide.description}</div>
                )}
                <a
                  href={
                    slide.type === "Venue"
                      ? "/venues"
                      : slide.type === "PopupVenue"
                      ? "/popup-venues"
                      : "/school"
                  }
                  className="mt-4 inline-block bg-cyan-600 hover:bg-cyan-700 text-white rounded px-4 py-1 text-xs font-bold shadow transition"
                >
                  {slide.type === "Venue"
                    ? "View Venues"
                    : slide.type === "PopupVenue"
                    ? "More Popup Venues"
                    : "See School Programs"}
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Slide Dots */}
      <div className="flex justify-center gap-2 mt-6">
        {slides.map((_, idx) => (
          <button
            key={idx}
            className={`w-3 h-3 rounded-full transition shadow ${
              idx === currentSlide ? "bg-yellow-600" : "bg-gray-300"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
            onClick={() => slider.current?.moveToIdx(idx)}
          />
        ))}
      </div>
    </section>
  );
}

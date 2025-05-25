"use client";
import { useGetAboutQuery } from "@/services/debarenApi";
import Image from "next/image";
import { Transition } from "@headlessui/react";
import { HiOutlineBriefcase } from "react-icons/hi2";

export default function AboutPage() {
  const { data, isLoading, error } = useGetAboutQuery();

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {/* Loading shimmer */}
      <Transition
        show={isLoading}
        enter="transition-opacity duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="animate-pulse space-y-8">
          <div className="h-14 w-40 bg-yellow-100 rounded mb-6" />
          <div className="h-6 w-2/3 bg-slate-100 rounded" />
          <div className="h-6 w-1/2 bg-slate-100 rounded" />
          <div className="h-44 w-full bg-yellow-50 rounded-xl" />
        </div>
      </Transition>

      {/* Error state */}
      {!isLoading && error && (
        <div className="text-center text-red-600 mt-20">Could not load About info. Please try again.</div>
      )}

      {/* Main About Content */}
      {!isLoading && data && (
        <Transition
          show={!!data}
          appear
          enter="transition duration-700"
          enterFrom="opacity-0 translate-y-6"
          enterTo="opacity-100 translate-y-0"
        >
          <div>
            {/* Brand + (optional image) */}
            <div className="flex flex-col items-center mb-10">
              <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 via-cyan-400 to-yellow-100 shadow-lg mb-4">
                {data.image ? (
                  <Image
                    src={data.image}
                    alt={data.title}
                    width={56}
                    height={56}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <span className="text-3xl font-extrabold text-white drop-shadow">D</span>
                )}
              </span>
              <h1 className="text-4xl md:text-5xl font-extrabold text-yellow-700 text-center mb-2 drop-shadow">
                {data.title || "About Debaren"}
              </h1>
              <p className="text-lg text-slate-700 text-center max-w-xl">
                {data.description}
              </p>
            </div>

            {/* Highlights / Vision */}
            {Array.isArray(data.highlights) && data.highlights.length > 0 && (
              <div className="rounded-2xl bg-white shadow-lg p-8 border border-yellow-100 mb-10">
                <h2 className="text-2xl font-bold text-cyan-600 mb-2">What We Offer</h2>
                <ul className="list-disc pl-5 text-slate-700 space-y-2">
                  {data.highlights.map((point: string, i: number) => (
                    <li key={i}>{point}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* CTA to Careers */}
            <section className="mt-16">
              <div className="max-w-3xl mx-auto rounded-2xl bg-gradient-to-tr from-cyan-50 via-yellow-50 to-white shadow-md p-8 flex flex-col items-center border border-yellow-100">
                <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-400/90 shadow-lg mb-4">
                  <HiOutlineBriefcase className="text-white text-3xl" />
                </span>
                <h2 className="text-2xl md:text-3xl font-extrabold text-cyan-700 mb-2 text-center">
                  Join the Debaren Team
                </h2>
                <p className="text-slate-700 text-center max-w-xl mb-4">
                  Passionate about connecting people, places, and possibilities? At{" "}
                  <span className="font-semibold text-yellow-700">Debaren</span>, we’re always on the lookout for creative minds and driven individuals to help us shape the future of venues and event spaces across South Africa.
                </p>
                <p className="text-slate-600 text-center mb-6">
                  Whether you're an innovator, organizer, or digital professional, discover new opportunities to grow your career with us!
                </p>
                <a
                  href="/careers"
                  className="inline-block bg-yellow-400 hover:bg-cyan-600 text-white font-bold py-2 px-8 rounded-full shadow-lg text-lg transition-all duration-200"
                >
                  Explore Careers at Debaren
                </a>
              </div>
            </section>
          </div>
        </Transition>
      )}
    </div>
  );
}

"use client";
import { useGetSchoolProgramsQuery } from "@/services/debarenApi";
import SchoolShimmerCard from "@/components/SchoolShimmerCard";
import Image from "next/image";
import { FaGraduationCap } from "react-icons/fa";

export default function SchoolPage() {
  const { data, isLoading, error } = useGetSchoolProgramsQuery();

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-extrabold mb-8 text-center bg-gradient-to-tr from-yellow-400 to-cyan-400 text-transparent bg-clip-text drop-shadow-sm">
        School Programs
      </h1>

      {/* Shimmer Loading */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[...Array(4)].map((_, i) => <SchoolShimmerCard key={i} />)}
        </div>
      )}

      {!isLoading && error && (
        <div className="text-red-500 text-center mt-8 text-lg font-medium">
          Error loading programs. Please try again.
        </div>
      )}

      {!isLoading && !error && Array.isArray(data) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {data.map((program) => (
            <div
              key={program.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border border-yellow-50 flex flex-col md:flex-row"
            >
              {/* Image or Icon */}
              <div className="relative w-full md:w-40 h-40 flex-shrink-0 bg-gradient-to-tr from-yellow-100 to-cyan-50 rounded-t-2xl md:rounded-t-none md:rounded-l-2xl flex items-center justify-center overflow-hidden">
                {program.image ? (
                  <Image
                    src={program.image}
                    alt={program.name}
                    fill
                    className="object-cover rounded-t-2xl md:rounded-l-2xl"
                    sizes="(max-width: 768px) 100vw, 200px"
                  />
                ) : (
                  <FaGraduationCap className="text-yellow-500 text-4xl opacity-70" />
                )}
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <span className="inline-block px-3 py-1 mb-3 text-xs font-bold rounded-full bg-yellow-100 text-yellow-800">
                  School Program
                </span>
                <h2 className="text-xl font-semibold mb-1 text-slate-800">{program.name}</h2>
                <p className="text-sm text-slate-600 line-clamp-3">{program.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

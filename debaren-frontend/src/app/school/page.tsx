"use client";
import { useGetSchoolProgramsQuery } from "@/services/debarenApi";

export default function SchoolPage() {
  const { data, isLoading, error } = useGetSchoolProgramsQuery();

  if (isLoading) return <p>Loading school programs...</p>;
  if (error) return <p>Error loading programs</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">School Programs</h1>
      <div className="grid md:grid-cols-2 gap-6">
        {data.map((program) => (
          <div key={program.id} className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-semibold">{program.name}</h2>
            <p className="text-sm text-slate-500">{program.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

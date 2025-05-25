// components/ShimmerCard.tsx
export default function ShimmerCard() {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-yellow-50 animate-pulse">
      <div className="aspect-w-16 aspect-h-9 bg-gradient-to-tr from-yellow-50 to-cyan-50 rounded-t-2xl" />
      <div className="p-5">
        <div className="h-5 w-24 bg-yellow-100 rounded-full mb-3" />
        <div className="h-6 w-3/4 bg-slate-200 rounded mb-2" />
        <div className="h-4 w-1/2 bg-slate-100 rounded" />
      </div>
    </div>
  );
}

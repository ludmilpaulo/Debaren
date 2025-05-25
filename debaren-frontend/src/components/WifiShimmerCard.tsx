// components/WifiShimmerCard.tsx
export default function WifiShimmerCard() {
  return (
    <div className="bg-white rounded-2xl shadow-md border border-yellow-50 animate-pulse p-5 flex gap-4 items-center">
      <div className="w-10 h-10 bg-cyan-100 rounded-full" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-2/3 bg-slate-200 rounded" />
        <div className="h-3 w-1/2 bg-slate-100 rounded" />
      </div>
    </div>
  );
}

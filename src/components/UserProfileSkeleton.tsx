export default function UserProfileSkeleton() {
  return (
    <div className="glassmorphism rounded-xl p-4 flex items-center gap-3 animate-pulse">
      <div className="w-10 h-10 rounded-full bg-gray-700"></div>
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-700 rounded w-24"></div>
        <div className="h-3 bg-gray-700 rounded w-32"></div>
      </div>
      <div className="w-4 h-4 bg-gray-700 rounded"></div>
    </div>
  );
}

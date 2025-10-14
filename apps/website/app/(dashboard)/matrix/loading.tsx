export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-300 rounded w-48 mb-4"></div>
        <div className="h-4 bg-gray-300 rounded w-96 mb-8"></div>
        <div className="space-y-4">
          <div className="h-32 bg-gray-300 rounded"></div>
          <div className="h-32 bg-gray-300 rounded"></div>
        </div>
      </div>
    </div>
  )
}
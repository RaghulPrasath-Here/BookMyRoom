export default function Home() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">
        Find your room in Dublin 
      </h1>
      <p className="text-gray-500 mb-8">
        Search through real listings from WhatsApp & Facebook groups
      </p>

      {/* Search bar */}
      <div className="flex gap-2 mb-10">
        <input
          type="text"
          placeholder="e.g. room near UCD under €600 for 3 months"
          className="flex-1 border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button className="bg-blue-600 text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-blue-700">
          Search
        </button>
      </div>

      {/* Listings grid*/}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <p className="text-gray-400 text-sm">No listings yet.</p>
      </div>
    </div>
  )
}
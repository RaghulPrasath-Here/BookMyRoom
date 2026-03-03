export default function Submit() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Post a Room</h1>
      <p className="text-gray-500 mb-6">
        Describe about your accomodation listing. Our AI will extract the details automatically.
      </p>

      <textarea
        rows={10}
        placeholder="Paste your listing message here..."
        className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
      />

      <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700">
        Extract
      </button>
    </div>
  )
}
export default function Confirm() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Review your listing</h1>
      <p className="text-gray-500 mb-6">
        Check the details below. You can edit anything before publishing.
      </p>

      {/* Parsed fields will go here */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
        <p className="text-gray-400 text-sm">Parsed listing fields</p>
      </div>

      <button className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700">
        Publish Listing ✓
      </button>
    </div>
  )
}
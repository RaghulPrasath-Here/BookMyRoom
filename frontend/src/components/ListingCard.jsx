import { Link } from 'react-router-dom'

export default function ListingCard({ listing }) {
  return (
    <Link to={`/listings/${listing.id}`}>
      <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition cursor-pointer bg-white">
        <div className="flex justify-between items-start mb-2">
          <h2 className="font-semibold text-gray-800 text-sm">{listing.title}</h2>
          <span className="text-blue-600 font-bold text-sm">€{listing.price}/mo</span>
        </div>
        <p className="text-gray-500 text-xs mb-2"> {listing.location}</p>
        <div className="flex gap-2 flex-wrap">
          {listing.room_type && (
            <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
              {listing.room_type}
            </span>
          )}
          {listing.gender_preference && (
            <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
              {listing.gender_preference}
            </span>
          )}
          {listing.bills_included && (
            <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
              Bills included
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
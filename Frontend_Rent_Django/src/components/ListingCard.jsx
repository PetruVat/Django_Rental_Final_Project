// src/components/ListingCard.jsx

import { Link } from "react-router-dom";

export default function ListingCard({ listing }) {
  const firstImage = listing.images?.length > 0 ? listing.images[0].image : null;

  const avgRating = listing.reviews?.length
    ? (
        listing.reviews.reduce((acc, r) => acc + r.rating, 0) /
        listing.reviews.length
      ).toFixed(1)
    : null;

  return (
    <div className="border rounded-xl shadow hover:shadow-md transition overflow-hidden bg-white">
      {firstImage && (
        <img
          src={firstImage}
          alt={listing.title}
          className="w-full h-60 object-cover"
        />
      )}
      <div className="p-4 space-y-1">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">{listing.title}</h2>
          {avgRating && (
            <span className="text-sm text-yellow-600 font-medium">
              ⭐ {avgRating}
            </span>
          )}
        </div>
        <p className="text-sm text-gray-600">
          {listing.city}, {listing.district}
        </p>
        <p className="text-base font-bold text-green-700">
          € {listing.price} / ночь
        </p>
        <Link
          to={`/listings/${listing.id}`}
          className="text-blue-600 text-sm inline-block mt-2 hover:underline"
        >
          Подробнее
        </Link>
      </div>
    </div>
  );
}

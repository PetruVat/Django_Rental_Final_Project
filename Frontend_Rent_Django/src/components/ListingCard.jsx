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
    <div className="rounded-2xl overflow-hidden border bg-white shadow-sm hover:shadow-lg transition">
      <Link to={`/listings/${listing.id}`} className="block relative">
        {firstImage && (
          <img
            src={firstImage}
            alt={listing.title}
            className="w-full aspect-square object-cover"
          />
        )}
        {avgRating && (
          <span className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-full text-sm font-medium">
            ⭐ {avgRating}
          </span>
        )}
      </Link>
      <div className="p-4 space-y-1">
        <h2 className="text-base font-semibold truncate">{listing.title}</h2>
        <p className="text-sm text-gray-600">
          {listing.city}, {listing.district}
        </p>
        <p className="text-sm font-medium text-green-700">
          € {listing.price} / ночь
        </p>

      </div>
    </div>
  );
}

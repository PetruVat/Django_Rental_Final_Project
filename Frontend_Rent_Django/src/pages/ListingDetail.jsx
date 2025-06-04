// src/components/ListingDetail.jsx

import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { getListingDetail } from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import ReviewList from "@/components/ReviewList";
import ReviewForm from "@/components/ReviewForm";
import StarRating from "@/components/StarRating";

export default function ListingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [listing, setListing] = useState(null);

  const fetchListing = async () => {
    try {
      const data = await getListingDetail(id);
      setListing(data);
    } catch {
      toast.error("Объявление не найдено");
      navigate("/");
    }
  };

  useEffect(() => {
    fetchListing();
  }, [id]);

  if (!listing) return null;

  const avgRating = listing.average_rating ?? "—";

  return (
    <section className="max-w-5xl mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h1 className="text-3xl font-bold mb-1">{listing.title}</h1>
          <p className="text-gray-600 mb-2">
            {listing.city}, {listing.district}
          </p>
          <p className="text-green-700 font-semibold text-xl mb-4">
            € {listing.price}
          </p>

          <div className="grid grid-cols-2 gap-4 mb-4">
            {listing.images?.map((img, i) => (
              <img
                key={i}
                src={img.image}
                alt={`Фото ${i + 1}`}
                className="w-full h-48 object-cover rounded"
              />
            ))}
          </div>

          <p className="mb-4 text-gray-700 whitespace-pre-line">
            {listing.description}
          </p>

          <div className="space-y-1 text-sm text-gray-800 mb-6">
            <p><strong>Тип:</strong> {listing.property_type}</p>
            <p><strong>Комнат:</strong> {listing.rooms}</p>
            <p className="flex items-center gap-1">
              <strong>Средняя оценка:</strong>
              <StarRating value={avgRating} />
              {avgRating}
            </p>
          </div>

          {user?.role === "tenant" && (
            <Link to={`/bookings/create/${listing.id}`}>
              <Button>Забронировать</Button>
            </Link>
          )}
        </div>

        <div>
          <ReviewList listingId={listing.id} />
          {user?.role === "tenant" && <ReviewForm listingId={listing.id} onReviewSubmitted={fetchListing} />}
        </div>
      </div>
    </section>
  );
}
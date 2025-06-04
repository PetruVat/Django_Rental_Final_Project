import { useEffect, useState } from "react";
import { api } from "@/services/api";
import ListingCard from "@/components/ListingCard";

export default function PopularListings() {
  const [popular, setPopular] = useState([]);

  useEffect(() => {
    api.get("/analytics/popular-listing/").then((data) => {
      if (Array.isArray(data)) setPopular(data);
    });
  }, []);

  if (popular.length === 0) return null;

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-3">🔥 Популярные объявления</h2>
      <div className="grid md:grid-cols-3 gap-4">
        {popular.map((listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </div>
    </div>
  );
}

// src/pages/MyListingsPage.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Spinner } from "../components/ui/spinner";
import { Button } from "../components/ui/button";
import { useAuth } from "../context/AuthContext";
import { getListings } from "../services/api";

export default function MyListingsPage() {
  const { user } = useAuth();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const all = await getListings();
        const mine = all.results?.filter((listing) => listing.owner === user.id);
        setListings(mine);
      } catch (err) {
        console.error("Ошибка загрузки объявлений", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [user.id]);

  if (loading) return <Spinner />;

  return (
    <section className="max-w-4xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">Мои объявления</h1>

      {listings.length === 0 ? (
        <p className="text-gray-500">У вас пока нет объявлений.</p>
      ) : (
        <ul className="space-y-4">
          {listings.map((listing) => (
            <li key={listing.id} className="border p-4 rounded">
              <h2 className="text-xl font-semibold">{listing.title}</h2>
              <p className="text-sm text-gray-600">{listing.city}, {listing.district}</p>
              <div className="mt-2 flex gap-2">
                <Link to={`/listings/${listing.id}`}><Button size="sm">Просмотр</Button></Link>
                <Link to={`/listings/${listing.id}/edit`}><Button size="sm" variant="outline">Редактировать</Button></Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

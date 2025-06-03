// ✅ PopularAnalytics.jsx
import { useEffect, useState } from 'react';
import { api } from '@/services/api';

export default function PopularAnalytics() {
  const [searches, setSearches] = useState([]);
  const [listings, setListings] = useState([]);

  useEffect(() => {
    api.get('/api/analytics/popular-search/').then(res => setSearches(res.data));
    api.get('/api/analytics/popular-listing/').then(res => setListings(res.data));
  }, []);

  return (
    <section className="p-4">
      <h2 className="text-xl font-bold mb-2">Популярные поиски</h2>
      <ul className="mb-4 list-disc ml-4">
        {searches.map((s, i) => <li key={i}>{s.query}</li>)}
      </ul>
      <h2 className="text-xl font-bold mb-2">Популярные объекты</h2>
      <ul className="list-disc ml-4">
        {listings.map((l) => <li key={l.id}>{l.title}</li>)}
      </ul>
    </section>
  );
}
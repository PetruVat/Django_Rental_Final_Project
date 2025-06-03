import { useEffect, useState } from "react";
import { api } from "@/services/api";

export default function SearchHistory() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    api.get("/analytics/search-history/").then((data) => {
      if (Array.isArray(data)) setHistory(data);
    });
  }, []);

  if (history.length === 0) return null;

  return (
    <div className="bg-gray-100 p-4 rounded mb-6">
      <h2 className="text-lg font-semibold mb-2">🕘 История поиска</h2>
      <ul className="list-disc pl-6 text-sm text-gray-800">
        {history.map((item, i) => (
          <li key={i}>{item.term} ({item.count} раз)</li>
        ))}
      </ul>
    </div>
  );
}

// src/components/Pagination.jsx

export default function Pagination({ page, setPage, total, pageSize = 10 }) {
  const pageCount = Math.ceil(total / pageSize);
  if (pageCount <= 1) return null;

  return (
    <div className="flex justify-center mt-6 space-x-2">
      {Array.from({ length: pageCount }, (_, i) => i + 1).map((p) => (
        <button
          key={p}
          onClick={() => setPage(p)}
          className={`px-3 py-1 border rounded ${
            page === p ? "bg-blue-600 text-white" : "bg-white text-gray-800"
          }`}
        >
          {p}
        </button>
      ))}
    </div>
  );
}

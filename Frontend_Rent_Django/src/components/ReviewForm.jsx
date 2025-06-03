// src/components/ReviewForm.jsx

import { useState } from "react";
import { createReview } from "@/services/api";
import { toast } from "sonner";

export default function ReviewForm({ listingId, onReviewSubmitted }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await createReview(listingId, { rating, comment });
      toast.success("Отзыв отправлен");
      setRating(5);
      setComment("");
      onReviewSubmitted?.();
    } catch (err) {
      console.error(err);
      setError(err.message || "Ошибка при отправке отзыва");
      toast.error("Вы не можете оставить отзыв, если не завершили аренду.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-3">
      <h3 className="text-lg font-semibold">Оставить отзыв</h3>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <label className="block text-sm">
        Оценка:
        <select
          className="mt-1 block w-full border rounded p-1"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
        >
          {[5, 4, 3, 2, 1].map((val) => (
            <option key={val} value={val}>
              {val}
            </option>
          ))}
        </select>
      </label>

      <label className="block text-sm">
        Комментарий:
        <textarea
          className="mt-1 block w-full border rounded p-2"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
        />
      </label>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Отправить отзыв
      </button>
    </form>
  );
}

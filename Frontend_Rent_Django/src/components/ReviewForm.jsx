import { useState } from "react";
import { api } from "@/services/api";
import { toast } from "sonner";

export default function ReviewForm({ listingId, onReviewSubmitted }) {
  const [text, setText] = useState("");
  const [rating, setRating] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/reviews/", {
        listing: listingId,
        comment: text,         // исправлено здесь
        rating: parseInt(rating),
      });
      toast.success("Отзыв отправлен");
      setText("");
      setRating("");
      onReviewSubmitted?.();
    } catch (err) {
      toast.error("Ошибка при отправке отзыва");
      console.error("ReviewForm error:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded">
      <h3 className="text-lg font-semibold mb-2">Оставить отзыв</h3>
      <textarea
        className="w-full border rounded p-2 mb-2"
        placeholder="Ваш отзыв"
        value={text}
        onChange={(e) => setText(e.target.value)}
        required
      />
      <input
        className="w-full border rounded p-2 mb-2"
        type="number"
        min="1"
        max="5"
        placeholder="Оценка от 1 до 5"
        value={rating}
        onChange={(e) => setRating(e.target.value)}
        required
      />
      <button type="submit" className="bg-black text-white px-4 py-2 rounded">
        Оставить отзыв
      </button>
    </form>
  );
}

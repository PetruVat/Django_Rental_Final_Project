import { useEffect, useState } from 'react';
import { api } from '@/services/api';
import { Star } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

export default function ReviewList({ listingId }) {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    api.get(`/reviews/?listing=${listingId}`)
      .then(res => {
        const data = Array.isArray(res) ? res : res.results || [];
        setReviews(data);
      })
      .catch(error => {
        console.error("Ошибка при получении отзывов:", error?.message || error?.response?.data || error);
      });
  }, [listingId]);

  const renderStars = (rating) =>
    Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 stroke-yellow-400' : 'stroke-gray-300'}`}
        fill={i < rating ? 'currentColor' : 'none'}
      />
    ));

  const getInitials = (name) => {
  if (!name || typeof name !== 'string') return '??';
  return name
    .split(' ')
    .map(n => n[0]?.toUpperCase())
    .join('')
    .slice(0, 2);
};

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-4">Отзывы</h3>
      {reviews.length === 0 ? (
        <p className="text-sm text-gray-500">Пока нет отзывов</p>
      ) : (
        reviews.map((r) => (
          <div
            key={r.id}
            className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 shadow-sm mb-4"
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <div className="bg-gray-300 text-white w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold">
                  {getInitials(r.author)}
                </div>
                <div className="text-sm font-medium text-gray-800">{r.author}</div>
              </div>
              <div className="flex">{renderStars(r.rating)}</div>
            </div>
            <p className="text-gray-700 text-sm">{r.comment}</p>
            {r.created_at && (
              <p className="text-xs text-gray-400 mt-1">
                {format(new Date(r.created_at), 'd MMMM yyyy', { locale: ru })}
              </p>
            )}
          </div>
        ))
      )}
    </div>
  );
}

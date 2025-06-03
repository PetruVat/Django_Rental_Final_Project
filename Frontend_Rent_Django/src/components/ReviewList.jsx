//  src/components/ReviewList.jsx
import { useEffect, useState } from 'react';
import { api } from '@/services/api';

export default function ReviewList({ listingId }) {
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        api.get(`/reviews/?listing=${listingId}`)
            .then(res => {
                const data = Array.isArray(res) ? res : res.results || [];
                setReviews(data);
                console.log("ReviewList: Данные отзывов:", data);  // Лог
            })
            .catch(error => {
                console.error("ReviewList: Ошибка при получении отзывов:", error);  // Лог ошибки
            });
    }, [listingId]);

    return (
        <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Отзывы</h3>
            {reviews.map(r => (
                <div key={r.id} className="border rounded p-2 mb-2">
                    <p><strong>{r.author}</strong>: {r.comment} (Rating: {r.rating})</p>
                </div>
            ))}
        </div>
    );
}

// src/pages/BookingList.jsx

import { useEffect, useState } from "react";
import { getBookings, updateBookingStatus } from "../services/api";
import { Spinner } from "../components/ui/spinner";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import { toast } from "sonner";
import { logError } from "../lib/utils";

export default function BookingList() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await getBookings();
        setBookings(data.results ?? []);
      } catch (err) {
          logError("Fetch bookings error", err);
        setError("Не удалось загрузить бронирования");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const handleStatusUpdate = async (id, status) => {
    try {
      await updateBookingStatus(id, status);
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status } : b))
      );
      toast.success(`Бронирование ${status === "confirmed" ? "подтверждено" : "отклонено"}`);
    } catch (err) {
      logError("Update booking status error", err);
      toast.error("Не удалось обновить статус");
    }
  };

  if (loading) return <Spinner />;
  if (error) return <div className="text-red-500 p-4">{error}</div>;

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        {user?.role === "landlord" ? "Запросы на бронирование" : "Мои бронирования"}
      </h1>

      {bookings.length === 0 ? (
        <div className="text-gray-500">Нет бронирований.</div>
      ) : (
        <ul className="space-y-4">
          {bookings.map((booking) => (
            <li key={booking.id} className="border p-4 rounded shadow">
              <div className="font-semibold">
                Объект: {booking.listing_title || booking.listing}
              </div>
              <div className="text-sm text-gray-600">
                {booking.start_date} — {booking.end_date} • Гостей: {booking.guests}
              </div>
              <div className="text-sm text-gray-600">Статус: {booking.status}</div>

              {user?.role === "landlord" && booking.status === "pending" && (
                <div className="flex gap-2 mt-2">
                  <Button
                    variant="success"
                    onClick={() => handleStatusUpdate(booking.id, "confirmed")}
                  >
                    Подтвердить
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleStatusUpdate(booking.id, "rejected")}
                  >
                    Отклонить
                  </Button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

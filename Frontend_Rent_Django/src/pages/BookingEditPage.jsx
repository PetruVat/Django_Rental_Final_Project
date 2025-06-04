// src/pages/BookingEditPage.jsx

import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getBookings, api } from "../services/api";
import { Spinner } from "../components/ui/spinner";
import { useAuth } from "../context/AuthContext";
import { logError } from "../lib/utils";

export default function BookingEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [booking, setBooking] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [guests, setGuests] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const data = await getBookings();
        const item = data.results.find((b) => b.id === parseInt(id));
        if (!item) throw new Error("Бронирование не найдено");

        // Проверка: пользователь должен быть либо владельцем, либо арендодателем
        if (user?.role !== "landlord" && user?.role !== "admin") {
          throw new Error("У вас нет прав для редактирования этого бронирования");
        }

        setBooking(item);
        setStartDate(item.start_date);
        setEndDate(item.end_date);
        setGuests(item.guests);
      } catch (err) {
          logError("Fetch booking error", err);
          setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [id, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.patch(`/bookings/${id}/`, {
        start_date: startDate,
        end_date: endDate,
        guests,
      });
      navigate("/bookings");
    } catch (err) {
        logError("Update booking error", err);
      alert("Ошибка при обновлении");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Удалить бронирование?")) return;
    try {
      await api.delete(`/bookings/${id}/`);
      navigate("/bookings");
    } catch (err) {
        logError("Delete booking error", err);
      alert("Ошибка при удалении");
    }
  };

  const handleConfirm = async () => {
    try {
      await api.patch(`/bookings/${id}/`, { status: "confirmed" });
      alert("Бронирование подтверждено");
      navigate("/bookings");
    } catch (err) {
        logError("Confirm booking error", err);
      alert("Ошибка при подтверждении бронирования");
    }
  };

  const handleReject = async () => {
    try {
      await api.patch(`/bookings/${id}/`, { status: "rejected" });
      alert("Бронирование отклонено");
      navigate("/bookings");
    } catch (err) {
        logError("Reject booking error", err);
      alert("Ошибка при отклонении бронирования");
    }
  };

  if (loading) return <Spinner />;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-xl font-semibold mb-4">Редактировать бронирование</h1>
      {user?.role === "owner" && (
        <Link
          to="/listings/create"
          className="inline-block mb-4 text-white bg-blue-600 px-4 py-2 rounded"
        >
          + Добавить объявление
        </Link>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Дата заезда</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Дата выезда</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Гостей</label>
          <input
            type="number"
            value={guests}
            min={1}
            onChange={(e) => setGuests(Number(e.target.value))}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Сохранить
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            Удалить
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Подтвердить
          </button>
          <button
            type="button"
            onClick={handleReject}
            className="bg-yellow-500 text-white px-4 py-2 rounded"
          >
            Отклонить
          </button>
        </div>
      </form>
    </div>
  );
}

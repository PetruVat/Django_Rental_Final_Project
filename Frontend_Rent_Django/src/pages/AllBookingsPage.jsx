import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getBookings, updateBookingStatus } from "@/services/api";
import { Button } from "@/components/ui/button";

export default function AllBookingsPage() {
  const [bookings, setBookings] = useState([]);

  const fetchBookings = async () => {
    try {
      const data = await getBookings();
      setBookings(data.results || []);
    } catch {
      toast.error("Не удалось загрузить бронирования");
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleUpdate = async (id, status) => {
    try {
      await updateBookingStatus(id, status);
      toast.success("Статус обновлён");
      fetchBookings();
    } catch {
      toast.error("Ошибка при обновлении статуса");
    }
  };

  return (
    <section className="max-w-5xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Все запросы на бронирование</h1>
      {bookings.length === 0 ? (
        <p>Нет бронирований</p>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => (
            <div key={b.id} className="border rounded-lg p-4 shadow-sm space-y-2">
              <p><strong>Объект:</strong> {b.listing_title}</p>
              <p><strong>Арендатор:</strong> {b.tenant_name}</p>
              <p><strong>Даты:</strong> {b.start_date} – {b.end_date}</p>
              <p><strong>Статус:</strong> {b.status}</p>

              {b.status === "pending" && (
                <div className="flex gap-2">
                  <Button onClick={() => handleUpdate(b.id, "confirmed")}>
                    Подтвердить
                  </Button>
                  <Button
                    variant="destructive"
                    className="text-black bg-red-100 hover:bg-red-200"
                    onClick={() => handleUpdate(b.id, "rejected")}
                  >
                    Отклонить
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

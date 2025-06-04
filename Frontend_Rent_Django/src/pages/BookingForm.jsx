import { useState } from "react";
import { useParams } from "react-router-dom";
import { createBooking } from "../services/api";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { toast } from "../components/ui/toast";
import { logError } from "../lib/utils";

export default function BookingForm() {
  const { id } = useParams(); // ID жилья
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [guests, setGuests] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createBooking({ listing: id, start_date: startDate, end_date: endDate, guests });
      toast.success("Бронирование отправлено на подтверждение.");
    } catch (err) {
        logError("Create booking error", err);
      toast.error("Ошибка при бронировании.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Забронировать жильё</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 text-sm">Дата начала</label>
          <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
        </div>
        <div>
          <label className="block mb-1 text-sm">Дата окончания</label>
          <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
        </div>
        <div>
          <label className="block mb-1 text-sm">Количество гостей</label>
          <Input type="number" min="1" value={guests} onChange={(e) => setGuests(e.target.value)} required />
        </div>
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Отправка..." : "Отправить заявку"}
        </Button>
      </form>
    </div>
  );
}

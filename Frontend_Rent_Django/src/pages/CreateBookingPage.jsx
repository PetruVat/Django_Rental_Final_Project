// src/pages/CreateBookingPage.jsx

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { createBooking, getListingDetail } from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function CreateBookingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [listing, setListing] = useState(null);
  const [form, setForm] = useState({
    start_date: "",
    end_date: "",
    listing: id,
  });
  const [nights, setNights] = useState(0);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const data = await getListingDetail(id);
        setListing(data);
      } catch {
        toast.error("Объявление не найдено");
        navigate("/");
      }
    };
    fetchListing();
  }, [id, navigate]);

  if (user?.role !== "tenant") {
    return (
      <div className="p-4 text-center text-red-500">
        Только арендаторы могут бронировать жильё.
      </div>
    );
  }

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  useEffect(() => {
    if (form.start_date && form.end_date) {
      const start = new Date(form.start_date);
      const end = new Date(form.end_date);
      const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      setNights(diff > 0 ? diff : 0);
    } else {
      setNights(0);
    }
  }, [form.start_date, form.end_date]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createBooking(form);
      toast.success("Бронирование создано");
      navigate("/bookings");
    } catch {
      toast.error("Ошибка при создании бронирования");
    }
  };

  const totalPrice = nights * (listing?.price || 0);

  return (
    <section className="max-w-5xl mx-auto p-4">
      <div className="grid md:grid-cols-2 gap-8 bg-white p-6 rounded-lg shadow">
        <div>
          {listing?.images?.[0] && (
            <img
              src={listing.images[0].image}
              alt={listing.title}
              className="w-full h-64 object-cover rounded-lg mb-4"
            />
          )}
          <h1 className="text-2xl font-semibold mb-2">{listing?.title}</h1>
          <p className="text-gray-500 mb-1">
            {listing?.city}, {listing?.district}
          </p>
          <p className="text-xl font-bold">€ {listing?.price} / ночь</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Забронировать</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="date"
              value={form.start_date}
              onChange={handleChange("start_date")}
              required
            />
            <Input
              type="date"
              value={form.end_date}
              onChange={handleChange("end_date")}
              required
            />
            {nights > 0 && (
              <div className="text-sm text-gray-700 space-y-1">
                <p>Количество ночей: {nights}</p>
                <p>
                  Итого: <span className="font-medium">€ {totalPrice}</span>
                </p>
              </div>
            )}
            <Button type="submit" className="w-full">
              Забронировать
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
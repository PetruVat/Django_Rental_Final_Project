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

  return (
    <section className="max-w-xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Бронирование: {listing?.title}</h1>

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

        <Button type="submit">Забронировать</Button>
      </form>
    </section>
  );
}

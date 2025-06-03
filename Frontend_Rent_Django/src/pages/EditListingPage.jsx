// src/pages/EditListingPage.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { api } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import ImageUploader from "@/components/ImageUploader";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const PROPERTY_TYPES = [
  { value: "house", label: "Дом" },
  { value: "apartment", label: "Квартира" },
  { value: "room", label: "Комната" },
];

export default function EditListingPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    city: "",
    district: "",
    rooms: "",
    property_type: "",
  });

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const data = await api.get(`/listings/${id}/`);
        setForm({
          title: data.title,
          description: data.description,
          price: data.price,
          city: data.city,
          district: data.district,
          rooms: data.rooms,
          property_type: data.property_type,
        });
      } catch {
        toast.error("Не удалось загрузить объявление");
        navigate("/bookings");
      }
    };
    fetchListing();
  }, [id, navigate]);

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put(`/listings/${id}/`, form);
      toast.success("Объявление обновлено");
      navigate("/listings/" + id);
    } catch {
      toast.error("Ошибка при обновлении объявления");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-2xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Редактировать объявление</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input placeholder="Заголовок" value={form.title} onChange={handleChange("title")} required />
        <Textarea placeholder="Описание" value={form.description} onChange={handleChange("description")} rows={5} />
        <Input placeholder="Цена" value={form.price} onChange={handleChange("price")} type="number" />
        <Input placeholder="Город" value={form.city} onChange={handleChange("city")} />
        <Input placeholder="Район" value={form.district} onChange={handleChange("district")} />
        <Input placeholder="Количество комнат" value={form.rooms} onChange={handleChange("rooms")} type="number" />

        <Select value={form.property_type} onValueChange={(val) => setForm({ ...form, property_type: val })}>
          <SelectTrigger>
            <SelectValue placeholder="Тип недвижимости" />
          </SelectTrigger>
          <SelectContent>
            {PROPERTY_TYPES.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button type="submit" disabled={loading}>
          {loading ? "Обновление..." : "Обновить объявление"}
        </Button>
      </form>

      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-2">Изображения</h2>
        <ImageUploader listingId={id} />
      </div>
    </section>
  );
}

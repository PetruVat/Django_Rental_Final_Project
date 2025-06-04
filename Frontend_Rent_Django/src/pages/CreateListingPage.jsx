// src/pages/CreateListingPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { PROPERTY_TYPES } from "@/constants/propertyTypes";

export default function CreateListingPage() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [listingId, setListingId] = useState(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    city: "",
    district: "",
    rooms: "",
    property_type: "",
  });

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {
    const listing = await api.post("/listings/", form);
    setListingId(listing.id);
    toast.success("Объявление создано. Теперь можно загрузить фото.");
  } catch (err) {
    console.error(err?.message || err?.response?.data || err);
    toast.error("Ошибка при создании объявления");
  } finally {
    setLoading(false);
  }
};

  return (
    <section className="max-w-2xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Создать объявление</h1>

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
          {loading ? "Создание..." : "Создать объявление"}
        </Button>
      </form>

      {listingId && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-2">Загрузка изображений</h2>
          <ImageUploader listingId={listingId} />
        </div>
      )}
    </section>
  );
}

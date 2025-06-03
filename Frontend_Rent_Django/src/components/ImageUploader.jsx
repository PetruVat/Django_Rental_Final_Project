// src/components/ImageUploader.jsx

import { useState } from "react";
import { toast } from "sonner";
import { api } from "@/services/api";

export default function ImageUploader({ listingId }) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);
    formData.append("listing", listingId);

    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/upload-image/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      if (!res.ok) throw new Error("Ошибка при загрузке");

      const data = await res.json();
      setImages((prev) => [...prev, data.image]);
      toast.success("Изображение загружено");
    } catch (err) {
      toast.error("Ошибка загрузки изображения");
    } finally {
      setLoading(false);
      e.target.value = null;
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} disabled={loading} />
      <div className="grid grid-cols-2 gap-4 mt-4">
        {images.map((url, i) => (
          <img key={i} src={url} alt="listing" className="w-full h-32 object-cover rounded" />
        ))}
      </div>
    </div>
  );
}

// src/pages/ListingList.jsx

import ListingCard from "@/components/ListingCard";
import PopularListings from "@/components/PopularListings";
import SearchHistory from "@/components/SearchHistory";
import { useEffect, useState } from "react";
import { getListings } from "@/services/api";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { PROPERTY_TYPES } from "@/constants/propertyTypes";

export default function ListingList() {
  const [listings, setListings] = useState([]);
  const [city, setCity] = useState("");
  const [propertyType, setPropertyType] = useState("all");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");

  const fetchData = async () => {
    try {
      const data = await getListings();
      setListings(data.results || []);
    } catch {
      toast.error("Ошибка загрузки объявлений");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleReset = () => {
    setCity("");
    setPropertyType("all");
    setPriceMin("");
    setPriceMax("");
  };

  const filteredListings = listings.filter((listing) => {
    return (
      (!city || listing.city.toLowerCase().includes(city.toLowerCase())) &&
      (propertyType === "all" || listing.property_type === propertyType) &&
      (!priceMin || listing.price >= Number(priceMin)) &&
      (!priceMax || listing.price <= Number(priceMax))
    );
  });

  return (
    <section className="max-w-7xl mx-auto p-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
       <SearchHistory />
      <PopularListings />
        <h1 className="text-2xl font-bold">Список недвижимости</h1>
        <div className="flex flex-col sm:flex-row gap-2">
          <Input
            placeholder="Город"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <Select value={propertyType} onValueChange={setPropertyType}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Тип недвижимости" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все типы</SelectItem>
              {PROPERTY_TYPES.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            placeholder="Мин. цена"
            type="number"
            value={priceMin}
            onChange={(e) => setPriceMin(e.target.value)}
            className="w-28"
          />
          <Input
            placeholder="Макс. цена"
            type="number"
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value)}
            className="w-28"
          />
          <Button variant="outline" onClick={handleReset} className="whitespace-nowrap">
            Сбросить фильтр
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredListings.map((listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </div>
    </section>
  );
}

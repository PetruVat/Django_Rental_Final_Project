import { Input } from "./ui/input";
import { Button } from "./ui/button";

export default function HeroSection({ city, setCity, onSearch }) {
  return (
    <div
      className="bg-[url('https://source.unsplash.com/1600x900/?home')] bg-cover bg-center py-20 text-center rounded-2xl mb-10"
    >
      <h1 className="text-white text-3xl md:text-5xl font-bold mb-6 drop-shadow-lg">
        Найдите жильё своей мечты
      </h1>
      <div className="flex max-w-md mx-auto bg-white rounded-full overflow-hidden shadow-lg">
        <Input
          placeholder="Город"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="flex-1 border-0 focus:ring-0 rounded-none px-4"
        />
        <Button onClick={onSearch} className="rounded-none">
          Поиск
        </Button>
      </div>
    </div>
  );
}
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="p-8 text-center">
      <h1 className="text-2xl font-bold mb-4">Страница не найдена</h1>
      <Link to="/" className="text-blue-600 underline">
        На главную
      </Link>
    </div>
  );
}
import { Star, StarHalf } from "lucide-react";

export default function StarRating({ value = 0, className = "" }) {
  const rating = Number(value) || 0;
  const full = Math.floor(rating);
  const hasHalf = rating - full >= 0.5;
  return (
    <div className={`flex ${className}`.trim()}>
      {Array.from({ length: 5 }, (_, i) => {
        if (i < full) {
          return (
            <Star
              key={i}
              className="w-4 h-4 fill-yellow-400 stroke-yellow-400"
            />
          );
        }
        if (i === full && hasHalf) {
          return (
            <StarHalf
              key={i}
              className="w-4 h-4 fill-yellow-400 stroke-yellow-400"
            />
          );
        }
        return <Star key={i} className="w-4 h-4 stroke-gray-300" fill="none" />;
      })}
    </div>
  );
}
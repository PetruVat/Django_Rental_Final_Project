import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PrivateRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <div className="text-center py-10">Загрузка...</div>;

  return user ? children : <Navigate to="/login" />;
}
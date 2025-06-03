// src/components/Header.jsx

import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

export default function Header() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutUser();
    navigate("/login");
  };

  return (
    <header className="bg-white shadow px-4 py-3 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold text-primary">
        ДомАренда
      </Link>

      <nav className="flex gap-4 items-center">
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-1">
                {user.username}
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {user.role === "tenant" && (
                <DropdownMenuItem asChild>
                  <Link to="/bookings">Мои бронирования</Link>
                </DropdownMenuItem>
              )}
              {user.role === "landlord" && (
                <>
                  <DropdownMenuItem asChild>
                    <Link to="/my-listings">Мои объявления</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/listings/create">Создать объявление</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/all-bookings">Все запросы</Link>
                  </DropdownMenuItem>
                </>
              )}
              <DropdownMenuItem onClick={handleLogout}>Выйти</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <>
            <Link to="/login" className="text-sm hover:underline">
              Войти
            </Link>
            <Link to="/register" className="text-sm hover:underline">
              Зарегистрироваться
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}

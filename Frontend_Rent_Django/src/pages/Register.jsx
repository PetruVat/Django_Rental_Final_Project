import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../services/api";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { toast } from "../components/ui/toast";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== password2) {
      toast.error("Пароли не совпадают.");
      return;
    }
    setLoading(true);
    try {
      await register({ username, email, password, password2, role });
      toast.success("Подтвердите email для завершения регистрации.");
      navigate("/login");
    } catch (err) {
      toast.error("Ошибка при регистрации.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold mb-6 text-center">Регистрация</h2>
      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <label className="text-sm">Имя пользователя</label>
          <Input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div>
          <label className="text-sm">Email</label>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label className="text-sm">Пароль</label>
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <div>
          <label className="text-sm">Повторите пароль</label>
          <Input type="password" value={password2} onChange={(e) => setPassword2(e.target.value)} required />
        </div>
        <div>
          <label className="text-sm">Роль</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm focus:outline-none"
            required
          >
            <option value="" disabled>Выберите роль</option>
            <option value="tenant">Арендатор</option>
            <option value="landlord">Собственник</option>
          </select>
        </div>
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Регистрация..." : "Зарегистрироваться"}
        </Button>
      </form>
    </div>
  );
}

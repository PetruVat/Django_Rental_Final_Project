import { apiRequest, setToken } from './main.js';

// Login
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  if (!form) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const username = form.username.value;
    const password = form.password.value;

    try {
      const data = await apiRequest('/auth/login/', 'POST', { username, password });
      setToken(data.access);
      alert('Успешный вход');
      window.location = 'listings.html';
    } catch (e) {
      alert(`Ошибка входа: ${e.detail.detail || e.status}`);
    }
  });
});

// Register
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('registerForm');
  if (!form) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const payload = {
      username: form.regUsername.value,
      email: form.regEmail.value,
      password: form.regPassword.value,
      password2: form.regPassword2.value,
      role: form.regRole.value
    };

    try {
      await apiRequest('/auth/register/', 'POST', payload);
      alert('Успешная регистрация, теперь войдите');
      window.location = 'login.html';
    } catch (e) {
      alert(`Ошибка регистрации: ${JSON.stringify(e.detail)}`);
    }
  });
});

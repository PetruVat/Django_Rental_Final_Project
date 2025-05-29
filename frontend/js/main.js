// Базовый URL вашего API
const baseUrl = 'http://127.0.0.1:8000/api';

// Работа с токеном
export function setToken(token) {
  localStorage.setItem('authToken', token);
}
export function getToken() {
  return localStorage.getItem('authToken');
}

// Универсальный helper для fetch
export async function apiRequest(path, method = 'GET', body = null) {
  const headers = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${baseUrl}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw { status: res.status, detail: err };
  }
  return res.json().catch(() => null);
}

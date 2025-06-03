// src/services/api.js

const API_BASE = import.meta.env.VITE_API_BASE_URL;

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function refreshToken() {
  const refresh = localStorage.getItem("refresh");
  const res = await fetch(`${API_BASE}/auth/token/refresh/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refresh }),
  });
  if (!res.ok) throw new Error("Ошибка обновления токена");
  const data = await res.json();
  localStorage.setItem("token", data.access);
  return data.access;
}

// ---------- AUTH ----------
export async function login({ username, password }) {
  const res = await fetch(`${API_BASE}/auth/login/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) throw new Error("Ошибка логина");
  return await res.json();
}

export async function register({ username, email, password, password2, role }) {
  const res = await fetch(`${API_BASE}/auth/register/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, email, password, password2, role }),
  });
  if (!res.ok) throw new Error("Ошибка регистрации");
  return await res.json();
}

export async function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("refresh");
}

export async function getMe() {
  let res = await fetch(`${API_BASE}/auth/me/`, {
    headers: {
      ...getAuthHeaders(),
    },
  });

  if (res.status === 401) {
    const newAccess = await refreshToken();
    res = await fetch(`${API_BASE}/auth/me/`, {
      headers: {
        Authorization: `Bearer ${newAccess}`,
      },
    });
  }

  if (!res.ok) throw new Error("Не авторизован");
  return await res.json();
}

// ---------- LISTINGS ----------
export async function getListings({ sort = "date", page = 1 } = {}) {
  const res = await fetch(`${API_BASE}/listings/?sort=${sort}&page=${page}`, {
    headers: {
      ...getAuthHeaders(),
    },
  });
  if (!res.ok) throw new Error("Ошибка загрузки списка");
  return await res.json();
}

export async function getListingDetail(id) {
  const res = await fetch(`${API_BASE}/listings/${id}/`, {
    headers: {
      ...getAuthHeaders(),
    },
  });
  if (!res.ok) throw new Error("Ошибка загрузки объекта");
  return await res.json();
}

export async function createListing(data) {
  const res = await fetch(`${API_BASE}/listings/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Ошибка создания");
  return await res.json();
}

export async function updateListing(id, data) {
  const res = await fetch(`${API_BASE}/listings/${id}/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Ошибка обновления");
  return await res.json();
}

// ---------- BOOKINGS ----------
export async function getBookings() {
  const res = await fetch(`${API_BASE}/bookings/`, {
    headers: {
      ...getAuthHeaders(),
    },
  });
  if (!res.ok) throw new Error("Ошибка загрузки бронирований");
  return await res.json();
}

export async function createBooking(data) {
  const res = await fetch(`${API_BASE}/bookings/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Ошибка создания бронирования");
  return await res.json();
}

export async function updateBookingStatus(id, status) {
  const res = await fetch(`${API_BASE}/bookings/${id}/status/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error("Ошибка обновления статуса");
  return await res.json();
}

// ---------- DEFAULT API WRAPPER ----------
export const api = {
  get: (url) =>
    fetch(`${API_BASE}${url}`, {
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
    }).then((res) => res.json()),

  post: (url, data) =>
    fetch(`${API_BASE}${url}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify(data),
    }).then((res) => res.json()),

  put: (url, data) =>
    fetch(`${API_BASE}${url}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify(data),
    }).then((res) => res.json()),

  patch: (url, data) =>
    fetch(`${API_BASE}${url}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify(data),
    }).then((res) => res.json()),

  delete: (url) =>
    fetch(`${API_BASE}${url}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
    }).then((res) => res.json()),
};

export const apiBase = API_BASE;


// ---------- REVIEWS ----------
export const createReview = async (listingId, reviewData) => {
    const response = await api.post(`/reviews/`, { listing: listingId, ...reviewData });
    if (!response) {
        throw new Error('Could not create review');
    }
    return response;
};

export const getReviews = async (listingId) => {
    const response = await api.get(`/reviews/?listing=${listingId}`);
    if (!response) {
        throw new Error('Could not fetch reviews');
    }
    return response;
};
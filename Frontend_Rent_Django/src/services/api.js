// src/services/api.js

const API_BASE = import.meta.env.VITE_API_BASE_URL;

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(method, url, data) {
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
  };

  if (data !== undefined) {
    options.body = JSON.stringify(data);
  }

  const res = await fetch(`${API_BASE}${url}`, options);

  let body = null;
  try {
    body = await res.json();
  } catch (e) {
    body = null;
  }

  if (!res.ok) {
    const message =
      body?.detail || body?.message || body?.error || res.statusText;
    const error = new Error(message);
    error.status = res.status;
    error.body = body;
    throw error;
  }

  return body;
}

export async function refreshToken() {
  const refresh = localStorage.getItem("refresh");
  const data = await request("POST", "/auth/token/refresh/", { refresh });
  if (data?.access) {
    localStorage.setItem("token", data.access);
  }
  return data?.access;
}

// ---------- AUTH ----------
export async function login({ username, password }) {
  return await request("POST", "/auth/login/", { username, password });
}

export async function register({ username, email, password, password2, role }) {
  return await request("POST", "/auth/register/", {
    username,
    email,
    password,
    password2,
    role,
  });
}

export async function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("refresh");
}

export async function getMe() {
  try {
    return await request("GET", "/auth/me/");
  } catch (err) {
    if (err.status === 401) {
      await refreshToken();
      return await request("GET", "/auth/me/");
    }
    throw err;
  }
}

// ---------- LISTINGS ----------
export async function getListings({ sort = "date", page = 1 } = {}) {
  return await request(
    "GET",
    `/listings/?sort=${sort}&page=${page}`
  );
}

export async function getListingDetail(id) {
  return await request("GET", `/listings/${id}/`);
}

export async function createListing(data) {
  return await request("POST", "/listings/", data);
}

export async function updateListing(id, data) {
  return await request("PUT", `/listings/${id}/`, data);
}

// ---------- BOOKINGS ----------
export async function getBookings() {
  return await request("GET", "/bookings/");
}

export async function createBooking(data) {
  return await request("POST", "/bookings/", data);
}

export async function updateBookingStatus(id, status) {
  return await request("PATCH", `/bookings/${id}/status/`, { status });
}

// ---------- DEFAULT API WRAPPER ----------
export const api = {
  get: (url) => request("GET", url),

  post: (url, data) => request("POST", url, data),

  put: (url, data) => request("PUT", url, data),

  patch: (url, data) => request("PATCH", url, data),

  delete: (url) => request("DELETE", url),
};

export const apiBase = API_BASE;


// ---------- REVIEWS ----------
export const createReview = async (listingId, reviewData) => {
  const response = await api.post(`/reviews/`, {
    listing: listingId,
    ...reviewData,
  });

  if (response?.detail) {
    // Ошибка от сервера — например, аренда не завершена
    throw new Error(response.detail);
  }

  return response;
};

export const getReviews = async (listingId) => {
  const response = await api.get(`/reviews/?listing=${listingId}`);
  return response?.results || response;
};


// ---------- ANALYTICS ----------
export async function getSearchHistory() {
  return await request("GET", "/analytics/search-history/");
}

export async function getPopularListings() {
  return await request("GET", "/analytics/popular-listings/");
  }
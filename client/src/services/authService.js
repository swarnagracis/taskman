const API_URL = "http://localhost:5000/api/auth";

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function handleResponse(res) {
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
}

export const loginUser = async (email, password) => {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return handleResponse(res);
};

export const registerUser = async (name, email, password) => {
  const res = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  return handleResponse(res);
};

export const getProfile = async () => {
  const res = await fetch(`${API_URL}/me`, { headers: getAuthHeaders() });
  const data = await handleResponse(res);
  return data.user;
};

export const updateProfile = async (updates) => {
  const res = await fetch(`${API_URL}/profile`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(updates),
  });
  const data = await handleResponse(res);
  return data.user;
};

export const changePassword = async (currentPassword, newPassword) => {
  const res = await fetch(`${API_URL}/change-password`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ currentPassword, newPassword }),
  });
  return handleResponse(res);
};

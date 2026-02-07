const API_URL = "http://localhost:5000/api/tasks";

async function handleResponse(res) {
  const data = await res.json();
  if (!res.ok) {
    const err = new Error(data.message || "Request failed");
    err.status = res.status;
    throw err;
  }
  return data;
}

export const getMyTasks = async () => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/my`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(res);
};

export const createTask = async (title, description) => {
  const token = localStorage.getItem("token");
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title, description }),
  });
  return handleResponse(res);
};

export const updateTask = async (id, updates) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updates),
  });
  return handleResponse(res);
};

export const getTaskStats = async () => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/stats`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(res);
};

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export async function createRoom(movieDeck) {
  const res = await fetch(`${API_URL}/api/rooms`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ movieDeck }),
  });
  return res.json();
}

export async function getRoom(code) {
  const res = await fetch(`${API_URL}/api/rooms/${code}`);
  if (!res.ok) return null;
  return res.json();
}

export async function getUserLikes(userId) {
  const res = await fetch(`${API_URL}/api/rooms/likes/${userId}`);
  if (!res.ok) return { movies: {} };
  return res.json();
}
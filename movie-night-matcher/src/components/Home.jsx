import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createRoom, getRoom } from "../api";
import { fetchMoviesByGenre, fetchGenres } from "../tmdb";
import { getUserId, getUserName, setUserName } from "../user";

export default function Home() {
  const [joinCode, setJoinCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(getUserName());
  const [genres, setGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchGenres().then(setGenres);
  }, []);

  function toggleGenre(id) {
    setSelectedGenres((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
    );
  }

  async function handleCreateRoom() {
    setLoading(true);
    setUserName(name);
    getUserId();
    const movies = await fetchMoviesByGenre(selectedGenres);
    const movieDeck = movies.map((m) => m.id);
    const room = await createRoom(movieDeck);
    setLoading(false);
    navigate(`/room/${room.code}`);
  }

  async function handleJoinRoom() {
    if (!joinCode.trim()) return;
    setLoading(true);
    setUserName(name);
    const code = joinCode.trim().toUpperCase();
    const room = await getRoom(code);
    setLoading(false);

    if (!room) {
      alert("Room not found. Double check the code.");
      return;
    }
    navigate(`/room/${code}`);
  }

  return (
    <div className="reel-frame">
      <div className="top-nav">
        <span className="brand">MOVIE<span> IO</span></span>
      </div>

      <div className="home-screen">
        <p className="eyebrow">Tonight's showing</p>
        <h1 className="marquee-title">MOVIE NIGHT MATCHER</h1>
        <p className="tagline">Swipe with friends. Land on one film everyone will actually watch.</p>
        <input
  className="ticket-input"
  style={{ width: "100%", marginBottom: 20, letterSpacing: "1px" }}
  placeholder="Your name (optional)"
  maxLength={20}
  value={name}
  onChange={(e) => setName(e.target.value)}
/>
      
        {genres.length > 0 && (
          <div className="genre-section">
            <h4>Pick genres (optional)</h4>
            <div className="genre-chips">
              {genres.slice(0, 10).map((g) => (
                <button
                  key={g.id}
                  className={`genre-chip ${selectedGenres.includes(g.id) ? "active" : ""}`}
                  onClick={() => toggleGenre(g.id)}
                >
                  {g.name}
                </button>
              ))}
            </div>
          </div>
        )}

        <button className="btn-primary" onClick={handleCreateRoom} disabled={loading}>
          {loading ? "Setting up..." : "Start a Room"}
        </button>

        <div className="divider"><span>or join with a code</span></div>

        <div className="join-row">
          <input
            className="ticket-input"
            placeholder="ABCDE"
            maxLength={5}
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
          />
          <button className="btn-secondary" onClick={handleJoinRoom} disabled={loading}>
            Join
          </button>
        </div>
      </div>
    </div>
  );
}
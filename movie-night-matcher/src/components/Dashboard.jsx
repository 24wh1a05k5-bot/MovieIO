import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserLikes } from "../api";
import { getUserId } from "../user";

export default function Dashboard() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const uid = getUserId();
      const data = await getUserLikes(uid);
      const list = Object.values(data.movies || {}).sort((a, b) => b.likedAt - a.likedAt);
      setMovies(list);
      setLoading(false);
    })();
  }, []);

  return (
    <div className="reel-frame">
      <div className="top-nav">
        <span className="brand" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
  MOV<span>IO</span>
</span>
        <button className="history-btn" onClick={() => navigate("/start")}>
          + New Room
        </button>
      </div>

      <div className="room-screen">
        <p className="eyebrow">Your collection</p>
        <h1 className="marquee-title" style={{ fontSize: 32 }}>LIKED MOVIES</h1>

        {loading ? (
          <p className="loading-text">Loading your likes...</p>
        ) : movies.length === 0 ? (
          <p className="empty-sub" style={{ textAlign: "center", marginTop: 40 }}>
            You haven't liked any movies yet. Join a room and start swiping!
          </p>
        ) : (
          <div className="liked-grid">
            {movies.map((m) => (
              <div
                key={m.id}
                className="liked-item"
                onClick={() => navigate(`/movie/${m.id}`)}
              >
                {m.poster ? <img src={m.poster} alt={m.title} /> : null}
                <p>{m.title}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
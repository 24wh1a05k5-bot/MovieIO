import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUserLikes } from "../api";
import { getUserId } from "../user";
import { fetchWatchInfo, fetchMovieDetails } from "../tmdb";

export default function MovieDetail() {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const [allMovies, setAllMovies] = useState([]);
  const [movie, setMovie] = useState(null);
  const [overview, setOverview] = useState("");
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [slideClass, setSlideClass] = useState("slide-in");

  const touchStartX = useRef(null);
  const mouseStartX = useRef(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const uid = getUserId();
      const data = await getUserLikes(uid);
      const list = Object.values(data.movies || {}).sort((a, b) => b.likedAt - a.likedAt);
      setAllMovies(list);

      const found = list.find((m) => String(m.id) === String(movieId));
      setMovie(found || null);

      if (found) {
        const info = await fetchWatchInfo(found.id);
        setProviders(info.providers);

        if (found.overview && found.overview.trim().length > 0) {
          setOverview(found.overview);
        } else {
          const details = await fetchMovieDetails(found.id);
          setOverview(details.overview || "No summary available.");
        }
      }
      setLoading(false);
      setSlideClass("slide-in");
    })();
  }, [movieId]);

  const currentIndex = allMovies.findIndex((m) => String(m.id) === String(movieId));
  const prevMovie = currentIndex > 0 ? allMovies[currentIndex - 1] : null;
  const nextMovie = currentIndex >= 0 && currentIndex < allMovies.length - 1 ? allMovies[currentIndex + 1] : null;

  function goNext() {
    if (nextMovie) navigate(`/movie/${nextMovie.id}`);
  }
  function goPrev() {
    if (prevMovie) navigate(`/movie/${prevMovie.id}`);
  }

  useEffect(() => {
    function handleKey(e) {
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prevMovie, nextMovie]);

  // Touch swipe (phones / touchpads that emit touch events)
  function handleTouchStart(e) {
    touchStartX.current = e.touches[0].clientX;
  }
  function handleTouchEnd(e) {
    if (touchStartX.current === null) return;
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(diff) > 50) {
      if (diff < 0) goNext();
      else goPrev();
    }
    touchStartX.current = null;
  }

  // Mouse drag swipe (desktop, click-and-drag across the poster)
  function handleMouseDown(e) {
    mouseStartX.current = e.clientX;
  }
  function handleMouseUp(e) {
    if (mouseStartX.current === null) return;
    const diff = e.clientX - mouseStartX.current;
    if (Math.abs(diff) > 50) {
      if (diff < 0) goNext();
      else goPrev();
    }
    mouseStartX.current = null;
  }

  if (loading) return <p className="loading-text">Loading...</p>;
  if (!movie) return <p className="loading-text">Movie not found in your likes.</p>;

  return (
    <div className="reel-frame">
      <div className="top-nav">
        <span className="brand" onClick={() => navigate("/dashboard")} style={{ cursor: "pointer" }}>
  MOV<span>IO</span>
</span>
        <button className="history-btn" onClick={() => navigate("/dashboard")}>
          Back
        </button>
      </div>

      <div className="room-screen">
        <div
          className={`swipe-poster-wrap ${slideClass}`}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
        >
          {movie.poster ? <img src={movie.poster} alt={movie.title} draggable={false} /> : null}
        </div>

        <p className="gallery-position">
          {allMovies.length > 0 ? `${currentIndex + 1} of ${allMovies.length}` : ""}
        </p>
        <p className="keyboard-hint" style={{ marginTop: -6, marginBottom: 18 }}>
          swipe, drag, or use arrow keys to browse
        </p>

        <h1 className="marquee-title" style={{ fontSize: 30, textAlign: "left", margin: "10px 0 6px" }}>
          {movie.title}
        </h1>
        <p className="detail-meta">
          {movie.year} &nbsp;·&nbsp; Rating {movie.rating ? movie.rating.toFixed(1) : "N/A"}
        </p>

        {movie.roomCode ? (
          <div className="ticket-badge" style={{ margin: "16px 0" }}>
            <div className="ticket-text">
              <span className="ticket-label">LIKED IN ROOM</span>
              <span className="ticket-code">{movie.roomCode}</span>
            </div>
          </div>
        ) : null}

        <h4 style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: 2, color: "var(--text-dim)", textTransform: "uppercase", margin: "20px 0 8px" }}>
          Story
        </h4>
        <p className="detail-overview">{overview}</p>

        <h4 style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: 2, color: "var(--text-dim)", textTransform: "uppercase", margin: "20px 0 8px" }}>
          Where to Watch
        </h4>
        {providers.length === 0 ? (
          <p className="empty-sub">No streaming info available right now.</p>
        ) : (
          <div className="provider-row" style={{ justifyContent: "flex-start" }}>
            {providers.map((p) => (
              <img
                key={p.provider_id}
                src={`https://image.tmdb.org/t/p/w92${p.logo_path}`}
                alt={p.provider_name}
                title={p.provider_name}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
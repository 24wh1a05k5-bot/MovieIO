import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import socket from "../socket";
import { fetchPopularMovies, fetchWatchInfo } from "../tmdb";
import { getUserId, getUserName } from "../user";
import SwipeCard from "./SwipeCard";
import MatchModal from "./MatchModal";

export default function Room() {
  const { roomCode } = useParams();
  const navigate = useNavigate();
  const uid = useRef(getUserId());

  const [roomData, setRoomData] = useState(null);
  const [movies, setMovies] = useState([]);
  const [index, setIndex] = useState(0);
  const [matchedMovie, setMatchedMovie] = useState(null);
  const [providers, setProviders] = useState([]);
  const [justwatchLink, setJustwatchLink] = useState(null);
  const [toast, setToast] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showVotes, setShowVotes] = useState(false);
  const [page, setPage] = useState(1);

  const dismissedMatches = useRef(new Set());

  useEffect(() => {
    fetchPopularMovies(1).then(setMovies);
    socket.emit("join-room", { roomCode, userId: uid.current, name: getUserName() || "Guest" });

    function handleUpdate(room) {
      setRoomData(room);
    }
    socket.on("room-update", handleUpdate);
    return () => socket.off("room-update", handleUpdate);
  }, [roomCode]);

  useEffect(() => {
    if (!roomData || movies.length === 0) return;
    const latest = roomData.matches && roomData.matches[roomData.matches.length - 1];
    if (!latest) return;
    if (dismissedMatches.current.has(latest)) return;

    const movieObj = movies.find((m) => m.id === latest);
    if (movieObj && (!matchedMovie || matchedMovie.id !== movieObj.id)) {
      setMatchedMovie(movieObj);
      fetchWatchInfo(movieObj.id).then((result) => {
        setProviders(result.providers);
        setJustwatchLink(result.link);
      });
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2200);
    }
  }, [roomData, movies, matchedMovie]);

  useEffect(() => {
    function handleKey(e) {
      if (matchedMovie || showHistory || showVotes) return;
      if (e.key === "ArrowRight") handleSwipe(true);
      if (e.key === "ArrowLeft") handleSwipe(false);
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [movies, index, matchedMovie, showHistory, showVotes]);

  function handleSwipe(liked) {
    const currentMovie = movies[index];
    setIndex((i) => i + 1);
    if (!currentMovie) return;

    socket.emit("swipe", {
      roomCode,
      userId: uid.current,
      movie: currentMovie,
      liked,
    });
  }

  function handleCloseMatch() {
    if (matchedMovie) dismissedMatches.current.add(matchedMovie.id);
    setMatchedMovie(null);
  }

  async function handleLoadMore() {
    const nextPage = page + 1;
    const more = await fetchPopularMovies(nextPage);
    setMovies((prev) => [...prev, ...more]);
    setPage(nextPage);
  }

  function handleCopyCode() {
    navigator.clipboard.writeText(roomCode);
    setToast("Room code copied!");
    setTimeout(() => setToast(""), 2000);
  }

  if (!roomData) return <p className="loading-text">Loading room...</p>;

  const currentMovie = movies[index];
  const progress = movies.length ? Math.min((index / movies.length) * 100, 100) : 0;
  const matchedMovies = (roomData.matches || [])
    .map((id) => movies.find((m) => m.id === id))
    .filter(Boolean);

  // Build a name lookup and a vote tally from everyone's individual likes
  const nameByUserId = {};
  (roomData.members || []).forEach((m) => {
    nameByUserId[m.userId] = m.name && m.name.trim() ? m.name : "Guest";
  });

  const tally = {};
  Object.entries(roomData.likes || {}).forEach(([userId, movieIds]) => {
    (movieIds || []).forEach((movieId) => {
      if (!tally[movieId]) tally[movieId] = { count: 0, names: [] };
      tally[movieId].count += 1;
      tally[movieId].names.push(nameByUserId[userId] || "Guest");
    });
  });

  const voteList = Object.entries(tally)
    .map(([movieId, info]) => ({
      movie: movies.find((m) => m.id === Number(movieId)),
      count: info.count,
      names: info.names,
    }))
    .filter((v) => v.movie)
    .sort((a, b) => b.count - a.count);

  return (
    <div className="reel-frame">
      <div className="top-nav">
        <span className="brand" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
          MOVIE<span> NIGHT</span>
        </span>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="history-btn" onClick={() => navigate("/dashboard")}>
            My Likes
          </button>
        </div>
      </div>

      <div className="room-screen">
        <div className="room-header">
          <div className="ticket-badge">
            <div className="ticket-text">
              <span className="ticket-label">ADMIT ROOM</span>
              <span className="ticket-code">{roomCode}</span>
            </div>
            <button className="copy-btn" onClick={handleCopyCode}>
              Copy
            </button>
          </div>
          <div className="live-indicator">
            <span className="live-dot" />
            {roomData.members.map((m) => m.name || "Guest").join(", ")}
          </div>
        </div>

        <div className="room-tab-row">
          <button className="tab-btn" onClick={() => setShowVotes(true)}>
            Votes ({voteList.length})
          </button>
          <button className="tab-btn" onClick={() => setShowHistory(true)}>
            Matches ({matchedMovies.length})
          </button>
        </div>

        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>

        {currentMovie ? (
          <SwipeCard movie={currentMovie} onSwipe={handleSwipe} />
        ) : (
          <div className="empty-text">
            <p>No more movies to swipe on right now.</p>
            <button className="btn-secondary" onClick={handleLoadMore}>
              Load More Movies
            </button>
          </div>
        )}

        {matchedMovie ? (
          <MatchModal
            movie={matchedMovie}
            providers={providers}
            justwatchLink={justwatchLink}
            onClose={handleCloseMatch}
          />
        ) : null}

        {showVotes ? (
          <div className="match-overlay" onClick={() => setShowVotes(false)}>
            <div className="history-modal" onClick={(e) => e.stopPropagation()}>
              <h3>Room Votes</h3>
              {voteList.length === 0 ? (
                <p className="empty-sub">No likes yet — start swiping!</p>
              ) : (
                <div className="votes-list">
                  {voteList.map((v) => (
                    <div key={v.movie.id} className="votes-item">
                      {v.movie.poster ? <img src={v.movie.poster} alt={v.movie.title} /> : null}
                      <div className="votes-info">
                        <p className="votes-title">{v.movie.title}</p>
                        <p className="votes-names">Liked by: {v.names.join(", ")}</p>
                      </div>
                      <span className="votes-count-badge">{v.count}</span>
                    </div>
                  ))}
                </div>
              )}
              <button className="close-btn" onClick={() => setShowVotes(false)}>
                Close
              </button>
            </div>
          </div>
        ) : null}

        {showHistory ? (
          <div className="match-overlay" onClick={() => setShowHistory(false)}>
            <div className="history-modal" onClick={(e) => e.stopPropagation()}>
              <h3>Matches so far</h3>
              {matchedMovies.length === 0 ? (
                <p className="empty-sub">No matches yet - keep swiping!</p>
              ) : (
                <div className="history-grid">
                  {matchedMovies.map((m) => (
                    <div key={m.id} className="history-item">
                      {m.poster ? <img src={m.poster} alt={m.title} /> : null}
                      <p>{m.title}</p>
                    </div>
                  ))}
                </div>
              )}
              <button className="close-btn" onClick={() => setShowHistory(false)}>
                Close
              </button>
            </div>
          </div>
        ) : null}

        {showConfetti ? (
          <div className="confetti-wrap">
            {Array.from({ length: 30 }).map((_, i) => (
              <span
                key={i}
                className="confetti-piece"
                style={{
                  left: `${Math.random() * 100}%`,
                  background: ["#e8b94b", "#e0483f", "#f5efe0", "#6ee08c"][i % 4],
                  animationDuration: `${1.5 + Math.random() * 1.2}s`,
                  animationDelay: `${Math.random() * 0.3}s`,
                }}
              />
            ))}
          </div>
        ) : null}

        {toast ? <div className="toast">{toast}</div> : null}
      </div>
    </div>
  );
}
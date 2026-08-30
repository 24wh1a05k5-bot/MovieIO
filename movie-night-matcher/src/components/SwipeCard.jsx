import { useRef } from "react";

export default function SwipeCard({ movie, onSwipe }) {
  const cardRef = useRef(null);

  if (!movie) return null;

  function handleMouseMove(e) {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateY = ((x - centerX) / centerX) * 8;
    const rotateX = -((y - centerY) / centerY) * 8;
    card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  }

  function handleMouseLeave() {
    const card = cardRef.current;
    if (card) card.style.transform = "rotateX(0deg) rotateY(0deg)";
  }

  return (
    <>
      <div className="card-3d-wrap" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
        <div className="ticket-card" ref={cardRef}>
          <div className="poster-wrap">
            {movie.poster ? (
              <img src={movie.poster} alt={movie.title} className="poster" />
            ) : (
              <div className="no-poster">No poster available</div>
            )}
          </div>
          <div className="tear-line" />
          <div className="ticket-stub-info">
            <p className="movie-title">{movie.title}</p>
            <p className="movie-meta">{movie.year} · ★ {movie.rating.toFixed(1)}</p>
            <p className="movie-overview">{movie.overview.slice(0, 120)}...</p>
          </div>
        </div>
      </div>

      <div className="swipe-buttons">
        <button className="skip-btn" onClick={() => onSwipe(false)}>Skip</button>
        <button className="like-btn" onClick={() => onSwipe(true)}>Like</button>
      </div>
    </>
  );
}
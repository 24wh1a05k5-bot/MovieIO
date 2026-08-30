import { useNavigate } from "react-router-dom";

const FEATURES = [
  {
    title: "Swipe Together",
    desc: "Everyone in the room swipes through the exact same deck of movies, live.",
  },
  {
    title: "Instant Match",
    desc: "The second everyone likes the same movie, it's revealed to the whole group at once.",
  },
  {
    title: "Stream Ready",
    desc: "See exactly where a matched movie is streaming, or find nearby showtimes if it's still in theaters.",
  },
];

const STEPS = [
  { number: "01", title: "Open a Room", desc: "Start a room and get a 5-letter ticket code, or join one a friend already opened." },
  { number: "02", title: "Swipe the Deck", desc: "Everyone sees the same lineup of movies and swipes left to skip, right to like." },
  { number: "03", title: "Get Matched", desc: "The instant your whole group likes the same title, it's announced to everyone at once." },
];

export default function Intro() {
  const navigate = useNavigate();

  return (
    <div className="reel-frame">
      <div className="top-nav">
        <span className="brand">MOVIE<span> IO</span></span>
        <button className="history-btn" onClick={() => navigate("/dashboard")}>
          My Likes
        </button>
      </div>

      <div className="home-screen">
        <p className="eyebrow">Now Playing</p>
        <h1 className="marquee-title">MOVIE NIGHT MATCHER</h1>

        <div className="bulb-strip">
          {Array.from({ length: 14 }).map((_, i) => (
            <span key={i} className="bulb" style={{ animationDelay: `${i * 0.12}s` }} />
          ))}
        </div>

        <p className="tagline">
          Stop scrolling for 40 minutes trying to agree on something. Swipe with your
          friends and land on one movie everyone actually wants to watch.
        </p>

        <button className="btn-primary" onClick={() => navigate("/start")}>
          Get Started
        </button>

        <div className="feature-grid">
          {FEATURES.map((f) => (
            <div className="feature-card" key={f.title}>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="how-it-works">
          <h4 className="section-label">How It Works</h4>
          <div className="steps-list">
            {STEPS.map((s) => (
              <div className="step-row" key={s.number}>
                <span className="step-number">{s.number}</span>
                <div>
                  <p className="step-title">{s.title}</p>
                  <p className="step-desc">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        
      </div>
    </div>
  );
}
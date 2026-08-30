import { useEffect, useState } from "react";
import { fetchMovieDetails, getProviderUrl } from "../tmdb";

export default function MatchModal({ movie, providers, justwatchLink, onClose }) {
  const [details, setDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  useEffect(() => {
    if (providers.length === 0 && movie) {
      setLoadingDetails(true);
      fetchMovieDetails(movie.id).then((d) => {
        setDetails(d);
        setLoadingDetails(false);
      });
    }
  }, [movie, providers]);

  if (!movie) return null;

  function handleShare() {
    navigator.clipboard.writeText("We matched on " + movie.title + " for movie night!");
    setShareCopied(true);
    setTimeout(function () {
      setShareCopied(false);
    }, 1500);
  }

  function handleTrailer() {
    var url =
      "https://www.youtube.com/results?search_query=" +
      encodeURIComponent(movie.title + " official trailer");
    window.open(url, "_blank");
  }

  var daysSinceRelease = null;
  if (details && details.release_date) {
    daysSinceRelease = Math.floor(
      (Date.now() - new Date(details.release_date)) / (1000 * 60 * 60 * 24)
    );
  }
  var isUpcoming =
    details && details.release_date && new Date(details.release_date) > new Date();
  var isRecentTheatrical =
    daysSinceRelease !== null && daysSinceRelease >= 0 && daysSinceRelease <= 60;

  var releaseDateUrl =
    "https://www.google.com/search?q=" +
    encodeURIComponent(movie.title + " release date");
  var showtimesUrl =
    "https://www.google.com/search?q=" +
    encodeURIComponent("book tickets " + movie.title);
  var searchOptionsUrl =
    "https://www.google.com/search?q=" +
    encodeURIComponent("watch " + movie.title + " online");

  return (
    <div className="match-overlay">
      <div className="match-modal">
        <p className="match-eyebrow">Now Showing</p>
        <h2>IT'S A MATCH</h2>
        <p className="match-movie-name">{movie.title}</p>
        {movie.poster ? (
          <img src={movie.poster} className="match-poster" alt={movie.title} />
        ) : null}

        <h4>Where to Watch</h4>

        {providers.length > 0 ? (
          <div>
            <div className="provider-row">
              {providers.map(function (p) {
                var logoUrl = "https://image.tmdb.org/t/p/w92" + p.logo_path;
                var providerPageUrl = getProviderUrl(p.provider_name, movie.title);
                return (
                  <a
                    key={p.provider_id}
                    href={providerPageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={"Open " + p.provider_name}
                  >
                    <img src={logoUrl} alt={p.provider_name} />
                  </a>
                );
              })}
            </div>
            {justwatchLink ? (
              <a
                href={justwatchLink}
                target="_blank"
                rel="noopener noreferrer"
                className="see-all-link"
              >
                See all streaming options
              </a>
            ) : null}
          </div>
        ) : loadingDetails ? (
          <p className="availability-text">Checking availability...</p>
        ) : isUpcoming ? (
          <div className="availability-box">
            <p className="availability-text">
              Not released yet - coming {details.release_date}
            </p>
            <a
              className="theater-link"
              href={releaseDateUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Track Release
            </a>
          </div>
        ) : isRecentTheatrical ? (
          <div className="availability-box">
            <p className="availability-text">Likely still in theaters</p>
            <a
              className="theater-link"
              href={showtimesUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Find Showtimes
            </a>
          </div>
        ) : (
          <div className="availability-box">
            <p className="availability-text">
              Not currently available to stream in your region.
            </p>
            <a
              className="theater-link"
              href={searchOptionsUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Search Options
            </a>
          </div>
        )}

        <div className="match-actions-row">
          <button className="small-btn" onClick={handleTrailer}>
            Trailer
          </button>
          <button className="small-btn" onClick={handleShare}>
            {shareCopied ? "Copied!" : "Share"}
          </button>
        </div>

        <button className="close-btn" onClick={onClose}>
          Keep Swiping
        </button>
      </div>
    </div>
  );
}
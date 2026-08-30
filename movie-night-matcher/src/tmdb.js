const TOKEN = import.meta.env.VITE_TMDB_TOKEN;
const BASE_URL = "https://api.themoviedb.org/3";

const headers = {
  Authorization: `Bearer ${TOKEN}`,
  "Content-Type": "application/json",
};

export async function fetchPopularMovies(page = 1) {
  const res = await fetch(`${BASE_URL}/movie/popular?page=${page}`, { headers });
  const data = await res.json();
  return data.results.map((m) => ({
    id: m.id,
    title: m.title,
    overview: m.overview,
    poster: m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : null,
    rating: m.vote_average,
    year: m.release_date ? m.release_date.slice(0, 4) : "N/A",
  }));
}

export async function fetchWatchProviders(movieId) {
  const res = await fetch(`${BASE_URL}/movie/${movieId}/watch/providers`, { headers });
  const data = await res.json();
  const region = data.results?.IN;
  if (!region) return [];
  return region.flatrate || region.rent || region.buy || [];
}

export async function fetchGenres() {
  try {
    const res = await fetch(`${BASE_URL}/genre/movie/list`, { headers });
    const data = await res.json();
    return data.genres || [];
  } catch (err) {
    return [];
  }
}

export async function fetchMoviesByGenre(genreIds = [], page = 1) {
  if (genreIds.length === 0) return fetchPopularMovies(page);
  const genreParam = genreIds.join(",");
  const res = await fetch(
    `${BASE_URL}/discover/movie?with_genres=${genreParam}&sort_by=popularity.desc&page=${page}`,
    { headers }
  );
  const data = await res.json();
  return data.results.map((m) => ({
    id: m.id,
    title: m.title,
    overview: m.overview,
    poster: m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : null,
    rating: m.vote_average,
    year: m.release_date ? m.release_date.slice(0, 4) : "N/A",
  }));
}
export async function fetchWatchInfo(movieId) {
  const res = await fetch(`${BASE_URL}/movie/${movieId}/watch/providers`, { headers });
  const data = await res.json();
  const region = data.results?.IN;
  if (!region) return { providers: [], link: null };
  const providers = region.flatrate || region.rent || region.buy || [];
  return { providers, link: region.link || null };
}

export async function fetchMovieDetails(movieId) {
  const res = await fetch(`${BASE_URL}/movie/${movieId}`, { headers });
  return res.json();
}

// Best-effort search URLs since TMDB doesn't give exact per-title deep links for free
const PROVIDER_LINKS = {
  "Netflix": (t) => `https://www.netflix.com/search?q=${encodeURIComponent(t)}`,
  "Amazon Prime Video": (t) => `https://www.primevideo.com/search/ref=atv_nb_sr?phrase=${encodeURIComponent(t)}`,
  "Disney Plus": (t) => `https://www.hotstar.com/in/search?q=${encodeURIComponent(t)}`,
  "Disney+ Hotstar": (t) => `https://www.hotstar.com/in/search?q=${encodeURIComponent(t)}`,
  "JioCinema": (t) => `https://www.jiocinema.com/search/${encodeURIComponent(t)}`,
  "Apple TV": (t) => `https://tv.apple.com/search?term=${encodeURIComponent(t)}`,
  "Apple TV Plus": (t) => `https://tv.apple.com/search?term=${encodeURIComponent(t)}`,
  "Google Play Movies": (t) => `https://play.google.com/store/search?q=${encodeURIComponent(t)}&c=movies`,
  "YouTube": (t) => `https://www.youtube.com/results?search_query=${encodeURIComponent(t + " full movie")}`,
  "Sony LIV": (t) => `https://www.sonyliv.com/search?q=${encodeURIComponent(t)}`,
  "ZEE5": (t) => `https://www.zee5.com/search?q=${encodeURIComponent(t)}`,
};

export function getProviderUrl(providerName, movieTitle) {
  const fn = PROVIDER_LINKS[providerName];
  if (fn) return fn(movieTitle);
  return `https://www.google.com/search?q=${encodeURIComponent("watch " + movieTitle + " on " + providerName)}`;
}
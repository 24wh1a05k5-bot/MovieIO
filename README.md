# 🎬 MOVIO

**MOVIO** is a movie night app that helps you and your friends pick something to watch together. Create a room, swipe through movies, match on picks, and build a personal collection of everything you've liked — with a smooth, gallery-style browsing experience.

---

## ✨ Features

- **Room-based movie nights** — create or join a room with friends using a room code
- **Swipe to like/pass** — quickly go through movie suggestions
- **Match detection** — see when everyone in the room likes the same movie
- **Personal likes collection** — a dashboard of every movie you've liked, with poster grid view
- **Movie detail view** — full synopsis, rating, and where-to-watch streaming providers (powered by TMDB)
- **Gallery-style browsing** — swipe, drag, or use arrow keys to move between liked movies, just like flipping through photos on your phone
- **Keyboard navigation** — left/right arrow keys move between movies on the detail page
- **Responsive, animated UI** — subtle transitions and a clean dark theme throughout

---

## 🛠️ Tech Stack

- **Frontend:** React, React Router
- **Styling:** Custom CSS (dark theme, CSS variables for theming)
- **Movie data:** [TMDB API](https://www.themoviedb.org/documentation/api) for movie details, overviews, and streaming providers
- **State/Data:** Backend API for storing rooms, likes, and matches (see `/src/api.js`)

---

## 📂 Project Structure

```
src/
  components/
    Dashboard.jsx      # Grid of all movies the user has liked
    MovieDetail.jsx     # Full movie detail + swipeable gallery navigation
    MatchModal.jsx       # Shown when a match happens in a room
    ...
  api.js                 # Backend API calls (likes, rooms, users)
  tmdb.js                # TMDB API integration (details, watch providers)
  user.js                 # Local user identity helper
  index.css               # Global styles and theme
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn
- A TMDB API key ([get one here](https://www.themoviedb.org/settings/api))

### Installation

```bash
git clone https://github.com/your-username/movio.git
cd movio
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```
VITE_TMDB_API_KEY=your_tmdb_api_key_here
VITE_API_BASE_URL=your_backend_url_here
```

### Run locally

```bash
npm run dev
```

The app will be available at `http://localhost:5173` (or whichever port your dev server uses).

### Build for production

```bash
npm run build
```

---

## 🎮 Usage

1. Start or join a room with friends using a shared room code
2. Swipe through movie suggestions — like or pass
3. When everyone in the room likes the same movie, get a match
4. Head to your **Dashboard** to see every movie you've liked
5. Click any movie to see full details, streaming availability, and swipe/drag/arrow-key through the rest of your collection

---

## 📌 Roadmap / Ideas

- Group chat or reactions within a room
- Filters by genre, streaming platform, or release year
- Shareable match results
- User profiles and watch history

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🙌 Acknowledgements

- Movie data and streaming provider info from [TMDB](https://www.themoviedb.org/)
- Built as a personal project to make movie nights with friends easier

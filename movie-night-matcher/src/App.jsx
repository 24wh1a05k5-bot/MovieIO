import { BrowserRouter, Routes, Route } from "react-router-dom";
import Intro from "./components/Intro";
import Home from "./components/Home";
import Room from "./components/Room";
import Dashboard from "./components/Dashboard";
import MovieDetail from "./components/MovieDetail";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Intro />} />
        <Route path="/start" element={<Home />} />
        <Route path="/room/:roomCode" element={<Room />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/movie/:movieId" element={<MovieDetail />} />
      </Routes>
    </BrowserRouter>
  );
}
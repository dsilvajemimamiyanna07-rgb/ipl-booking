import { useState } from "react";
import { Navbar } from "./components/Navbar";
import { MatchCard } from "./components/MatchCard";
import { BookingForm } from "./components/BookingForm";
import { Footer } from "./components/Footer";
import "./App.css";

const INITIAL_MATCHES = [
  {
    id: 1,
    team1: "RCB",
    team2: "CSK",
    date: "Apr 12, 2026",
    venue: "M. Chinnaswamy Stadium",
    price: 1500,
    availableSeats: 25,
  },
  {
    id: 2,
    team1: "MI",
    team2: "KKR",
    date: "Apr 15, 2026",
    venue: "Wankhede Stadium",
    price: 1200,
    availableSeats: 15,
  },
  {
    id: 3,
    team1: "DC",
    team2: "RR",
    date: "Apr 18, 2026",
    venue: "Arun Jaitley Stadium",
    price: 1000,
    availableSeats: 0,
  },
];

function App() {
  const [matches, setMatches] = useState(INITIAL_MATCHES);
  const [selectedMatchId, setSelectedMatchId] = useState(null);
  const [totalBookings, setTotalBookings] = useState(0);

  const selectedMatch = matches.find((m) => m.id === selectedMatchId) || null;

  function handleConfirmBooking(matchId, bookedSeats) {
    setMatches((prevMatches) =>
      prevMatches.map((m) =>
        m.id === matchId
          ? { ...m, availableSeats: Math.max(0, m.availableSeats - bookedSeats) }
          : m
      )
    );
    setTotalBookings((prev) => prev + bookedSeats);
  }

  return (
    <div>
      <Navbar totalBookings={totalBookings} />

      <header className="hero">
        <div className="hero-badge-box" aria-hidden="true">
          <svg width="88" height="88" viewBox="0 0 96 96" fill="none">
            <circle cx="48" cy="48" r="44" fill="rgba(255,255,255,0.12)" stroke="#fbbf24" strokeWidth="2.5" />
            <ellipse cx="48" cy="54" rx="28" ry="13" stroke="#ffffff" strokeWidth="2.5" fill="rgba(15,23,42,0.45)" />
            <path
              d="M26 52C33 59 63 59 70 52"
              stroke="#fbbf24"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <circle cx="48" cy="33" r="10" fill="#f59e0b" stroke="#ffffff" strokeWidth="2" />
            <path d="M43 29L53 37M53 29L43 37" stroke="#090d16" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
        <span className="hero-tag">T20 STADIUM PASS</span>
        <h1>IPL Match Ticket Booking</h1>
        <p>Select an upcoming match below to book your seats.</p>
      </header>

      <main className="matches-section">
        <h2>Upcoming Matches</h2>
        <div className="matches-grid">
          {matches.map((match) => (
            <MatchCard
              key={match.id}
              match={match}
              onSelectMatch={(clickedMatch) => setSelectedMatchId(clickedMatch.id)}
            />
          ))}
        </div>

        <BookingForm
          selectedMatch={selectedMatch}
          onConfirmBooking={handleConfirmBooking}
        />
      </main>

      <Footer />
    </div>
  );
}

export default App;
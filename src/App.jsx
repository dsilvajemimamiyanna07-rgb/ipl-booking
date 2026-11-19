import { useEffect, useState } from "react";
import { supabase } from "./supabase";
import { Navbar } from "./components/Navbar";
import { MatchCard } from "./components/MatchCard";
import { BookingForm } from "./components/BookingForm";
import { Footer } from "./components/Footer";
import "./App.css";

function App() {
  const [matches, setMatches] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [selectedMatchId, setSelectedMatchId] = useState(null);
  const [totalBookings, setTotalBookings] = useState(0);
  const [activeView, setActiveView] = useState("booking");
  const [loading, setLoading] = useState(true);

  async function fetchMatches() {
    const { data, error } = await supabase
      .from("matches")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      console.error("Error fetching matches:", error.message);
    } else if (data) {
      setMatches(
        data.map((row) => ({
          ...row,
          availableSeats: row.available_seats,
        }))
      );
    }
    setLoading(false);
  }

  async function fetchBookings() {
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      console.error("Error fetching bookings:", error.message);
      return;
    }

    if (data) {
      setBookings(data);
      const sum = data.reduce(
        (acc, row) => acc + (row.seats_booked ?? row.tickets ?? 0),
        0
      );
      setTotalBookings(sum);
    }
  }

  useEffect(() => {
    fetchMatches();
    fetchBookings();

    const channel = supabase
      .channel("matches-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "matches" },
        () => {
          fetchMatches();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const selectedMatch = matches.find((m) => m.id === selectedMatchId) || null;

  async function handleConfirmBooking(matchId, bookedSeats, customerName = "Guest") {
    const targetMatch = matches.find((m) => m.id === matchId);
    if (!targetMatch) return;

    const newSeats = Math.max(0, targetMatch.availableSeats - bookedSeats);
    const matchTitle = targetMatch.title || targetMatch.name || "IPL Match";
    const seatPrice = Number(targetMatch.price) || 0;
    const totalPrice = bookedSeats * seatPrice;

    const { error: bookingError } = await supabase.from("bookings").insert([
      {
        match_id: matchId,
        match_title: matchTitle,
        user_name: customerName,
        customer_name: customerName,
        seats_booked: bookedSeats,
        tickets: bookedSeats,
        total_price: totalPrice,
      },
    ]);

    if (bookingError) {
      console.error("Booking insert error:", bookingError.message);
      return;
    }

    const { error: updateError } = await supabase
      .from("matches")
      .update({ available_seats: newSeats })
      .eq("id", matchId);

    if (updateError) {
      console.error("Seats update error:", updateError.message);
      return;
    }

    setTotalBookings((prev) => prev + bookedSeats);
    fetchMatches();
    fetchBookings();
  }

  return (
    <div>
      <Navbar
        totalBookings={totalBookings}
        onNavigate={(view) => setActiveView(view)}
      />

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
        {activeView === "history" ? (
          <section className="booking-history-section">
            <h2>Booking History</h2>
            {bookings.length === 0 ? (
              <p>No bookings found yet.</p>
            ) : (
              <div className="history-list">
                {bookings.map((item, idx) => {
                  const name = item.customer_name || item.user_name || "Guest";
                  const seats = item.seats_booked ?? item.tickets ?? 1;
                  const matchName = item.match_title || `Match #${item.match_id}`;
                  const amount = item.total_price ?? 0;

                  return (
                    <div key={item.id ?? idx} className="history-card">
                      <h3>{matchName}</h3>
                      <p><strong>Booked By:</strong> {name}</p>
                      <p><strong>Seats:</strong> {seats}</p>
                      <p><strong>Total Price:</strong> ₹{amount}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        ) : (
          <>
            <h2>Upcoming Matches</h2>
            {loading ? (
              <p>Loading matches from Supabase...</p>
            ) : (
              <div className="matches-grid">
                {matches.map((match) => (
                  <MatchCard
                    key={match.id}
                    match={match}
                    onSelectMatch={(clickedMatch) => setSelectedMatchId(clickedMatch.id)}
                  />
                ))}
              </div>
            )}

            <BookingForm
              selectedMatch={selectedMatch}
              onConfirmBooking={handleConfirmBooking}
            />
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;
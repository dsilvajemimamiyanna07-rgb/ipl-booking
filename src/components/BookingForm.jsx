import { useState } from "react";

export function BookingForm({ selectedMatch, onConfirmBooking }) {
  const [name, setName] = useState("");
  const [seats, setSeats] = useState(1);
  const [message, setMessage] = useState("");

  if (!selectedMatch) {
    return <p>Click "Book Tickets" on a match card to start booking.</p>;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const count = Number(seats);

    if (!name.trim()) {
      setMessage("Please enter your name.");
      return;
    }

    if (count < 1 || count > selectedMatch.availableSeats) {
      setMessage(`Enter between 1 and ${selectedMatch.availableSeats} seats.`);
      return;
    }

    onConfirmBooking(selectedMatch.id, count, name.trim());
    setMessage(
      `Booked ${count} seat(s) for ${selectedMatch.team1} vs ${selectedMatch.team2} (${name.trim()}).`
    );
    setName("");
    setSeats(1);
  }

  return (
    <form className="booking-form" onSubmit={handleSubmit}>
      <h3>
        Book: {selectedMatch.team1} vs {selectedMatch.team2}
      </h3>

      <label>
        Name:
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
        />
      </label>

      <label>
        Seats (Max {selectedMatch.availableSeats}):
        <input
          type="number"
          min="1"
          max={selectedMatch.availableSeats}
          value={seats}
          onChange={(e) => setSeats(e.target.value)}
        />
      </label>

      <button type="submit" disabled={selectedMatch.availableSeats === 0}>
        Confirm Booking
      </button>

      {message && <p>{message}</p>}
    </form>
  );
}
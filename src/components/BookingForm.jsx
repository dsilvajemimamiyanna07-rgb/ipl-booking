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
    if (seats < 1 || seats > selectedMatch.availableSeats) {
      setMessage(`Enter between 1 and ${selectedMatch.availableSeats} seats.`);
      return;
    }
    onConfirmBooking(selectedMatch.id, seats);
    setMessage(`Booked ${seats} seat(s) for ${selectedMatch.team1} vs ${selectedMatch.team2} (${name}).`);
    setName("");
    setSeats(1);
  }

  return (
    <form className="booking-form" onSubmit={handleSubmit}>
      <h3>Book: {selectedMatch.team1} vs {selectedMatch.team2}</h3>
      <label>
        Name:
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </label>
      <label>
        Seats (Max {selectedMatch.availableSeats}):
        <input
          type="number"
          min="1"
          max={selectedMatch.availableSeats}
          value={seats}
          onChange={(e) => setSeats(Number(e.target.value))}
        />
      </label>
      <button type="submit">Confirm Booking</button>
      {message && <p>{message}</p>}
    </form>
  );
}
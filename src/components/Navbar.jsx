export function Navbar({ totalBookings, onNavigate }) {
  return (
    <nav className="navbar">
      <div className="brand">IPL TICKETS</div>
      <div className="nav-links">
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            onNavigate?.("booking");
          }}
        >
          Home
        </a>
        <a
          href="#matches"
          onClick={(e) => {
            e.preventDefault();
            onNavigate?.("booking");
          }}
        >
          Matches
        </a>
        <a
          href="#history"
          onClick={(e) => {
            e.preventDefault();
            onNavigate?.("history");
          }}
        >
          Booking History
        </a>
      </div>
      <div className="booking-badge">Bookings: {totalBookings}</div>
    </nav>
  );
}
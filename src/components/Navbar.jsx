export function Navbar({ totalBookings }) {
  return (
    <nav className="navbar">
      <div className="brand-logo">
        <a href="/">
          <span className="logo-icon" aria-hidden="true">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" fill="#f59e0b" />
              <path
                d="M7 9.5L17 14.5M17 9.5L7 14.5"
                stroke="#090d16"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <span className="logo-text">
            IPL <span>TICKETS</span>
          </span>
        </a>
      </div>

      <div className="nav-links">
        <a href="/">Home</a>
        <a href="/matches">Matches</a>
        <a href="/history">Booking History</a>
      </div>

      <div className="nav-bookings">
        <p>Bookings: <strong>{totalBookings}</strong></p>
      </div>
    </nav>
  );
}
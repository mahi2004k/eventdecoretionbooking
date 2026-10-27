import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const TIME_SLOTS = ["Morning", "Afternoon", "Evening", "Night"];

const BookingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Event name received from the previous page
  const eventName = location.state?.selectedEvent || "General Decor";

  // Today's date as YYYY-MM-DD
  const todayDate = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    eventDate: "",
    timeSlot: "Morning",
    venueAddress: "",
    eventName: eventName,
  });

  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");
    setIsError(false);
    try {
      const response = await fetch("http://localhost:8080/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setDone(true);
        setMessage("Your booking is confirmed. We'll contact you shortly. Taking you back to the home page...");
        setTimeout(() => navigate("/"), 3000);
      } else {
        setIsError(true);
        setMessage("We couldn't submit your booking. Check your details and try again.");
      }
    } catch (err) {
      console.error("Error:", err);
      setIsError(true);
      setMessage("We couldn't reach the server. Check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bk-root">
      <style>{css}</style>

      <div className="bk-layout">
        <aside className="bk-summary">
          <h1>Complete your booking</h1>
          <p>Tell us about your event and we'll take it from here.</p>

          <dl>
            <div>
              <dt>Package</dt>
              <dd>{formData.eventName}</dd>
            </div>
            <div>
              <dt>Booking date</dt>
              <dd>{todayDate}</dd>
            </div>
            {formData.eventDate && (
              <div>
                <dt>Event date</dt>
                <dd>{formData.eventDate}, {formData.timeSlot.toLowerCase()}</dd>
              </div>
            )}
          </dl>
        </aside>

        <main className="bk-card">
          {message && (
            <div className={`bk-alert ${isError ? "is-error" : "is-ok"}`} role={isError ? "alert" : "status"}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <fieldset disabled={done || submitting}>
              <h2>Your details</h2>
              <div className="bk-grid">
                <label className="bk-field">
                  <span>Your name</span>
                  <input
                    type="text"
                    name="customerName"
                    required
                    autoComplete="name"
                    value={formData.customerName}
                    onChange={handleChange}
                    className="bk-input"
                  />
                </label>

                <label className="bk-field">
                  <span>Phone number</span>
                  <input
                    type="tel"
                    name="customerPhone"
                    required
                    autoComplete="tel"
                    value={formData.customerPhone}
                    onChange={handleChange}
                    className="bk-input"
                  />
                </label>

                <label className="bk-field bk-wide">
                  <span>Email address</span>
                  <input
                    type="email"
                    name="customerEmail"
                    required
                    autoComplete="email"
                    value={formData.customerEmail}
                    onChange={handleChange}
                    className="bk-input"
                  />
                </label>
              </div>

              <h2>Event details</h2>
              <div className="bk-grid">
                <label className="bk-field">
                  <span>Event date</span>
                  <input
                    type="date"
                    name="eventDate"
                    min={todayDate}
                    required
                    value={formData.eventDate}
                    onChange={handleChange}
                    className="bk-input"
                  />
                </label>

                <label className="bk-field">
                  <span>Time slot</span>
                  <select name="timeSlot" value={formData.timeSlot} onChange={handleChange} className="bk-input">
                    {TIME_SLOTS.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </label>

                <label className="bk-field bk-wide">
                  <span>Venue address</span>
                  <textarea
                    name="venueAddress"
                    rows="3"
                    required
                    value={formData.venueAddress}
                    onChange={handleChange}
                    className="bk-input"
                  />
                </label>
              </div>

              <button type="submit" className="bk-btn">
                {submitting ? "Booking..." : done ? "Booked" : "Confirm booking"}
              </button>
            </fieldset>
          </form>
        </main>
      </div>
    </div>
  );
};

const css = `
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');

.bk-root {
  --plum: #2e1a3b;
  --plum-soft: #44295a;
  --marigold: #f2a900;
  --marigold-dark: #b97f00;
  --bg: #f6f4f8;
  --line: #e7e2ec;
  --text: #25202b;
  --muted: #6f677a;
  min-height: 100vh;
  padding: 40px 24px 64px;
  background: var(--bg);
  color: var(--text);
  font-family: 'Manrope', system-ui, -apple-system, 'Segoe UI', sans-serif;
  font-size: 15px;
  line-height: 1.5;
}
.bk-root *, .bk-root *::before, .bk-root *::after { box-sizing: border-box; }
.bk-root h1, .bk-root h2, .bk-root p, .bk-root dl, .bk-root dd { margin: 0; }
.bk-root button { font-family: inherit; cursor: pointer; }
.bk-root :focus-visible { outline: 2px solid var(--marigold); outline-offset: 2px; }

.bk-layout {
  max-width: 980px; margin: 0 auto;
  display: grid; grid-template-columns: 320px 1fr; gap: 24px; align-items: start;
}

/* Summary panel */
.bk-summary {
  background: var(--plum); color: #f6eefb; border-radius: 16px; padding: 32px 28px;
  position: sticky; top: 24px;
}
.bk-summary h1 { font-size: 26px; font-weight: 800; line-height: 1.15; letter-spacing: -.015em; margin-bottom: 8px; }
.bk-summary p { color: #cdbddc; margin-bottom: 28px; }
.bk-summary dl > div { padding: 14px 0; border-top: 1px solid rgba(255,255,255,.14); }
.bk-summary dt { font-size: 13px; color: #b9a8c8; font-weight: 600; }
.bk-summary dd { font-size: 17px; font-weight: 700; margin-top: 2px; }

/* Form card */
.bk-card { background: #fff; border: 1px solid var(--line); border-radius: 16px; padding: 32px; }
.bk-card fieldset { border: 0; margin: 0; padding: 0; min-width: 0; }
.bk-card h2 { font-size: 17px; font-weight: 800; margin-bottom: 16px; }
.bk-card h2:not(:first-child) { margin-top: 28px; }

.bk-alert { padding: 12px 16px; border-radius: 10px; margin-bottom: 24px; font-weight: 600; }
.bk-alert.is-ok { background: #d9f2e3; border: 1px solid #a9dcbd; color: #19683a; }
.bk-alert.is-error { background: #fdf0ee; border: 1px solid #efc4be; color: #96281b; }

.bk-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.bk-wide { grid-column: 1 / -1; }
.bk-field { display: flex; flex-direction: column; gap: 6px; }
.bk-field > span { font-size: 13px; font-weight: 700; }
.bk-input {
  width: 100%; padding: 11px 12px; border: 1px solid var(--line); border-radius: 8px;
  background: #fff; color: var(--text); font: inherit; font-size: 15px;
}
.bk-input:hover { border-color: #cfc6d8; }
.bk-input:focus { border-color: var(--marigold-dark); outline: 2px solid rgba(242,169,0,.35); outline-offset: 0; }
textarea.bk-input { resize: vertical; }

.bk-btn {
  width: 100%; margin-top: 28px; padding: 14px;
  background: var(--marigold); color: var(--plum);
  border: 0; border-radius: 10px; font-size: 16px; font-weight: 800; transition: background .15s;
}
.bk-btn:hover:not(:disabled) { background: #ffbb1f; }
.bk-btn:disabled { opacity: .65; cursor: not-allowed; }
fieldset:disabled .bk-btn { opacity: .65; cursor: not-allowed; }

@media (max-width: 800px) {
  .bk-layout { grid-template-columns: 1fr; }
  .bk-summary { position: static; padding: 24px; }
  .bk-summary p { margin-bottom: 16px; }
}
@media (max-width: 520px) {
  .bk-root { padding: 20px 14px 48px; }
  .bk-card { padding: 22px 18px; }
  .bk-grid { grid-template-columns: 1fr; }
}
@media (prefers-reduced-motion: reduce) {
  .bk-root * { transition: none !important; }
}
`;

export default BookingPage;
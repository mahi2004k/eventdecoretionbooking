import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Externalized API Base URL (Fallback to http://localhost:8080 for local dev)
// Note: If using Vite, replace process.env.REACT_APP_API_BASE_URL with import.meta.env.VITE_API_URL
const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";
const API = `${API_BASE}/api`;

const EMPTY_EVENT = { id: null, name: "", category: "", description: "", detailedDescription: "", price: "" };
const STATUSES = ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"];

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("bookings");
  const [bookings, setBookings] = useState([]);
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  const [eventData, setEventData] = useState(EMPTY_EVENT);
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [videoFile, setVideoFile] = useState(null);

  const [editingEvent, setEditingEvent] = useState(null);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchBookings = () => {
    fetch(`${API}/bookings`)
      .then((res) => res.json())
      .then(setBookings)
      .catch((err) => console.error("Error fetching bookings:", err));
  };

  const fetchEvents = () => {
    fetch(`${API}/events`)
      .then((res) => res.json())
      .then(setEvents)
      .catch((err) => console.error("Error fetching events:", err));
  };

  useEffect(() => {
    fetchBookings();
    fetchEvents();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await fetch(`${API}/bookings/${id}/status?status=${newStatus}`, { method: "PATCH" });
      if (res.ok) {
        setBookings(bookings.map((b) => (b.id === id ? { ...b, status: newStatus } : b)));
      }
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const handleDeleteEvent = async (eventId, eventName) => {
    if (window.confirm(`Are you sure you want to delete "${eventName}"?`)) {
      try {
        const res = await fetch(`${API}/events/${eventId}`, { method: "DELETE" });
        if (res.ok) {
          setMessage(`Event "${eventName}" deleted successfully.`);
          setEvents(events.filter((ev) => ev.id !== eventId));
        } else {
          alert("Failed to delete event.");
        }
      } catch (err) {
        console.error("Error deleting event:", err);
      }
    }
  };

  const resetFiles = () => {
    setCoverImageFile(null);
    setGalleryFiles([]);
    setVideoFile(null);
  };

  const handleStartEdit = (event) => {
    setEditingEvent(event);
    setEventData({
      id: event.id,
      name: event.name,
      category: event.category,
      description: event.description,
      detailedDescription: event.detailedDescription || "",
      price: event.price || "",
    });
    resetFiles();
  };

  const handleEventSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("name", eventData.name);
      formData.append("category", eventData.category);
      formData.append("description", eventData.description);
      formData.append("detailedDescription", eventData.detailedDescription || "");
      formData.append("price", eventData.price || 0);

      if (coverImageFile) formData.append("coverImage", coverImageFile);
      for (let i = 0; i < galleryFiles.length; i++) {
        formData.append("galleryImages", galleryFiles[i]);
      }
      if (videoFile) formData.append("videoFile", videoFile);

      const isEdit = !!editingEvent;
      const url = isEdit ? `${API}/events/${editingEvent.id}` : `${API}/events`;
      const res = await fetch(url, { method: isEdit ? "PUT" : "POST", body: formData });

      if (res.ok) {
        setMessage(isEdit ? "Event updated successfully!" : "New event created successfully!");
        setEventData(EMPTY_EVENT);
        resetFiles();
        setEditingEvent(null);
        fetchEvents();
        setActiveTab("manageEvents");
      } else {
        setMessage("Operation failed. Please check backend logs.");
      }
    } catch (err) {
      console.error("Error submitting event:", err);
      setMessage("Server error.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  const goTab = (tab) => {
    setActiveTab(tab);
    setEditingEvent(null);
    setMessage("");
    if (tab === "addEvent") {
      setEventData(EMPTY_EVENT);
      resetFiles();
    }
  };

  const statusClass = (s) => `ad-badge ad-status-${(s || "PENDING").toLowerCase()}`;
  const pendingCount = bookings.filter((b) => (b.status || "PENDING") === "PENDING").length;

  const tabs = [
    { key: "bookings", label: "Bookings", count: bookings.length },
    { key: "manageEvents", label: "Events", count: events.length },
    { key: "addEvent", label: editingEvent ? "Edit event" : "New event" },
  ];

  return (
    <div className="ad-root">
      <style>{css}</style>

      <aside className="ad-side">
        <div className="ad-brand">
          <span className="ad-brand-mark">D</span>
          <div>
            <strong>Decor Studio</strong>
            <small>Admin console</small>
          </div>
        </div>

        <nav className="ad-nav" aria-label="Dashboard sections">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => goTab(t.key)}
              className={`ad-nav-item ${activeTab === t.key ? "is-active" : ""}`}
              aria-current={activeTab === t.key ? "page" : undefined}
            >
              <span>{t.label}</span>
              {t.count !== undefined && <span className="ad-count">{t.count}</span>}
            </button>
          ))}
        </nav>

        <button onClick={handleLogout} className="ad-logout">Log out</button>
      </aside>

      <main className="ad-main">
        <header className="ad-head">
          <div>
            <h1>
              {activeTab === "bookings" && "Customer bookings"}
              {activeTab === "manageEvents" && "Event packages"}
              {activeTab === "addEvent" && (editingEvent ? `Edit ${editingEvent.name}` : "Add a new event package")}
            </h1>
            <p>
              {activeTab === "bookings" && `${bookings.length} total, ${pendingCount} waiting for confirmation`}
              {activeTab === "manageEvents" && "Edit or remove the packages shown to customers"}
              {activeTab === "addEvent" && "Fill in the details and upload photos or a setup video"}
            </p>
          </div>
          {activeTab !== "addEvent" && (
            <button className="ad-btn ad-btn-primary" onClick={() => goTab("addEvent")}>Add event</button>
          )}
        </header>

        {message && (
          <div className="ad-alert" role="status">
            <span>{message}</span>
            <button onClick={() => setMessage("")} aria-label="Dismiss">×</button>
          </div>
        )}

        {/* BOOKINGS */}
        {activeTab === "bookings" && (
          <section className="ad-card">
            {bookings.length === 0 ? (
              <div className="ad-empty">No bookings yet. New orders will appear here.</div>
            ) : (
              <div className="ad-table-wrap">
                <table className="ad-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Customer</th>
                      <th>Event</th>
                      <th>Date and time</th>
                      <th>Venue</th>
                      <th>Status</th>
                      <th>Update status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((b) => (
                      <tr key={b.id}>
                        <td className="ad-muted">#{b.id}</td>
                        <td>
                          <strong>{b.customerName}</strong>
                          <div className="ad-muted">{b.customerPhone}</div>
                        </td>
                        <td>{b.eventName}</td>
                        <td>
                          {b.eventDate}
                          <div className="ad-muted">{b.timeSlot}</div>
                        </td>
                        <td className="ad-venue">{b.venueAddress}</td>
                        <td><span className={statusClass(b.status)}>{b.status || "PENDING"}</span></td>
                        <td>
                          <select
                            value={b.status || "PENDING"}
                            onChange={(e) => handleStatusChange(b.id, e.target.value)}
                            className="ad-input ad-select"
                            aria-label={`Status for booking ${b.id}`}
                          >
                            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {/* MANAGE EVENTS */}
        {activeTab === "manageEvents" && (
          <section className="ad-card">
            {events.length === 0 ? (
              <div className="ad-empty">No events yet. Add your first package to get started.</div>
            ) : (
              <div className="ad-table-wrap">
                <table className="ad-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th className="ad-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {events.map((ev) => (
                      <tr key={ev.id}>
                        <td className="ad-muted">#{ev.id}</td>
                        <td><strong>{ev.name}</strong></td>
                        <td><span className="ad-badge ad-tag">{ev.category}</span></td>
                        <td>{ev.price ? `₹${Number(ev.price).toLocaleString("en-IN")}` : "N/A"}</td>
                        <td>
                          <div className="ad-actions">
                            <button
                              onClick={() => { handleStartEdit(ev); setActiveTab("addEvent"); }}
                              className="ad-btn ad-btn-ghost"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteEvent(ev.id, ev.name)}
                              className="ad-btn ad-btn-danger"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {/* ADD / EDIT */}
        {activeTab === "addEvent" && (
          <form onSubmit={handleEventSubmit} className="ad-form">
            <section className="ad-card ad-pad">
              <h2>Basic details</h2>
              <div className="ad-grid">
                <label className="ad-field">
                  <span>Event name</span>
                  <input
                    type="text"
                    required
                    className="ad-input"
                    value={eventData.name}
                    onChange={(e) => setEventData({ ...eventData, name: e.target.value })}
                  />
                </label>

                <label className="ad-field">
                  <span>Category</span>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Wedding, Birthday, Haldi"
                    className="ad-input"
                    value={eventData.category}
                    onChange={(e) => setEventData({ ...eventData, category: e.target.value })}
                  />
                </label>

                <label className="ad-field">
                  <span>Starting price (₹)</span>
                  <input
                    type="number"
                    min="0"
                    className="ad-input"
                    value={eventData.price}
                    onChange={(e) => setEventData({ ...eventData, price: e.target.value })}
                  />
                </label>
              </div>

              <label className="ad-field">
                <span>Short description</span>
                <textarea
                  rows="2"
                  required
                  className="ad-input"
                  value={eventData.description}
                  onChange={(e) => setEventData({ ...eventData, description: e.target.value })}
                />
              </label>

              <label className="ad-field">
                <span>Detailed description</span>
                <textarea
                  rows="4"
                  className="ad-input"
                  placeholder="Shown on the event details page"
                  value={eventData.detailedDescription}
                  onChange={(e) => setEventData({ ...eventData, detailedDescription: e.target.value })}
                />
              </label>
            </section>

            <section className="ad-card ad-pad">
              <h2>Media</h2>
              {editingEvent && <p className="ad-hint">Leave a field empty to keep the current file.</p>}
              <div className="ad-grid">
                <label className="ad-field">
                  <span>Cover image</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="ad-input ad-file"
                    onChange={(e) => setCoverImageFile(e.target.files[0])}
                  />
                </label>

                <label className="ad-field">
                  <span>Gallery images</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="ad-input ad-file"
                    onChange={(e) => setGalleryFiles(e.target.files)}
                  />
                </label>

                <label className="ad-field">
                  <span>Setup video</span>
                  <input
                    type="file"
                    accept="video/*"
                    className="ad-input ad-file"
                    onChange={(e) => setVideoFile(e.target.files[0])}
                  />
                </label>
              </div>
            </section>

            <div className="ad-form-actions">
              {editingEvent && (
                <button
                  type="button"
                  onClick={() => { setEditingEvent(null); setActiveTab("manageEvents"); }}
                  className="ad-btn ad-btn-ghost"
                >
                  Cancel
                </button>
              )}
              <button type="submit" disabled={submitting} className="ad-btn ad-btn-primary">
                {submitting ? "Saving..." : editingEvent ? "Save changes" : "Publish event"}
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
};

const css = `
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');

.ad-root {
  --plum: #2e1a3b;
  --plum-soft: #44295a;
  --marigold: #f2a900;
  --marigold-dark: #b97f00;
  --bg: #f6f4f8;
  --surface: #ffffff;
  --line: #e7e2ec;
  --text: #25202b;
  --muted: #6f677a;
  --danger: #c0392b;
  display: grid;
  grid-template-columns: 240px 1fr;
  min-height: 100vh;
  background: var(--bg);
  color: var(--text);
  font-family: 'Manrope', system-ui, -apple-system, 'Segoe UI', sans-serif;
  font-size: 15px;
  line-height: 1.5;
}
.ad-root *, .ad-root *::before, .ad-root *::after { box-sizing: border-box; }
.ad-root button { font-family: inherit; cursor: pointer; }
.ad-root :focus-visible { outline: 2px solid var(--marigold); outline-offset: 2px; }

/* Sidebar */
.ad-side {
  background: var(--plum);
  color: #f3ecf8;
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
  gap: 28px;
  position: sticky;
  top: 0;
  height: 100vh;
}
.ad-brand { display: flex; align-items: center; gap: 12px; padding: 0 8px; }
.ad-brand strong { display: block; font-size: 16px; font-weight: 800; }
.ad-brand small { color: #b9a8c8; font-size: 12px; }
.ad-brand-mark {
  width: 38px; height: 38px; border-radius: 10px;
  background: var(--marigold); color: var(--plum);
  display: grid; place-items: center; font-weight: 800; font-size: 18px;
}
.ad-nav { display: flex; flex-direction: column; gap: 4px; flex: 1; }
.ad-nav-item {
  display: flex; justify-content: space-between; align-items: center;
  background: transparent; border: 0; color: #d9cce6;
  padding: 11px 12px; border-radius: 8px; font-size: 14px; font-weight: 600; text-align: left;
  transition: background .15s, color .15s;
}
.ad-nav-item:hover { background: var(--plum-soft); color: #fff; }
.ad-nav-item.is-active { background: var(--plum-soft); color: #fff; box-shadow: inset 3px 0 0 var(--marigold); }
.ad-count {
  background: rgba(255,255,255,.12); border-radius: 999px;
  padding: 1px 9px; font-size: 12px; font-weight: 700;
}
.ad-logout {
  background: transparent; border: 1px solid rgba(255,255,255,.25); color: #e9def2;
  padding: 10px; border-radius: 8px; font-weight: 600; font-size: 14px;
}
.ad-logout:hover { background: rgba(255,255,255,.08); }

/* Main */
.ad-main { padding: 32px 40px 56px; min-width: 0; max-width: 1180px; width: 100%; }
.ad-head { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; margin-bottom: 24px; }
.ad-head h1 { margin: 0; font-size: 26px; font-weight: 800; letter-spacing: -.01em; }
.ad-head p { margin: 4px 0 0; color: var(--muted); }

.ad-alert {
  display: flex; justify-content: space-between; align-items: center; gap: 12px;
  background: #fff8e1; border: 1px solid #f3dd9a; color: #6b4e00;
  padding: 12px 16px; border-radius: 10px; margin-bottom: 20px; font-weight: 600;
}
.ad-alert button { background: none; border: 0; font-size: 20px; line-height: 1; color: inherit; }

.ad-card { background: var(--surface); border: 1px solid var(--line); border-radius: 12px; }
.ad-pad { padding: 24px; }
.ad-card h2 { margin: 0 0 16px; font-size: 16px; font-weight: 700; }
.ad-empty { padding: 56px 24px; text-align: center; color: var(--muted); }

/* Tables */
.ad-table-wrap { overflow-x: auto; }
.ad-table { width: 100%; border-collapse: collapse; font-size: 14px; }
.ad-table th {
  text-align: left; font-weight: 700; font-size: 13px; color: var(--muted);
  padding: 14px 16px; border-bottom: 1px solid var(--line); background: #faf8fc; white-space: nowrap;
}
.ad-table td { padding: 14px 16px; border-bottom: 1px solid var(--line); vertical-align: middle; }
.ad-table tbody tr:last-child td { border-bottom: 0; }
.ad-table tbody tr:hover { background: #fcfbfd; }
.ad-muted { color: var(--muted); font-size: 13px; }
.ad-venue { max-width: 220px; }
.ad-right { text-align: right !important; }

/* Badges */
.ad-badge { display: inline-block; padding: 3px 10px; border-radius: 999px; font-size: 12px; font-weight: 700; }
.ad-status-pending { background: #fff1cc; color: #8a5a00; }
.ad-status-confirmed { background: #d9f2e3; color: #19683a; }
.ad-status-completed { background: #dbeafe; color: #1e4f9a; }
.ad-status-cancelled { background: #fbe0dd; color: #96281b; }
.ad-tag { background: #eee6f5; color: var(--plum-soft); }

/* Buttons */
.ad-btn {
  border: 1px solid transparent; border-radius: 8px; padding: 9px 16px;
  font-size: 14px; font-weight: 700; transition: background .15s, border-color .15s;
}
.ad-btn:disabled { opacity: .6; cursor: not-allowed; }
.ad-btn-primary { background: var(--marigold); color: var(--plum); }
.ad-btn-primary:hover:not(:disabled) { background: #ffbb1f; }
.ad-btn-ghost { background: var(--surface); border-color: var(--line); color: var(--text); }
.ad-btn-ghost:hover { background: #f4f0f8; }
.ad-btn-danger { background: var(--surface); border-color: #efc4be; color: var(--danger); }
.ad-btn-danger:hover { background: #fdf0ee; }
.ad-actions { display: flex; gap: 8px; justify-content: flex-end; }

/* Form */
.ad-form { display: flex; flex-direction: column; gap: 20px; }
.ad-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px; margin-bottom: 16px; }
.ad-field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px; }
.ad-grid .ad-field { margin-bottom: 0; }
.ad-field > span { font-size: 13px; font-weight: 700; }
.ad-hint { margin: -8px 0 16px; color: var(--muted); font-size: 13px; }
.ad-input {
  width: 100%; padding: 10px 12px; border: 1px solid var(--line); border-radius: 8px;
  background: #fff; color: var(--text); font: inherit; font-size: 14px;
}
.ad-input:hover { border-color: #cfc6d8; }
.ad-input:focus { border-color: var(--marigold-dark); outline: 2px solid rgba(242,169,0,.35); outline-offset: 0; }
textarea.ad-input { resize: vertical; }
.ad-select { padding: 7px 10px; min-width: 140px; }
.ad-file { padding: 8px; background: #faf8fc; border-style: dashed; }
.ad-form-actions { display: flex; justify-content: flex-end; gap: 10px; }

/* Responsive */
@media (max-width: 860px) {
  .ad-root { grid-template-columns: 1fr; }
  .ad-side { position: static; height: auto; flex-direction: row; flex-wrap: wrap; align-items: center; padding: 14px 16px; gap: 12px; }
  .ad-nav { flex-direction: row; flex: 1 1 100%; order: 3; overflow-x: auto; }
  .ad-nav-item { white-space: nowrap; gap: 8px; }
  .ad-logout { margin-left: auto; padding: 8px 14px; }
  .ad-main { padding: 20px 16px 40px; }
  .ad-head { flex-direction: column; }
}
@media (prefers-reduced-motion: reduce) {
  .ad-root * { transition: none !important; }
}
`;

export default AdminDashboard;
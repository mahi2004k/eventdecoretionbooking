import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("bookings");
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();
  
  // New Event Form State
  const [newEvent, setNewEvent] = useState({
    name: "",
    category: "",
    description: "",
    coverImageUrl: "",
    active: true
  });
  const [message, setMessage] = useState("");

  // Fetch bookings on load
  useEffect(() => {
    fetch("http://localhost:8080/api/bookings")
      .then((res) => res.json())
      .then((data) => setBookings(data))
      .catch((err) => console.error("Error fetching bookings:", err));
  }, []);

  // Update Booking Status
  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await fetch(`http://localhost:8080/api/bookings/${id}/status?status=${newStatus}`, {
        method: "PATCH",
      });
      if (res.ok) {
        setBookings(bookings.map(b => b.id === id ? { ...b, status: newStatus } : b));
      }
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  // Handle Event Form Submission
  const handleEventSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8080/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEvent),
      });
      if (res.ok) {
        setMessage("New decoration event added successfully!");
        setNewEvent({ name: "", category: "", description: "", coverImageUrl: "", active: true });
      } else {
        setMessage("Failed to add event.");
      }
    } catch (err) {
      console.error("Error adding event:", err);
      setMessage("Server error.");
    }
  };

  const handleLogout = () => {
  localStorage.removeItem("adminToken");
  navigate("/admin/login");
};

  return (
    <div style={{ maxWidth: "1200px", margin: "30px auto", padding: "20px" }}>
      <h1>⚙️ Admin Dashboard</h1>
      <button onClick={handleLogout} style={{ background: "#ef4444", color: "white", border: "none", padding: "8px 16px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}>
        Logout
      </button>
      
      {/* Tabs */}
      <div style={{ display: "flex", gap: "10px", margin: "20px 0" }}>
        <button 
          onClick={() => setActiveTab("bookings")}
          style={{ padding: "10px 20px", background: activeTab === "bookings" ? "#2563eb" : "#e2e8f0", color: activeTab === "bookings" ? "#fff" : "#333", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}
        >
          Customer Bookings ({bookings.length})
        </button>
        <button 
          onClick={() => setActiveTab("addevent")}
          style={{ padding: "10px 20px", background: activeTab === "addevent" ? "#2563eb" : "#e2e8f0", color: activeTab === "addevent" ? "#fff" : "#333", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}
        >
          + Add New Event
        </button>
      </div>

      {/* TAB 1: BOOKINGS TABLE */}
      {activeTab === "bookings" && (
        <div style={{ background: "#fff", padding: "20px", borderRadius: "10px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", overflowX: "auto" }}>
          <h2>Incoming Booking Orders</h2>
          {bookings.length === 0 ? (
            <p>No bookings received yet.</p>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "15px", textAlign: "left" }}>
              <thead>
                <tr style={{ background: "#f1f5f9", borderBottom: "2px solid #cbd5e1" }}>
                  <th style={{ padding: "10px" }}>ID</th>
                  <th style={{ padding: "10px" }}>Customer</th>
                  <th style={{ padding: "10px" }}>Event</th>
                  <th style={{ padding: "10px" }}>Date & Time</th>
                  <th style={{ padding: "10px" }}>Venue</th>
                  <th style={{ padding: "10px" }}>Status</th>
                  <th style={{ padding: "10px" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id} style={{ borderBottom: "1px solid #e2e8f0" }}>
                    <td style={{ padding: "10px" }}>#{b.id}</td>
                    <td style={{ padding: "10px" }}>
                      <strong>{b.customerName}</strong><br />
                      <span style={{ fontSize: "12px", color: "#666" }}>{b.customerPhone}</span>
                    </td>
                    <td style={{ padding: "10px" }}>{b.eventName}</td>
                    <td style={{ padding: "10px" }}>{b.eventDate}<br /><small>{b.timeSlot}</small></td>
                    <td style={{ padding: "10px", maxWidth: "200px", fontSize: "13px" }}>{b.venueAddress}</td>
                    <td style={{ padding: "10px" }}>
                      <span style={{ 
                        padding: "4px 8px", borderRadius: "4px", fontSize: "12px", fontWeight: "bold",
                        background: b.status === "CONFIRMED" ? "#dcfce7" : b.status === "COMPLETED" ? "#e0f2fe" : "#fef9c3",
                        color: b.status === "CONFIRMED" ? "#166534" : b.status === "COMPLETED" ? "#0369a1" : "#854d0e"
                      }}>
                        {b.status || "PENDING"}
                      </span>
                    </td>
                    <td style={{ padding: "10px" }}>
                      <select 
                        value={b.status || "PENDING"} 
                        onChange={(e) => handleStatusChange(b.id, e.target.value)}
                        style={{ padding: "5px", borderRadius: "4px" }}
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="CONFIRMED">CONFIRMED</option>
                        <option value="COMPLETED">COMPLETED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* TAB 2: ADD EVENT FORM */}
      {activeTab === "addevent" && (
        <div style={{ background: "#fff", padding: "30px", borderRadius: "10px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", maxWidth: "600px" }}>
          <h2>Add New Decoration Package</h2>
          {message && <p style={{ color: "green", fontWeight: "bold" }}>{message}</p>}
          
          <form onSubmit={handleEventSubmit}>
            <div style={{ marginBottom: "15px" }}>
              <label>Event Name:</label>
              <input type="text" required value={newEvent.name} onChange={(e) => setNewEvent({...newEvent, name: e.target.value})} style={{ width: "100%", padding: "8px", marginTop: "5px" }} />
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label>Category:</label>
              <input type="text" required placeholder="e.g. Wedding, Birthday, Haldi" value={newEvent.category} onChange={(e) => setNewEvent({...newEvent, category: e.target.value})} style={{ width: "100%", padding: "8px", marginTop: "5px" }} />
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label>Description:</label>
              <textarea rows="3" required value={newEvent.description} onChange={(e) => setNewEvent({...newEvent, description: e.target.value})} style={{ width: "100%", padding: "8px", marginTop: "5px" }}></textarea>
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label>Cover Image URL:</label>
              <input type="url" placeholder="https://images.unsplash.com/..." value={newEvent.coverImageUrl} onChange={(e) => setNewEvent({...newEvent, coverImageUrl: e.target.value})} style={{ width: "100%", padding: "8px", marginTop: "5px" }} />
            </div>

            <button type="submit" style={{ background: "#2563eb", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold", width: "100%" }}>
              Save Event Package
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
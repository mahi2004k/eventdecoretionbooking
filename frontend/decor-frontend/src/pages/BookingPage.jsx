import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const BookingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Automatically receive event name from previous page
  const eventName = location.state?.selectedEvent || "General Decor";

  // Automatically get today's date YYYY-MM-DD
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8080/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage("Booking submitted successfully! WhatsApp alert triggered.");
        setTimeout(() => navigate("/"), 3000);
      } else {
        setMessage("Failed to submit booking.");
      }
    } catch (err) {
      console.error("Error:", err);
      setMessage("Server connection error.");
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "30px auto", padding: "20px", border: "1px solid #ccc", borderRadius: "8px", background: "#f9f9f9" }}>
      <h2>Complete Your Booking</h2>
      {message && <p style={{ color: "green", fontWeight: "bold" }}>{message}</p>}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "12px" }}>
          <label>Selected Event:</label>
          <input type="text" value={formData.eventName} readOnly disabled style={{ width: "100%", padding: "8px", background: "#e9ecef" }} />
        </div>

        <div style={{ marginBottom: "12px" }}>
          <label>Date of Booking:</label>
          <input type="date" value={todayDate} readOnly disabled style={{ width: "100%", padding: "8px", background: "#e9ecef" }} />
        </div>

        <div style={{ marginBottom: "12px" }}>
          <label>Your Name:</label>
          <input type="text" name="customerName" required value={formData.customerName} onChange={handleChange} style={{ width: "100%", padding: "8px" }} />
        </div>

        <div style={{ marginBottom: "12px" }}>
          <label>Phone Number:</label>
          <input type="tel" name="customerPhone" required value={formData.customerPhone} onChange={handleChange} style={{ width: "100%", padding: "8px" }} />
        </div>

        <div style={{ marginBottom: "12px" }}>
          <label>Email Address:</label>
          <input type="email" name="customerEmail" required value={formData.customerEmail} onChange={handleChange} style={{ width: "100%", padding: "8px" }} />
        </div>

        <div style={{ marginBottom: "12px" }}>
          <label>Event Date (When is the event?):</label>
          <input type="date" name="eventDate" min={todayDate} required value={formData.eventDate} onChange={handleChange} style={{ width: "100%", padding: "8px" }} />
        </div>

        <div style={{ marginBottom: "12px" }}>
          <label>Time Slot:</label>
          <select name="timeSlot" value={formData.timeSlot} onChange={handleChange} style={{ width: "100%", padding: "8px" }}>
            <option value="Morning">Morning</option>
            <option value="Afternoon">Afternoon</option>
            <option value="Evening">Evening</option>
            <option value="Night">Night</option>
          </select>
        </div>

        <div style={{ marginBottom: "12px" }}>
          <label>Venue Address:</label>
          <textarea name="venueAddress" rows="3" required value={formData.venueAddress} onChange={handleChange} style={{ width: "100%", padding: "8px" }}></textarea>
        </div>

        <button type="submit" style={{ width: "100%", padding: "10px", background: "#28a745", color: "white", border: "none", borderRadius: "5px", fontSize: "16px", cursor: "pointer" }}>
          Confirm & Book
        </button>
      </form>
    </div>
  );
};

export default BookingPage;
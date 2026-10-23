import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8080/api/events")
      .then((res) => res.json())
      .then((data) => {
        setEvents(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching events:", err);
        setLoading(false);
      });
  }, []);

  const handleBookClick = (eventName) => {
    navigate("/book", { state: { selectedEvent: eventName } });
  };

  if (loading) return <p style={{ textAlign: "center", marginTop: "40px" }}>Loading events...</p>;

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <h1 style={{ textAlign: "center" }}>Decoration Events Catalogue</h1>
      
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px", marginTop: "20px" }}>
        {events.map((event) => (
          <div key={event.id} style={{ border: "1px solid #ddd", borderRadius: "10px", overflow: "hidden", boxShadow: "0 4px 8px rgba(0,0,0,0.1)", background: "#fff" }}>
            <img 
              src={event.coverImageUrl || "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600"} 
              alt={event.name} 
              style={{ width: "100%", height: "200px", objectFit: "cover" }} 
            />

            <div style={{ padding: "15px" }}>
              <span style={{ fontSize: "12px", background: "#e0f2fe", color: "#0369a1", padding: "4px 8px", borderRadius: "4px", fontWeight: "bold" }}>
                {event.category}
              </span>
              <h3 style={{ margin: "10px 0 5px 0" }}>{event.name}</h3>
              <p style={{ color: "#666", fontSize: "14px", height: "40px", overflow: "hidden" }}>{event.description}</p>
              
              <button 
                onClick={() => handleBookClick(event.name)}
                style={{ background: "#2563eb", color: "white", border: "none", padding: "10px 15px", borderRadius: "6px", cursor: "pointer", width: "100%", marginTop: "10px", fontWeight: "bold" }}
              >
                Book Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
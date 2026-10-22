import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const EventsPage = () => {
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

  // Fallback image URL
  const defaultImage =
    "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600&auto=format&fit=crop";

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading events...</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-vh-100 py-5"
      style={{
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
      }}
    >
      <div className="container">
        {/* Header Section */}
        <div className="text-center mb-5">
          <h1
            className="fw-bold display-4 mb-2"
            style={{
              background: "linear-gradient(90deg, #4f46e5, #9333ea, #e11d48)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Decoration Events Catalogue
          </h1>
          <p className="text-secondary fs-5">
            Discover and book stunning decoration packages for your special occasions
          </p>
        </div>

        {/* Cards Grid */}
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {events.map((event) => (
            <div className="col" key={event.id}>
              <div
                className="card h-100 border-0 shadow-lg rounded-4 overflow-hidden position-relative event-card"
                style={{
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  background: "rgba(255, 255, 255, 0.95)",
                  backdropFilter: "blur(10px)",
                }}
              >
                {/* Event Image */}
                <div className="position-relative overflow-hidden" style={{ height: "220px" }}>
                  <img
                    src={event.coverImageUrl || defaultImage}
                    alt={event.name}
                    className="card-img-top w-100 h-100"
                    style={{ objectFit: "cover" }}
                    onError={(e) => {
                      if (e.target.src.endsWith(".jpg")) {
                        e.target.src = e.target.src.replace(".jpg", ".png");
                      } else if (e.target.src.endsWith(".png")) {
                        e.target.src = e.target.src.replace(".png", ".jpeg");
                      } else {
                        e.target.src = defaultImage;
                      }
                    }}
                  />
                  {/* Category Badge */}
                  <span
                    className="position-absolute top-0 end-0 m-3 px-3 py-1 text-white fw-semibold rounded-pill shadow-sm"
                    style={{
                      background: "linear-gradient(45deg, #06b6d4, #3b82f6)",
                      fontSize: "0.75rem",
                      letterSpacing: "0.5px",
                      textTransform: "uppercase",
                    }}
                  >
                    {event.category}
                  </span>
                </div>

                {/* Card Body */}
                <div className="card-body d-flex flex-column p-4">
                  <h4 className="card-title fw-bold text-dark mb-2">
                    {event.name}
                  </h4>
                  <p
                    className="card-text text-muted flex-grow-1"
                    style={{
                      fontSize: "0.9rem",
                      lineHeight: "1.5",
                      display: "-webkit-box",
                      WebkitLineClamp: "2",
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {event.description}
                  </p>

                  {/* Gradient Book Button */}
                  <button
                    onClick={() => handleBookClick(event.name)}
                    className="btn text-white fw-bold py-2 px-4 rounded-3 border-0 w-100 mt-3 shadow-sm gradient-btn"
                    style={{
                      background: "linear-gradient(90deg, #6366f1 0%, #a855f7 100%)",
                      transition: "opacity 0.2s ease",
                    }}
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Optional inline styles for hover interactions */}
      <style>{`
        .event-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 10px 10px -5px rgba(0, 0, 0, 0.04) !important;
        }
        .gradient-btn:hover {
          opacity: 0.9;
        }
      `}</style>
    </div>
  );
};

export default EventsPage;
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";
const defaultImage =
  "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600&auto=format&fit=crop";

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_BASE}/api/events`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setEvents(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching events:", err);
        setError("We couldn't load the events. Check that the backend server is running, then refresh.");
        setLoading(false);
      });
  }, []);

  const handleBookClick = (e, eventName) => {
    e.stopPropagation(); // Prevents the card click from firing when booking
    navigate("/book", { state: { selectedEvent: eventName } });
  };

  const handleCardClick = (eventId) => {
    navigate(`/events/${eventId}`);
  };

  // Handles full URLs vs relative backend paths
  const getImageUrl = (url) => {
    if (!url) return defaultImage;
    const cleanUrl = url.trim();
    if (cleanUrl.startsWith("http://") || cleanUrl.startsWith("https://") || cleanUrl.startsWith("data:")) {
      return cleanUrl;
    }
    const formattedPath = cleanUrl.startsWith("/") ? cleanUrl : `/${cleanUrl}`;
    return `${API_BASE}${formattedPath}`;
  };

  // Fallback through mixed image formats (.jpg, .png, .webp, .jpeg), then the default image
  const handleImageError = (e, currentUrl) => {
    console.warn(`Failed to load image at URL: ${currentUrl}`);

    if (currentUrl.endsWith(".jpg")) {
      e.target.src = currentUrl.replace(".jpg", ".png");
    } else if (currentUrl.endsWith(".png")) {
      e.target.src = currentUrl.replace(".png", ".webp");
    } else if (currentUrl.endsWith(".webp")) {
      e.target.src = currentUrl.replace(".webp", ".jpeg");
    } else if (currentUrl.endsWith(".jpeg")) {
      e.target.src = currentUrl.replace(".jpeg", ".jpg");
    } else if (e.target.src !== defaultImage) {
      e.target.src = defaultImage;
    }
  };

  const categories = ["All", ...new Set(events.map((ev) => ev.category).filter(Boolean))];
  const visibleEvents =
    activeCategory === "All" ? events : events.filter((ev) => ev.category === activeCategory);

  return (
    <div className="ev-root">
      <style>{css}</style>

      <header className="ev-hero">
        <div className="ev-wrap">
          <h1>Decoration packages for every celebration</h1>
          <p>Browse our work, then open any package to see its gallery, setup video and full details.</p>
        </div>
      </header>

      <main className="ev-wrap ev-main">
        {loading && (
          <div className="ev-grid" aria-busy="true" aria-label="Loading events">
            {[0, 1, 2].map((i) => (
              <div className="ev-skel" key={i}>
                <div className="ev-skel-img" />
                <div className="ev-skel-line" />
                <div className="ev-skel-line short" />
              </div>
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="ev-alert" role="alert">{error}</div>
        )}

        {!loading && !error && events.length === 0 && (
          <div className="ev-empty">
            <h2>No packages are listed yet</h2>
            <p>New decoration packages will appear here soon. Please check back later.</p>
          </div>
        )}

        {!loading && !error && events.length > 0 && (
          <>
            {categories.length > 2 && (
              <div className="ev-filters" role="group" aria-label="Filter by category">
                {categories.map((c) => (
                  <button
                    key={c}
                    onClick={() => setActiveCategory(c)}
                    className={`ev-chip ${activeCategory === c ? "is-active" : ""}`}
                    aria-pressed={activeCategory === c}
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}

            <div className="ev-grid">
              {visibleEvents.map((event) => (
                <article
                  className="ev-card"
                  key={event.id}
                  onClick={() => handleCardClick(event.id)}
                >
                  <div className="ev-media">
                    <img
                      src={getImageUrl(event.coverImageUrl)}
                      alt={event.name}
                      loading="lazy"
                      onError={(e) => handleImageError(e, e.target.src)}
                    />
                    {event.category && <span className="ev-tag">{event.category}</span>}
                  </div>

                  <div className="ev-body">
                    <h2>
                      <a
                        href={`/events/${event.id}`}
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleCardClick(event.id); }}
                      >
                        {event.name}
                      </a>
                    </h2>
                    <p>{event.description}</p>

                    <div className="ev-foot">
                      <div className="ev-price">
                        {event.price ? (
                          <>
                            <small>Starting at</small>
                            <strong>₹{Number(event.price).toLocaleString("en-IN")}</strong>
                          </>
                        ) : (
                          <small>Price on request</small>
                        )}
                      </div>
                      <button className="ev-btn" onClick={(e) => handleBookClick(e, event.name)}>
                        Book now
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

const css = `
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');

.ev-root {
  --plum: #2e1a3b;
  --plum-soft: #44295a;
  --marigold: #f2a900;
  --bg: #f6f4f8;
  --surface: #ffffff;
  --line: #e7e2ec;
  --text: #25202b;
  --muted: #6f677a;
  min-height: 100vh;
  background: var(--bg);
  color: var(--text);
  font-family: 'Manrope', system-ui, -apple-system, 'Segoe UI', sans-serif;
  font-size: 15px;
  line-height: 1.5;
}
.ev-root *, .ev-root *::before, .ev-root *::after { box-sizing: border-box; }
.ev-root button { font-family: inherit; cursor: pointer; }
.ev-root :focus-visible { outline: 2px solid var(--marigold); outline-offset: 2px; }
.ev-wrap { max-width: 1160px; margin: 0 auto; padding: 0 24px; }

/* Hero */
.ev-hero { background: var(--plum); color: #f6eefb; padding: 64px 0 72px; }
.ev-hero h1 {
  margin: 0 0 12px; max-width: 18ch;
  font-size: clamp(30px, 5vw, 48px); font-weight: 800; line-height: 1.12; letter-spacing: -.02em;
}
.ev-hero p { margin: 0; max-width: 52ch; font-size: 17px; color: #cdbddc; }

.ev-main { padding-top: 32px; padding-bottom: 64px; }

/* Filters */
.ev-filters { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 28px; }
.ev-chip {
  background: var(--surface); border: 1px solid var(--line); color: var(--text);
  padding: 7px 16px; border-radius: 999px; font-size: 14px; font-weight: 600;
  transition: background .15s, border-color .15s;
}
.ev-chip:hover { border-color: #cfc6d8; background: #f4f0f8; }
.ev-chip.is-active { background: var(--plum); border-color: var(--plum); color: #fff; }

/* Grid + cards */
.ev-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 24px; }
.ev-card {
  display: flex; flex-direction: column; overflow: hidden;
  background: var(--surface); border: 1px solid var(--line); border-radius: 14px;
  cursor: pointer; transition: border-color .2s, box-shadow .2s;
}
.ev-card:hover { border-color: #cdbddc; box-shadow: 0 12px 28px -14px rgba(46, 26, 59, .35); }
.ev-media { position: relative; aspect-ratio: 3 / 2; background: #eee6f5; overflow: hidden; }
.ev-media img { width: 100%; height: 100%; object-fit: cover; display: block; }
.ev-tag {
  position: absolute; top: 12px; left: 12px;
  background: var(--marigold); color: var(--plum);
  padding: 3px 12px; border-radius: 999px; font-size: 12px; font-weight: 800;
}
.ev-body { display: flex; flex-direction: column; flex: 1; padding: 20px; }
.ev-body h2 { margin: 0 0 6px; font-size: 19px; font-weight: 800; letter-spacing: -.01em; }
.ev-body h2 a { color: inherit; text-decoration: none; }
.ev-body h2 a:hover { text-decoration: underline; text-underline-offset: 3px; }
.ev-body p {
  margin: 0 0 18px; color: var(--muted); flex: 1;
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
}
.ev-foot {
  display: flex; justify-content: space-between; align-items: center; gap: 12px;
  padding-top: 16px; border-top: 1px solid var(--line);
}
.ev-price { display: flex; flex-direction: column; line-height: 1.25; }
.ev-price small { color: var(--muted); font-size: 12px; font-weight: 600; }
.ev-price strong { font-size: 18px; font-weight: 800; }
.ev-btn {
  background: var(--marigold); color: var(--plum); border: 0; border-radius: 8px;
  padding: 10px 18px; font-size: 14px; font-weight: 800; transition: background .15s;
}
.ev-btn:hover { background: #ffbb1f; }

/* States */
.ev-alert {
  background: #fdf0ee; border: 1px solid #efc4be; color: #96281b;
  padding: 14px 18px; border-radius: 10px; font-weight: 600;
}
.ev-empty {
  text-align: center; padding: 64px 24px; background: var(--surface);
  border: 1px dashed var(--line); border-radius: 14px;
}
.ev-empty h2 { margin: 0 0 6px; font-size: 20px; }
.ev-empty p { margin: 0; color: var(--muted); }

/* Loading skeleton */
.ev-skel { background: var(--surface); border: 1px solid var(--line); border-radius: 14px; padding-bottom: 20px; overflow: hidden; }
.ev-skel-img { aspect-ratio: 3 / 2; background: #eee6f5; margin-bottom: 18px; }
.ev-skel-line { height: 14px; margin: 0 20px 10px; border-radius: 6px; background: #eee6f5; }
.ev-skel-line.short { width: 40%; }

@media (max-width: 560px) {
  .ev-grid { grid-template-columns: 1fr; }
  .ev-hero { padding: 44px 0 52px; }
}
@media (prefers-reduced-motion: reduce) {
  .ev-root * { transition: none !important; }
}
`;

export default EventsPage;
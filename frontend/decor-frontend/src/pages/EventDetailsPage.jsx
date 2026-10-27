import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

// Externalized API Base URL (Fallback to http://localhost:8080 for local dev)
// Note: If using Vite, replace process.env.REACT_APP_API_BASE_URL with import.meta.env.VITE_API_URL
const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";

const defaultImage =
  "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&auto=format&fit=crop";

// Formats uploaded file paths vs external URLs
const getImageUrl = (url) => {
  if (!url) return defaultImage;
  const cleanUrl = url.trim();
  if (cleanUrl.startsWith("http://") || cleanUrl.startsWith("https://") || cleanUrl.startsWith("data:")) {
    return cleanUrl;
  }
  const formattedPath = cleanUrl.startsWith("/") ? cleanUrl : `/${cleanUrl}`;
  return `${API_BASE}${formattedPath}`;
};

const EventDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null); // Image shown in the main viewer

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`${API_BASE}/api/events/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setEvent(data);
        if (data.coverImageUrl) {
          setSelectedImage(getImageUrl(data.coverImageUrl));
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching event details:", err);
        setError("We couldn't load this event. Please try again in a moment.");
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="ed-root">
        <style>{css}</style>
        <div className="ed-wrap" aria-busy="true" aria-label="Loading event details">
          <div className="ed-skel-top" />
          <div className="ed-skel-hero">
            <div className="ed-skel-block" />
            <div className="ed-skel-block tall" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="ed-root">
        <style>{css}</style>
        <div className="ed-wrap ed-center">
          <div className="ed-alert" role="alert">{error || "We couldn't find this event."}</div>
          <button onClick={() => navigate("/events")} className="ed-btn ed-btn-primary">
            Back to all packages
          </button>
        </div>
      </div>
    );
  }

  const isVideoFile =
    event.videoUrl &&
    (event.videoUrl.endsWith(".mp4") ||
      event.videoUrl.endsWith(".webm") ||
      event.videoUrl.endsWith(".ogg") ||
      event.videoUrl.startsWith("/uploads/"));

  const mainImage = selectedImage || getImageUrl(event.coverImageUrl);
  const hasGallery = event.galleryImages && event.galleryImages.length > 0;

  return (
    <div className="ed-root">
      <style>{css}</style>

      <div className="ed-wrap">
        <button onClick={() => navigate("/events")} className="ed-back">
          ← All packages
        </button>

        {/* Hero: summary + main image */}
        <section className="ed-hero">
          <div className="ed-info">
            {event.category && <span className="ed-tag">{event.category}</span>}
            <h1>{event.name}</h1>
            <p className="ed-lead">{event.description}</p>

            {event.price > 0 && (
              <div className="ed-price">
                <small>Starting at</small>
                <strong>₹{Number(event.price).toLocaleString("en-IN")}</strong>
              </div>
            )}

            <button
              onClick={() => navigate("/book", { state: { selectedEvent: event.name } })}
              className="ed-btn ed-btn-primary ed-btn-lg"
            >
              Book this package
            </button>
          </div>

          <div className="ed-viewer">
            <img
              src={mainImage}
              alt={event.name}
              onError={(e) => { e.target.src = defaultImage; }}
            />
          </div>
        </section>

        {/* About */}
        {event.detailedDescription && (
          <section className="ed-card">
            <h2>About this package</h2>
            <p className="ed-about">{event.detailedDescription}</p>
          </section>
        )}

        {/* Gallery */}
        {hasGallery && (
          <section className="ed-card">
            <h2>Our work</h2>
            <p className="ed-hint">Select a photo to show it in the large viewer at the top.</p>

            <div className="ed-gallery">
              {event.galleryImages.map((imgUrl, index) => {
                const finalUrl = getImageUrl(imgUrl);
                const active = finalUrl === mainImage;
                return (
                  <button
                    key={index}
                    type="button"
                    className={`ed-thumb ${active ? "is-active" : ""}`}
                    onClick={() => {
                      setSelectedImage(finalUrl);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    aria-label={`Show photo ${index + 1} in the viewer`}
                    aria-pressed={active}
                  >
                    <img
                      src={finalUrl}
                      alt={`Work sample ${index + 1}`}
                      loading="lazy"
                      onError={(e) => { e.target.src = defaultImage; }}
                    />
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* Video */}
        {event.videoUrl && (
          <section className="ed-card">
            <h2>Setup video</h2>
            {isVideoFile ? (
              <div className="ed-video">
                <video controls src={getImageUrl(event.videoUrl)}>
                  Your browser does not support the video tag.
                </video>
              </div>
            ) : (
              <div className="ed-embed">
                <iframe src={event.videoUrl} title={`${event.name} video`} allowFullScreen />
              </div>
            )}
          </section>
        )}

        {/* Closing prompt */}
        <section className="ed-cta">
          <div>
            <h2>Like what you see?</h2>
            <p>Book this package and we'll get in touch to plan the details.</p>
          </div>
          <button
            onClick={() => navigate("/book", { state: { selectedEvent: event.name } })}
            className="ed-btn ed-btn-primary"
          >
            Book this package
          </button>
        </section>
      </div>
    </div>
  );
};

const css = `
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');

.ed-root {
  --plum: #2e1a3b;
  --plum-soft: #44295a;
  --marigold: #f2a900;
  --marigold-dark: #b97f00;
  --bg: #f6f4f8;
  --surface: #ffffff;
  --line: #e7e2ec;
  --text: #25202b;
  --muted: #6f677a;
  min-height: 100vh;
  padding: 28px 24px 72px;
  background: var(--bg);
  color: var(--text);
  font-family: 'Manrope', system-ui, -apple-system, 'Segoe UI', sans-serif;
  font-size: 16px;
  line-height: 1.6;
}
.ed-root *, .ed-root *::before, .ed-root *::after { box-sizing: border-box; }
.ed-root h1, .ed-root h2, .ed-root p { margin: 0; }
.ed-root button { font-family: inherit; cursor: pointer; }
.ed-root :focus-visible { outline: 2px solid var(--marigold); outline-offset: 2px; }
.ed-wrap { max-width: 1040px; margin: 0 auto; display: flex; flex-direction: column; gap: 24px; }
.ed-center { align-items: center; justify-content: center; text-align: center; min-height: 60vh; }

/* Back link */
.ed-back {
  align-self: flex-start; background: none; border: 0; padding: 6px 0;
  color: var(--plum-soft); font-size: 14px; font-weight: 700;
}
.ed-back:hover { text-decoration: underline; text-underline-offset: 3px; }

/* Buttons */
.ed-btn {
  border: 1px solid transparent; border-radius: 10px; padding: 12px 22px;
  font-size: 15px; font-weight: 800; transition: background .15s;
}
.ed-btn-primary { background: var(--marigold); color: var(--plum); }
.ed-btn-primary:hover { background: #ffbb1f; }
.ed-btn-lg { padding: 14px 28px; font-size: 16px; }

/* Hero */
.ed-hero {
  display: grid; grid-template-columns: 1fr 1.1fr; gap: 32px; align-items: center;
  background: var(--surface); border: 1px solid var(--line); border-radius: 16px; padding: 28px;
}
.ed-tag {
  display: inline-block; background: var(--marigold); color: var(--plum);
  padding: 3px 12px; border-radius: 999px; font-size: 12px; font-weight: 800; margin-bottom: 14px;
}
.ed-info h1 { font-size: clamp(28px, 4vw, 40px); font-weight: 800; line-height: 1.12; letter-spacing: -.02em; margin-bottom: 12px; }
.ed-lead { color: var(--muted); font-size: 17px; margin-bottom: 20px; }
.ed-price { display: flex; flex-direction: column; line-height: 1.25; margin-bottom: 22px; }
.ed-price small { color: var(--muted); font-size: 13px; font-weight: 600; }
.ed-price strong { font-size: 28px; font-weight: 800; color: var(--plum); }
.ed-info .ed-btn { width: 100%; }
.ed-viewer { aspect-ratio: 4 / 3; border-radius: 12px; overflow: hidden; background: #eee6f5; }
.ed-viewer img { width: 100%; height: 100%; object-fit: cover; display: block; }

/* Content cards */
.ed-card { background: var(--surface); border: 1px solid var(--line); border-radius: 16px; padding: 28px; }
.ed-card h2 { font-size: 20px; font-weight: 800; letter-spacing: -.01em; margin-bottom: 14px; }
.ed-about { color: #4a4255; white-space: pre-line; line-height: 1.75; max-width: 72ch; }
.ed-hint { color: var(--muted); font-size: 14px; margin: -8px 0 18px; }

/* Gallery */
.ed-gallery { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 12px; }
.ed-thumb {
  padding: 0; border: 2px solid transparent; border-radius: 10px; overflow: hidden;
  background: #eee6f5; aspect-ratio: 1 / 1; transition: border-color .15s;
}
.ed-thumb:hover { border-color: #cdbddc; }
.ed-thumb.is-active { border-color: var(--marigold); }
.ed-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }

/* Video */
.ed-video { border-radius: 12px; overflow: hidden; background: #1b1022; }
.ed-video video { display: block; width: 100%; max-height: 520px; }
.ed-embed { position: relative; aspect-ratio: 16 / 9; border-radius: 12px; overflow: hidden; background: #1b1022; }
.ed-embed iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; }

/* Closing CTA */
.ed-cta {
  background: var(--plum); color: #f6eefb; border-radius: 16px; padding: 32px 36px;
  display: flex; justify-content: space-between; align-items: center; gap: 20px; flex-wrap: wrap;
}
.ed-cta h2 { font-size: 24px; font-weight: 800; letter-spacing: -.01em; }
.ed-cta p { color: #cdbddc; margin-top: 2px; }

/* States */
.ed-alert {
  background: #fdf0ee; border: 1px solid #efc4be; color: #96281b;
  padding: 14px 20px; border-radius: 10px; font-weight: 600; margin-bottom: 16px; max-width: 460px;
}
.ed-skel-top { height: 18px; width: 120px; border-radius: 6px; background: #eee6f5; }
.ed-skel-hero { display: grid; grid-template-columns: 1fr 1.1fr; gap: 24px; }
.ed-skel-block { height: 280px; border-radius: 16px; background: #eee6f5; }
.ed-skel-block.tall { height: 340px; }

@media (max-width: 760px) {
  .ed-root { padding: 18px 14px 56px; }
  .ed-hero { grid-template-columns: 1fr; padding: 20px; gap: 20px; }
  .ed-viewer { order: -1; }
  .ed-card { padding: 22px 20px; }
  .ed-cta { padding: 26px 22px; }
  .ed-skel-hero { grid-template-columns: 1fr; }
}
@media (prefers-reduced-motion: reduce) {
  .ed-root * { transition: none !important; scroll-behavior: auto !important; }
}
`;

export default EventDetailsPage;
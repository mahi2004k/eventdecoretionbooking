import React from "react";
import { useNavigate } from "react-router-dom";

const stats = [
  { value: "500+", label: "Events decorated" },
  { value: "98%", label: "Happy clients" },
  { value: "10+", label: "Years of experience" },
];

const services = [
  {
    title: "Wedding decorations",
    text: "Custom mandap setups, floral arches, grand entrance walkways and themed stage arrangements for your big day.",
  },
  {
    title: "Corporate events and galas",
    text: "Clean, brand-focused stage design, ambient lighting and elegant centrepieces for corporate events and award nights.",
  },
  {
    title: "Birthdays and parties",
    text: "Colourful themed decor, balloon styling, photo booth backdrops and custom setups for celebrations people remember.",
  },
];

const steps = [
  { title: "Consultation", text: "We talk through your vision, theme, budget and venue." },
  { title: "Design and concept", text: "Our team prepares layout concepts and mood boards for your approval." },
  { title: "Setup on the day", text: "We arrive early and set up every detail before your guests do." },
];

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="hp-root">
      <style>{css}</style>

      {/* Hero */}
      <section className="hp-hero">
        <div className="hp-wrap hp-hero-inner">
          <h1>Decor that makes your event feel like yours</h1>
          <p>
            From weddings to corporate galas, we turn your venue into a space your guests will talk about long after the day.
          </p>
          <div className="hp-hero-actions">
            <button onClick={() => navigate("/events")} className="hp-btn hp-btn-primary">
              Browse packages
            </button>
            <button onClick={() => navigate("/book")} className="hp-btn hp-btn-outline">
              Book a consultation
            </button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <div className="hp-wrap">
        <section className="hp-stats" aria-label="Our track record">
          {stats.map((s) => (
            <div key={s.label}>
              <strong>{s.value}</strong>
              <span>{s.label}</span>
            </div>
          ))}
        </section>
      </div>

      {/* Services */}
      <section className="hp-section hp-wrap">
        <div className="hp-section-head">
          <h2>What we decorate</h2>
          <p>Whatever the occasion, we bring creativity and careful planning to it.</p>
        </div>
        <div className="hp-services">
          {services.map((s) => (
            <article key={s.title} className="hp-service">
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Process */}
      <section className="hp-process-band">
        <div className="hp-wrap">
          <div className="hp-section-head">
            <h2>How we work</h2>
            <p>Three steps from first call to finished setup.</p>
          </div>
          <ol className="hp-steps">
            {steps.map((s, i) => (
              <li key={s.title}>
                <span className="hp-step-no">{i + 1}</span>
                <div>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* CTA */}
      <section className="hp-wrap hp-section">
        <div className="hp-cta">
          <div>
            <h2>Planning an event?</h2>
            <p>Look through our packages to pick a theme, or book a custom setup.</p>
          </div>
          <button onClick={() => navigate("/events")} className="hp-btn hp-btn-primary">
            View all packages
          </button>
        </div>
      </section>
    </div>
  );
};

const css = `
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');

.hp-root {
  --plum: #2e1a3b;
  --plum-soft: #44295a;
  --marigold: #f2a900;
  --bg: #f6f4f8;
  --surface: #ffffff;
  --line: #e7e2ec;
  --text: #25202b;
  --muted: #6f677a;
  background: var(--bg);
  color: var(--text);
  font-family: 'Manrope', system-ui, -apple-system, 'Segoe UI', sans-serif;
  font-size: 16px;
  line-height: 1.6;
}
.hp-root *, .hp-root *::before, .hp-root *::after { box-sizing: border-box; }
.hp-root h1, .hp-root h2, .hp-root h3, .hp-root p { margin: 0; }
.hp-root button { font-family: inherit; cursor: pointer; }
.hp-root :focus-visible { outline: 2px solid var(--marigold); outline-offset: 3px; }
.hp-wrap { max-width: 1160px; margin: 0 auto; padding: 0 24px; }

/* Buttons */
.hp-btn {
  border: 1px solid transparent; border-radius: 10px; padding: 13px 24px;
  font-size: 16px; font-weight: 800; transition: background .15s, border-color .15s;
}
.hp-btn-primary { background: var(--marigold); color: var(--plum); }
.hp-btn-primary:hover { background: #ffbb1f; }
.hp-btn-outline { background: transparent; border-color: rgba(255,255,255,.5); color: #fff; }
.hp-btn-outline:hover { background: rgba(255,255,255,.1); border-color: #fff; }

/* Hero */
.hp-hero {
  background-color: var(--plum);
  background-image:
    linear-gradient(90deg, rgba(46,26,59,.96) 0%, rgba(46,26,59,.82) 55%, rgba(46,26,59,.45) 100%),
    url('https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1600');
  background-size: cover;
  background-position: center;
  color: #f6eefb;
  padding: 96px 0 120px;
}
.hp-hero-inner h1 {
  max-width: 17ch; font-size: clamp(34px, 6vw, 58px);
  font-weight: 800; line-height: 1.08; letter-spacing: -.025em; margin-bottom: 18px;
}
.hp-hero-inner p { max-width: 50ch; font-size: 18px; color: #d9cce6; margin-bottom: 32px; }
.hp-hero-actions { display: flex; flex-wrap: wrap; gap: 12px; }

/* Stats overlap the hero edge */
.hp-stats {
  display: grid; grid-template-columns: repeat(3, 1fr);
  background: var(--surface); border: 1px solid var(--line); border-radius: 14px;
  margin-top: -52px; position: relative; padding: 8px 0;
}
.hp-stats > div { padding: 20px 16px; text-align: center; }
.hp-stats > div + div { border-left: 1px solid var(--line); }
.hp-stats strong { display: block; font-size: 34px; font-weight: 800; line-height: 1.1; color: var(--plum); }
.hp-stats span { color: var(--muted); font-size: 14px; font-weight: 600; }

/* Sections */
.hp-section { padding-top: 72px; padding-bottom: 8px; }
.hp-section-head { margin-bottom: 32px; }
.hp-section-head h2 { font-size: clamp(26px, 4vw, 34px); font-weight: 800; letter-spacing: -.015em; }
.hp-section-head p { color: var(--muted); margin-top: 6px; max-width: 54ch; }

.hp-services { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 20px; }
.hp-service {
  background: var(--surface); border: 1px solid var(--line); border-radius: 14px;
  padding: 28px; border-top: 4px solid var(--marigold);
}
.hp-service h3 { font-size: 19px; font-weight: 800; margin-bottom: 8px; }
.hp-service p { color: var(--muted); font-size: 15px; }

/* Process */
.hp-process-band { background: #eee6f5; margin-top: 72px; padding: 72px 0; }
.hp-steps { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 28px; }
.hp-steps li { display: flex; gap: 16px; align-items: flex-start; }
.hp-step-no {
  flex: none; width: 40px; height: 40px; border-radius: 50%;
  background: var(--plum); color: #fff; font-weight: 800;
  display: grid; place-items: center;
}
.hp-steps h3 { font-size: 18px; font-weight: 800; margin-bottom: 4px; }
.hp-steps p { color: var(--muted); font-size: 15px; }

/* CTA */
.hp-section:last-child { padding-bottom: 72px; }
.hp-cta {
  background: var(--plum); color: #f6eefb; border-radius: 16px; padding: 40px 44px;
  display: flex; justify-content: space-between; align-items: center; gap: 24px; flex-wrap: wrap;
}
.hp-cta h2 { font-size: 28px; font-weight: 800; letter-spacing: -.015em; }
.hp-cta p { color: #cdbddc; margin-top: 4px; }

@media (max-width: 640px) {
  .hp-hero { padding: 64px 0 88px; }
  .hp-stats { grid-template-columns: 1fr; }
  .hp-stats > div + div { border-left: 0; border-top: 1px solid var(--line); }
  .hp-cta { padding: 28px 24px; }
}
@media (prefers-reduced-motion: reduce) {
  .hp-root * { transition: none !important; }
}
`;

export default HomePage;
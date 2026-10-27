import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("adminToken", data.token);
        navigate("/admin");
      } else {
        setError("The username or password is incorrect. Check both and try again.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("We couldn't reach the server. Check that the backend is running, then try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="al-root">
      <style>{css}</style>

      <main className="al-card">
        <div className="al-brand">
          <span className="al-brand-mark">D</span>
          <div>
            <strong>Decor Studio</strong>
            <small>Admin console</small>
          </div>
        </div>

        <h1>Log in</h1>
        <p className="al-sub">Use your admin account to manage bookings and event packages.</p>

        {error && (
          <div className="al-alert" role="alert">{error}</div>
        )}

        <form onSubmit={handleLogin}>
          <label className="al-field">
            <span>Username</span>
            <input
              type="text"
              name="username"
              required
              autoComplete="username"
              autoFocus
              value={credentials.username}
              onChange={handleChange}
              className="al-input"
            />
          </label>

          <label className="al-field">
            <span>Password</span>
            <div className="al-pw">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                autoComplete="current-password"
                value={credentials.password}
                onChange={handleChange}
                className="al-input"
              />
              <button
                type="button"
                className="al-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-pressed={showPassword}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </label>

          <button type="submit" disabled={loading} className="al-btn">
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>
      </main>
    </div>
  );
};

const css = `
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');

.al-root {
  --plum: #2e1a3b;
  --plum-soft: #44295a;
  --marigold: #f2a900;
  --marigold-dark: #b97f00;
  --line: #e7e2ec;
  --text: #25202b;
  --muted: #6f677a;
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
  background: var(--plum);
  background-image: radial-gradient(circle at 15% 10%, var(--plum-soft) 0%, transparent 45%);
  color: var(--text);
  font-family: 'Manrope', system-ui, -apple-system, 'Segoe UI', sans-serif;
  font-size: 15px;
  line-height: 1.5;
}
.al-root *, .al-root *::before, .al-root *::after { box-sizing: border-box; }
.al-root h1, .al-root p { margin: 0; }
.al-root button { font-family: inherit; cursor: pointer; }
.al-root :focus-visible { outline: 2px solid var(--marigold); outline-offset: 2px; }

.al-card {
  width: 100%; max-width: 420px;
  background: #fff; border-radius: 16px; padding: 36px;
  box-shadow: 0 24px 48px -20px rgba(0, 0, 0, .5);
}

.al-brand { display: flex; align-items: center; gap: 12px; margin-bottom: 28px; }
.al-brand strong { display: block; font-size: 16px; font-weight: 800; }
.al-brand small { color: var(--muted); font-size: 12px; }
.al-brand-mark {
  width: 38px; height: 38px; border-radius: 10px;
  background: var(--marigold); color: var(--plum);
  display: grid; place-items: center; font-weight: 800; font-size: 18px;
}

.al-card h1 { font-size: 26px; font-weight: 800; letter-spacing: -.015em; }
.al-sub { color: var(--muted); margin: 4px 0 24px; }

.al-alert {
  background: #fdf0ee; border: 1px solid #efc4be; color: #96281b;
  padding: 11px 14px; border-radius: 10px; margin-bottom: 18px;
  font-size: 14px; font-weight: 600;
}

.al-field { display: block; margin-bottom: 18px; }
.al-field > span { display: block; margin-bottom: 6px; font-size: 13px; font-weight: 700; }
.al-input {
  width: 100%; padding: 11px 12px; border: 1px solid var(--line); border-radius: 8px;
  background: #fff; color: var(--text); font: inherit; font-size: 15px;
}
.al-input:hover { border-color: #cfc6d8; }
.al-input:focus { border-color: var(--marigold-dark); outline: 2px solid rgba(242, 169, 0, .35); outline-offset: 0; }

.al-pw { position: relative; }
.al-pw .al-input { padding-right: 64px; }
.al-toggle {
  position: absolute; right: 6px; top: 50%; transform: translateY(-50%);
  background: none; border: 0; padding: 6px 10px; border-radius: 6px;
  color: var(--plum-soft); font-size: 13px; font-weight: 700;
}
.al-toggle:hover { background: #f4f0f8; }

.al-btn {
  width: 100%; margin-top: 6px; padding: 13px;
  background: var(--marigold); color: var(--plum);
  border: 0; border-radius: 10px; font-size: 16px; font-weight: 800;
  transition: background .15s;
}
.al-btn:hover:not(:disabled) { background: #ffbb1f; }
.al-btn:disabled { opacity: .65; cursor: not-allowed; }

@media (max-width: 480px) {
  .al-card { padding: 28px 22px; }
}
@media (prefers-reduced-motion: reduce) {
  .al-root * { transition: none !important; }
}
`;

export default AdminLogin;
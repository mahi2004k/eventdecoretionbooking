import React from "react";
import { Link, NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <nav
      className="navbar navbar-expand-lg sticky-top shadow-sm py-3"
      style={{
        background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)",
      }}
    >
      <div className="container">
        {/* Brand Logo */}
        <Link className="navbar-brand fw-bold fs-3 text-white d-flex align-items-center" to="/">
          <span className="me-2">✨</span>
          <span>
            Decor<span style={{ color: "#fbbf24" }}>Ease</span>
          </span>
        </Link>

        {/* Mobile Toggle Button */}
        <button
          className="navbar-toggler border-0 text-white"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon filter-white"></span>
        </button>

        {/* Navigation Links */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-3 mt-3 mt-lg-0">
            <li className="nav-item">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `nav-link fw-semibold px-3 ${
                    isActive ? "text-white active-link" : "text-light text-opacity-75"
                  }`
                }
              >
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/events"
                className={({ isActive }) =>
                  `nav-link fw-semibold px-3 ${
                    isActive ? "text-white active-link" : "text-light text-opacity-75"
                  }`
                }
              >
                Events
              </NavLink>
            </li>
            {/* Added Admin Link */}
            <li className="nav-item">
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `nav-link fw-semibold px-3 ${
                    isActive ? "text-white active-link" : "text-light text-opacity-75"
                  }`
                }
                style={({ isActive }) => ({
                  color: isActive ? "#fbbf24" : "#f59e0b",
                })}
              >
                ⚙️ Admin Panel
              </NavLink>
            </li>
            <li className="nav-item ms-lg-2">
              <Link
                to="/book"
                className="btn text-white fw-bold px-4 py-2 rounded-pill border-0 shadow-sm gradient-book-btn"
                style={{
                  background: "linear-gradient(90deg, #6366f1 0%, #a855f7 100%)",
                }}
              >
                Book Event
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Custom Styles */}
      <style>{`
        .active-link {
          border-bottom: 2px solid #a855f7;
        }
        .nav-link:hover {
          color: #ffffff !important;
        }
        .gradient-book-btn:hover {
          opacity: 0.9;
          transform: translateY(-1px);
          transition: all 0.2s ease;
        }
        .navbar-toggler-icon {
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='rgba%28255, 255, 255, 0.85%29' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e");
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
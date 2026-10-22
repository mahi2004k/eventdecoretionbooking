import React from "react";

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <div>
          <h3>✨ DecorEase</h3>
          <p style={{ color: "#94a3b8", fontSize: "14px" }}>
            Making your special occasions unforgettable with premium event decorations.
          </p>
        </div>
        <div>
          <h4>Contact Us</h4>
          <p style={{ color: "#94a3b8", fontSize: "14px" }}>📍 Miraj, Maharashtra</p>
          <p style={{ color: "#94a3b8", fontSize: "14px" }}>📞 +91 80104 25526</p>
          <p style={{ color: "#94a3b8", fontSize: "14px" }}>📧 support@decorease.com</p>
        </div>
      </div>
      <div style={styles.copyright}>
        © {new Date().getFullYear()} DecorEase. All rights reserved.
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    backgroundColor: "#0f172a",
    color: "#ffffff",
    padding: "40px 0 20px 0",
    marginTop: "60px",
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 20px",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "30px",
  },
  copyright: {
    textAlign: "center",
    marginTop: "30px",
    paddingTop: "20px",
    borderTop: "1px solid #1e293b",
    color: "#64748b",
    fontSize: "13px",
  },
};

export default Footer;
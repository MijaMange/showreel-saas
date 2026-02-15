import { Link } from "react-router-dom";
import "../styles/editor.css";

export default function NotFound() {
  return (
    <div
      style={{
        padding: "48px var(--pad-x, 22px)",
        maxWidth: 480,
        margin: "0 auto",
      }}
    >
      <div
        className="editor-card"
        style={{
          padding: 32,
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: "1.5rem",
            fontWeight: 600,
            margin: "0 0 12px",
            color: "var(--text)",
          }}
        >
          Page not found
        </h1>
        <p style={{ color: "var(--muted)", margin: "0 0 24px", fontSize: "0.95rem" }}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          style={{
            display: "inline-block",
            padding: "12px 24px",
            background: "var(--accent)",
            color: "var(--bg)",
            borderRadius: 12,
            fontWeight: 500,
            textDecoration: "none",
          }}
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}

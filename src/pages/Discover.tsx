import { Link } from "react-router-dom";
import { getAllProfiles } from "../app/profileStore";

export function Discover() {
  const profiles = getAllProfiles();

  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      <h1 style={{ marginBottom: 24 }}>Discover</h1>
      <p style={{ marginBottom: 24, opacity: 0.8 }}>Browse all profiles.</p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: 16,
        }}
      >
        {profiles.map((p) => (
          <Link
            key={p.slug}
            to={`/u/${p.slug}`}
            style={{
              border: "1px solid var(--line)",
              borderRadius: 12,
              padding: 16,
              background: "var(--panel)",
              color: "inherit",
              textDecoration: "none",
              transition: "border-color 0.2s",
            }}
          >
            <h3 style={{ margin: "0 0 8px 0", fontSize: 1.1 }}>{p.name}</h3>
            <p style={{ margin: 0, fontSize: 0.9, opacity: 0.8 }}>{p.role}</p>
            <span
              style={{
                display: "inline-block",
                marginTop: 8,
                padding: "4px 10px",
                borderRadius: 8,
                background: "var(--line)",
                fontSize: 0.85,
                opacity: 0.9,
              }}
            >
              {p.theme}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

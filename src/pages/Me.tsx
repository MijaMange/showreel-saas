import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { ensureMyProfile } from "../app/profileApi";

export default function Me() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    ensureMyProfile()
      .then((profile) => {
        navigate(`/app/editor?slug=${profile.slug}`, { replace: true });
      })
      .catch((e) => {
        const err = e as { message?: string };
        setError(err?.message || "Could not load profile");
        setLoading(false);
      });
  }, [navigate]);

  if (loading) {
    return (
      <div style={{ padding: 48, textAlign: "center", color: "var(--muted)" }}>
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 48, maxWidth: 400, margin: "0 auto" }}>
        <p style={{ color: "var(--accent)", marginBottom: 16 }}>{error}</p>
        <Link to="/app/auth" style={{ color: "var(--accent)" }}>Sign in again</Link>
      </div>
    );
  }

  return null;
}

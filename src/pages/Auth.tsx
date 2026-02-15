import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../app/supabaseClient";
import "../styles/editor.css";

type Tab = "signin" | "create";

export default function Auth() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (tab === "signin") {
        const { error: err } = await supabase.auth.signInWithPassword({ email, password });
        if (err) throw err;
      } else {
        const { error: err } = await supabase.auth.signUp({ email, password });
        if (err) throw err;
      }
      navigate("/app/me", { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="editor">
      <div className="editor-container" style={{ maxWidth: 420 }}>
        <div className="editor-card auth-card">
          <div style={{ display: "flex", gap: 0, marginBottom: 24, borderBottom: "1px solid var(--line)" }}>
            <button
              type="button"
              onClick={() => { setTab("signin"); setError(null); }}
              style={{
                padding: "12px 20px",
                fontSize: "0.95rem",
                fontWeight: 500,
                background: "none",
                border: "none",
                borderBottom: tab === "signin" ? "2px solid var(--accent)" : "2px solid transparent",
                color: tab === "signin" ? "var(--text)" : "var(--muted)",
                cursor: "pointer",
              }}
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={() => { setTab("create"); setError(null); }}
              style={{
                padding: "12px 20px",
                fontSize: "0.95rem",
                fontWeight: 500,
                background: "none",
                border: "none",
                borderBottom: tab === "create" ? "2px solid var(--accent)" : "2px solid transparent",
                color: tab === "create" ? "var(--text)" : "var(--muted)",
                cursor: "pointer",
              }}
            >
              Create account
            </button>
          </div>
          <form onSubmit={handleSubmit} className="editor-fields">
            <div className="editor-field">
              <label>Email</label>
              <input
                type="email"
                className="editor-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="editor-field">
              <label>Password</label>
              <input
                type="password"
                className="editor-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && (
              <p style={{ color: "var(--accent)", fontSize: "0.9rem", margin: 0 }}>
                {error}
              </p>
            )}
            <button type="submit" className="editor-save" disabled={loading}>
              {loading ? "..." : tab === "signin" ? "Sign in" : "Create account"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

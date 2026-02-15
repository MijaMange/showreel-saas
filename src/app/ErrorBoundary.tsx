import { Component, type ReactNode } from "react";
import "../styles/editor.css";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError && this.state.error) {
      return (
        <div
          style={{
            padding: 48,
            maxWidth: 480,
            margin: "0 auto",
            minHeight: "100vh",
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
              Something went wrong
            </h1>
            <p style={{ color: "var(--muted)", margin: "0 0 24px", fontSize: "0.95rem" }}>
              A runtime error occurred. Try reloading the page.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <button
                onClick={() => window.location.reload()}
                className="editor-save"
                style={{ cursor: "pointer" }}
              >
                Reload
              </button>
              <a
                href="/"
                className="editor-btn-secondary"
                style={{
                  display: "inline-block",
                  padding: "14px 24px",
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                Back to home
              </a>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

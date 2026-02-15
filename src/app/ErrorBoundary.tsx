import { Component, type ReactNode } from "react";

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
        <div style={{
          padding: 48,
          maxWidth: 600,
          margin: "0 auto",
          fontFamily: "system-ui, sans-serif",
          color: "#fff",
          background: "#0b0c10",
          minHeight: "100vh",
        }}>
          <h1 style={{ color: "#d7b6ff", marginBottom: 16 }}>Something went wrong</h1>
          <pre style={{
            background: "rgba(255,255,255,0.1)",
            padding: 16,
            borderRadius: 8,
            overflow: "auto",
            fontSize: "0.9rem",
          }}>
            {this.state.error.message}
          </pre>
          <button
            onClick={() => window.location.href = "/"}
            style={{
              marginTop: 24,
              padding: "12px 24px",
              background: "#d7b6ff",
              color: "#0b0c10",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
              fontWeight: 500,
            }}
          >
            Back to home
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

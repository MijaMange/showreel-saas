import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthProvider";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ padding: 48, textAlign: "center", color: "var(--muted)" }}>
        Loading...
      </div>
    );
  }

  if (!session) {
    const next = location.pathname + location.search;
    return <Navigate to={`/app/auth?next=${encodeURIComponent(next)}`} replace />;
  }

  return <>{children}</>;
}

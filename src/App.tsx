import { Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./app/layout";
import { MarketingLayout } from "./app/layout/MarketingLayout";
import { AuthProvider } from "./app/auth/AuthProvider";
import { ProtectedRoute } from "./app/auth/ProtectedRoute";
import { Landing, Editor, Profile, Pro, Discover, Auth, Me } from "./pages";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<MarketingLayout />}>
          <Route index element={<Landing />} />
        </Route>

        <Route path="/u/:slug" element={<MarketingLayout />}>
          <Route index element={<Profile mode="public" />} />
        </Route>

        <Route path="/app" element={<Layout />}>
          <Route index element={<Discover />} />
          <Route path="discover" element={<Discover />} />
          <Route path="auth" element={<Auth />} />
          <Route path="me" element={<ProtectedRoute><Me /></ProtectedRoute>} />
          <Route path="u/:slug" element={<Profile mode="app" />} />
          <Route path="editor" element={<ProtectedRoute><Editor /></ProtectedRoute>} />
          <Route path="pro" element={<Pro />} />
        </Route>

        <Route path="/discover" element={<Navigate to="/app/discover" replace />} />
        <Route path="/editor" element={<Navigate to="/app/editor" replace />} />
        <Route path="/pro" element={<Navigate to="/app/pro" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;

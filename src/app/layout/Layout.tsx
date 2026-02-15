import { useEffect } from "react";
import { Outlet, Link } from "react-router-dom";
import { getProfileBySlug, seedProfilesIfEmpty } from "../profileStore";
import { applyTheme } from "../theme";
import "../../styles/global.css";

export function Layout() {
  useEffect(() => {
    seedProfilesIfEmpty();
    applyTheme(getProfileBySlug("anna-example").theme);
  }, []);

  return (
    <div className="app">
      <aside className="side">
        <div className="brand">
          <span className="dot" />
          <b>Showreel</b>
        </div>

        <nav className="nav">
          <Link to="/">🏠 Discover</Link>
          <Link to="/editor">🧩 Editor</Link>
          <Link to="/u/anna-example">🎬 Profile</Link>
          <Link to="/pro">💳 Pro</Link>
        </nav>
      </aside>

      <main className="main">
        <Outlet />
      </main>
    </div>
  );
}

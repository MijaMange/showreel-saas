import { forwardRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { PortfolyLogo } from "../Brand/PortfolyLogo";
import { getProfileBySlug } from "../../app/profileStore";
import { useAuth } from "../../app/auth/AuthProvider";
import "../../styles/header.css";

type HeaderVariant = "marketing" | "app";

interface HeaderProps {
  variant: HeaderVariant;
}

export const Header = forwardRef<HTMLElement, HeaderProps>(function Header({ variant }, ref) {
  const { session, signOut } = useAuth();
  const { pathname } = useLocation();
  const isEditor = pathname === "/app/editor";
  const currentTheme =
    variant === "app" && isEditor ? getProfileBySlug("anna-example").theme : null;

  return (
    <header ref={ref} className="header topbar">
      <div className="header-container">
        <Link to="/" className="header-brand" onClick={() => window.scrollTo(0, 0)}>
          <PortfolyLogo size={22} className="header-logo" />
        </Link>

        {variant === "marketing" && (
          <nav className="header-center">
            <a href="/#why" className="header-nav-link">
              Why Portfoly
            </a>
            <a href="/#pricing" className="header-nav-link">
              Pricing
            </a>
            <a href="/#about" className="header-nav-link">
              About
            </a>
          </nav>
        )}

        <div className="header-right">
          {variant === "marketing" ? (
            session ? (
              <>
                <Link to="/app" className="header-btn header-btn-primary">
                  Enter app
                </Link>
                <Link to="/app/me" className="header-link">
                  My page
                </Link>
                <button
                  type="button"
                  onClick={() => signOut()}
                  className="header-link"
                  style={{ cursor: "pointer", font: "inherit", background: "none", border: "none" }}
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link to="/app" className="header-btn header-btn-primary">
                  Enter app
                </Link>
                <Link to="/app/auth" className="header-link">
                  Sign in
                </Link>
              </>
            )
          ) : (
            <>
              <Link to="/app" className="header-pill">
                Discover
              </Link>
              {session ? (
                <>
                  <Link to="/app/me" className="header-pill">
                    My page
                  </Link>
                  <Link to="/app/pro" className="header-pill">
                    Pro
                  </Link>
                  <button
                    type="button"
                    onClick={() => signOut()}
                    className="header-pill"
                    style={{ cursor: "pointer", font: "inherit", color: "inherit" }}
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/app/editor" className="header-pill">
                    Editor
                  </Link>
                  <Link to="/app/pro" className="header-pill">
                    Pro
                  </Link>
                  <Link to="/app/auth" className="header-link">
                    Sign in
                  </Link>
                </>
              )}
              {currentTheme && (
                <span className="header-mono">
                  Theme: {currentTheme}
                </span>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
});

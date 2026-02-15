import { Link } from "react-router-dom";
import { PortfolyLogo } from "../components/Brand/PortfolyLogo";
import { PricingSection } from "../sections/PricingSection";
import { AboutSection } from "../sections/AboutSection";

export function Landing() {
  return (
    <div className="landing">
      <section className="landing-hero">
        <div className="container landing-hero-inner">
          <div className="landing-hero-left">
            <h1 className="landing-hero-headline">
              A studio site in minutes.
              <br />
              No developers.
            </h1>
            <p className="landing-hero-sub">
              Build once. Update anytime. Share as a link or export as a PDF.
            </p>
            <div className="landing-hero-cta">
              <Link to="/app/me" className="landing-btn landing-btn-primary">
                Create your page
              </Link>
              <a href="#pricing" className="landing-btn landing-btn-secondary">
                See pricing
              </a>
            </div>
          </div>
          <div className="landing-hero-preview heroPreview">
            <div className="landing-preview-card">
              <div className="landing-preview-card-top">
                <span className="landing-preview-label">Live preview</span>
              </div>
              <div className="landing-preview-thumbs">
                {[
                  "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&q=80",
                  "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&q=80",
                  "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&q=80",
                ].map((src, i) => (
                  <div
                    key={i}
                    className="landing-preview-thumb"
                    style={{ backgroundImage: `url(${src})`, backgroundSize: "cover" }}
                  />
                ))}
              </div>
              <p className="landing-preview-url">portfoly.app/u/your-name</p>
            </div>
          </div>
        </div>
      </section>

      <section className="whyWrap" id="why">
        <div className="whyBackdrop" aria-hidden="true" />
        <div className="container">
          <div className="whyKicker">WHY PORTFOLY</div>
          <div className="whyGrid">
            <div className="whyCard whyCard--side">
              <h3 className="whyCardTitle">No expensive frontend</h3>
              <p className="whyCardBody">
                Skip the cost of building, hosting, and maintaining a custom site. Portfoly gives you a studio-ready page instantly.
              </p>
            </div>
            <div className="whyCard whyCard--spotlight">
              <p className="whyCardEyebrow">Core value</p>
              <h3 className="whyCardTitle">Studio-ready, without the studio budget</h3>
              <p className="whyCardBody">
                Bio, work, links, and press kit — one page that feels like your digital studio.
              </p>
              <ul className="whyCardBullets">
                <li>Themes that look premium</li>
                <li>Fast updates, no code</li>
                <li>Export to PDF anytime</li>
              </ul>
            </div>
            <div className="whyCard whyCard--side">
              <h3 className="whyCardTitle">One link + PDF</h3>
              <p className="whyCardBody">
                Send a single link to clients and collaborators. Export a clean PDF when you need an attachment.
              </p>
            </div>
          </div>
        </div>
      </section>

      <PricingSection />

      <AboutSection />

      <footer className="landing-footer">
        <div className="container">
          <div className="landing-footer-inner">
            <div className="landing-footer-col">
              <Link to="/" className="landing-footer-brand">
                <PortfolyLogo size={22} className="header-logo" />
              </Link>
              <p className="landing-footer-tagline">
                Studio-like portfolio site without custom development.
              </p>
            </div>
            <div className="landing-footer-col">
              <a href="/#why" className="landing-footer-link">Why Portfoly</a>
              <a href="/#pricing" className="landing-footer-link">Pricing</a>
              <a href="/#about" className="landing-footer-link">About</a>
              <a href="#contact" className="landing-footer-link">Contact</a>
            </div>
            <div className="landing-footer-col">
              <a href="https://instagram.com" className="landing-footer-social" target="_blank" rel="noopener noreferrer">Instagram</a>
              <a href="https://linkedin.com" className="landing-footer-social" target="_blank" rel="noopener noreferrer">LinkedIn</a>
              <a href="https://x.com" className="landing-footer-social" target="_blank" rel="noopener noreferrer">X</a>
            </div>
          </div>
          <p className="landing-footer-copy">
            © {new Date().getFullYear()} Portfoly. Built by Mija Mange.
          </p>
        </div>
      </footer>
    </div>
  );
}

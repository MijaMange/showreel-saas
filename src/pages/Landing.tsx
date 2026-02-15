import { Link } from "react-router-dom";
import { PortfolyLogo } from "../components/Brand/PortfolyLogo";
import { getExampleForDisplay } from "../app/profileStore";
import { PricingSection } from "../sections/PricingSection";
import { AboutSection } from "../sections/AboutSection";

export function Landing() {
  const anna = getExampleForDisplay("anna-example");
  const previewWorks = anna.works?.slice(0, 3) ?? [];

  return (
    <div className="landing">
      <section className="landing-hero">
        <div className="container landing-hero-inner">
          <div className="landing-hero-left">
            <h1 className="landing-hero-headline">
              A studio site in 10 minutes. No developers.
            </h1>
            <p className="landing-hero-sub">
              Pick a theme, add your work and share a link. Export as PDF whenever you want.
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
          <div className="landing-hero-preview">
            <div className="landing-preview-card">
              <div className="landing-preview-card-top">
                <h3 className="landing-preview-name">{anna.name}</h3>
                <span className="landing-preview-role">{anna.role}</span>
              </div>
              <div className="landing-preview-thumbs">
                {previewWorks.length > 0
                  ? previewWorks.map((w, i) => (
                      <div
                        key={i}
                        className="landing-preview-thumb"
                        style={{
                          backgroundImage: `url(${w.image})`,
                          backgroundSize: "cover",
                        }}
                      />
                    ))
                  : [1, 2, 3].map((i) => (
                      <div key={i} className="landing-preview-thumb" />
                    ))}
              </div>
              <p className="landing-preview-url">portfoly.app/u/{anna.slug}</p>
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
          <div className="whyCta">
            <div className="whyCtaBtns">
              <Link to="/app/me" className="landing-btn landing-btn-primary">Create your page</Link>
              <a href="#examples" className="landing-btn landing-btn-secondary">See examples</a>
            </div>
            <p className="whyCtaNote">Free to start • Shareable link • PDF export</p>
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

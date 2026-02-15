import { Link } from "react-router-dom";

export function PricingSection() {
  return (
    <section className="pricingWrap" id="pricing">
      <div className="container">
        <header className="pricingHead">
          <h2 className="pricingTitle">Pricing</h2>
          <p className="pricingSubtitle">
            Simple plans for creators who want a professional presence online.
          </p>
        </header>
        <div className="pricingGrid">
          <div className="pricingCard pricingCard--free">
            <h3 className="pricingCardName">Free</h3>
            <p className="pricingCardPrice">0 kr / month</p>
            <ul className="pricingCardFeatures">
              <li>Portfoly subdomain</li>
              <li>One theme</li>
              <li>Limited number of works</li>
              <li>Basic profile page</li>
              <li>Portfoly branding visible</li>
            </ul>
            <Link to="/app/me" className="landing-btn landing-btn-outline">
              Start free
            </Link>
          </div>
          <div className="pricingCard pricingCard--starter">
            <span className="pricingCardTag">Most popular</span>
            <h3 className="pricingCardName">Starter</h3>
            <p className="pricingCardPrice">59 kr / month</p>
            <ul className="pricingCardFeatures">
              <li>All themes included</li>
              <li>Unlimited works</li>
              <li>PDF export</li>
              <li>Remove Portfoly branding</li>
              <li>Priority profile performance</li>
            </ul>
            <Link to="/app" className="landing-btn landing-btn-primary">
              Upgrade to Starter
            </Link>
          </div>
          <div className="pricingCard pricingCard--pro">
            <span className="pricingCardTag">For professionals</span>
            <h3 className="pricingCardName">Pro</h3>
            <p className="pricingCardPrice">119 kr / month</p>
            <ul className="pricingCardFeatures">
              <li>Custom domain</li>
              <li>Analytics & visitor insights</li>
              <li>Hero video / advanced layout</li>
              <li>Early access to new features</li>
              <li>Priority support</li>
            </ul>
            <Link to="/app" className="landing-btn landing-btn-secondary">
              Go Pro
            </Link>
          </div>
        </div>
        <p className="pricingNote">
          You can start free and upgrade anytime. No lock-in. Cancel whenever you want.
        </p>
      </div>
    </section>
  );
}

import { Link } from "react-router-dom";
import { getAllProfiles } from "../app/profileStore";

export function Discover() {
  const profiles = getAllProfiles();

  return (
    <div className="discover">
      <h1 className="discover-title">Discover</h1>
      <p className="discover-sub">Browse all profiles.</p>

      <div className="discover-grid">
        {profiles.map((p) => (
          <Link key={p.slug} to={`/app/u/${p.slug}`} className="discover-card">
            <div
              className="discover-card-thumb"
              style={
                p.heroImage
                  ? {
                      backgroundImage: `url(${p.heroImage})`,
                      backgroundSize: "cover",
                    }
                  : undefined
              }
            />
            <div className="discover-card-body">
              <h3 className="discover-card-name">{p.name}</h3>
              <p className="discover-card-role">{p.role}</p>
              <div className="discover-card-meta">
                <span className="discover-card-theme">{p.theme}</span>
                {p.location && (
                  <span className="discover-card-location">{p.location}</span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getProfileBySlug } from "../app/profileStore";
import { applyTheme } from "../app/theme";

export default function Profile() {
  const { slug } = useParams<{ slug: string }>();
  const profile = getProfileBySlug(slug ?? "anna-example");

  useEffect(() => {
    applyTheme(profile.theme);
  }, [profile.theme]);

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
        <h1 style={{ margin: 0 }}>{profile.name}</h1>
        <Link to={`/editor?slug=${profile.slug}`}>Edit profile</Link>
      </div>

      <p style={{ opacity: 0.8 }}>
        {profile.role} • {profile.theme}
      </p>

      <p style={{ opacity: 0.8 }}>{profile.bio}</p>

      <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
        <button onClick={() => navigator.clipboard.writeText(window.location.href)}>Copy link</button>
        <Link to="/pro">Go Pro</Link>
      </div>
    </div>
  );
}

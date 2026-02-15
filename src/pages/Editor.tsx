import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getProfileBySlug, saveProfile } from "../app/profileStore";
import { applyTheme } from "../app/theme";
import type { Theme } from "../app/profileStore";

export default function Editor() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const slug = searchParams.get("slug") ?? "anna-example";

  const profile = getProfileBySlug(slug);

  const [name, setName] = useState(profile.name);
  const [role, setRole] = useState(profile.role);
  const [theme, setTheme] = useState<Theme>(profile.theme);
  const [bio, setBio] = useState(profile.bio);

  useEffect(() => {
    setName(profile.name);
    setRole(profile.role);
    setTheme(profile.theme);
    setBio(profile.bio);
  }, [slug]);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  function onSave() {
    saveProfile({ slug, name, role, theme, bio });
    navigate(`/u/${slug}`);
  }

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <h1>Editor</h1>
      <p>Redigera profilen och spara.</p>

      <div style={{ display: "grid", gap: 12 }}>
        <label>
          Name
          <input value={name} onChange={(e) => setName(e.target.value)} style={{ width: "100%", padding: 10 }} />
        </label>

        <label>
          Role
          <input value={role} onChange={(e) => setRole(e.target.value)} style={{ width: "100%", padding: 10 }} />
        </label>

        <label>
          Theme
          <select value={theme} onChange={(e) => setTheme(e.target.value as Theme)} style={{ width: "100%", padding: 10 }}>
            <option value="Cinematic">Cinematic</option>
            <option value="Editorial">Editorial</option>
            <option value="Minimal">Minimal</option>
            <option value="Fashion">Fashion</option>
          </select>
        </label>

        <label>
          Bio
          <textarea value={bio} onChange={(e) => setBio(e.target.value)} style={{ width: "100%", padding: 10, minHeight: 120 }} />
        </label>

        <button onClick={onSave} style={{ padding: 12 }}>
          Save & preview
        </button>
      </div>
    </div>
  );
}

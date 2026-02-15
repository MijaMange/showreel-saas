import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useNavigate, useLocation } from "react-router-dom";
import {
  getSessionUser,
  ensureMyProfile,
  getMyProfileWithWorks,
  updateMyProfile,
  replaceWorks,
  setPublish,
  type ApiProfile,
} from "../app/profileApi";
import { uploadHero, uploadWorkImage } from "../app/storageApi";
import type { Theme } from "../app/profileStore";
import Profile from "./Profile";
import "../styles/editor.css";

type ProfileWork = { title: string; image: string };

export default function Editor() {
  const navigate = useNavigate();
  const location = useLocation();
  const [profile, setProfile] = useState<ApiProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [slug, setSlug] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [theme, setTheme] = useState<Theme>("Cinematic");
  const [bio, setBio] = useState("");
  const [heroImage, setHeroImage] = useState("");
  const [works, setWorks] = useState<ProfileWork[]>([]);
  const [isPublished, setIsPublished] = useState(false);
  const [saving, setSaving] = useState(false);
  const [heroUploading, setHeroUploading] = useState(false);
  const [heroUploadError, setHeroUploadError] = useState<string | null>(null);
  const [workUploading, setWorkUploading] = useState<Record<number, boolean>>({});
  const [workUploadError, setWorkUploadError] = useState<Record<number, string>>({});
  const [showLivePreview, setShowLivePreview] = useState(false);
  const [view, setView] = useState<"edit" | "preview">("edit");
  const livePreviewContentRef = useRef<HTMLDivElement>(null);
  const heroInputRef = useRef<HTMLInputElement>(null);
  const workInputRefs = useRef<Record<number, HTMLInputElement | null>>({});
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    const next = encodeURIComponent(location.pathname + location.search);

    getSessionUser()
      .then(async (user) => {
        if (!user) {
          navigate(`/app/auth?next=${next}`, { replace: true });
          return;
        }

        const p = await ensureMyProfile();
        setSlug(p.slug);

        const withWorks = await getMyProfileWithWorks();
        if (withWorks) {
          setProfile(withWorks);
          setName(withWorks.name);
          setRole(withWorks.role);
          setTheme(withWorks.theme);
          setBio(withWorks.bio);
          setHeroImage(withWorks.heroImage ?? "");
          setWorks(withWorks.works ?? []);
          setIsPublished(withWorks.is_published);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [navigate, location.pathname, location.search]);


  useEffect(() => {
    if (showLivePreview && livePreviewContentRef.current) {
      livePreviewContentRef.current.scrollTop = 0;
    }
  }, [showLivePreview]);

  function addWork() {
    setWorks([...works, { title: "", image: "" }]);
  }

  function removeWork(index: number) {
    setWorks(works.filter((_, i) => i !== index));
  }

  function updateWork(index: number, field: keyof ProfileWork, value: string) {
    setWorks(works.map((w, i) => (i === index ? { ...w, [field]: value } : w)));
  }

  async function onHeroUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setHeroUploadError(null);
    setHeroUploading(true);

    try {
      const url = await uploadHero(file);
      setHeroImage(url);
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : "Upload failed";
      setHeroUploadError(errMsg);
    } finally {
      setHeroUploading(false);
      e.target.value = "";
    }
  }

  async function onWorkUpload(index: number, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setWorkUploadError((prev) => ({ ...prev, [index]: "" }));
    setWorkUploading((prev) => ({ ...prev, [index]: true }));

    try {
      const url = await uploadWorkImage(file);
      updateWork(index, "image", url);
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : "Upload failed";
      setWorkUploadError((prev) => ({ ...prev, [index]: errMsg }));
    } finally {
      setWorkUploading((prev) => ({ ...prev, [index]: false }));
      e.target.value = "";
    }
  }

  async function onSave() {
    if (!slug || !profile) return;
    setSaving(true);
    setMessage(null);

    try {
      await updateMyProfile({ name, role, bio, theme, hero_image: heroImage.trim(), is_published: isPublished });
      await replaceWorks(profile.id, works);
      setMessage({ type: "success", text: "Saved" });
      setTimeout(() => {
        setMessage(null);
        navigate(isPublished ? `/u/${slug}` : `/app/u/${slug}`);
      }, 800);
    } catch (e) {
      console.error("Save failed:", e);
      const err = e as { message?: string; error_description?: string };
      const errMsg = err?.message || err?.error_description || "Failed to save";
      setMessage({ type: "error", text: errMsg });
    } finally {
      setSaving(false);
    }
  }

  async function onPublishToggle() {
    try {
      await setPublish(!isPublished);
      setIsPublished(!isPublished);
    } catch (e) {
      console.error(e);
    }
  }

  const isUploading = heroUploading || Object.values(workUploading).some(Boolean);

  if (loading) {
    return (
      <div style={{ padding: 48, textAlign: "center", color: "var(--muted)" }}>
        Loading...
      </div>
    );
  }

  if (!profile) {
    return (
      <div style={{ padding: 48, textAlign: "center", color: "var(--muted)" }}>
        <p>Could not load your profile.</p>
        <a href="/app/me" style={{ color: "var(--accent)" }}>Try again</a>
      </div>
    );
  }

  const previewWorks = works.slice(0, 3);

  return (
    <div className="editor" data-theme={theme.toLowerCase()}>
      <div className="editor-container">
        <div className="editor-mobile-toggle">
          <button
            type="button"
            className={`editor-toggle-btn ${view === "edit" ? "editor-toggle-btn--active" : ""}`}
            onClick={() => setView("edit")}
            aria-pressed={view === "edit"}
          >
            Edit
          </button>
          <button
            type="button"
            className={`editor-toggle-btn ${view === "preview" ? "editor-toggle-btn--active" : ""}`}
            onClick={() => setView("preview")}
            aria-pressed={view === "preview"}
          >
            Preview
          </button>
        </div>
        <div className="editor-grid">
          <div className={`editor-controls editor-controls--edit ${view === "edit" ? "editor-controls--visible" : ""}`}>
            <div className="editor-controls-inner">
            {message && (
              <div
                className="editor-message"
                style={{
                  padding: "12px 16px",
                  borderRadius: 12,
                  fontSize: "0.95rem",
                  backgroundColor: message.type === "success" ? "rgba(0,255,100,0.15)" : "rgba(255,80,80,0.15)",
                  color: message.type === "success" ? "#5aff88" : "#ff6b6b",
                }}
              >
                {message.text}
              </div>
            )}

            <div className="editor-card">
              <h3 className="editor-card-title">Basic info</h3>
              <div className="editor-fields">
                <div className="editor-field">
                  <label>Name</label>
                  <input
                    className="editor-input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="editor-field">
                  <label>Role</label>
                  <input
                    className="editor-input"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  />
                </div>
                <div className="editor-field">
                  <label>Theme</label>
                  <select
                    className="editor-select"
                    value={theme}
                    onChange={(e) => setTheme(e.target.value as Theme)}
                  >
                    <option value="Cinematic">Cinematic</option>
                    <option value="Editorial">Editorial</option>
                    <option value="Minimal">Minimal</option>
                    <option value="Fashion">Fashion</option>
                  </select>
                </div>
                <div className="editor-field">
                  <label>Hero image</label>
                  <input
                    className="editor-input"
                    type="url"
                    value={heroImage}
                    onChange={(e) => {
                      setHeroImage(e.target.value);
                      setHeroUploadError(null);
                    }}
                    placeholder="https://... or upload below"
                  />
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 8, flexWrap: "wrap" }}>
                    <input
                      ref={heroInputRef}
                      type="file"
                      accept="image/*"
                      onChange={onHeroUpload}
                      style={{ display: "none" }}
                    />
                    <button
                      type="button"
                      className="editor-btn-secondary"
                      onClick={() => heroInputRef.current?.click()}
                      disabled={heroUploading}
                      style={{ padding: "8px 16px", fontSize: "0.9rem" }}
                    >
                      {heroUploading ? "Uploading…" : "Upload hero"}
                    </button>
                    {heroUploadError && (
                      <span style={{ fontSize: "0.85rem", color: "var(--error, #ff6b6b)" }}>
                        {heroUploadError}
                      </span>
                    )}
                  </div>
                </div>
                <div className="editor-field">
                  <label>Bio</label>
                  <textarea
                    className="editor-textarea"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <aside className="editor-preview editor-preview-inline">
              <span className="editor-preview-label">Live preview</span>
              <div className="editor-preview-inner">
                <div className={`editor-preview-hero heroCover ${heroImage ? "" : "heroCover--placeholder"}`} style={heroImage ? { backgroundImage: `url(${heroImage})` } : undefined}>
                  <div className="heroOverlay" />
                  <div className="heroInner">
                    <h2 className="editor-preview-hero-name">{name || "Name"}</h2>
                    <p className="editor-preview-hero-meta">{role || "Role"} · {theme}</p>
                  </div>
                </div>
                <div className="editor-preview-main">
                  <p className="editor-preview-bio">{bio || "Add a short bio."}</p>
                  <div className="editor-preview-grid">
                    {previewWorks.length > 0 ? previewWorks.map((w, i) => (
                      <div key={i} className="editor-preview-work">
                        <div className="editor-preview-work-thumb" style={w.image ? { backgroundImage: `url(${w.image})`, backgroundSize: "cover" } : undefined} />
                        {w.title ? <div className="editor-preview-work-title">{w.title}</div> : null}
                      </div>
                    )) : [1, 2, 3].map((i) => (
                      <div key={i} className="editor-preview-work"><div className="editor-preview-work-thumb" /></div>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            <div className="editor-card">
              <h3 className="editor-card-title">Selected work</h3>
              <div className="editor-works-list">
                {works.map((work, i) => (
                  <div key={i} className="editor-work-card">
                    <div
                      className="editor-work-thumb"
                      style={
                        work.image
                          ? {
                              backgroundImage: `url(${work.image})`,
                              backgroundSize: "cover",
                            }
                          : undefined
                      }
                    />
                    <div className="editor-work-fields">
                      <input
                        className="editor-input"
                        value={work.title}
                        onChange={(e) => updateWork(i, "title", e.target.value)}
                        placeholder="Title"
                      />
                      <input
                        className="editor-input"
                        value={work.image}
                        onChange={(e) => updateWork(i, "image", e.target.value)}
                        placeholder="Image URL or upload below"
                      />
                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                        <input
                          ref={(el) => { workInputRefs.current[i] = el; }}
                          type="file"
                          accept="image/*"
                          onChange={(e) => onWorkUpload(i, e)}
                          style={{ display: "none" }}
                        />
                        <button
                          type="button"
                          className="editor-work-upload"
                          onClick={() => workInputRefs.current[i]?.click()}
                          disabled={workUploading[i]}
                        >
                          {workUploading[i] ? "Uploading…" : "Upload"}
                        </button>
                        {workUploadError[i] && (
                          <span style={{ fontSize: "0.8rem", color: "var(--error, #ff6b6b)" }}>
                            {workUploadError[i]}
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      type="button"
                      className="editor-work-remove"
                      onClick={() => removeWork(i)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
              <button type="button" className="editor-add-work" onClick={addWork}>
                Add work
              </button>
            </div>

            <div className="editorActions">
              <div className="editor-card" style={{ padding: "16px 24px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontSize: "0.95rem" }}>
                    <input
                      type="checkbox"
                      checked={isPublished}
                      onChange={onPublishToggle}
                      style={{ width: 18, height: 18, accentColor: "var(--accent)" }}
                    />
                    Published
                  </label>
                  {isPublished && (
                    <a
                      href={`/u/${slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontSize: "0.85rem", color: "var(--accent)", textDecoration: "none" }}
                    >
                      Live link: /u/{slug}
                    </a>
                  )}
                </div>
              </div>

              <div className="editor-actions-row">
                <button
                  type="button"
                  className="editor-btn-secondary"
                  onClick={() => setShowLivePreview(true)}
                >
                  Live preview
                </button>
                <button
                  className="editor-save editor-save-desktop"
                  onClick={onSave}
                  disabled={saving || isUploading}
                >
                  {saving ? "Saving…" : isUploading ? "Uploading…" : "Save & preview"}
                </button>
              </div>
              <div className={`editor-mobile-save-bar ${view === "edit" ? "editor-mobile-save-bar--visible" : ""}`}>
                <button
                  className="editor-save"
                  onClick={onSave}
                  disabled={saving || isUploading}
                >
                  {saving ? "Saving…" : isUploading ? "Uploading…" : "Save & preview"}
                </button>
              </div>
            </div>
            </div>
          </div>

          <aside className={`editor-preview editor-preview-sidebar ${view === "preview" ? "editor-preview--visible" : ""}`}>
            <span className="editor-preview-label">Live preview</span>
            <div className="editor-preview-inner">
              <div
                className={`editor-preview-hero heroCover ${heroImage ? "" : "heroCover--placeholder"}`}
                style={
                  heroImage
                    ? { backgroundImage: `url(${heroImage})` }
                    : undefined
                }
              >
                <div className="heroOverlay" />
                <div className="heroInner">
                  <h2 className="editor-preview-hero-name">{name || "Name"}</h2>
                  <p className="editor-preview-hero-meta">{role || "Role"} · {theme}</p>
                </div>
              </div>
              <div className="editor-preview-main">
                <p className="editor-preview-bio">{bio || "Add a short bio."}</p>
                <div className="editor-preview-grid">
                  {previewWorks.length > 0
                    ? previewWorks.map((w, i) => (
                        <div key={i} className="editor-preview-work">
                          <div
                            className="editor-preview-work-thumb"
                            style={
                              w.image
                                ? {
                                    backgroundImage: `url(${w.image})`,
                                    backgroundSize: "cover",
                                  }
                                : undefined
                            }
                          />
                          {w.title ? (
                            <div className="editor-preview-work-title">{w.title}</div>
                          ) : null}
                        </div>
                      ))
                    : [1, 2, 3].map((i) => (
                        <div key={i} className="editor-preview-work">
                          <div className="editor-preview-work-thumb" />
                        </div>
                      ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {showLivePreview &&
        slug &&
        createPortal(
          <div
            className="live-preview-overlay"
            onClick={() => setShowLivePreview(false)}
            role="dialog"
            aria-modal="true"
            aria-label="Live preview"
          >
            <div className="live-preview-bar">
              <span className="live-preview-title">Live preview — how others see your page</span>
              <button
                type="button"
                className="live-preview-close"
                onClick={() => setShowLivePreview(false)}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div
              ref={livePreviewContentRef}
              className="live-preview-content"
              onClick={(e) => e.stopPropagation()}
            >
              <Profile mode="app" slugOverride={slug} />
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}

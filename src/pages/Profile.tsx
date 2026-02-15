import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getProfileBySlug as dbGetProfileBySlug, getWorks, type ProfileRow } from "../app/db";
import "../styles/editor.css";
import { useAuth } from "../app/auth/AuthProvider";

interface ProfileProps {
  mode: "public" | "app";
  /** When provided (e.g. in a modal), use this instead of route slug */
  slugOverride?: string;
  /** When provided (e.g. in Editor live preview), use instead of fetching — live form state */
  profileOverride?: Partial<ProfileRow> & { slug: string; name: string; role: string; bio: string; theme: string };
  /** When profileOverride is set, use these works instead of fetching */
  worksOverride?: { title: string; image: string; link?: string }[];
}

interface ProfileLink {
  label: string;
  url: string;
}

interface DisplayProfile {
  slug: string;
  name: string;
  role: string;
  bio: string;
  theme: string;
  heroStyle: string;
  worksLayout: string;
  location?: string;
  availability?: string;
  tags?: string[];
  heroImage?: string;
  links?: ProfileLink[];
  works: { title: string; image: string; link?: string }[];
  socials?: { instagram?: string; linkedin?: string; x?: string };
}

function toDisplayProfile(p: ProfileRow, works: { title: string; image: string; link?: string }[]): DisplayProfile {
  return {
    slug: p.slug,
    name: p.name,
    role: p.role,
    bio: p.bio,
    theme: p.theme,
    heroStyle: p.hero_style ?? "cover",
    worksLayout: p.works_layout ?? "grid",
    location: p.location ?? undefined,
    availability: p.availability ?? undefined,
    tags: (p.tags ?? []).filter(Boolean).slice(0, 3),
    heroImage: p.hero_image ?? undefined,
    links: (p.links ?? []).filter((l) => l?.label || l?.url).slice(0, 4),
    works,
    socials: undefined,
  };
}

export default function Profile({ mode, slugOverride, profileOverride, worksOverride }: ProfileProps) {
  const { slug: routeSlug } = useParams<{ slug: string }>();
  const slug = slugOverride ?? routeSlug;
  const { session } = useAuth();

  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [works, setWorks] = useState<{ title: string; image: string; link?: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  const useOverride = !!(profileOverride && worksOverride);

  useEffect(() => {
    if (useOverride) return;
    if (!slug) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setNotFound(false);
    setLoadError(false);

    async function load() {
      try {
        const p = await dbGetProfileBySlug(slug!);
        if (!p) {
          setNotFound(true);
          setProfile(null);
          return;
        }
        if (mode === "public" && !p.is_published) {
          setNotFound(true);
          setProfile(null);
          return;
        }
        setProfile(p);
        const w = await getWorks(p.id);
        setWorks(w.map((x) => ({ title: x.title, image: x.image, link: x.link ?? undefined })));
      } catch {
        setLoadError(true);
        setProfile(null);
      }
    }

    load().finally(() => setLoading(false));
  }, [slug, mode, retryKey, useOverride]);

  const displayProfile: ProfileRow | null = useOverride && profileOverride
    ? { ...profileOverride, id: profileOverride.id ?? "", user_id: profileOverride.user_id ?? "", hero_style: profileOverride.hero_style ?? "cover", works_layout: profileOverride.works_layout ?? "grid" } as ProfileRow
    : profile;
  const displayWorks = useOverride ? (worksOverride ?? []) : works;

  function retry() {
    setRetryKey((k) => k + 1);
  }

  if (!useOverride && loading) {
    return (
      <div style={{ padding: 48, textAlign: "center", color: "var(--muted)" }}>
        Loading...
      </div>
    );
  }

  if (!useOverride && loadError) {
    return (
      <div
        style={{
          padding: 48,
          maxWidth: 480,
          margin: "0 auto",
        }}
      >
        <div className="editor-card" style={{ padding: 32, textAlign: "center" }}>
          <p style={{ color: "var(--text)", margin: "0 0 8px", fontSize: "1.1rem" }}>
            Couldn't load this page. Please try again.
          </p>
          <p style={{ color: "var(--muted)", margin: "0 0 24px", fontSize: "0.9rem" }}>
            A network or server error occurred.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button type="button" className="editor-save" onClick={retry}>
              Retry
            </button>
            <Link to="/" className="editor-btn-secondary" style={{ padding: "14px 24px", textDecoration: "none", color: "inherit" }}>
              Back to home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!useOverride && (notFound || !profile)) {
    return (
      <div
        style={{
          padding: 48,
          maxWidth: 480,
          margin: "0 auto",
        }}
      >
        <div className="editor-card" style={{ padding: 32, textAlign: "center" }}>
          <p style={{ color: "var(--text)", margin: "0 0 8px", fontSize: "1.1rem" }}>
            This profile doesn't exist or isn't published yet.
          </p>
          <p style={{ color: "var(--muted)", margin: "0 0 24px", fontSize: "0.9rem" }}>
            The page may have been removed or the profile is still private.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button type="button" className="editor-save" onClick={retry}>
              Retry
            </button>
            <Link to="/" className="editor-btn-secondary" style={{ padding: "14px 24px", textDecoration: "none", color: "inherit" }}>
              Back to home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const display = toDisplayProfile(displayProfile!, displayWorks);
  const hasWorks = displayWorks.length > 0;
  const isOwner = !!(session && displayProfile && displayProfile.user_id === session.user?.id);
  const hasQuickInfo = display.location || display.availability || (display.tags && display.tags.length > 0);
  const hasLinks = display.links && display.links.length > 0;

  const heroClasses = [
    "profile-hero",
    `profile-hero--${display.heroStyle}`,
    display.heroImage ? "" : "profile-hero--placeholder",
  ].filter(Boolean).join(" ");

  const worksClasses = [
    "profile-work-grid",
    `profile-work-grid--${display.worksLayout}`,
  ].join(" ");

  return (
    <div className="profile profile--studio" data-theme={(display.theme ?? "cinematic").toLowerCase()} data-hero-style={display.heroStyle} data-works-layout={display.worksLayout}>
      <div
        className={heroClasses}
        style={display.heroStyle !== "split" && display.heroImage ? { backgroundImage: `url(${display.heroImage})` } : undefined}
      >
        <div className="heroOverlay" />
        <div className="profile-hero-content">
          <h1 className="profile-hero-name">{display.name}</h1>
          <p className="profile-hero-meta">{display.role} · {display.theme}</p>
          {(display.heroStyle === "cover" || display.heroStyle === "split") && (
            <p className="profile-hero-bio">{display.bio}</p>
          )}
          {(display.location || (display.tags && display.tags.length > 0)) && (
            <div className="profile-hero-pills">
              {display.location && <span className="profile-pill">{display.location}</span>}
              {display.tags?.map((t) => (
                <span key={t} className="profile-pill">{t}</span>
              ))}
            </div>
          )}
          {isOwner && (
            <div className="profile-hero-actions">
              <Link to={`/app/editor?slug=${display.slug}`} className="profile-btn profile-btn-primary">
                Edit profile
              </Link>
              <button
                type="button"
                onClick={() => navigator.clipboard.writeText(window.location.href)}
                className="profile-btn profile-btn-secondary"
              >
                Copy link
              </button>
            </div>
          )}
        </div>
        {display.heroStyle === "split" && display.heroImage && (
          <div className="profile-hero-split-image" style={{ backgroundImage: `url(${display.heroImage})` }} />
        )}
      </div>

      <div className="profile-main">
        <div className="profile-content">
          {(display.heroStyle === "minimal" || !display.heroImage) && display.bio && (
            <section className="profile-about">
              <h2 className="profile-section-title">About</h2>
              <p className="profile-bio-text">{display.bio}</p>
            </section>
          )}

          <section className="profile-work-section">
            <h2 className="profile-section-title">Selected work</h2>
            <div className={worksClasses}>
              {!hasWorks ? (
                isOwner ? (
                  <p className="profile-empty-cta">
                    Add your first work in <Link to={`/app/editor?slug=${display.slug}`}>Editor</Link>.
                  </p>
                ) : null
              ) : (
                displayWorks.map((w, i) => {
                  const inner = (
                    <>
                      <div
                        className="profile-work-thumb"
                        style={w.image ? { backgroundImage: `url(${w.image})`, backgroundSize: "cover" } : undefined}
                      />
                      {w.title && <div className="profile-work-title">{w.title}</div>}
                    </>
                  );
                  return w.link ? (
                    <a key={i} href={w.link} target="_blank" rel="noopener noreferrer" className="profile-work-card">
                      {inner}
                    </a>
                  ) : (
                    <div key={i} className="profile-work-card">
                      {inner}
                    </div>
                  );
                })
              )}
            </div>
          </section>
        </div>

        {(hasQuickInfo || hasLinks) && (
          <aside className="profile-sidebar">
            <div className="profile-quick-info">
              {hasQuickInfo && (
                <>
                  <h3 className="profile-quick-title">Quick info</h3>
                  <div className="profile-pills">
                    {display.location && <span className="profile-pill">{display.location}</span>}
                    {display.availability && <span className="profile-pill">{display.availability}</span>}
                    {display.tags?.map((t) => (
                      <span key={t} className="profile-pill">{t}</span>
                    ))}
                  </div>
                </>
              )}
              {hasLinks && (
                <>
                  <h3 className="profile-quick-title" style={{ marginTop: hasQuickInfo ? 16 : 0 }}>Links</h3>
                  <div className="profile-links">
                    {display.links!.map((l, i) => (
                      <a key={i} href={l.url} target="_blank" rel="noopener noreferrer" className="profile-link">
                        {l.label || l.url}
                      </a>
                    ))}
                  </div>
                </>
              )}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}

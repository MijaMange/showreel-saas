import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getProfileBySlug } from "../app/profileStore";
import {
  getPublicProfileBySlug,
  getMyProfileBySlug,
  type ApiProfile,
} from "../app/profileApi";
import { useAuth } from "../app/auth/AuthProvider";

interface ProfileProps {
  mode: "public" | "app";
  /** When provided (e.g. in a modal), use this instead of route slug */
  slugOverride?: string;
}

interface DisplayProfile {
  slug: string;
  name: string;
  role: string;
  bio: string;
  theme: string;
  location?: string;
  tags?: string[];
  heroImage?: string;
  works: { title: string; image: string }[];
  socials?: { instagram?: string; linkedin?: string; x?: string };
}

function toDisplayProfile(p: ApiProfile): DisplayProfile {
  return {
    slug: p.slug,
    name: p.name,
    role: p.role,
    bio: p.bio,
    theme: p.theme,
    location: p.location,
    tags: p.tags,
    heroImage: p.heroImage,
    works: p.works ?? [],
    socials: p.socials,
  };
}

function fallbackToApiProfile(slug: string): ApiProfile {
  const fallback = getProfileBySlug(slug);
  return {
    id: "",
    slug: fallback.slug,
    name: fallback.name,
    role: fallback.role,
    bio: fallback.bio,
    theme: fallback.theme,
    location: fallback.location,
    heroImage: fallback.heroImage,
    tags: fallback.tags,
    is_published: false,
    works: fallback.works,
    socials: fallback.socials,
  };
}

export default function Profile({ mode, slugOverride }: ProfileProps) {
  const { slug: routeSlug } = useParams<{ slug: string }>();
  const slug = slugOverride ?? routeSlug;
  const { session } = useAuth();

  const [profile, setProfile] = useState<ApiProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setNotFound(false);
    setIsOwner(false);
    const s = slug;

    async function load() {
      try {
        if (mode === "public") {
          const p = await getPublicProfileBySlug(s);
          if (p) {
            setProfile(p);
            if (session) {
              const mine = await getMyProfileBySlug(s).catch(() => null);
              setIsOwner(!!mine);
            }
          } else {
            const seeded = getProfileBySlug(s);
            if (seeded) {
              setProfile(fallbackToApiProfile(s));
            } else {
              setNotFound(true);
              setProfile(null);
            }
          }
        } else {
          if (session) {
            const mine = await getMyProfileBySlug(s).catch(() => null);
            if (mine) {
              setProfile(mine);
              setIsOwner(true);
            } else {
              const p = await getPublicProfileBySlug(s);
              if (p) {
                setProfile(p);
              } else {
                const seeded = getProfileBySlug(s);
                if (seeded) {
                  setProfile(fallbackToApiProfile(s));
                } else {
                  setNotFound(true);
                }
              }
            }
          } else {
            const p = await getPublicProfileBySlug(s);
            if (p) {
              setProfile(p);
            } else {
              const seeded = getProfileBySlug(s);
              if (seeded) {
                setProfile(fallbackToApiProfile(s));
              } else {
                setNotFound(true);
              }
            }
          }
        }
      } catch {
        const seeded = getProfileBySlug(s);
        if (seeded) {
          setProfile(fallbackToApiProfile(s));
        } else {
          setNotFound(true);
          setProfile(null);
        }
      }
    }

    load().finally(() => setLoading(false));
  }, [slug, mode, session]);


  if (loading) {
    return (
      <div style={{ padding: 48, textAlign: "center", color: "var(--muted)" }}>
        Loading...
      </div>
    );
  }

  if (notFound || !profile) {
    return (
      <div style={{ padding: 48, textAlign: "center", color: "var(--muted)" }}>
        <p>Profile not found.</p>
        <Link to="/" style={{ color: "var(--accent)" }}>Back to home</Link>
      </div>
    );
  }

  const display = toDisplayProfile(profile);
  const works = display.works;
  const hasWorks = works.length > 0;
  const displayWorks = hasWorks ? works : Array.from({ length: 6 }, () => ({ title: "", image: "" }));

  return (
    <div className="profile" data-theme={(display.theme ?? "cinematic").toLowerCase()}>
      <div
        className="profile-hero"
        style={
          display.heroImage
            ? { backgroundImage: `url(${display.heroImage})` }
            : undefined
        }
      >
        <div className="heroOverlay" />
        <div className="profile-hero-content">
          <h1 className="profile-hero-name">{display.name}</h1>
          <p className="profile-hero-meta">{display.role} · {display.theme}</p>
          <p className="profile-hero-bio">{display.bio}</p>
          {(display.location || (display.tags && display.tags.length > 0)) && (
            <div className="profile-hero-pills">
              {display.location && (
                <span className="profile-pill">{display.location}</span>
              )}
              {display.tags?.map((t) => (
                <span key={t} className="profile-pill">
                  {t}
                </span>
              ))}
            </div>
          )}
          <div className="profile-hero-actions">
            {isOwner && (
              <Link
                to={`/app/editor?slug=${display.slug}`}
                className="profile-btn profile-btn-primary"
              >
                Edit profile
              </Link>
            )}
            <button
              type="button"
              onClick={() => navigator.clipboard.writeText(window.location.href)}
              className="profile-btn profile-btn-secondary"
            >
              Copy link
            </button>
          </div>
        </div>
      </div>

      <div className="profile-main">
        <div className="profile-work-section">
          <h2 className="profile-section-title">Selected work</h2>
          <div className="profile-work-grid">
            {displayWorks.map((w, i) => (
              <div key={i} className="profile-work-card">
                <div
                  className="profile-work-thumb"
                  style={
                    w.image
                      ? {
                          backgroundImage: `url(${w.image})`,
                          backgroundSize: "cover",
                        }
                      : undefined
                  }
                />
                {w.title && (
                  <div className="profile-work-title">{w.title}</div>
                )}
              </div>
            ))}
          </div>
        </div>

        <aside className="profile-sidebar">
          <div className="profile-quick-info">
            <h3 className="profile-quick-title">Quick info</h3>
            <div className="profile-pills">
              {display.location && (
                <span className="profile-pill">{display.location}</span>
              )}
              {display.tags?.map((t) => (
                <span key={t} className="profile-pill">
                  {t}
                </span>
              ))}
              {display.socials?.instagram && (
                <a href={`https://instagram.com/${display.socials.instagram}`} className="profile-pill" target="_blank" rel="noopener noreferrer">
                  Instagram
                </a>
              )}
              {display.socials?.linkedin && (
                <a href={`https://linkedin.com/in/${display.socials.linkedin}`} className="profile-pill" target="_blank" rel="noopener noreferrer">
                  LinkedIn
                </a>
              )}
              {display.socials?.x && (
                <a href={`https://x.com/${display.socials.x}`} className="profile-pill" target="_blank" rel="noopener noreferrer">
                  X
                </a>
              )}
              {!display.location && !display.tags?.length && !display.socials && (
                <>
                  <span className="profile-pill">Location</span>
                  <span className="profile-pill">Availability</span>
                </>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

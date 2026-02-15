export type Theme = "Cinematic" | "Editorial" | "Minimal" | "Fashion";

export interface Profile {
  slug: string;
  name: string;
  role: string;
  bio: string;
  theme: Theme;
}

const STORAGE_KEY = "showreel_profiles";

function loadProfiles(): Record<string, Profile> {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) return JSON.parse(raw) as Record<string, Profile>;
  return {};
}

function saveProfiles(profiles: Record<string, Profile>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
}

function defaultProfileForSlug(slug: string): Profile {
  const defaults: Record<string, Partial<Profile>> = {
    "anna-example": {
      name: "Anna Example",
      role: "Actor",
      bio: "Short intro that feels like YOU.",
      theme: "Cinematic",
    },
    "mija-example": {
      name: "Mija Lindberg",
      role: "Director",
      bio: "Creating stories that matter.",
      theme: "Editorial",
    },
    "karl-example": {
      name: "Karl Svensson",
      role: "Photographer",
      bio: "Light and shadow.",
      theme: "Minimal",
    },
    "lisa-example": {
      name: "Lisa Andersson",
      role: "Model",
      bio: "Fashion forward.",
      theme: "Fashion",
    },
  };
  const d = defaults[slug] ?? {
    name: slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    role: "Creator",
    bio: "Welcome to my showreel.",
    theme: "Cinematic" as Theme,
  };
  return { slug, ...d } as Profile;
}

export function getAllProfiles(): Profile[] {
  const profiles = loadProfiles();
  return Object.values(profiles).sort((a, b) =>
    (a.name ?? a.slug).localeCompare(b.name ?? b.slug)
  );
}

export function getProfileBySlug(slug: string): Profile {
  const profiles = loadProfiles();
  if (profiles[slug]) return profiles[slug];
  const profile = defaultProfileForSlug(slug);
  profiles[slug] = profile;
  saveProfiles(profiles);
  return profile;
}

export function saveProfile(profile: Profile) {
  const profiles = loadProfiles();
  profiles[profile.slug] = profile;
  saveProfiles(profiles);
}

export function seedProfilesIfEmpty() {
  const profiles = loadProfiles();
  if (Object.keys(profiles).length > 0) return;

  const demo: Profile[] = [
    { slug: "anna-example", name: "Anna Example", role: "Actor", bio: "Short intro that feels like YOU.", theme: "Cinematic" },
    { slug: "mija-example", name: "Mija Lindberg", role: "Director", bio: "Creating stories that matter.", theme: "Editorial" },
    { slug: "karl-example", name: "Karl Svensson", role: "Photographer", bio: "Light and shadow.", theme: "Minimal" },
    { slug: "lisa-example", name: "Lisa Andersson", role: "Model", bio: "Fashion forward.", theme: "Fashion" },
    { slug: "erik-example", name: "Erik Berg", role: "Cinematographer", bio: "Framing the moment.", theme: "Cinematic" },
    { slug: "sara-example", name: "Sara Holm", role: "Art Director", bio: "Visual storytelling.", theme: "Editorial" },
  ];

  const dict: Record<string, Profile> = {};
  for (const p of demo) dict[p.slug] = p;
  saveProfiles(dict);
}

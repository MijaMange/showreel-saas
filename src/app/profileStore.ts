export type Theme = "Cinematic" | "Editorial" | "Minimal" | "Fashion";

export interface ProfileWork {
  title: string;
  image: string;
}

export interface ProfileSocials {
  instagram?: string;
  linkedin?: string;
  x?: string;
}

export interface Profile {
  slug: string;
  name: string;
  role: string;
  bio: string;
  theme: Theme;
  location?: string;
  tags?: string[];
  heroImage?: string;
  works?: ProfileWork[];
  socials?: ProfileSocials;
}

const STORAGE_KEY = "showreel_profiles";

const ANNA_WORKS: ProfileWork[] = [
  { title: "Scene 1", image: "https://picsum.photos/seed/anna1/600/400" },
  { title: "Stage", image: "https://picsum.photos/seed/anna2/600/400" },
  { title: "Reel", image: "https://picsum.photos/seed/anna3/600/400" },
  { title: "Film", image: "https://picsum.photos/seed/anna4/600/400" },
  { title: "Act", image: "https://picsum.photos/seed/anna5/600/400" },
  { title: "Project", image: "https://picsum.photos/seed/anna6/600/400" },
];

const MIJA_WORKS: ProfileWork[] = [
  { title: "Portrait", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600" },
  { title: "Landscape", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600" },
  { title: "Street", image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600" },
  { title: "Light", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600" },
  { title: "Nature", image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600" },
  { title: "Studio", image: "https://images.unsplash.com/photo-1471341971476-ae15ff5dd4ea?w=600" },
];

const LISA_WORKS: ProfileWork[] = [
  { title: "Editorial", image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600" },
  { title: "Campaign", image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600" },
  { title: "Lookbook", image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600" },
  { title: "Design", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600" },
  { title: "Art", image: "https://images.unsplash.com/photo-1569172122301-bc5008bc09c5?w=600" },
  { title: "Brand", image: "https://images.unsplash.com/photo-1469460340997-2f854421e72f?w=600" },
];

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
      name: "Anna Sheller",
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
  const existing = profiles[profile.slug];
  profiles[profile.slug] = existing
    ? { ...existing, ...profile }
    : profile;
  saveProfiles(profiles);
}

export function getExampleSlugs(): string[] {
  return ["anna-example", "mija-example", "lisa-example"];
}

/** Returnerar alltid full exempeldata för visning (t.ex. Landing) – oberoende av localStorage. */
export function getExampleForDisplay(slug: string): Profile {
  const example = EXAMPLE_PROFILES[slug];
  if (example) return { slug, ...example } as Profile;
  return getProfileBySlug(slug);
}

const EXAMPLE_PROFILES: Record<string, Partial<Profile>> = {
  "anna-example": {
    name: "Anna Sheller",
    role: "Actor",
    bio: "Reel-ready profiles with cinematic themes.",
    theme: "Cinematic",
    location: "Stockholm",
    tags: ["Film", "Theatre", "Commercial"],
    heroImage: "https://picsum.photos/seed/anna-hero/1200/600",
    works: ANNA_WORKS,
    socials: { instagram: "annasheller", linkedin: "annasheller" },
  },
  "mija-example": {
    name: "Mija Lindberg",
    role: "Photographer",
    bio: "Creating stories that matter. Light and shadow.",
    theme: "Editorial",
    location: "Copenhagen",
    tags: ["Portrait", "Documentary", "Editorial"],
    heroImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200",
    works: MIJA_WORKS,
    socials: { instagram: "mijalindberg", x: "mijalindberg" },
  },
  "lisa-example": {
    name: "Lisa Andersson",
    role: "Art Director",
    bio: "Visual storytelling. Fashion forward.",
    theme: "Minimal",
    location: "Malmö",
    tags: ["Art Direction", "Design", "Branding"],
    heroImage: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200",
    works: LISA_WORKS,
    socials: { instagram: "lisaandersson", linkedin: "lisaandersson" },
  },
};

/** Fyll i heroImage, works etc för exempelprofiler som saknar dem (gammal data). */
export function upgradeExamplesIfNeeded() {
  const profiles = loadProfiles();
  let changed = false;
  for (const slug of getExampleSlugs()) {
    const example = EXAMPLE_PROFILES[slug];
    if (!example) continue;
    const existing = profiles[slug];
    if (!existing) {
      profiles[slug] = { slug, ...example } as Profile;
      changed = true;
    } else if (!existing.heroImage || !existing.works?.length) {
      profiles[slug] = {
        ...existing,
        heroImage: existing.heroImage ?? example.heroImage,
        works: existing.works?.length ? existing.works : example.works,
        location: existing.location ?? example.location,
        tags: existing.tags?.length ? existing.tags : example.tags,
        socials: existing.socials ?? example.socials,
      };
      changed = true;
    }
  }
  if (changed) saveProfiles(profiles);
}

export function seedProfilesIfEmpty() {
  const profiles = loadProfiles();
  if (Object.keys(profiles).length > 0) {
    upgradeExamplesIfNeeded();
    return;
  }

  const demo: Profile[] = [
    { slug: "anna-example", ...EXAMPLE_PROFILES["anna-example"] } as Profile,
    { slug: "mija-example", ...EXAMPLE_PROFILES["mija-example"] } as Profile,
    { slug: "lisa-example", ...EXAMPLE_PROFILES["lisa-example"] } as Profile,
    {
      slug: "karl-example",
      name: "Karl Svensson",
      role: "Photographer",
      bio: "Light and shadow.",
      theme: "Minimal",
    },
    {
      slug: "erik-example",
      name: "Erik Berg",
      role: "Cinematographer",
      bio: "Framing the moment.",
      theme: "Cinematic",
    },
    {
      slug: "sara-example",
      name: "Sara Holm",
      role: "Art Director",
      bio: "Visual storytelling.",
      theme: "Editorial",
    },
  ];

  const dict: Record<string, Profile> = {};
  for (const p of demo) dict[p.slug] = p;
  saveProfiles(dict);
}

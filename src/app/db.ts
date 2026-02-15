/**
 * Data layer for profiles and works. Avoids .single() to prevent PGRST116.
 */
import { supabase } from "./supabaseClient";

export type Theme = string;
export type HeroStyle = "cover" | "split" | "minimal";
export type WorksLayout = "grid" | "masonry" | "featured";

export interface ProfileLink {
  label: string;
  url: string;
}

export interface ProfileRow {
  id: string;
  user_id: string;
  slug: string;
  name: string;
  role: string;
  bio: string;
  theme: string;
  is_published?: boolean;
  hero_image?: string | null;
  hero_style?: string | null;
  works_layout?: string | null;
  location?: string | null;
  availability?: string | null;
  tags?: string[] | null;
  links?: ProfileLink[] | null;
  created_at?: string;
  updated_at?: string;
}

export interface WorkRow {
  id: string;
  profile_id: string;
  title: string;
  image: string;
  link?: string | null;
  sort_order: number;
}

/**
 * Get profile by slug. Uses limit(1) to avoid PGRST116.
 * Includes: hero_style, works_layout, availability, tags, links, hero_image, location, theme, is_published.
 */
export async function getProfileBySlug(slug: string): Promise<ProfileRow | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, user_id, slug, name, role, bio, theme, is_published, hero_image, hero_style, works_layout, location, availability, tags, links, created_at, updated_at")
    .eq("slug", slug)
    .limit(1);

  if (error) throw error;
  const rows = Array.isArray(data) ? data : data ? [data] : [];
  if (rows.length > 1) {
    console.warn("[db] Multiple profiles found for slug:", slug, "- using first");
  }
  return (rows[0] as ProfileRow) ?? null;
}

/**
 * Get profile by user_id. Takes first row, warns if multiple.
 * Includes: hero_style, works_layout, availability, tags, links, hero_image, location, theme, is_published.
 */
export async function getProfileByUserId(userId: string): Promise<ProfileRow | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, user_id, slug, name, role, bio, theme, is_published, hero_image, hero_style, works_layout, location, availability, tags, links, created_at, updated_at")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false })
    .limit(1);

  if (error) throw error;
  const rows = Array.isArray(data) ? data : data ? [data] : [];
  if (rows.length > 1) {
    console.warn("[db] Multiple profiles found for user_id:", userId, "- using first");
  }
  return (rows[0] as ProfileRow) ?? null;
}

/**
 * Upsert profile. Uses slug as conflict target (unique per profile).
 */
export async function upsertProfile(
  input: Partial<ProfileRow> & { user_id: string; slug: string }
): Promise<ProfileRow> {
  const fullRow: Record<string, unknown> = {
    user_id: input.user_id,
    slug: input.slug,
    name: input.name ?? "",
    role: input.role ?? "",
    bio: input.bio ?? "",
    theme: input.theme ?? "Cinematic",
    is_published: input.is_published ?? false,
    hero_image: input.hero_image?.trim() || null,
    hero_style: input.hero_style ?? "cover",
    works_layout: input.works_layout ?? "grid",
    location: input.location ?? null,
    availability: input.availability ?? null,
    tags: input.tags ?? null,
    links: input.links ?? null,
    updated_at: new Date().toISOString(),
  };

  const baseRow: Record<string, unknown> = {
    user_id: input.user_id,
    slug: input.slug,
    name: input.name ?? "",
    role: input.role ?? "",
    bio: input.bio ?? "",
    theme: input.theme ?? "Cinematic",
    is_published: input.is_published ?? false,
    hero_image: input.hero_image?.trim() || null,
    location: input.location ?? null,
    tags: input.tags ?? null,
    updated_at: new Date().toISOString(),
  };

  let res = await supabase
    .from("profiles")
    .upsert(fullRow, { onConflict: "slug" })
    .select()
    .limit(1);

  if (res.error) {
    res = await supabase
      .from("profiles")
      .upsert(baseRow, { onConflict: "slug" })
      .select()
      .limit(1);
  }

  if (res.error) throw res.error;
  const data = res.data;
  const result = Array.isArray(data) ? data[0] : data;
  if (!result) throw new Error("Profile upsert failed: no data returned");
  return result as ProfileRow;
}

/**
 * Get works for a profile, ordered by sort_order.
 */
export async function getWorks(profileId: string): Promise<WorkRow[]> {
  const { data, error } = await supabase
    .from("works")
    .select("*")
    .eq("profile_id", profileId)
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return (data ?? []) as WorkRow[];
}

/**
 * Replace all works for a profile. Delete existing, then insert new list.
 */
export async function replaceWorks(
  profileId: string,
  works: Array<Pick<WorkRow, "title" | "image" | "link" | "sort_order">>
): Promise<void> {
  const { error: delError } = await supabase
    .from("works")
    .delete()
    .eq("profile_id", profileId);

  if (delError) throw delError;

  if (works.length === 0) return;

  const rowsWithLink = works.map((w, i) => ({
    profile_id: profileId,
    title: (w.title || "").trim() || "Untitled",
    image: (w.image || "").trim() || "https://placehold.co/600x400?text=+",
    link: (w.link || "").trim() || null,
    sort_order: w.sort_order ?? i,
  }));

  const rowsBase = works.map((w, i) => ({
    profile_id: profileId,
    title: (w.title || "").trim() || "Untitled",
    image: (w.image || "").trim() || "https://placehold.co/600x400?text=+",
    sort_order: w.sort_order ?? i,
  }));

  let insRes = await supabase.from("works").insert(rowsWithLink);
  if (insRes.error) {
    insRes = await supabase.from("works").insert(rowsBase);
  }
  if (insRes.error) throw insRes.error;
}

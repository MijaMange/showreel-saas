import type { User } from "@supabase/supabase-js";
import { supabase } from "./supabaseClient";
import type { Theme } from "./profileStore";

export interface DbProfile {
  id: string;
  user_id: string;
  slug: string;
  name: string;
  role: string;
  bio: string;
  theme: string;
  location?: string | null;
  hero_image?: string | null;
  tags?: string[];
  is_published: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ApiProfile {
  id: string;
  slug: string;
  name: string;
  role: string;
  bio: string;
  theme: Theme;
  location?: string;
  heroImage?: string;
  tags?: string[];
  is_published: boolean;
  works?: { title: string; image: string }[];
  socials?: { instagram?: string; linkedin?: string; x?: string };
}

function toSlug(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function random4(): string {
  return Math.random().toString(36).slice(2, 6);
}

function dbToApi(p: DbProfile): ApiProfile {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    role: p.role,
    bio: p.bio,
    theme: p.theme as Theme,
    location: p.location ?? undefined,
    heroImage: p.hero_image ?? undefined,
    tags: p.tags?.length ? p.tags : undefined,
    is_published: p.is_published,
  };
}

export async function getSessionUser(): Promise<User | null> {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function getMyProfile(): Promise<ApiProfile | null> {
  const user = await getSessionUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .limit(1);

  if (error) throw error;
  const row = Array.isArray(data) ? data[0] : data;
  if (!row) return null;

  return dbToApi(row as DbProfile);
}

export async function ensureMyProfile(): Promise<ApiProfile> {
  let profile = await getMyProfile();
  if (profile) return profile;

  const user = await getSessionUser();
  if (!user) throw new Error("Not authenticated");

  const emailPrefix = (user.email ?? "user").split("@")[0];
  const slugBase = toSlug(emailPrefix) || "portfolio";
  const slug = `${slugBase}-${random4()}`;
  const name = emailPrefix || "Creator";

  const { data, error } = await supabase
    .from("profiles")
    .insert({
      user_id: user.id,
      slug,
      name,
      role: "Creator",
      bio: "",
      theme: "Cinematic",
      is_published: false,
      hero_image: null,
    })
    .select();

  if (error) throw error;
  const row = Array.isArray(data) && data.length > 0 ? data[0] : data;
  if (!row) throw new Error("Profile was created but could not be retrieved. Try again.");
  return dbToApi(row as DbProfile);
}

export async function updateMyProfile(fields: {
  name?: string;
  role?: string;
  bio?: string;
  theme?: string;
  is_published?: boolean;
  location?: string;
  hero_image?: string;
  tags?: string[];
}): Promise<ApiProfile> {
  const user = await getSessionUser();
  if (!user) throw new Error("Not authenticated");

  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (fields.name !== undefined) updates.name = fields.name;
  if (fields.role !== undefined) updates.role = fields.role;
  if (fields.bio !== undefined) updates.bio = fields.bio;
  if (fields.theme !== undefined) updates.theme = fields.theme;
  if (fields.is_published !== undefined) updates.is_published = fields.is_published;
  if (fields.location !== undefined) updates.location = fields.location;
  if (fields.hero_image !== undefined) updates.hero_image = fields.hero_image?.trim() || null;
  if (fields.tags !== undefined) updates.tags = fields.tags;

  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("user_id", user.id)
    .select()
    .limit(1);

  if (error) throw error;
  const row = Array.isArray(data) ? data[0] : data;
  if (!row) throw new Error("Profile could not be updated.");
  return dbToApi(row as DbProfile);
}

export async function setPublish(isPublished: boolean): Promise<void> {
  const user = await getSessionUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("profiles")
    .update({ is_published: isPublished, updated_at: new Date().toISOString() })
    .eq("user_id", user.id);

  if (error) throw error;
}

export async function replaceWorks(
  profileId: string,
  works: { title: string; image: string }[]
): Promise<{ title: string; image: string }[]> {
  const { error: delError } = await supabase
    .from("works")
    .delete()
    .eq("profile_id", profileId);

  if (delError) throw delError;

  const rows = works
    .map((w, i) => ({
      profile_id: profileId,
      title: (w.title || "").trim() || "Untitled",
      image: (w.image || "").trim() || "https://placehold.co/600x400?text=+",
      sort_order: i,
    }));

  if (rows.length === 0) return [];

  const { data, error: insError } = await supabase.from("works").insert(rows).select("title, image");
  if (insError) throw insError;
  return (data ?? []) as { title: string; image: string }[];
}

export async function getPublicProfileBySlug(slug: string): Promise<ApiProfile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .limit(1);

  if (error) throw error;
  const row = Array.isArray(data) ? data[0] : data;
  if (!row) return null;

  const apiProfile = dbToApi(row as DbProfile);
  const works = await getPublicWorks((row as DbProfile).id);
  apiProfile.works = works;

  return apiProfile;
}

export async function getPublicWorks(profileId: string): Promise<{ title: string; image: string }[]> {
  const { data, error } = await supabase
    .from("works")
    .select("title, image")
    .eq("profile_id", profileId)
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return (data ?? []) as { title: string; image: string }[];
}

export async function getMyWorks(profileId: string): Promise<{ title: string; image: string }[]> {
  const { data, error } = await supabase
    .from("works")
    .select("title, image")
    .eq("profile_id", profileId)
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return (data ?? []) as { title: string; image: string }[];
}

export async function getMyProfileBySlug(slug: string): Promise<ApiProfile | null> {
  const user = await getSessionUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .eq("slug", slug)
    .limit(1);

  if (error) throw error;
  const row = Array.isArray(data) ? data[0] : data;
  if (!row) return null;

  const apiProfile = dbToApi(row as DbProfile);
  const works = await getMyWorks((row as DbProfile).id);
  apiProfile.works = works;

  return apiProfile;
}

export async function getMyProfileWithWorks(): Promise<ApiProfile | null> {
  const profile = await getMyProfile();
  if (!profile) return null;

  const works = await getMyWorks(profile.id);
  profile.works = works;
  return profile;
}

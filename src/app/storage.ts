/**
 * Hero image upload to Supabase Storage.
 * Bucket name: change HERO_BUCKET if your bucket differs.
 */
import { supabase } from "./supabaseClient";

export const HERO_BUCKET =
  import.meta.env.VITE_HERO_BUCKET ?? "portfolio-images";

export function sanitizeFileName(name: string): string {
  const ext = name.includes(".") ? name.slice(name.lastIndexOf(".")).toLowerCase() : "";
  const base = name.includes(".")
    ? name.slice(0, name.lastIndexOf("."))
    : name;
  const safe = base
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .slice(0, 80);
  return (safe || "image") + ext;
}

export async function uploadHeroImage(userId: string, file: File): Promise<string> {
  const path = `${userId}/${Date.now()}-${sanitizeFileName(file.name)}`;

  const { error } = await supabase.storage
    .from(HERO_BUCKET)
    .upload(path, file, { upsert: true, cacheControl: "3600" });

  if (error) {
    throw new Error(error.message || "Upload failed");
  }

  const { data } = supabase.storage.from(HERO_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

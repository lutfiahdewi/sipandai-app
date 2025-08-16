import type { SupabaseClient } from "@supabase/supabase-js";
const defaultIcon = new URL("@/assets/img/file.png", import.meta.url).href;
export default function (path: string| null | undefined, supabase: SupabaseClient) {
  if (!path || path.trim() === '') return defaultIcon
  else return supabase.storage.from('uploads').getPublicUrl(path).data.publicUrl
}
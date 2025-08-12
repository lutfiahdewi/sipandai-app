import type { SupabaseClient } from "@supabase/supabase-js";
      export default function (path: string, supabase: SupabaseClient) {
        return supabase.storage.from('uploads').getPublicUrl(path).data.publicUrl
      }
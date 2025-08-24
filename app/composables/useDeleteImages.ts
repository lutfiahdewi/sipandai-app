import type { SupabaseClient } from "@supabase/supabase-js";

export default async (pathsToDelete: string[], supabase: SupabaseClient) => {
    // if (pathsToDelete.length<1) return;
    const { error } = await supabase.storage
        .from("uploads")
        .remove(pathsToDelete);
    return {error};
}
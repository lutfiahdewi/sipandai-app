import type { SupabaseClient } from "@supabase/supabase-js"

export default async (table: string, supabase: SupabaseClient, ref : Ref<number>) => {
    const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true })
    ref.value = count ?? 0;
    return error
}
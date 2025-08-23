import type { SupabaseClient } from "@supabase/supabase-js";

// selector = field that wanna retrieved 
export default async (table: string, targetData: Ref<any[]>, isLoading: Ref<boolean>, supabase :SupabaseClient,selector?: string,) => {
  isLoading.value = true;
  try {
    const { data, error } = await supabase
      .from(table)
      .select(selector ?? "(*)");
    if (!error) {
      targetData.value = data;
    }
  } finally {
    isLoading.value = false;
  }
}
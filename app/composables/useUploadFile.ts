import type { SupabaseClient } from "@supabase/supabase-js";

export default async function uploadFile(path: Ref<string | null>, file: File, folder: string, supabase: SupabaseClient) {
  const filePath = `${folder}/${Date.now()}-${file.name}`;
  const { error } = await supabase.storage
    .from("uploads")
    .upload(filePath, file);
  if (error) {
    console.log("Gagal upload gambar: ", filePath)
    console.log(error)
    return { path, error };
  }
  path.value = filePath;
  return { path, error };
}
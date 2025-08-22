import type { SupabaseClient } from "@supabase/supabase-js";

  export default async function uploadFile(file: File, folder: string, supabase: SupabaseClient) {
  console.log("Upload file called! =>", folder);
  const filePath = `${folder}/${Date.now()}-${file.name}`;
  const { error } = await supabase.storage
    .from("uploads")
    .upload(filePath, file);
  if (error) throw error;
  return filePath;
}
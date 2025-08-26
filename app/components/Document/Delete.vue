<script setup lang="ts">
import type { ModalBase } from "#components";
// import type { Database } from "~/types/supabase";

defineProps<{
  id: string;
  name: string;
  table: string;
}>();
const emit = defineEmits<{
  (e: "refresh"): void;
  (e: "show-error"): void;
  (e: "show-success"): void;
}>();
const modal = ref<InstanceType<typeof ModalBase> | null>(null);
const supabase = useSupabaseClient();
const isLoading = ref(false);
const errorMessageDelete = ref("");
// pass open modal method to parent component
const open = () => {
  modal.value?.open();
};
defineExpose({
  open,
});
/**
 * Deleting data comes in two major step:
 * 1. Deleting the main data in table. It's done first to check if't able to done. Then return the data, catch the path
 * 2. Do the deletion if the path exist
 */
async function deleteData(table: string, id: string): Promise<boolean> {
  isLoading.value = true;
  let dataDeleted: any | undefined;
  // 1. Detete data in table
  const { data, error } = await supabase
    .from(table)
    .delete()
    .eq("id", id)
    .select();
  if (error) {
    emit("show-error");
    isLoading.value = false;
    errorMessageDelete.value =
      "Gagal menghapus. Detail error: " + error.details;
    return false;
  }
  dataDeleted = data[0];

  // 2. DElete images data in storage
  const pathsToDelete = [];
  if (dataDeleted) {
    if (dataDeleted?.icon_path) pathsToDelete.push(dataDeleted.icon_path);
    if (dataDeleted?.photo_path) pathsToDelete.push(dataDeleted.photo_path);
  }
  if (pathsToDelete.length > 0) {
    const { error: errorUpload } = await useDeleteImages(pathsToDelete,supabase);
    if (errorUpload) {
      emit("show-error");
      isLoading.value = false;
      errorMessageDelete.value =
        "Gagal menghapus. Pesan error: " + errorUpload.message;
      return false;
    }
  }

  emit("show-success");
  isLoading.value = false;
  emit("refresh"); // ✅ tell parent to reload
  modal.value?.close(); // ✅ close modal
  return true;
}
function reset(){
  errorMessageDelete.value='';
  modal.value?.close();
}
</script>

<template>
  <ModalBase
    ref="modal"
    class-modal=" w-full sm:max-w-[400px] lg:max-w-[700px] text-base sm:text-lg"
    class-header=" bg-red-400 text-slate-800 font-semibold text-base sm:text-xl"
    class-body=" h-fit "
    class-footer="  "
    @click-outside="reset()"
  >
    <template #header>
      <span>Hapus Tautan Dokumen</span>
    </template>
    <template #body>
      <h5 class="text-center">
        Anda yakin akan menghapus tautan dokumen <span class="font-semibold">{{ name }}</span> ?
      </h5>
      <div class="error-box text-red-600" v-if="errorMessageDelete">
        {{ errorMessageDelete }}
      </div>
    </template>
    <template #footer>
      <div class="flex justify-center gap-x-3 text-sm sm:text-lg">
        <button
          @click="deleteData(table, id)"
          :disabled="isLoading"
          class="p-1 sm:p-2 min-w-18 sm:min-w-24 focus:ring-4 focus:outline-none focus:ring-red-400 rounded-lg"
          :class="
            isLoading
              ? 'bg-red-700 text-slate-400'
              : ' bg-red-500 hover:bg-red-600 '
          "
        >
          <div
            v-if="isLoading"
            class="px-2 flex gap-x-2 justify-center items-center"
          >
            <IconLoading class="inline w-6 h-6" />
            <span>Loading...</span>
          </div>
          <span v-else>Hapus</span>
        </button>
        <button
          @click="reset()"
          class="p-1 sm:p-2 min-w-18 sm:min-w-24 bg-slate-300 rounded-lg hover:bg-slate-400 focus:ring-4 focus:outline-none focus:ring-slate-300"
        >
          Batal
        </button>
      </div>
    </template>
  </ModalBase>
  
</template>

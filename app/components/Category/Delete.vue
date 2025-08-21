<script setup lang="ts">
import type { ModalBase } from "#components";

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

async function deleteData(table: string, id: string): Promise<boolean> {
  isLoading.value = true;
  const { data, error } = await supabase
    .from(table)
    .delete()
    .eq("id", id)
    .select();
  if (error) {
    emit('show-error')
    isLoading.value = false;
    errorMessageDelete.value =
      "Gagal menghapus. Detail error: " + error.details;
    return false;
  }
  emit('show-success')
  isLoading.value = false;
  emit("refresh"); // ✅ tell parent to reload
  modal.value?.close(); // ✅ close modal
  return true;
  // reloadNuxtApp();
}
</script>

<template>
  <ModalBase
    ref="modal"
    class-modal=" w-full sm:max-w-[400px] lg:max-w-[700px] text-base sm:text-lg"
    class-header=" bg-red-400 text-slate-800 font-semibold text-base sm:text-xl"
    class-body=" h-fit "
    class-footer="  "
  >
    <template #header>
      <span>Hapus Kategori</span>
    </template>
    <template #body>
      <h5 class="text-center">
        Anda yakin akan menghapus kategori {{ name }} ?
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
          @click="modal?.close"
          class="p-1 sm:p-2 min-w-18 sm:min-w-24 bg-slate-300 rounded-lg hover:bg-slate-400 focus:ring-4 focus:outline-none focus:ring-slate-300"
        >
          Batal
        </button>
      </div>
    </template>
  </ModalBase>
  <button type="button" @click="modal?.open()">
    <IconDelete
      class="w-7 h-7 sm:w-8 sm:h-8 p-[1px] rounded-md bg-red-500 text-white hover:bg-red-600 pointer-events-auto"
    />
  </button>
</template>

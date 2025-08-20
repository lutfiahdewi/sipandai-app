<script setup lang="ts">
import type { ModalBase } from "#components";

defineProps<{
  id: string;
}>();
const modal = ref<InstanceType<typeof ModalBase> | null>(null);
</script>

<template>
  <ModalBase
    ref="modal"
    class-modal="w-full sm:max-w-[580px] lg:max-w-[980px]"
    class-header=" text-slate-800 font-semibold text-base sm:text-xl"
    class-body=" max-h-[60vh] sm:max-h-[65vh] "
    class-footer="  "
  >
    <template #header>
      <span>Tambah kategori baru</span>
    </template>
    <template #body>
      <div class="hidden form">
        <label for="block name mb-3">Nama </label>
        <input id="name" type="text" class="w-full rounded-lg text-slate-800" />
      </div>
    </template>
    <template #footer></template>
  </ModalBase>
  <button type="button" @click="modal?.open()">
    <IconDelete
      class="w-7 h-7 sm:w-8 sm:h-8 p-[1px] rounded-md bg-red-500 text-white hover:bg-red-600 pointer-events-auto"
    />
  </button>
</template>

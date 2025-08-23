<script setup lang="ts">
import { ButtonDefault } from "#components";
defineProps<{
  loadingData: boolean;
}>();
defineEmits<{
  (e: "refresh-data"): void;
}>();
</script>
<template>
  <ButtonDefault
    @click="$emit('refresh-data')"
    :disabled="loadingData"
    name="refresh data"
    class="text-white bg-green-500 rounded disabled:opacity-50 focus:ring-4 focus:outline-none focus:ring-green-300 d shadow-lg shadow-green-400/50 mb-3 sm:mb-6"
    ><IconRefresh
      class="w-5 sm:w-6 lg:w-7 me-2"
      :class="loadingData ? ' hidden ' : ' inline '"
    /><IconLoading
      class="w-3 h-3 lg:w-7 fill-slate-50 me-2"
      :class="!loadingData ? ' hidden ' : ' inline '"
    />
    <span>
      {{ loadingData ? "Refreshing..." : "Refresh" }}
    </span>
  </ButtonDefault>
</template>

<script setup lang="ts">
defineProps<{
  name: string;
  class?: string;
}>();
</script>

<template>
  <button
    type="button"
    :title="name"
    class="flex items-center font-medium rounded-lg text-sm sm:text-lg lg:text-xl px-5 py-2.5 text-center me-2 mb-3 sm:mb-6"
    :class="class"
  >
    <slot />
  </button>
</template>

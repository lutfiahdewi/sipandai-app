<script setup lang="ts">
const props = defineProps<{
  name: string;
  class?: string;
}>();
</script>

<template>
  <button
    type="button"
    :title="name"
    :class="`${props.class} flex items-center font-medium rounded-lg text-sm sm:text-base lg:text-lg px-5 py-2.5 text-center me-2`"
    @click="$emit('click')"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
defineProps<{
  id?: number,
  baseLink?: string,
}>();
</script>

<template>
  <NuxtLink v-if="baseLink && id" :to="baseLink + id">
    <IconEdit class="w-7 h-7 sm:w-8 sm:h-8 p-1 rounded-md bg-blue-600 text-white hover:bg-blue-700" />
  </NuxtLink>
  <IconEdit v-else class="w-7 h-7 sm:w-8 sm:h-8 p-1 rounded-md bg-blue-500 text-white hover:bg-blue-600" />
</template>
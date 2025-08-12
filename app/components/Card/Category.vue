<script setup lang="ts">
import { NuxtImg } from '#components';

const defaultIcon = new URL("@/assets/img/file.png", import.meta.url).href;
defineProps({
  name: { type: String, required: true },
  id: { type: String, required: true },
  iconPath: { type: String, required: true },
});
const resolvedIcon = computed(() => {
  return iconPath?.startsWith("http") || iconPath?.startsWith("/")
    ? iconPath
    : defaultIcon;
});
// flex flex-col items-center justify-center
</script>
<template>
  <NuxtLink :to="'/category/'+id" class="flex items-center gap-x-2 sm:gap-x-4 bg-slate-100 hover:bg-slate-200 shadow-md px-3 sm:px-6 rounded-2xl hover:shadow-lg transition-all duration-300 cursor-pointer">
    <NuxtImg
      :src="iconPath ?  iconPath : defaultIcon"
      alt="Icon"
      class="w-12 sm:w-16 h-auto object-contain p-1.5 sm:p-2"
    />
    <h3 class="truncate sm:text-xl font-medium text-gray-800 sm:w-60" :title="name">{{name}} </h3>
  </NuxtLink>
</template>

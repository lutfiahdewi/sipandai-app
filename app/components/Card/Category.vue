<script setup lang="ts">
const props = defineProps<{
  name:  string,
  id:  string,
  iconPath:  string,
  desc?:  string | null,
  slug?:  string | null,
}>();
</script>
<template>
  <NuxtLink
    :to="'/category/' +props.slug"
    class="flex items-center gap-x-2 sm:gap-x-4 bg-slate-100 hover:bg-slate-200 shadow-md px-3 sm:px-6 rounded-2xl hover:shadow-lg transition-all duration-300 cursor-pointer"
  >
    <NuxtImg
      :src="iconPath"
      alt="Icon"
      class="w-12 sm:w-16 h-12 sm:h-16 object-contain p-1.5 sm:p-2"
    />
    <h3
      class="truncate sm:text-lg font-medium text-gray-800 sm:w-60"
      :title="name"
    >
      {{ name }}
    </h3>
  </NuxtLink>
</template>

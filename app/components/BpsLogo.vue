<script setup lang="ts">
const props = defineProps<{
  color: "white" | "black"| "custom",
  class?: String,
}>()
// Map colors to Tailwind classes
const colorClasses: Record<typeof props.color, string> = {
  white: ' text-white ',
  black: ' text-blck ',
  custom: ''
}
// Combine class props and color class
const finalClass = computed(() => {
  return `${colorClasses[props.color]} ${props.class ? (' '+props.class+' ') : ''}`
})
</script>
<template>
  <NuxtLink to="/" :class="'flex items-center justify-between gap-x-2 '+finalClass">
    <NuxtImg
      src="/logo.svg"
      class="w-8 h-auto sm:w-10 lg:w-12"
      loading="lazy"
    />
    <div class="nama font-bold italic text-xs sm:text-base lg:text-lg">
      <p class="leading-3 sm:leading-4 lg:leading-5">BADAN PUSAT STATISTIK</p>
      <p class="leading-3 sm:leading-4 lg:leading-5">KABUPATEN POLEWALI MANDAR</p>
    </div>
  </NuxtLink>
</template>

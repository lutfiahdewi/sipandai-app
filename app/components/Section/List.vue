<script setup lang="ts">
defineProps<{
  title: string;
  sectionClass?: string;
  titleClass?: string;
  slotClass?: string;
}>()
</script>

<template>
    <section :class="DEFAULT_PADDING_X + DEFAULT_PADDING_Y_LG + ' ' +sectionClass">
      <h2 :class="'text-lg sm:text-2xl lg:text-3xl text-center font-semibold text-gray-700 mb-4 sm:mb-8 '+titleClass">{{ title }}</h2>
      <div :class="'flex flex-col sm:flex-row sm:flex-wrap sm:justify-center gap-y-4 sm:gap-x-6 lg:gap-x-8 mb-4 sm:mb-8 ' + slotClass">
        <slot/>
      </div>
      
    </section>
</template>
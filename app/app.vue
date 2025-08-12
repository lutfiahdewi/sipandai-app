<script setup lang="ts">
useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} - SIPANDAI` : 'SIPANDAI';
  }
})
</script>


<template>
   <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

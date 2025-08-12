<script setup lang="ts">
import { DEFAULT_PADDING_X } from '@/utils/constants'
</script>
<template>
  <div>
    <Header />
    <div :class="DEFAULT_PADDING_X">
      <slot />
    </div>
    <Footer/>
  </div>
</template>

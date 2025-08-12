<script setup lang="ts">
import { DEFAULT_PADDING_X } from "@/utils/constants";
</script>
<template>
  <footer :class="DEFAULT_PADDING_X + DEFAULT_PADDING_Y_MD + ' bg-slate-500 '">
    <!-- logo+konten -->
    <div class="flex items-center justify-between pb-4 sm:pb-8">
      <BpsLogo />
      <div class="socmed-group flex gap-x-2 sm:gap-x-4">
        <Icon name="logos:youtube-icon" size="24" />
        <Icon name="skill-icons:instagram" size="24" />
        <Icon name="hugeicons:new-twitter" size="24" />
      </div>
    </div>
    <div class="cr pt-4 sm:pt-8 border-t">
      <p class="text-xs sm:text-base lg:text-lg text-center">
        &copy; BPS Kabupaten Polewali Mandar 2025
      </p>
    </div>
  </footer>
</template>

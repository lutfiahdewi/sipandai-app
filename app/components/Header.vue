<script setup lang="ts">
import { DEFAULT_PADDING_X } from "@/utils/constants";
const isOpen = ref(false);
const toggleMobileMenu = () => {
  isOpen.value = !isOpen.value;
  console.log(isOpen.value);
};
</script>

<template>
  <header class="sticky top-0 bg-slate-100 shadow-md opacity-95">
    <div
      :class="
        DEFAULT_PADDING_X +
        DEFAULT_PADDING_Y +
        'flex justify-between py-2 sm:py-4'
      "
    >
      <!-- logo-nama  -->
      <BpsLogo />
      <!-- Hamburger (only on small screens) -->
      <button
        class="flex sm:hidden focus:outline-none items-center"
        @click="toggleMobileMenu"
        aria-label="Toggle menu"
      >
        <Icon
          name="line-md:menu-to-close-alt-transition"
          class="transition duration-700 ease-in-out transform rotate-180"
          size="24"
          v-if="isOpen"
        />
        <Icon
          name="line-md:close-to-menu-alt-transition"
          class="transition duration-700 ease-in-out transform"
          size="24"
          v-else
        />
      </button>

      <!-- Desktop Menu -->
      <nav class="hidden sm:flex space-x-6 items-center justify-between">
        <NuxtLink to="/" class="text-gray-700 hover:text-blue-600"
          >Beranda</NuxtLink
        >
        <NuxtLink to="/" class="text-gray-700 hover:text-blue-600"
          >Kategori</NuxtLink
        >
        <NuxtLink to="/" class="text-gray-700 hover:text-blue-600"
          >Tentang</NuxtLink
        >
      </nav>
    </div>

    <!-- Mobile Menu (shown below nav when open) -->
    <nav
      v-if="isOpen"
      class="sm:hidden p-2 bg-slate-200 border-t border-gray-500"
    >
      <NuxtLink
        to="/"
        class="block text-gray-700 hover:text-blue-600 hover:bg-slate-300 rounded-b-lg p-2"
        >Beranda</NuxtLink
      >
      <NuxtLink
        to="/kategori"
        class="block text-gray-700 hover:text-blue-600 hover:bg-slate-300 rounded-b-lg p-2"
        >Kategori</NuxtLink
      >
      <NuxtLink
        to="/tentang"
        class="block text-gray-700 hover:text-blue-600 hover:bg-slate-300 rounded-b-lg p-2"
        >Tentang</NuxtLink
      >
    </nav>
  </header>
</template>

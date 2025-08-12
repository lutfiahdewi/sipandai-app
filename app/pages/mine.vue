<script setup lang="ts">
definePageMeta({
  layout: false,
})
import { ref } from 'vue'

const isOpen = ref(false)
const toggleMobileMenu = () => {
  isOpen.value = !isOpen.value
}
</script>

<template>
  <header class="bg-white shadow-md">
    <div class="flex items-center justify-between px-4 py-3 sm:px-8">
      <!-- Logo & App Name -->
      <div class="flex items-center gap-2">
        <img src="~assets/img/logo.svg" alt="Logo" class="w-8 h-8" />
        <span class="text-xl font-semibold text-gray-800">SIPANDAI</span>
      </div>

      <!-- Hamburger (only on small screens) -->
      <button
        class="sm:hidden focus:outline-none"
        @click="toggleMobileMenu"
        aria-label="Toggle menu"
      >
        <svg
          v-if="!isOpen"
          class="w-6 h-6 text-gray-700"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
        </svg>
        <svg
          v-else
          class="w-6 h-6 text-gray-700"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>

      <!-- Desktop Menu -->
      <nav class="hidden sm:flex space-x-6">
        <NuxtLink to="/" class="text-gray-700 hover:text-blue-600">Beranda</NuxtLink>
        <NuxtLink to="/kategori" class="text-gray-700 hover:text-blue-600">Kategori</NuxtLink>
        <NuxtLink to="/tentang" class="text-gray-700 hover:text-blue-600">Tentang</NuxtLink>
      </nav>
    </div>

    <!-- Mobile Menu (shown below nav when open) -->
    <nav
      v-if="isOpen"
      class="sm:hidden px-4 pb-4 space-y-2 bg-white border-t border-gray-100"
    >
      <NuxtLink to="/" class="block text-gray-700 hover:text-blue-600">Beranda</NuxtLink>
      <NuxtLink to="/kategori" class="block text-gray-700 hover:text-blue-600">Kategori</NuxtLink>
      <NuxtLink to="/tentang" class="block text-gray-700 hover:text-blue-600">Tentang</NuxtLink>
    </nav>
  </header>
</template>

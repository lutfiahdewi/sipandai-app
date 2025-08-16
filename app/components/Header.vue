<script setup lang="ts">
import { DEFAULT_PADDING_X } from "@/utils/constants";
const isOpen = ref(false);
const toggleMobileMenu = () => {
  isOpen.value = !isOpen.value;
  console.log(isOpen.value);
};
interface menu {
  name: string;
  url: string;
  desc?: string;
}
const menuItems: menu[] = [
  { name: "Beranda", url: "/" },
  { name: "Tentang", url: "/about" },
];
</script>

<template>
  <header class="sticky top-0 z-99 bg-slate-200 shadow-md opacity-95">
    <div
      :class="
        DEFAULT_PADDING_X +
        DEFAULT_PADDING_Y +
        'flex justify-between py-2 sm:py-4'
      "
    >
      <!-- logo-nama  -->
      <BpsLogo color="black" />
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
        <InputSearch />
        <NuxtLink
          v-for="item in menuItems"
          :to="item.url"
          :title="item.desc"
          class="text-gray-700 hover:text-orange-600"
          >{{ item.name }}</NuxtLink
        >
      </nav>
    </div>

    <!-- Mobile Menu (shown below nav when open) -->
    <nav
      v-if="isOpen"
      class="sm:hidden p-2 bg-slate-200 border-t border-gray-500"
    >
      <InputSearch />
      <NuxtLink
        v-for="item in menuItems"
        :to="item.url"
        class="block text-gray-700 hover:text-orange-600 hover:bg-slate-300 rounded-lg p-2 mb-1"
        :title="item.desc"
        >{{ item.name }}</NuxtLink
      >
    </nav>
  </header>
</template>

<script setup lang="ts">
import useGoToCategory from "~/composables/useGoToCategory";

const supabase = useSupabaseClient();
const { data: categories } = await supabase
  .from("categories")
  .select("*")
  .order("created_at", { ascending: true });

function getImageUrl(path: string) {
  return supabase.storage.from("uploads").getPublicUrl(path).data.publicUrl;
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 px-6 py-12">
    <div class="max-w-4xl mx-auto text-center">
      <h1 class="text-3xl md:text-4xl font-bold mb-4">
        Selamat Datang di SIPANDAI
      </h1>
      <p class="text-gray-600 mb-8">
        Sistem Pengelolaan Dokumentasi Berkas Elektronik untuk Tim dan Program
        Kerja
      </p>

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <button
          v-for="category in categories"
          :key="category.id"
          @click="useGoToCategory(category.id)"
          class="flex flex-col items-center justify-center p-4 bg-white shadow rounded-xl hover:bg-blue-50 transition"
        >
          <img
            v-if="category.icon_path"
            :src="getImageUrl(category.icon_path)"
            alt="icon"
            class="w-12 h-12 mb-2 object-contain"
          />
          <span class="text-lg font-semibold text-gray-800">{{
            category.name
          }}</span>
        </button>
      </div>
      {{ categories }}
    </div>
  </div>
</template>

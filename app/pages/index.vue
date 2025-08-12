<script setup lang="ts">
import useGetImageUrl from '~/composables/useGetImageUrl'
definePageMeta({
  layout: false,
})
useHead({
    title:"Beranda"
})
 const supabase = useSupabaseClient()

const categories = ref([])

onMounted(async () => {
  const { data, error } = await supabase
    .from('categories')
    .select('id, name, icon_path')

  if (!error) categories.value = data
})
      
</script>

<template>
  <Header/>
  <div class="space-y-8 py-8 sm:space-y-12 sm:pb-12 sm:pt-0">
    <!-- Banner Section -->
    <section class="-px-8 max-h-[70vh] flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden">
      <!-- Left section -->
      <div class="px-4 sm:px-8 lg:px-16">
        <h1 class="mb-4 sm:mb-6 lg:mb-10 text-3xl sm:text-5xl lg:text-7xl font-bold text-gray-800 text-center sm:text-left">SIPANDAI</h1>
        <p class="mb-4 sm:mb-6 lg:mb-10 text-2xl sm:text-4xl lg:text-5xl font-semibold text-gray-600 text-center sm:text-left">Sistem Informasi Pengelolaan Arsip Digital dan Integrasi</p>
        <div class="flex justify-center sm:justify-start gap-x-4 mb-2">
          <NuxtLink to="/login">
            <button type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm sm:text-base lg:text-lg px-5 py-2.5 focus:outline-none ">Admin</button>
          </NuxtLink>
          <button type="button" class="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm sm:text-base lg:text-lg px-5 py-2.5 text-center ">Default</button>
        </div>
      </div>
      <!-- Right section-->
      <div class="rounded-lg w-full sm:max-w-1/2 r">
        <img
        src="~/assets/img/main.jpg"
        alt="Maskot atau Kantor"
        class="object-cover"
        />
      </div>
    </section>

    <!-- Category Section -->
    <section :class="DEFAULT_PADDING_X + DEFAULT_PADDING_Y_LG + ''">
      <h2 class="text-lg sm:text-xl lg:text-2xl text-center font-semibold text-gray-700 mb-4">Kategori</h2>
      <div class="flex flex-col sm:flex-row sm:flex-wrap gap-y-4 sm:gap-x-8 lg:gap-x-12">
        <CardCategory
          v-for="cat in categories"
          :key="cat.id"
          :id="cat.id"
          :name="cat.name"
          :icon-path="useGetImageUrl(cat.icon_path, supabase)"
        />
      </div>
      <a href="https://www.flaticon.com/free-icons/population" title="population icons">Population icons created by Freepik - Flaticon</a>
    </section>
  </div>

  <Footer/>
</template>



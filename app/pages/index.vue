<script setup lang="ts">
import type { Database } from "~/types/supabase";
import _ from "lodash";
import useGetImageUrl from "~/composables/useGetImageUrl";

useHead({
  title: "Beranda",
});

const supabase = useSupabaseClient<Database>();
const categories: Ref<Database["public"]["Tables"]["categories"]["Row"][]> =
  ref([]);
// const mainCategory: Ref<Database["public"]["Tables"]["categories"]["Row"] | undefined> = ref()
const mainDocuments: Ref<Database["public"]["Tables"]["documents"]["Row"][]> =
  ref([]);
const polmanDocuments: Ref<Database["public"]["Tables"]["documents"]["Row"][]> =
  ref([]);

async function getDocumentsFiltered(name: string) {
  const { data, error } = await supabase
    .from("documents")
    .select(
      `
    *,
    categories!inner (
      id,
      name,
      slug
    )
  `
    )
    .eq("categories.name", name); // filter pakai nama kategori
  if (!error) {
    data.sort((a, b) => {
      const dateA = new Date(a.activity_date);
      const dateB = new Date(b.activity_date);
      return dateA - dateB; // Subtracting Date objects yields their difference in milliseconds
    });
  }
  return { data, error };
}

onMounted(async () => {
  const { data, error } = await supabase
    .from("categories")
    .select("id, name, description, icon_path, slug");
  if (!error) {
    _.remove(data, { name: "Main" }); //Exclude the main category
    _.remove(data, { name: "polman" }); //Exclude the polman category
    categories.value = data;
  }
  const { data: dataAplikasi, error: errorAplikasi } =
    await getDocumentsFiltered("Main");
  if (!errorAplikasi) mainDocuments.value = dataAplikasi;
  const { data: dataPolman, error: errorPolman } = await getDocumentsFiltered(
    "polman"
  );
  if (!errorPolman) polmanDocuments.value = dataPolman;
});
</script>

<template>
  <div :class="DEFAULT_PADDING_X_MINUS">
    <!-- Banner Section -->
    <section class="relative w-full">
      <img src="/img/front.JPG" alt="Hero" class="w-screen h-auto" />
      <div class="absolute inset-0 bg-gray-800 opacity-50"></div>

      <div
        class="absolute inset-0 px-8 sm:px-32 lg:px-48 flex flex-col items-center justify-center"
      >
        <h1
          class="mb-2 sm:mb-4 lg:mb-6 text-3xl sm:text-6xl lg:text-8xl font-bold text-slate-50 text-center text-shadow-lg bg-orange-400 p-2 rounded-lg"
        >
          SIPANDAI
        </h1>
        <p
          class="mb-2 sm:mb-6 lg:mb-10 text-lg sm:text-3xl lg:text-6xl font-semibold text-slate-200 text-center"
        >
          Sistem Informasi Pengelolaan Arsip Digital Terintegrasi
        </p>
        <div class="flex justify-center sm:justify-start gap-x-4 mb-2 lg:mb-64">
          <NuxtLink to="/login">
            <button
              type="button"
              class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm sm:text-base lg:text-lg px-5 py-2.5 focus:outline-none"
            >
              Admin
            </button>
          </NuxtLink>
          <button
            type="button"
            class="hidden text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm sm:text-base lg:text-lg px-5 py-2.5 text-center"
          >
            Default
          </button>
        </div>
      </div>
    </section>
    <!-- Main App Section -->
    <SectionList
      title="Aplikasi BPS Pusat dan Provinsi"
      section-class="bg-orange-100 "
    >
      <CardLink
        v-for="doc in mainDocuments"
        :key="doc.id"
        :id="doc.id"
        :name="doc.name"
        :desc="doc.description"
        :icon-path="useGetImageUrl(doc.icon_path, supabase)"
        :url="doc.url"
      />
    </SectionList>
    <hr class="border-gray-500" />

    <!-- Polman App Section -->
    <SectionList title="Tautan Dokumen BPS Polman" section-class="bg-sky-100 ">
      <CardLink
        v-for="doc in polmanDocuments"
        :key="doc.id"
        :id="doc.id"
        :name="doc.name"
        :desc="doc.description"
        :icon-path="useGetImageUrl(doc.icon_path, supabase)"
        :url="doc.url"
      />
    </SectionList>
    <hr class="border-gray-500" />

    <!-- Category Section -->
    <SectionList
      id="categoryList"
      title="Kategori tim dan lain-lain"
      title-class="text-orange-600"
    >
      <CardCategory
        v-for="cat in categories"
        :key="cat.id"
        :id="cat.id"
        :name="cat.name"
        :slug="cat.slug"
        :icon-path="useGetImageUrl(cat.icon_path, supabase)"
      />
    </SectionList>
  </div>
</template>

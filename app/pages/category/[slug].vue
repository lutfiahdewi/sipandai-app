<script setup lang="ts">
import { useRoute } from "vue-router";
import { useSupabaseClient } from "#imports";
import { ref, onMounted } from "vue";
import type { Database } from "~/types/supabase";
import type { QueryResult, QueryData, QueryError } from "@supabase/supabase-js";

const route = useRoute();
const supabase = useSupabaseClient();

const category: Ref<Database["public"]["Tables"]["categories"]["Row"] | null> =
  ref(null);
const subcategories1: Ref<
  Database["public"]["Tables"]["subcategories1"]["Row"][]
> = ref([]);
const documents: Ref<Database["public"]["Tables"]["documents"]["Row"][]> = ref(
  []
);
const isLoading = ref(true);

const categorySlug = route.params.slug;
onMounted(async () => {
  const queryAll = supabase
    .from("categories")
    .select(
      `
    *,
    subcategories1(id, name, slug, icon_path),
    documents(id, name, slug, icon_path, url)
  `
    )
    .eq("slug", categorySlug)
    .single();

  type queryBulk = QueryData<typeof queryAll>;
  const { data, error } = await queryAll;
  if (error) throw error;
  const result: queryBulk = data;
  category.value = result;
  subcategories1.value = result.subcategories1;
  documents.value = result.documents;

  isLoading.value = false;
});
useHead({
  title: category.value?.name,
});
</script>

<template>
  <div class="">
    <!-- Loading -->
    <div v-if="isLoading"><IndicatorLoading /></div>

    <div v-else>
      <!-- Kategori Deskripsi -->
      <SectionList
        v-if="category"
        :title="category.name"
        :section-class="DEFAULT_PADDING_X_MINUS + ' pt-4 bg-orange-100 '"
        title-class="text-3xl sm:text-4xl lg:text-6xl font-bold text-gray-800"
      >
        <!-- Gambar float kiri -->
        <img
          v-if="category.photo_path"
          :src="useGetImageUrl(category.photo_path, supabase)"
          :alt="'Foto ' + category.name"
          :title="'Foto ' + category.name"
          class="lg:float-left w-full lg:max-w-180 mr-4 mb-2 rounded-xl object-contain shadow"
        />
        <!-- Teks deskripsi -->
        <p
          v-if="category.description"
          class="text-gray-700 text-base sm:text-lg"
        >
          {{ category.description }}
        </p>
      </SectionList>
      <!-- Subkategori -->
      <SectionList
        v-if="true"
        id="categoryList"
        title="Subkategori"
        section-class=""
        title-class="text-orange-600"
      >
        <CardCategory
          v-for="cat in subcategories1"
          :key="cat.id"
          :id="cat.id"
          :name="cat.name"
          :icon-path="useGetImageUrl(cat.icon_path, supabase)"
          :slug="'subcategory1/' + cat.slug"
        />
      </SectionList>
      <!-- Dokumen dibawah kategori ini -->
      <SectionList
        v-if="documents"
        title="Dokumen dan lain-lain"
        section-class="border-t border-slate-600 "
      >
        <CardLink
          v-for="doc in documents"
          :key="doc.id"
          :id="doc.id"
          :name="doc.name"
          :desc="doc.description"
          :icon-path="useGetImageUrl(doc.icon_path, supabase)"
          :url="doc.url"
        />
      </SectionList>
    </div>
  </div>
</template>

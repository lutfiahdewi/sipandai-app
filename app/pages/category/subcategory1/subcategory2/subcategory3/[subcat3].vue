<script setup lang="ts">
import { useRoute } from "vue-router";
import { useSupabaseClient } from "#imports";
import { ref, onMounted } from "vue";
import type { Database } from "~/types/supabase";
import type { QueryResult, QueryData, QueryError } from "@supabase/supabase-js";
import { useNavigation } from "~/composables/useNavigation";

const route = useRoute();
const supabase = useSupabaseClient();

const subcategories3: Ref<
  Database["public"]["Tables"]["subcategories3"]["Row"]
> = ref([]);
const documents: Ref<Database["public"]["Tables"]["documents"]["Row"][]> = ref(
  []
);
const isLoading = ref(true);
const subcat = route.params.subcat3 as string;
const nav = useNavigation("subcategory3");

nav.subcat3.value = subcat;
onMounted(async () => {
  const queryAll = supabase
    .from("subcategories3")
    .select(`*`)
    .eq("slug", subcat)
    .single();

  type queryBulk = QueryData<typeof queryAll>;
  const { data, error } = await queryAll;
  if (error) throw error;
  const result: queryBulk = data;
  subcategories3.value = result;

  //data dokumen
  const { data: dataDocuments, error: errorDocuments } = await supabase
    .from("documents")
    .select("id, name, slug, icon_path, url")
    .eq("subcategory3_id", subcategories3.value.id);
  documents.value = dataDocuments;

  isLoading.value = false;
});
useHead({
  title: subcategories3.value?.name,
});
</script>

<template>
  <div class="">
    <!-- Loading -->
    <div v-if="isLoading"><IndicatorLoading /></div>

    <div v-else class="flex flex-col min-h-[70vh]">
      <!-- Kategori Deskripsi -->
      <SectionContent
        v-if="subcategories3"
        :title="subcategories3.name"
        :section-class="DEFAULT_PADDING_X_MINUS + ' pt-4 bg-orange-100 '"
        title-class="text-3xl sm:text-4xl lg:text-6xl font-bold text-gray-800"
      >
        <!-- breadcrumbs -->
        <nav>
          <NuxtLink v-if="nav.category" :to="`/category/${nav.category.value}`">{{
            nav.category.value
          }}</NuxtLink>
          <NuxtLink v-if="nav.subcat1" :to="`/category/subcategory1/${nav.subcat1.value}`">{{
            ' > '+nav.subcat1.value
          }}</NuxtLink>
          <NuxtLink v-if="nav.subcat2" :to="`/category/subcategory1/subcategory2/${nav.subcat2.value}`">{{
            ' > '+nav.subcat2.value
          }}</NuxtLink>
          <NuxtLink v-if="nav.subcat3" :to="`/category/subcategory1/subcategory2/subcategory3/${nav.subcat3.value}`">{{
            ' > '+nav.subcat3.value
          }}</NuxtLink>
        </nav>
        <!-- Gambar -->
        <img
          v-if="subcategories3.photo_path"
          :src="useGetImageUrl(subcategories3.photo_path, supabase)"
          :alt="'Foto ' + subcategories3.name"
          :title="'Foto ' + subcategories3.name"
          class="w-full lg:max-w-180 mb-2 rounded-xl object-contain shadow"
        />
        <!-- Teks deskripsi -->
        <div
          v-if="subcategories3.description"
          class="desc text-gray-700 text-base sm:text-lg sm:w-96 lg:w-240"
        >
          <p>{{ subcategories3.description }}</p>
        </div>
      </SectionContent>
      <!-- Subkategori -->
      <!-- <SectionList
        v-if="true"
        id="categoryList"
        title="Subkategori 3"
        section-class=""
        title-class="text-orange-600"
      >
        <CardCategory
          v-for="cat in subcategories3"
          :key="cat.id"
          :id="cat.id"
          :name="cat.name"
          :icon-path="useGetImageUrl(cat.icon_path, supabase)"
          :slug="`subcategory1/subcategory2/subcategory3/${cat.slug}`"
        />
      </SectionList> -->
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
      <div class="dummy flex-1"></div>
    </div>
  </div>
</template>

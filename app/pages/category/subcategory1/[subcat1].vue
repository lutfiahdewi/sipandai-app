<script setup lang="ts">
import { useRoute } from "vue-router";
import { useSupabaseClient } from "#imports";
import { ref, onMounted } from "vue";
import type { Database } from "~/types/supabase";
import type { QueryResult, QueryData, QueryError } from "@supabase/supabase-js";
import { useNavigation } from "~/composables/useNavigation";

const route = useRoute();
const supabase = useSupabaseClient();

const subcategories1: Ref<
  Database["public"]["Tables"]["subcategories1"]["Row"] | null
> = ref(null);
const subcategories2: Ref<
  Database["public"]["Tables"]["subcategories2"]["Row"][]
> = ref([]);
const documents: Ref<Database["public"]["Tables"]["documents"]["Row"][]> = ref(
  []
);
const isLoading = ref(true);
const nav = useNavigation("subcategory1");
const subcat = route.params.subcat1 as string;
nav.subcat1.value = subcat;
onMounted(async () => {
  const queryAll = supabase
    .from("subcategories1")
    .select(`*, subcategories2(id, name, slug, icon_path)`)
    .eq("slug", subcat)
    .single();

  type queryBulk = QueryData<typeof queryAll>;
  const { data, error } = await queryAll;
  if (error) throw error;
  const result: queryBulk = data;
  subcategories1.value = result;
  subcategories2.value = result.subcategories2;

  //data dokumen
  const { data: dataDocuments, error: errorDocuments } = await supabase
    .from("documents")
    .select("id, name, slug, icon_path, url")
    .eq("subcategory1_id", subcategories1.value.id)
    .is("subcategory2_id", null);
  documents.value = dataDocuments;

  isLoading.value = false;
});
useHead({
  title: subcategories1.value?.name,
});
</script>

<template>
  <div class="">
    <!-- Loading -->
    <div v-if="isLoading"><IndicatorLoading /></div>

    <div v-else class="flex flex-col min-h-[70vh]">
      <!-- Kategori Deskripsi -->
      <SectionContent
        v-if="subcategories1"
        :title="subcategories1.name"
        :section-class="DEFAULT_PADDING_X_MINUS + ' pt-4 bg-orange-100 '"
        title-class="text-3xl sm:text-4xl lg:text-6xl font-bold text-gray-800"
      >
        <!-- breadcrumbs -->
        <Breadcrumb />
        <!-- Gambar -->
        <img
          v-if="subcategories1.photo_path"
          :src="useGetImageUrl(subcategories1.photo_path, supabase)"
          :alt="'Foto ' + subcategories1.name"
          :title="'Foto ' + subcategories1.name"
          class="w-full lg:max-w-180 mb-2 rounded-xl object-contain shadow"
        />
        <!-- Teks deskripsi -->
        <div
          v-if="subcategories1.description"
          class="desc text-gray-700 text-base sm:text-lg sm:w-96 lg:w-240"
        >
          <p>{{ subcategories1.description }}</p>
        </div>
      </SectionContent>
      <!-- Subkategori -->
      <SectionList
        v-if="true"
        id="categoryList"
        title="Subkategori 2"
        section-class=""
        title-class="text-orange-600"
      >
        <CardCategory
          v-for="cat in subcategories2"
          :key="cat.id"
          :id="cat.id"
          :name="cat.name"
          :icon-path="useGetImageUrl(cat.icon_path, supabase)"
          :slug="`subcategory1/subcategory2/${cat.slug}`"
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
      <div class="dummy flex-1"></div>
    </div>
  </div>
</template>

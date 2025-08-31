<script setup lang="ts">
import { useRoute } from "vue-router";
import { useSupabaseClient } from "#imports";
import { ref, onMounted } from "vue";
import type { Database } from "~/types/supabase";
import type { QueryResult, QueryData, QueryError } from "@supabase/supabase-js";
import { useNavigation } from "~/composables/useNavigation";

const route = useRoute();
const supabase = useSupabaseClient();

const subcategories2: Ref<
  Database["public"]["Tables"]["subcategories2"]["Row"] | null
> = ref(null);
const subcategories3: Ref<
  Database["public"]["Tables"]["subcategories3"]["Row"][]
> = ref([]);
const documents: Ref<Database["public"]["Tables"]["documents"]["Row"][]> = ref(
  []
);
const isLoading = ref(true);
const nav = useNavigation("subcategory2");
const subcat = route.params.subcat2 as string;
nav.subcat2.value = subcat;
onMounted(async () => {
  const queryAll = supabase
    .from("subcategories2")
    .select(`*, subcategories3(id, name, slug, icon_path)`)
    .eq("slug", subcat)
    .single();

  type queryBulk = QueryData<typeof queryAll>;
  const { data, error } = await queryAll;
  if (error) throw error;
  const result: queryBulk = data;
  subcategories2.value = result;
  subcategories3.value = result.subcategories3;

  //data dokumen
  const { data: dataDocuments, error: errorDocuments } = await supabase
    .from("documents")
    .select("id, name, slug, icon_path, url")
    .eq("subcategory2_id", subcategories2.value.id)
    .is("subcategory3_id", null);
  documents.value = dataDocuments;

  isLoading.value = false;
});
useHead({
  title: subcategories2.value?.name,
});
</script>

<template>
  <div class="">
    <!-- Loading -->
    <div v-if="isLoading"><IndicatorLoading /></div>

    <div v-else class="flex flex-col min-h-[70vh]">
      <!-- Kategori Deskripsi -->
      <SectionContent
        v-if="subcategories2"
        :title="subcategories2.name"
        :section-class="DEFAULT_PADDING_X_MINUS + ' pt-4 bg-orange-100 '"
        title-class="text-3xl sm:text-4xl lg:text-6xl font-bold text-gray-800"
      >
        <!-- breadcrumbs -->
        <Breadcrumb />
        <!-- Gambar -->
        <img
          v-if="subcategories2.photo_path"
          :src="useGetImageUrl(subcategories2.photo_path, supabase)"
          :alt="'Foto ' + subcategories2.name"
          :title="'Foto ' + subcategories2.name"
          class="w-full lg:max-w-180 mb-2 rounded-xl object-contain shadow"
        />
        <!-- Teks deskripsi -->
        <div
          v-if="subcategories2.description"
          class="desc text-gray-700 text-base sm:text-lg sm:w-96 lg:w-240"
        >
          <p>{{ subcategories2.description }}</p>
        </div>
      </SectionContent>
      <!-- Subkategori -->
      <SectionList
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

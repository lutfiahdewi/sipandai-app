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
const subcategories: Ref<
  Database["public"]["Tables"]["subcategories1"]["Row"][]
> = ref([]);
const documents: Ref<
  Database["public"]["Tables"]["documents"]["Row"][]
> = ref([]);
const pending = ref(true);

onMounted(async () => {
  const categoryId = route.params.id;
  const queryAll = supabase
    .from("categories")
    .select(
      `
    *,
    subcategories1(*),
    documents(*)
  `
    )
    .eq("id", categoryId)
    .single();

  type QueryAll = QueryData<typeof queryAll>;
  const { data, error } = await queryAll;
  if (error) throw error;
  const result: QueryAll = data;
  console.log(result);

  category.value = result;
  subcategories.value = result.subcategories1;
  documents.value = result.documents;

  // const { data, error } = await supabase
  //   .from("categories")
  //   .select(
  //     `
  //   (id, name, icon_path, description,photo_path)`
  //   )
  //   .eq("id", categoryId) // categoryId from router params
  //   .single();

  // const { data: subcategories, error: errorSubcategories } = await supabase
  //   .from("subcategories1")
  //   .select("id, name, icon_path, description")
  //   .eq("category_id", categoryId);

  // console.log(subcategories);
  // console.log(data);

  // if (!error) {
  //   category.value = data;
  // } else {
  //   console.log(error);
  // }

  pending.value = false;
});
useHead({
  title: category.value?.name,
});
</script>

<template>
  <div class="">
    <!-- Loading -->
    <div v-if="pending"><IndicatorLoading /></div>

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
          v-for="cat in subcategories"
          :key="cat.id"
          :id="cat.id"
          :name="cat.name"
          :icon-path="useGetImageUrl(cat.icon_path, supabase)"
        />
      </SectionList>
      <!-- Dokumen dibawah kategori ini -->
      <SectionList v-if="documents" title="Dokumen dan lain-lain" section-class="border-t border-slate-600 ">
        <!-- <CardLink/> -->
      </SectionList>
    </div>
  </div>
</template>

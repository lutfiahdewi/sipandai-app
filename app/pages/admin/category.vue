<script setup lang="ts">
import { ButtonDefault, ModalBase } from "#components";
import type { Database } from "~/types/supabase";

definePageMeta({
  layout: "admin",
});

const tableName = "categories";
const newCategory = ref<InstanceType<typeof ModalBase> | null>(null);
const columns = [
  {
    label: "Name",
    field: "name",
    thClass: "min-w-52",
    tdClass: "min-w-52",
  },
  {
    label: "Deskripsi",
    field: "description",
    thClass: "hidden sm:table-cell",
    tdClass: "hidden sm:table-cell",
  },
  {
    label: "Icon",
    field: "icon_path",
    type: "number",
    thClass: "hidden sm:table-cell",
    tdClass: "hidden sm:table-cell",
  },
  {
    label: "Subcat1",
    field: "sum",
    type: "number",
    thClass: "hidden sm:table-cell",
    tdClass: "hidden sm:table-cell",
  },
  {
    label: "Dibuat",
    field: "created_at",
    type: "date",
    dateInputFormat: "yyyy-MM-dd",
    dateOutputFormat: "dd MMM yyyy",
    thClass: "hidden sm:table-cell",
    tdClass: "hidden sm:table-cell",
  },
  {
    label: "Aksi",
    field: "id",
  },
];
const categories: Ref<Database["public"]["Tables"]["categories"]["Row"][]> =
  ref([]);
const loadingData = ref(false);
const supabase = useSupabaseClient();

// fetch categories data
const getData = async () => {
  loadingData.value = true;
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select("id, name, description, icon_path, photo_path, created_at::date");
    if (!error) {
      categories.value = data;
    }
  } finally {
    loadingData.value = false;
  }
};

// insert data ke tabel categories
const errorMessageCreate = ref("");
async function saveCategory(values: any) {
  if (errorMessageCreate.value.length != 0) errorMessageCreate.value = "";
  const { error } = await supabase.from("categories").insert(values);
  if (error) {
    errorMessageCreate.value = "Gagal membuat kategori. Pesan error: "+error.message;
  } else {
    refreshData();
    newCategory.value?.close();
  }
}

// delete data : done in button-delete component

//update data

// refresh data
const refreshData = async () => {
  loadingData.value = true;
  categories.value = [];
  await getData(); // always refresh
};
onMounted(getData);
</script>
<template>
  <div class="slot">
    <h1 class="mb-3 sm:mb-6 text-lg sm:text-2xl lg:text-4xl font-semibold">
      Kelola data kategori
    </h1>
    <ModalBase
      ref="newCategory"
      class-modal="w-full sm:max-w-[580px] lg:max-w-[980px]"
      class-header=" text-slate-800 font-semibold text-base sm:text-xl"
      class-body=" max-h-[60vh] sm:max-h-[65vh] "
      class-footer="  "
    >
      <template #header>
        <span>Tambah kategori baru</span>
      </template>
      <template #body>
        <FormCategory
          @submit="saveCategory"
          :create-error="errorMessageCreate"
        />
      </template>
      <template #footer></template>
    </ModalBase>
    <!-- grup tombol -->
    <div class="flex">
      <ButtonDefault
        name="Tambah Kategori"
        class="text-white bg-gradient-to-r from-orange-400 to-orange-500 hover:bg-gradient-to-br hover:from-orange-500 hover:to-orange-600 focus:ring-4 focus:outline-none focus:ring-orange-300 d shadow-lg shadow-orange-400/50 mb-3 sm:mb-6"
        @click="newCategory?.open()"
      >
        <IconAdd class="w-5 sm:w-6 lg:w-7 h-auto font-bold me-2" />
        <span>Tambah kategori</span>
      </ButtonDefault>
      <ButtonDefault
        @click="refreshData"
        :disabled="loadingData"
        name="refresh data"
        class="text-white bg-blue-500 rounded disabled:opacity-50 focus:ring-4 focus:outline-none focus:ring-blue-300 d shadow-lg shadow-blue-400/50 mb-3 sm:mb-6"
        ><Icon name="hugeicons:refresh" size="24 text-bold" class="me-2" />
        <span>
          {{ loadingData ? "Refreshing..." : "Refresh" }}
        </span>
      </ButtonDefault>
    </div>
    <div class="data-content">
      <vue-good-table
        :columns="columns"
        :rows="categories"
        :search-options="{ enabled: true }"
      >
        <template #table-row="props">
          <span
            v-if="props.column.field == 'id'"
            class="flex gap-x-1.5 sm:gap-x-3"
          >
            <button-delete
              :id="props.row.id"
              :name="props.row.name"
              :table="tableName"
              @refresh="refreshData"
            /><button-edit />
          </span>
          <span v-else-if="props.column.field == 'description'">
            <p class="line-clamp-3">{{ props.row.description }}</p>
          </span>
          <span v-else>
            {{ props.formattedRow[props.column.field] }}
          </span>
        </template>
      </vue-good-table>
    </div>
  </div>
</template>

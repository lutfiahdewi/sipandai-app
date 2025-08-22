<script setup lang="ts">
import {
  AlertError,
  AlertSuccess,
  ButtonDefault,
  CategoryCreate,
} from "#components";
import type { Database } from "~/types/supabase";

definePageMeta({
  layout: "admin",
});

const tableName = "categories";
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
const createCategory = ref<InstanceType<typeof CategoryCreate> | null>(null);
async function saveCategory(values: any) {
  if (errorMessageCreate.value.length != 0) errorMessageCreate.value = "";
  const { error } = await supabase.from("categories").insert(values);
  if (error) {
    alertError.value?.call(5);
    errorMessageCreate.value =
      "Gagal membuat kategori. Pesan error: " + error.message;
  } else {
    alertSuccess.value?.call(5);
    refreshData();
    createCategory.value?.close();
  }
}

// delete data : done in button-delete component, only pass the name and id to component. Some function or method pass by emit
//update data : done in child component
// refresh data
const refreshData = async () => {
  loadingData.value = true;
  categories.value = [];
  await getData(); // always refresh
  alertSuccess.value?.call(5);
};
//data tabel ditarik saat halaman sudah dirender
onMounted(getData);

//alert
const alertSuccess = ref<InstanceType<typeof AlertSuccess> | null>(null);
const alertError = ref<InstanceType<typeof AlertError> | null>(null);
</script>
<template>
  <div class="slot">
    <h1 class="mb-3 sm:mb-6 text-lg sm:text-2xl lg:text-4xl font-semibold">
      Kelola data kategori
    </h1>

    <!-- button group -->
    <div class="flex">
      <!-- Button Tambah kategori -->
      <CategoryCreate
        @submit="saveCategory"
        :create-error="errorMessageCreate"
        @resetError="errorMessageCreate = ''"
        ref="createCategory"
      />
      <!-- Button Refresh -->
      <ButtonDefault
        @click="refreshData"
        :disabled="loadingData"
        name="refresh data"
        class="text-white bg-green-500 rounded disabled:opacity-50 focus:ring-4 focus:outline-none focus:ring-green-300 d shadow-lg shadow-green-400/50 mb-3 sm:mb-6"
        ><IconRefresh
          class="w-5 sm:w-6 lg:w-7 me-2"
          :class="loadingData ? ' hidden ' : ' inline '"
        /><IconLoading
          class="w-5 sm:w-6 lg:w-7 fill-slate-50 me-2"
          :class="!loadingData ? ' hidden ' : ' inline '"
        />
        <span>
          {{ loadingData ? "Refreshing..." : "Refresh" }}
        </span>
      </ButtonDefault>
    </div>
    <!-- Tabel data -->
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
            <CategoryDelete
              :id="props.row.id"
              :name="props.row.name"
              :table="tableName"
              @refresh="refreshData"
              @show-error="alertError?.call(5)"
              @show-success="alertSuccess?.call(5)"
            />
            <CategoryEdit
              :id="props.row.id"
              :data="props.row"
              :table="tableName"
              @refresh="refreshData"
              @show-error="alertError?.call(5)"
              @show-success="alertSuccess?.call(5)"
            />
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
  <!-- Alert -->
  <AlertSuccess ref="alertSuccess">
    <template #content>
      <p class="font-medium">Data berhasil diperbarui!</p>
    </template>
  </AlertSuccess>
  <AlertError ref="alertError">
    <template #content>
      <p class="font-medium">Data gagal diperbarui!</p>
    </template>
  </AlertError>
</template>

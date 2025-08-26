<script setup lang="ts">
import { AlertError, AlertSuccess, DocumentDelete, DocumentEdit } from "#components";
import type { Database } from "~/types/supabase";

// Ubah tableName dan columns sesuai nama dan kolom tabel
const tableName = "documents";
const columns = [
  {
    label: "Name",
    field: "name",
    thClass: "min-w-52",
    tdClass: "min-w-52",
  },
  {
    label: "URL/Link",
    field: "url",
    thClass: "max-w-48 sm:max-w-64 ",
    tdClass: "max-w-48 sm:max-w-64 ",
  },
  {
    label: "Kategori",
    field: "categories.name",
    thClass: "hidden sm:table-cell",
    tdClass: "hidden sm:table-cell",
  },
  {
    label: "Sub Kategori 1",
    field: "subcategories1.name",
    thClass: "hidden sm:table-cell",
    tdClass: "hidden sm:table-cell",
  },
  {
    label: "Sub Kategori 2",
    field: "subcategories2.name",
    thClass: "hidden sm:table-cell",
    tdClass: "hidden sm:table-cell",
  },
  {
    label: "Sub Kategori 3",
    field: "subcategories3.name",
    thClass: "hidden sm:table-cell",
    tdClass: "hidden sm:table-cell",
  },

  {
    label: "Aksi",
    field: "id",
  },
];

const documents: Ref<Database["public"]["Tables"]["documents"]["Row"][]> = ref(
  []
);
const loadingData = ref(false);
const supabase = useSupabaseClient();

// fetch documents data documents
const getData = async () =>
  useGetAllData(
    tableName,
    documents,
    loadingData,
    supabase,
    `id, name, url, categories (name), subcategories1 (name), subcategories2 (name), subcategories3 (name)`
  );

// insert, edit dan deleta data : pada komponen child, hanya pass props dan emit
// refresh data
const refreshData = async () => {
  loadingData.value = true;
  documents.value = [];
  await getData(); // always refresh
  alertSuccess.value?.call(5);
  resetModal();
};
//data tabel ditarik saat halaman sudah dirender
onMounted(getData);

//alert
const alertSuccess = ref<InstanceType<typeof AlertSuccess> | null>(null);
const alertError = ref<InstanceType<typeof AlertError> | null>(null);

//Modal ref
const editModal = ref<InstanceType<typeof DocumentEdit> | null>(null);
const deleteModal = ref<InstanceType<typeof DocumentDelete> | null>(null);
// variables passed to modal components
const idEdit = ref("");
const id = ref("");
const name = ref("");
// modal open
function openEditModal(param: string) {
  idEdit.value = param;
  editModal.value?.open();
}
function openDeleteModal(param: string, param2: string) {
  id.value = param;
  name.value = param2;
  deleteModal.value?.open();
}
function resetModal() {
  id.value = "";
  idEdit.value = "";
  name.value = "";
}
</script>
<template>
  <!-- Modal utk edit dan delete -->
  <DocumentEdit
    :id="idEdit"
    :table="tableName"
    @refresh="refreshData"
    @reset="resetModal"
    @show-error="alertError?.call(5)"
    @show-success="alertSuccess?.call(5)"
    ref="editModal"
  />
  <DocumentDelete
    :id="id"
    :name="name"
    :table="tableName"
    ref="deleteModal"
    @refresh="refreshData"
    @show-error="alertError?.call(5)"
    @show-success="alertSuccess?.call(5)"
  />
  <div class="slot">
    <h1 class="mb-3 sm:mb-6 text-lg sm:text-2xl lg:text-4xl font-semibold">
      Kelola data tautan dokumen
    </h1>

    <!-- button group -->
    <div class="flex">
      <!-- Button Tambah tautan dokumen -->
      <DocumentCreate
        :table="tableName"
        @refresh="refreshData"
        @show-error="alertError?.call(5)"
        @show-success="alertSuccess?.call(5)"
      />
      <!-- Button Refresh -->
      <ButtonRefresh :loading-data="loadingData" @refresh-data="refreshData" />
    </div>
    <!-- Tabel data -->
    <div class="data-content">
      <vue-good-table
        :columns="columns"
        :rows="documents"
        :search-options="{ enabled: true }"
      >
        <template #table-row="props">
          <span
            v-if="props.column.field == 'id'"
            class="flex gap-x-1.5 sm:gap-x-3"
          >
            <button
              type="button"
              @click="openDeleteModal(props.row.id, props.row.name)"
            >
              <IconDelete
                class="w-7 h-7 sm:w-8 sm:h-8 p-[1px] rounded-md bg-red-500 text-white hover:bg-red-600 pointer-events-auto"
              />
            </button>
            <button @click="openEditModal(props.row.id)">
              <IconEdit
                class="w-7 h-7 sm:w-8 sm:h-8 p-1 rounded-md bg-blue-500 text-white hover:bg-blue-600"
              />
            </button>
          </span>
          <span v-else-if="props.column.field == 'url'">
            <NuxtLink
              class="line-clamp-2 text-blue-500 hover:underline hover:text-blue-700"
              :to="props.row.url"
              target="_blank"
            >
              {{ props.row.url }}</NuxtLink
            >
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

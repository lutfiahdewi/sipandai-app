<script setup lang="ts">
import { AlertError, AlertSuccess, ButtonDefault } from "#components";
import type { Database } from "~/types/supabase";
definePageMeta({
  layout: "admin",
});
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
    label: "Tanggal kegiatan",
    field: "activity_date",
    type: "date",
    dateInputFormat: "yyyy-MM-dd",
    dateOutputFormat: "dd MMM yyyy",
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
const documents: Ref<Database["public"]["Tables"]["documents"]["Row"][]> =
  ref([]);
const loadingData = ref(false);
const supabase = useSupabaseClient();

// fetch documents data
const getData = async () => {
  loadingData.value = true;
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select("id, name, description, icon_path, activity_date, created_at::date");
    if (!error) {
      documents.value = data;
    }
  } finally {
    loadingData.value = false;
  }
};

// insert, edit dan deleta data : pada komponen child, hanya pass props dan emit
// refresh data
const refreshData = async () => {
  loadingData.value = true;
  documents.value = [];
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
        :rows="documents"
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
            <!-- <CategoryEdit
              :id="props.row.id"
              :data="ref(props.row)"
              :table="tableName"
              @refresh="refreshData"
              @show-error="alertError?.call(5)"
              @show-success="alertSuccess?.call(5)"
            /> -->
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

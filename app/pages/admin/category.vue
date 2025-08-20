<script setup lang="ts">
import { ButtonDefault, ModalBase } from "#components";
import type { Database } from "~/types/supabase";

definePageMeta({
  layout: "admin",
});
const newCategory = ref<InstanceType<typeof ModalBase> | null>(null);
const columns = [
  {
    label: "Name",
    field: "name",
  },
  {
    label: "Deskripsi",
    field: "description",
  },
  {
    label: "Icon",
    field: "icon_path",
    type: "number",
  },
  {
    label: "Subcat1",
    field: "sum",
    type: "number",
  },
  {
    label: "Created On",
    field: "created_at",
    type: "date",
    dateInputFormat: "yyyy-MM-dd",
    dateOutputFormat: "dd MMM yyyy",
  },
  {
    label: "Aksi",
    field: "id",
  },
];

const rows = [
  { id: 1, name: "John", age: 20, createdAt: null, score: 0.03343 },
  { id: 2, name: "Jane", age: 24, createdAt: "2011-10-31", score: 0.03343 },
  { id: 3, name: "Susan", age: 16, createdAt: "2011-10-30", score: 0.03343 },
  { id: 4, name: "Chris", age: 55, createdAt: "2011-10-11", score: 0.03343 },
  { id: 5, name: "Dan", age: 40, createdAt: "2011-10-21", score: 0.03343 },
  { id: 6, name: "John", age: 20, createdAt: "2011-10-31", score: 0.03343 },
];

async function saveCategory(values: any) {
  const client = useSupabaseClient();
  const { error } = await client.from("categories").insert(values);

  if (error) {
    console.error(error);
    alert("Failed to save category");
  } else {
    alert("Category created!");
  }
}
const categories: Ref<Database["public"]["Tables"]["categories"]["Row"][]> =
  ref([]);
const supabase = useSupabaseClient();
onMounted(async () => {
  const { data, error } = await supabase
    .from("categories")
    .select("id, name, description, icon_path, photo_path, created_at::date");
  if (!error) {
    categories.value = data;
  }
});
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
        <div class="hidden form">
          <label for="block name mb-3">Nama </label>
          <input
            id="name"
            type="text"
            class="w-full rounded-lg text-slate-800"
          />
        </div>
        <FormCategory @submit="saveCategory" />
      </template>
      <template #footer></template>
    </ModalBase>
    <ButtonDefault
      name="Tambah Kategori"
      class="text-white bg-gradient-to-r from-orange-400 to-orange-500 hover:bg-gradient-to-br hover:from-orange-500 hover:to-orange-600 focus:ring-4 focus:outline-none focus:ring-orange-300 d shadow-lg shadow-orange-400/50 mb-3 sm:mb-6"
      @click="newCategory?.open()"
    >
      <IconAdd class="w-5 sm:w-6 lg:w-7 h-auto font-bold me-2" />
      <span>Tambah kategori</span>
    </ButtonDefault>
    <div class="data-content">
      <vue-good-table
        :columns="columns"
        :rows="categories"
        :search-options="{ enabled: true }"
      >
        <template #table-row="props">
          <span v-if="props.column.field == 'id'" class="flex gap-x-3">
            <button-delete :id="props.row.id" /><button-edit />
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

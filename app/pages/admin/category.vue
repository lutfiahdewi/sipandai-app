<script setup lang="ts">
import { ButtonDefault } from "#components";

definePageMeta({
  layout: "admin",
});

const columns = [
  {
    label: "Name",
    field: "name",
  },
  {
    label: "Age",
    field: "age",
    type: "number",
  },
  {
    label: "Created On",
    field: "createdAt",
    type: "date",
    dateInputFormat: "yyyy-MM-dd",
    dateOutputFormat: "MMM do yy",
  },
  {
    label: "Percent",
    field: "score",
    type: "percentage",
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
</script>
<template>
  <div class="slot">
    <h1 class="mb-3 sm:mb-6 text-lg sm:text-2xl lg:text-4xl font-semibold">
      Kelola data kategori
    </h1>
    <ButtonDefault
      name="Tambah Kategori"
      class="text-white bg-gradient-to-r from-orange-400 to-orange-500 hover:bg-gradient-to-br hover:from-orange-500 hover:to-orange-600 focus:ring-4 focus:outline-none focus:ring-orange-300 d shadow-lg shadow-orange-400/50"
    >
      <IconAdd class="w-5 sm:w-6 lg:w-7 h-auto font-bold me-2" />
      <span>Tambah kategori</span>
    </ButtonDefault>
    <div class="data-content">
      <vue-good-table
        :columns="columns"
        :rows="rows"
        :search-options="{ enabled: true }"
      >
        <template #table-row="props">
          <span v-if="props.column.field == 'id'" class="flex gap-x-3">
            <button-delete /><button-edit />
          </span>
          <span v-else>
            {{ props.formattedRow[props.column.field] }}
          </span>
        </template>
      </vue-good-table>
    </div>
  </div>
</template>

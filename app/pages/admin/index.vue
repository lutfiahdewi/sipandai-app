<script setup lang="ts">
import type { AlertError, AlertSuccess } from "#components";

//alert
const alertSuccess = ref<InstanceType<typeof AlertSuccess> | null>(null);
const alertError = ref<InstanceType<typeof AlertError> | null>(null);
</script>

<template>
  <div class="slot">
    <h1 class="text-center mb-5 sm:mb-8 text-lg sm:text-2xl lg:text-4xl font-semibold">
      Dashboard kelola tautan dan kategori SIPANDAI
    </h1>
    <div class="card-list flex flex-wrap justify-center gap-4 sm:gap-6">
      <CardStat
        table="categories"
        link="category"
        data-title="Kategori"
        @show-error="alertError?.call(5)"
        @show-success="alertSuccess?.call(5)"
      />
      <CardStat
        table="subcategories1"
        link="subcategory1"
        data-title="Sub Kategori 1"
        class-card="bg-cyan-100 border border-cyan-300 hover:bg-cyan-200"
        @show-error="alertError?.call(5)"
        @show-success="alertSuccess?.call(5)"
      /><CardStat
        table="subcategories2"
        link="subcategory2"
        data-title="Sub Kategori 2"
        class-card="bg-sky-100 border border-sky-300 hover:bg-sky-200"
        @show-error="alertError?.call(5)"
        @show-success="alertSuccess?.call(5)"
      /><CardStat
        table="subcategories3"
        link="subcategory3"
        data-title="Sub Kategori 3"
        class-card="bg-blue-100 border border-blue-300 hover:bg-blue-200"
        @show-error="alertError?.call(5)"
        @show-success="alertSuccess?.call(5)"
      /><CardStat
        table="documents"
        link="document"
        data-title="Tautan Dokumen"
        class-card="bg-lime-100 border border-lime-300 hover:bg-lime-200"
        @show-error="alertError?.call(5)"
        @show-success="alertSuccess?.call(5)"
      />
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

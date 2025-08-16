<script setup lang="ts">

</script>

<template>
  <form id="search-bar" class="flex items-center w-full">
    <label for="simple-search" class="sr-only">Search</label>
    <div class="relative w-full">
      <div
        class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none"
      >
        <Icon
          name="hugeicons:search-list-02"
          size="20"
          class="text-orange-500"
        />
        <!-- ikon -->
      </div>
      <input
        type="text"
        id="simple-search"
        class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-orange-500 focus:border-orange-500 block w-full ps-10 px-2.5 py-1.5"
        placeholder="Cari dokumen..."
        required
      />
    </div>
    <button
      type="submit"
      class="px-2.5 py-1.5 ms-2 font-medium text-white bg-orange-400 rounded-lg border border-orange-500 hover:bg-orange-500 focus:ring-4 focus:outline-none focus:ring-orange-300"
    >
      Cari
    </button>
  </form>
</template>

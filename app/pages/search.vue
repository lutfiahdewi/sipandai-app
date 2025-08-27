<!-- pages/search.vue -->
<script setup lang="ts">
import type { Database } from "~/types/supabase";

const router = useRouter(); // Nuxt router composable [6]
const route = useRoute();

const loading = ref(false);
const items = ref<Database["public"]["Tables"]["documents"]["Row"][]>([]);
const total = ref(0);
const page = ref<number>(Number(route.query.page || 1));
const perPage = 10;

let abortCtrl: AbortController | null = null;

const runSearch = async () => {
  console.log(route.query.q);
  if (abortCtrl) abortCtrl.abort();
  abortCtrl = new AbortController();
  loading.value = true;
  try {
    const data = await $fetch("/api/search", {
      params: { q: route.query.q || "", page: page.value, perPage },
      signal: abortCtrl.signal,
      headers: useRequestHeaders(["cookie"]),
    });
    items.value = (data as any).items;
    total.value = (data as any).total;
  } finally {
    loading.value = false;
  }
};

watch(
  () => [route.query.q, route.query.page],
  () => {
    page.value = Number(route.query.page || 1);
    const q = String(route.query.q || "");
    // Fetch for >=1 char or for empty (if showing cleared results)
    if (q.length >= 1) runSearch();
  },
  { immediate: true }
);

const totalPages = computed(() =>
  Math.max(1, Math.ceil(total.value / perPage))
);
const go = (p: number) => {
  router.replace({ query: { ...route.query, page: String(p) } });
};
</script>

<template>
  <section class="flex flex-col min-h-[70vh] max-w-3xl mx-auto p-4">
    <h3 class=""></h3>
    <h1 class="mb-3 sm:mb-6 text-lg sm:text-2xl lg:text-4xl font-semibold">
      Hasil Pencarian
    </h1>
    <div v-if="loading" class="text-sm text-gray-500">Mencari…</div>
    <div
      v-else-if="!items.length && route.query.q"
      class="text-sm text-gray-500"
    >
      Tidak ada hasil
    </div>
    <div v-else-if="!useIfStringEmpty(route.query.q as string)" class="text-sm text-gray-500">
      Ketik pada kolom pencarian untuk mencari...
    </div>

    <div v-else class="space-y-2">
      <NuxtLink
        v-for="it in items"
        :key="it.id"
        class="block p-3 border rounded hover:bg-orange-50 hover:border-orange-200 transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-103"
        :to="it.url"
        target="_blank"
      >
        <div class="font-medium">{{ it.name }}</div>
        <div class="text-gray-600 text-sm truncate">{{ it.description }}</div>
      </NuxtLink>
    </div>

    <div v-if="total > 0" class="flex items-center gap-2 mt-4">
      <button
        :disabled="page <= 1"
        class="px-3 py-1 border rounded disabled:opacity-50"
        @click="go(page - 1)"
      >
        Prev
      </button>
      <span class="text-sm">Page {{ page }} / {{ totalPages }}</span>
      <button
        :disabled="page >= totalPages"
        class="px-3 py-1 border rounded disabled:opacity-50"
        @click="go(page + 1)"
      >
        Next
      </button>
    </div>
    <div class="dummy flex-1"></div>
  </section>
</template>

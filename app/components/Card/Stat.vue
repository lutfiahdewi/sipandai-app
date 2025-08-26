<script setup lang="ts">
/**
 * 1. Make ref to make number ticker
 * 2. Query the total row use composable useGetTotalRow
 * 3. After waiting the result, start the loop
 * 4. in each loop make wait about smt ms
 */

import { NuxtLink } from "#components";
import { ref, watch, onMounted } from "vue";

interface Props {
  table: string;
  dataTitle: string;
  link: string;
  duration?: number; // animation time in ms
  classCard?: string;
}
const props = defineProps<Props>();
const emit = defineEmits<{
  //   (e: "refresh"): void;
  (e: "show-error"): void;
  (e: "show-success"): void;
}>();
const displayNumber = ref(0);
const totalRow = ref(0);

const supabase = useSupabaseClient();
async function getData() {
  const error = await useGetTotalRow(props.table, supabase, totalRow);
  if (error) {
    emit("show-error");
    return;
  }
  animateNumber(0, totalRow.value, props.duration ?? 2000);
}

function animateNumber(start: number, end: number, duration: number) {
  const startTime = performance.now();

  function tick(currentTime: number) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    displayNumber.value = Math.floor(start + (end - start) * progress);

    if (progress < 1) {
      requestAnimationFrame(tick);
    }
  }

  requestAnimationFrame(tick);
}

// Run on mount
onMounted(() => {
  getData();
});

// Run whenever `value` changes
watch(
  () => totalRow.value,
  (newVal, oldVal) => {
    animateNumber(oldVal, newVal, props.duration ?? 2000);
  }
);
</script>

<template>
  <NuxtLink
    :href="'/admin/' + link"
    class="
      block w-48 sm:w-72 px-4 py-3 sm:px-6 sm:py-5  rounded-lg shadow-sm 
    "
    :class="classCard??'bg-orange-100 border border-orange-300 hover:bg-orange-200'"
  >
    <h5
      class="mb-1 sm:mb-2 text-lg sm:text-2xl text-center font-medium leading-none tracking-tight text-gray-900"
    >
      Total Data {{ dataTitle }}
    </h5>
    <p class="text-2xl sm:text-4xl font-normal text-center text-gray-700">
      {{ displayNumber }}
    </p>
  </NuxtLink>
</template>

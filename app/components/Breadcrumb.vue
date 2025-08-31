<script setup lang="ts">
const nav = useNavigation();
</script>
<template>
  <nav>
    <NuxtLink v-if="nav.category" :to="`/category/${nav.category.value}`" class="hover:text-blue-600">{{
      nav.category.value
    }}</NuxtLink>
    <NuxtLink
      v-if="nav.subcat1.value"
      :to="`/category/subcategory1/${nav.subcat1.value}`" class="hover:text-blue-600"
      >{{ " > " + nav.subcat1.value }}</NuxtLink
    >
    <NuxtLink
      v-if="nav.subcat2.value"
      :to="`/category/subcategory1/subcategory2/${nav.subcat2.value}`" class="hover:text-blue-600"
      >{{ " > " + nav.subcat2.value }}</NuxtLink
    >
    <NuxtLink
      v-if="nav.subcat3.value"
      :to="`/category/subcategory1/subcategory2/subcategory3/${nav.subcat3.value}`" class="hover:text-blue-600"
      >{{ " > " + nav.subcat3.value }}</NuxtLink
    >
  </nav>
</template>

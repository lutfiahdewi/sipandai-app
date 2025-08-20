<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Create New Category</h1>
    <Dummy @submit="saveCategory" />
  </div>
</template>

<script setup lang="ts">


async function saveCategory(values: any) {
  const client = useSupabaseClient()
  const { error } = await client.from('categories').insert(values)

  if (error) {
    console.error(error)
    alert('❌ Failed to save category')
  } else {
    alert('✅ Category created!')
    navigateTo('/admin/categories')
  }
}
</script>

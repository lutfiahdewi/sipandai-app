<template>
  <div class="p-6 space-y-6">
    <!-- Loading -->
    <div v-if="pending">Loading...</div>

    <!-- Kategori Detail -->
    <div v-else>
      <h1 class="text-3xl font-bold text-gray-800">{{ category.name }}</h1>

      <div class="mt-4">
        <!-- Gambar float kiri -->
          <img
          v-if="category.photo_path"
          :src="getImageUrl(category.photo_path)"
          alt="Category Photo"
          class="float-left w-96 mr-4 mb-2 rounded-xl object-contain shadow"
          />
        <!-- Teks deskripsi yang membungkus -->
        <p v-if="category.description" class="inline text-gray-700 text-lg">
          {{ category.description }}
        </p>
      </div>

      <div class="p-8 w-96 bg-red-300 h-24 border rounded-xl shadow">
        <img
          v-if="category.photo_path"
          :src="getImageUrl(category.photo_path)"
          alt="Category Photo"
          class="object-contain mr-4 mb-2 "
          />
      </div>
      <!-- Subkategori -->
      <div class="mt-10">
        <h2 class="text-2xl font-semibold mb-4 text-gray-700">Subcategories</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            v-for="sub in subcategories"
            :key="sub.id"
            class="p-4 border rounded-xl shadow hover:shadow-md bg-white flex items-center gap-4"
          >
            <img
              v-if="sub.icon_path"
              :src="getImageUrl(sub.icon_path)"
              alt="Subcategory Icon"
              class="w-12 h-12 object-contain"
            />
            <div>
              <h3 class="text-lg font-semibold text-gray-800">{{ sub.name }}</h3>
              <p v-if="sub.description" class="text-sm text-gray-600">{{ sub.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useSupabaseClient } from '#imports'
import { ref, onMounted } from 'vue'

const route = useRoute()
const supabase = useSupabaseClient()

const category = ref({})
const subcategories = ref([])
const pending = ref(true)

function getImageUrl(path: string) {
  return supabase.storage.from('uploads').getPublicUrl(path).data.publicUrl
}

onMounted(async () => {
  const id = route.params.id

  // Ambil kategori
  const { data: cat, error: err1 } = await supabase
    .from('categories')
    .select('*')
    .eq('id', id)
    .single()

  if (!err1) category.value = cat

  // Ambil subkategori
  const { data: subs, error: err2 } = await supabase
    .from('subcategories')
    .select('*')
    .eq('category_id', id)

  if (!err2) subcategories.value = subs

  pending.value = false
})
</script>

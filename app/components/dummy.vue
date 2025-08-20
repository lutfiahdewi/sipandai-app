<script setup lang="ts">
import { Form, Field, ErrorMessage } from 'vee-validate'
import * as yup from 'yup'

const supabase = useSupabaseClient()
const { data: { session } } = await supabase.auth.getSession()
console.log(session?.user)

// Validation schema
const schema = yup.object({
  name: yup.string().required('Name is required'),
  description: yup.string().nullable(),
  icon: yup.mixed().nullable(),
  photo: yup.mixed().nullable()
})

const emit = defineEmits<{
  (e: 'submit', data: {
    name: string
    description?: string | null
    icon_path?: string | null
    photo_path?: string | null
  }): void
}>()

// helper for uploading
async function uploadFile(file: File, folder: string) {
  const filePath = `${folder}/${Date.now()}-${file.name}`
  const { error } = await supabase.storage.from('uploads').upload(filePath, file)
  if (error) throw error
  return filePath
}

// handler passed to <Form>
async function handleSubmit(values: any) {
  let icon_path = null
  let photo_path = null

  if (values.icon) {
    icon_path = await uploadFile(values.icon, 'icons')
  }
  if (values.photo) {
    photo_path = await uploadFile(values.photo, 'photos')
  }

  emit('submit', {
    name: values.name,
    description: values.description,
    icon_path,
    photo_path
  })
}
</script>

<template>
  <Form :validation-schema="schema" @submit="handleSubmit" v-slot="{ setFieldValue }">
    <div class="mb-4">
      <label class="block font-medium">Name</label>
      <Field name="name" class="border rounded p-2 w-full" />
      <ErrorMessage name="name" class="text-red-500 text-sm" />
    </div>

    <div class="mb-4">
      <label class="block font-medium">Description</label>
      <Field as="textarea" name="description" class="border rounded p-2 w-full" />
      <ErrorMessage name="description" class="text-red-500 text-sm" />
    </div>

    <div class="mb-4">
      <label class="block font-medium">Icon</label>
      <input type="file" @change="setFieldValue('icon', $event.target.files?.[0])" />
    </div>

    <div class="mb-4">
      <label class="block font-medium">Photo</label>
      <input type="file" @change="setFieldValue('photo', $event.target.files?.[0])" />
    </div>

    <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded">
      Save
    </button>
  </Form>
</template>

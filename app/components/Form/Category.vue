<script setup lang="ts">
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
const supabase = useSupabaseClient();
const isLoading = ref(false);

const props = defineProps<{
  createError?: string | null;
}>();
// Validation schema
const schema = yup.object({
  name: yup.string().required("Name harus diisi"),
  description: yup.string().nullable(),
  icon: yup.mixed().nullable(),
  photo: yup.mixed().nullable(),
});

const emit = defineEmits<{
  (
    e: "submit",
    data: {
      name: string;
      description?: string | null;
      icon_path?: string | null;
      photo_path?: string | null;
    }
  ): void;
}>();

// helper for uploading
async function uploadFile(file: File, folder: string) {
  console.log("Upload file called! =>", folder);
  const filePath = `${folder}/${Date.now()}-${file.name}`;
  const { error } = await supabase.storage
    .from("uploads")
    .upload(filePath, file);
  if (error) throw error;
  return filePath;
}

// handler passed to <Form>
async function handleSubmit(values: any) {
  console.log(values);
  let icon_path = null;
  let photo_path = null;

  if (values.icon) {
    icon_path = await uploadFile(values.icon, "icons");
  }
  if (values.photo) {
    photo_path = await uploadFile(values.photo, "photos");
  }
  console.log(values);

  emit("submit", {
    name: values.name,
    description: values.description,
    icon_path,
    photo_path,
  });
}

// For preview the icon and photo
// Previews
const iconPreview = ref<string | null>(null);
const photoPreview = ref<string | null>(null);

function onFileChange(
  e: Event,
  field: "icon" | "photo",
  setFieldValue: Function
) {
  const input = e.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;

  // update vee-validate form state
  setFieldValue(field, file);

  // revoke + update preview
  if (field === "icon") {
    if (iconPreview.value) URL.revokeObjectURL(iconPreview.value);
    iconPreview.value = URL.createObjectURL(file);
  } else {
    if (photoPreview.value) URL.revokeObjectURL(photoPreview.value);
    photoPreview.value = URL.createObjectURL(file);
  }
}

// cleanup
onBeforeUnmount(() => {
  if (iconPreview.value) URL.revokeObjectURL(iconPreview.value);
  if (photoPreview.value) URL.revokeObjectURL(photoPreview.value);
});
</script>

<template>
  <Form
    :validation-schema="schema"
    @submit="handleSubmit"
    v-slot="{ setFieldValue }"
  >
    <!-- Nama kategori -->
    <div class="mb-4">
      <label class="block font-medium" for="name">Name</label>
      <Field name="name" id="name" class="border rounded p-2 w-full" />
      <ErrorMessage name="name" class="text-red-500 text-sm" />
    </div>

    <!-- Deskripsi -->
    <div class="mb-4">
      <label for="description" class="block font-medium">Description</label>
      <Field
        as="textarea"
        name="description"
        id="description"
        class="border rounded p-2 w-full"
      />
      <ErrorMessage name="description" class="text-red-500 text-sm" />
    </div>

    <!-- Icon -->
    <div class="mb-4">
      <label for="icon" class="block font-medium">Icon</label>
      <input
        type="file"
        accept="image/*"
        name="icon"
        id="icon"
        @change="(e) => onFileChange(e, 'icon', setFieldValue)"
      />
      <div v-if="iconPreview" class="mt-2">
        <img
          :src="iconPreview"
          alt="Icon Preview"
          class="w-8 h-8 object-cover rounded border"
        />
      </div>
    </div>

    <!-- Photo -->
    <div class="mb-4">
      <label for="photo" class="block font-medium">Photo</label>
      <input
        type="file"
        accept="image/*"
        name="photo"
        id="photo"
        @change="(e) => onFileChange(e, 'photo', setFieldValue)"
      />
      <div v-if="photoPreview" class="mt-2">
        <img
          :src="photoPreview"
          alt="Photo Preview"
          class="w-32 h-20 object-cover rounded border"
        />
      </div>
    </div>

    <ButtonDefault
      name="buat kategori"
      type="submit"
      class="text-white bg-gradient-to-r from-orange-400 to-orange-500 hover:bg-gradient-to-br hover:from-orange-500 hover:to-orange-600 focus:ring-4 focus:outline-none focus:ring-orange-300 d shadow-lg shadow-orange-400/50 mb-3 sm:mb-6"
    >
      Buat Kategori
    </ButtonDefault>
  </Form>
  <div class="error-box text-red-600" v-if="props.createError">
    {{ props.createError }}
  </div>
</template>

<script setup lang="ts">
import { Form, Field, ErrorMessage } from "vee-validate";
import { vOnClickOutside } from "@vueuse/components";
const supabase = useSupabaseClient();
const isLoading = ref(false);
// props : catch variable from parent
const props = defineProps<{
  createError?: string | null;
}>();
// emit : pass event to parent to listen
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
  (e: "batal"): void;
  (e: "reset-error"): void;
}>();

// helper for uploading imaegs
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
  <div class="create-form" v-on-click-outside="() => $emit('reset-error')">
    <Form
      :validation-schema="categorySchema"
      @submit="handleSubmit"
      v-slot="{ setFieldValue, submitForm, resetForm, meta, values, errors }"
    >
      <!-- Nama kategori -->
      <div class="mb-4">
        <label :class="DEFAULT_LABEL" for="name">Nama</label>
        <Field name="name" id="name" :class="DEFAULT_INPUT" />
        <ErrorMessage name="name" class="text-red-500 text-sm sm:text-base" />
      </div>

      <!-- Deskripsi -->
      <div class="mb-4">
        <label for="description" :class="DEFAULT_LABEL">Deskripsi</label>
        <Field
          as="textarea"
          name="description"
          id="description"
          :class="DEFAULT_INPUT"
        />
        <ErrorMessage name="description" class="text-red-500 text-sm" />
      </div>

      <!-- Icon -->
      <div class="mb-4">
        <label for="icon" :class="DEFAULT_LABEL">Icon</label>
        <input
          type="file"
          accept="image/*"
          name="icon"
          id="icon"
          :class="DEFAULT_INPUT_FILE"
          @change="(e) => onFileChange(e, 'icon', setFieldValue)"
        />
        <div v-if="iconPreview" class="mt-2">
          <img
            :src="iconPreview"
            alt="Icon Preview"
            class="w-12 h-12 object-cover rounded border"
          />
        </div>
      </div>

      <!-- Photo -->
      <div class="mb-4">
        <label for="photo" :class="DEFAULT_LABEL">Photo</label>
        <input
          type="file"
          accept="image/*"
          name="photo"
          id="photo"
          :class="DEFAULT_INPUT_FILE"
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
      <div class="flex justify-center gap-x-3 text-sm sm:text-lg">
        <button
          :disabled="isLoading"
          type="submit"
          class="p-1.5 sm:p-3 min-w-18 sm:min-w-24 text-slate-50 font-medium bg-gradient-to-r from-orange-400 to-orange-500 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-orange-400 rounded-lg disabled:opacity-50"
        >
          <div
            v-if="isLoading"
            class="px-2 flex gap-x-2 justify-center items-center"
          >
            <IconLoading class="inline w-6 h-6 fill-slate-300" />
            <span>Loading...</span>
          </div>
          <span v-else>Buat Kategori</span>
        </button>
        <button
          @click="$emit('batal');$emit('reset-error')"
          type="reset"
          class="p-1 sm:p-2 min-w-18 sm:min-w-24 bg-slate-300 font-normal rounded-lg hover:bg-slate-400 focus:ring-4 focus:outline-none focus:ring-slate-300"
        >
          Batal
        </button>
      </div>
      <!-- <ButtonDefault
      name="buat kategori"
      type="submit"
      class="text-white bg-gradient-to-r from-orange-400 to-orange-500 hover:bg-gradient-to-br hover:from-orange-500 hover:to-orange-600 focus:ring-4 focus:outline-none focus:ring-orange-300 d shadow-lg shadow-orange-400/50 mb-3 sm:mb-6"
    >
      Buat Kategori
    </ButtonDefault> -->
    </Form>
    <div class="error-box text-red-600 py-3" v-if="props.createError">
      {{ props.createError }}
    </div>
  </div>
</template>

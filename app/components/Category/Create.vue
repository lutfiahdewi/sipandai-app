<script setup lang="ts">
import { Form, Field, ErrorMessage } from "vee-validate";
import { vOnClickOutside } from "@vueuse/components";
import type { ModalBase } from "#components";
const modal = ref<InstanceType<typeof ModalBase> | null>(null);
const close = () => {
  modal.value?.close();
};
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
  (e: "reset-error"): void;
}>();
defineExpose({
  close,
});


// handler passed to <Form>
async function handleSubmit(values: any) {
  isLoading.value = true;
  let icon_path = null;
  let photo_path = null;

  if (values.icon) {
    icon_path = await useUploadFile(values.icon, "icons", supabase);
  }
  if (values.photo) {
    photo_path = await useUploadFile(values.photo, "photos", supabase);
  }

  emit("submit", {
    name: values.name,
    description: values.description,
    icon_path,
    photo_path,
  });
  isLoading.value = false;
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
  <ModalBase
    ref="modal"
    class-modal="w-full sm:max-w-[580px] lg:max-w-[980px]"
    class-header=" text-slate-800 font-semibold text-base sm:text-xl"
    class-body=" max-h-[65vh] sm:max-h-[75vh] rounded-b-lg "
    class-footer=" hidden "
  >
    <template #header>
      <span>Tambah kategori baru</span>
    </template>
    <template #body>
      <div class="create-form" v-on-click-outside="() => $emit('reset-error')">
        <Form
          :validation-schema="categorySchema"
          @submit="handleSubmit"
          v-slot="{
            setFieldValue,
            submitForm,
            resetForm,
            meta,
            values,
            errors,
          }"
        >
          <!-- Nama kategori -->
          <div class="mb-4">
            <label :class="DEFAULT_LABEL" for="name">Nama</label>
            <Field name="name" id="name" :class="DEFAULT_INPUT" />
            <ErrorMessage
              name="name"
              class="text-red-500 text-sm sm:text-base"
            />
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
              @click="
                modal?.close();
                $emit('reset-error');
              "
              type="reset"
              class="p-1 sm:p-2 min-w-18 sm:min-w-24 bg-slate-300 font-normal rounded-lg hover:bg-slate-400 focus:ring-4 focus:outline-none focus:ring-slate-300"
            >
              Batal
            </button>
          </div>
        </Form>
        <div class="error-box text-red-600 py-3" v-if="props.createError">
          {{ props.createError }}
        </div>
      </div>
    </template>
  </ModalBase>
  <ButtonDefault
    name="Tambah Kategori"
    class="text-slate-50 bg-gradient-to-r from-orange-400 to-orange-500 hover:bg-gradient-to-br hover:from-orange-500 hover:to-orange-600 focus:ring-4 focus:outline-none focus:ring-orange-300 d shadow-lg shadow-orange-400/50 mb-3 sm:mb-6"
    @click="modal?.open()"
  >
    <IconAdd class="w-5 sm:w-6 lg:w-7 h-auto font-bold me-2" />
    <span>Tambah kategori</span>
  </ButtonDefault>
</template>

<script setup lang="ts">
import { Form, Field, ErrorMessage } from "vee-validate";
import { vOnClickOutside } from "@vueuse/components";
import type { ModalBase } from "#components";
import type { Database } from "~/types/supabase";
const editCategory = ref<InstanceType<typeof ModalBase> | null>(null);
const supabase = useSupabaseClient();
const isLoading = ref(false);
const props = defineProps<{
  id: string;
  data: Database["public"]["Tables"]["categories"]["Row"];
  table: string;
}>();
const emit = defineEmits<{
  (e: "refresh"): void;
  (e: "show-error"): void;
  (e: "show-success"): void;
}>();
// props : catch variable from parent
type category = Ref<Database["public"]["Tables"]["categories"]["Row"]>;
const currentData = ref(toRaw(props.data));
// handler passed to <Form>
const errorMessage = ref("");
async function handleSubmit(values: any) {
  isLoading.value = true;
  errorMessage.value = "";
  // console.log(values.name);
  // console.log(currentData.name);
  const icon_path: Ref<string | null> = ref(currentData.value.icon_path);
  const photo_path: Ref<string | null> = ref(currentData.value.photo_path);
  const pathsToDelete = [];
  // if there is new icon
  if (values.icon) {
    const { error } = await useUploadFile(
      icon_path,
      values.icon,
      "icons",
      supabase
    );
    if (error) {
      errorMessage.value = error.message;
      isLoading.value = false;
      return;
    }
    //icon_path.value = currentData.value?.icon_path;
    if (currentData.value?.icon_path)
      pathsToDelete.push(currentData.value?.icon_path);
  } else {
    // no new image but already exist
    if (currentData.value?.icon_path)
      icon_path.value = currentData.value?.icon_path;
  }

  // if there is new photo
  if (values.photo) {
    const { error } = await useUploadFile(
      photo_path,
      values.photo,
      "photos",
      supabase
    );
    if (error) {
      errorMessage.value = error.message;
      isLoading.value = false;
      return;
    }
    //photo_path.value = currentData.value?.photo_path;
    if (currentData.value?.photo_path)
      pathsToDelete.push(currentData.value?.photo_path);
  } else {
    // no new image but already exist
    if (currentData.value?.photo_path)
      photo_path.value = currentData.value?.photo_path;
  }

  // if any previous photos exist
  if (pathsToDelete.length > 0) {
    const { error: errorUpload } = await useDeleteImages(
      pathsToDelete,
      supabase
    );
    if (errorUpload) {
      errorMessage.value = errorUpload.message;
      isLoading.value = false;
      return;
    }
  }

  // update alldata
  const { error } = await supabase
    .from(props.table)
    .update({
      name: values.name,
      description: values.description,
      icon_path: icon_path.value,
      photo_path: photo_path.value,
    } as never) //idk why ts should take it as never
    .eq("id", currentData.value.id);

  if (error) {
    emit("show-error");
    errorMessage.value =
      "Gagal mengubah data kategori. Pesan error: " + error.message;
  } else {
    emit("show-success");
    emit("refresh");
    reset();
  }
  isLoading.value = false;
}

// For preview the icon and photo
const iconPreview = ref<string | null>(null);
const fileInputIcon = ref<HTMLInputElement | null>(null);
const photoPreview = ref<string | null>(null);
const fileInputPhoto = ref<HTMLInputElement | null>(null);

function onFileChange(
  e: Event,
  field: "icon" | "photo",
  setFieldValue: Function
) {
  const input = e.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) {
    if (iconPreview.value) URL.revokeObjectURL(iconPreview.value);
    iconPreview.value = null;
    return;
  }

  // update vee-validate form state
  setFieldValue(field, file);

  // revoke + update preview
  if (field === "icon") useUpdatePreview(iconPreview, file);
  else useUpdatePreview(photoPreview, file);
}
function resetIcon(setFieldValue: Function) {
  setFieldValue("icon", null); // reset in vee-validate state
  if (fileInputIcon.value) fileInputIcon.value.value = ""; // reset DOM input
  if (iconPreview.value) URL.revokeObjectURL(iconPreview.value);
  iconPreview.value = null;
}
function resetPhoto(setFieldValue: Function) {
  setFieldValue("photo", null);
  if (fileInputPhoto.value) fileInputPhoto.value.value = "";
  if (photoPreview.value) URL.revokeObjectURL(photoPreview.value);
  photoPreview.value = null;
}
// cleanup

function reset() {
  resetIcon(() => {});
  resetPhoto(() => {});
  errorMessage.value = "";
  editCategory.value?.close();
}
</script>

<template>
  <ModalBase
    ref="editCategory"
    class-modal="w-full sm:max-w-[580px] lg:max-w-[980px]"
    class-header=" bg-blue-400 text-slate-800 font-semibold text-base sm:text-xl"
    class-body=" max-h-[65vh] sm:max-h-[75vh] rounded-b-lg "
    class-footer=" hidden "
    @click-outside="reset()"
  >
    <template #header>
      <span>Ubah data kategori</span>
    </template>
    <template #body>
      <div class="create-form" v-on-click-outside="() => (errorMessage = '')">
        <Form
          :initial-values="data"
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
            <div class="flex gap-x-3 mt-2">
              <div v-if="values.icon_path">
                <img
                  :src="useGetImageUrl(values.icon_path, supabase)"
                  class="h-12 w-12 object-contain"
                />
                <span class="text-center">Icon Tersimpan</span>
              </div>
              <div v-if="iconPreview" class="mt-2 flex gap-x-3 items-center">
                <div class="img-p">
                  <img
                    :src="iconPreview"
                    alt="Icon Preview"
                    class="w-12 h-12 object-contain rounded border"
                  />
                  <span class="text-center">Icon Terunggah</span>
                </div>
                <button
                  type="button"
                  class="h-fit p-2 bg-slate-800 text-slate-50 rounded"
                  @click="resetIcon(setFieldValue)"
                >
                  Reset Icon
                </button>
              </div>
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
            <div class="flex gap-x-3 mt-2">
              <div v-if="values.photo_path">
                <img
                  :src="useGetImageUrl(values.photo_path, supabase)"
                  class="w-32 h-20 object-contain"
                />
                <span class="text-center">Foto Tersimpan</span>
              </div>
              <div v-if="photoPreview" class="mt-2 flex gap-x-3 items-center">
                <div class="img-p">
                  <img
                    :src="photoPreview"
                    alt="Photo Preview"
                    class="w-12 h-12 object-cover rounded border"
                  />
                  <span class="text-center">Foto Terunggah</span>
                </div>
                <button
                  type="button"
                  class="h-fit p-2 bg-slate-800 text-slate-50 rounded"
                  @click="resetPhoto(setFieldValue)"
                >
                  Reset Foto
                </button>
              </div>
            </div>
          </div>
          <!-- button submission -->
          <div class="flex justify-center gap-x-3 text-sm sm:text-lg">
            <button
              :disabled="isLoading || meta.dirty !== true"
              type="submit"
              class="p-1.5 sm:p-3 min-w-18 sm:min-w-24 text-slate-50 font-medium bg-gradient-to-r from-blue-400 to-blue-500 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-400 rounded-lg disabled:opacity-50"
            >
              <div
                v-if="isLoading"
                class="px-2 flex gap-x-2 justify-center items-center"
              >
                <IconLoading class="inline w-6 h-6 fill-slate-300" />
                <span>Loading...</span>
              </div>
              <span v-else>Simpan Perubahan</span>
            </button>
            <button
              @click="reset()"
              type="reset"
              class="p-1 sm:p-2 min-w-18 sm:min-w-24 bg-slate-300 font-normal rounded-lg hover:bg-slate-400 focus:ring-4 focus:outline-none focus:ring-slate-300"
            >
              Batal
            </button>
          </div>
        </Form>
        <div class="error-box text-red-600 py-3" v-if="errorMessage">
          {{ errorMessage }}
        </div>
      </div>
    </template>
  </ModalBase>
  <button @click="editCategory?.open()">
    <IconEdit
      class="w-7 h-7 sm:w-8 sm:h-8 p-1 rounded-md bg-blue-500 text-white hover:bg-blue-600"
    />
  </button>
</template>

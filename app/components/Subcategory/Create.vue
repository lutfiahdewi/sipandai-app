<script setup lang="ts">
import { Form, Field, ErrorMessage } from "vee-validate";
import type { ModalBase } from "#components";
import type { Database } from "~/types/supabase";
const modal = ref<InstanceType<typeof ModalBase> | null>(null);

const supabase = useSupabaseClient();
const isLoading = ref(false);
// props : catch variable from parent
const props = defineProps<{
  table: string;
  type: "subcategories1" | "subcategories2" | "subcategories3";
}>();
// emit : pass event to parent to listen
const emit = defineEmits<{
  (e: "refresh"): void;
  (e: "show-error"): void;
  (e: "show-success"): void;
}>();

//set type of subcategory
const subNumber = ref(0);
// getdata category
const defaultSelector = "id, name,slug";
const categories: Ref<Database["public"]["Tables"]["categories"]["Row"][]> =
  ref([]);
//if category or subcat selected, query option under it
const subcategories1: Ref<
  Database["public"]["Tables"]["subcategories1"]["Row"][]
> = ref([]);
const subcategories2: Ref<
  Database["public"]["Tables"]["subcategories2"]["Row"][]
> = ref([]);
const dataCollection = { subcategories1, subcategories2 };
const getDataInside = async (
  targetValue: string,
  targetTable: string,
  filtered_id: string,
  targetData: Ref<any[]>,
  selector?: string
) => {
  isLoading.value = true;
  if (targetValue) {
    try {
      const { data, error } = await supabase
        .from(targetTable)
        .select(selector ?? "(*)")
        .eq(filtered_id, targetValue);
      if (!error) {
        targetData.value = data;
      }
    } finally {
      isLoading.value = false;
    }
  }
  isLoading.value = false;
};

async function triggerGetDataInside(
  e: Event,
  targetTable: "subcategories1" | "subcategories2"
) {
  if (targetTable == "subcategories1") {
    subcategories1.value = [];
    subcategories2.value = [];
  } else subcategories2.value = [];

  const target = e.target as HTMLSelectElement;
  if (!target.value) return;
  await getDataInside(
    target.value,
    targetTable,
    useMatchTable(targetTable),
    dataCollection[targetTable],
    defaultSelector
  );
}

// handler passed to <Form>
async function handleSubmit(values: any) {
  console.log("sunit called");
  isLoading.value = true;
  const icon_path: Ref<string | null> = ref(null);
  const photo_path: Ref<string | null> = ref(null);
  if (values.icon) {
    const { error } = await useUploadFile(
      icon_path,
      values.icon,
      "icons",
      supabase
    );
    if (error) {
      errorMessage.value = error.message;
      return;
    }
  }
  if (values.photo) {
    const { error } = await useUploadFile(
      photo_path,
      values.photo,
      "photos",
      supabase
    );
    if (error) {
      errorMessage.value = error.message;
      return;
    }
  }
  var temp: any = {};
  if (subNumber.value == 1) temp["category_id"] = values.category_id;
  else if (subNumber.value == 2)
    temp["subcategory1_id"] = values.subcategory1_id;
  else if (subNumber.value == 3)
    temp["subcategory2_id"] = values.subcategory2_id;

  insertData({
    name: values.name,
    description: values.description,
    icon_path: icon_path.value,
    photo_path: photo_path.value,
    ... temp,
  });
  isLoading.value = false;
}
// insert data to db
const errorMessage = ref("");
async function insertData(values: any) {
  if (errorMessage.value.length != 0) errorMessage.value = "";
  // console.log(values);
  
  const { error } = await supabase.from(props.table).insert(values);
  if (error) {
    emit("show-error");
    errorMessage.value =
      `Gagal membuat subkategori ${subNumber}. Pesan error:  + ${error.message}`;
  } else {
    emit("show-success");
    emit("refresh");
    reset();
  }
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
    if (field === "icon") resetIcon(() => {});
    else resetPhoto(() => {});
    return;
  }
  setFieldValue(field, file);
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
onMounted(() => {
  subNumber.value = Number(props.type.charAt(props.type.length - 1))
  /*if (props.type === "subcategories1") {
    subNumber.value = 1;
  } else if (props.type === "subcategories2") {
    subNumber.value = 2;
  } else subNumber.value = 3;*/
  useGetAllData("categories", categories, isLoading, supabase, defaultSelector);
});
// cleanup
function reset() {
  errorMessage.value = "";
  subcategories1.value = [];
  subcategories2.value = [];
  resetIcon(() => {});
  resetPhoto(() => {});
  modal.value?.close();
}
</script>

<template>
  <ModalBase
    ref="modal"
    class-modal="w-full sm:max-w-[580px] lg:max-w-[980px]"
    class-header=" text-slate-800 font-semibold text-base sm:text-xl"
    class-body=" max-h-[65vh] sm:max-h-[75vh] rounded-b-lg "
    class-footer=" hidden "
    @click-outside="reset()"
  >
    <template #header>
      <span>Tambah subkategori {{ subNumber }} baru</span>
    </template>
    <template #body>
      <div class="create-form">
        <Form
          :validation-schema="
            subNumber === 3
              ? subcategories3Schema
              : subNumber === 2
              ? subcategories2Schema
              : subcategories1Schema
          "
          @submit="handleSubmit"
          v-slot="{ setFieldValue, resetForm, values, errors, meta }"
        >
          <!-- Nama subkategori -->
          <div class="mb-4">
            <label :class="DEFAULT_LABEL" for="name">Nama :</label>
            <Field name="name" id="name" :class="DEFAULT_INPUT" />
            <ErrorMessage
              name="name"
              class="text-red-500 text-sm sm:text-base"
            />
          </div>
          <!-- Deskripsi -->
          <div class="mb-4">
            <label for="description" :class="DEFAULT_LABEL">Deskripsi :</label>
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
              ref="fileInputIcon"
            />
            <div v-if="iconPreview" class="mt-2 flex gap-x-3 items-center">
              <div class="img-p">
                <img
                  :src="iconPreview"
                  alt="Icon Preview"
                  class="w-12 h-12 object-cover rounded border"
                />
                <span class="text-center">Foto Terunggah</span>
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
              ref="fileInputPhoto"
            />
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

          <!-- Kategori kegiatan -->
          <div class="mb-4">
            <label for="category_id" :class="DEFAULT_LABEL">Kategori</label>
            <Field
              as="select"
              id="category_id"
              name="category_id"
              :class="DEFAULT_INPUT_FILE"
              @change="triggerGetDataInside($event, 'subcategories1')"
              :disabled="isLoading"
            >
              <option value="" class="hover:bg-sky-200" disabled>
                -- Pilih Kategori --
              </option>
              <option
                v-for="cat in categories"
                :value="cat.id"
                :key="cat.id"
                class="hover:bg-sky-200"
              >
                {{ cat.name }}
              </option>
            </Field>
            <ErrorMessage name="category_id" class="text-red-500 text-sm" />
          </div>

          <!-- Subkategori 1 kegiatan -->
          <div class="mb-4" v-if="subcategories1.length > 0">
            <label for="subcategory1_id" :class="DEFAULT_LABEL"
              >Sub kategori 1</label
            >
            <Field
              as="select"
              id="subcategory1_id"
              name="subcategory1_id"
              :class="DEFAULT_INPUT_FILE"
              @change="triggerGetDataInside($event, 'subcategories2')"
              :disabled="isLoading"
            >
              <option value="" class="hover:bg-sky-200" disabled>
                -- Pilih Sub Kategori 1 --
              </option>
              <option
                v-for="cat in subcategories1"
                :value="cat.id"
                :key="cat.id"
                class="hover:bg-sky-200"
              >
                {{ cat.name }}
              </option>
            </Field>
            <ErrorMessage name="subcategory_id" class="text-red-500 text-sm" />
          </div>
          <!-- Subkategori 2 kegiatan -->
          <div class="mb-4" v-if="subcategories2.length > 0">
            <label for="subcategory2_id" :class="DEFAULT_LABEL"
              >Sub kategori 2</label
            >
            <Field
              as="select"
              id="subcategory2_id"
              name="subcategory2_id"
              :class="DEFAULT_INPUT_FILE"
              :disabled="isLoading"
            >
              <option value="" class="hover:bg-sky-200" disabled selected>
                -- Pilih Sub Kategori 2 --
              </option>
              <option
                v-for="cat in subcategories2"
                :value="cat.id"
                :key="cat.id"
                class="hover:bg-sky-200"
              >
                {{ cat.name }}
              </option>
            </Field>
            <ErrorMessage name="subcategory2_id" class="text-red-500 text-sm" />
          </div>

          <div class="flex justify-center gap-x-3 text-sm sm:text-lg">
            <button
              :disabled="isLoading || !meta.valid"
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
              <span v-else>Buat Subkategori {{ subNumber }}</span>
            </button>
            <button
              @click="
                reset();
                resetForm;
              "
              type="reset"
              class="p-1 sm:p-2 min-w-18 sm:min-w-24 bg-slate-300 font-normal rounded-lg hover:bg-slate-400 focus:ring-4 focus:outline-none focus:ring-slate-300"
            >
              Batal
            </button>
          </div>
          <div class="error-box text-red-600 py-3" v-if="errors.subcategory1_id || errors.subcategory2_id">
            {{ `Peringatan : Pastikan form terisi semua. ${errors.subcategory1_id??''} ${errors.subcategory2_id??''}` }}
          </div>
        </Form>
        <div class="error-box text-red-600 py-3" v-if="errorMessage">
          {{ errorMessage }}
        </div>
      </div>
    </template>
  </ModalBase>
  <ButtonDefault
    :name="'Tambah  subkategori ' + subNumber"
    class="text-slate-50 bg-gradient-to-r from-orange-400 to-orange-500 hover:bg-gradient-to-br hover:from-orange-500 hover:to-orange-600 focus:ring-4 focus:outline-none focus:ring-orange-300 d shadow-lg shadow-orange-400/50 mb-3 sm:mb-6"
    @click="modal?.open()"
  >
    <IconAdd class="w-5 sm:w-6 lg:w-7 h-auto font-bold me-2" />
    <span>Tambah subkategori {{ subNumber }}</span>
  </ButtonDefault>
</template>

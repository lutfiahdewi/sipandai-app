<script setup lang="ts">
import { Form, Field, ErrorMessage } from "vee-validate";
import type { ModalBase } from "#components";
import type { Database } from "~/types/supabase";
import _ from "lodash";

const modal = ref<InstanceType<typeof ModalBase> | null>(null);
const supabase = useSupabaseClient();
const isLoading = ref(false);
// props : catch variable from parent
const props = defineProps<{
  id: string;
  table: string;
  type: "subcategories1" | "subcategories2" | "subcategories3";
}>();
// emit : pass event to parent to listen
const emit = defineEmits<{
  (e: "refresh"): void;
  (e: "reset"): void;
  (e: "show-error"): void;
  (e: "show-success"): void;
}>();
// pass open modal method to
const open = () => {
  modal.value?.open();
};
defineExpose({
  open,
});
//set type of subcategory
const subNumber = ref(0);

// fetch current data
/**
 * Step:
 * 1 Define all variable
 * 2. getDataInside func to get all data inside or under a certain category or subcategory
 * 3. Trigger function to make option of table available, it's depend on what option selected in form. triggered onChange selection
 * 4.
 */
const currentData: Ref<
  Database["public"]["Tables"]["documents"]["Row"] | undefined
> = ref(undefined);
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
/**
 *
 * @param targetValue the value use to filter
 * @param targetTable the table in db to filter
 * @param filtered_id parameter used to filter
 * @param targetData the variable that would be mutated
 * @param selector
 */
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
// get the detail data to edit
const keyForm = ref(0);
const selector = ref("");
async function getDetailData() {
  if (props.id.length < 1) return;

  if (props.type === "subcategories1")
    selector.value =
      "id, name, description,icon_path, photo_path, categories(name, id)";
  else if (props.type === "subcategories2")
    selector.value =
      "id, name, description,icon_path, photo_path, subcategories1(name, id, categories!inner(name, id))";
  else
    selector.value =
      "id, name, description,icon_path, photo_path, subcategories2 (name, id, subcategories1!inner(name, id, categories!inner(name, id)))";

  await getData(selector.value);
  keyForm.value++;
}
async function getData(selector: string) {
  isLoading.value = true;
  if (errorMessage.value.length != 0) errorMessage.value = "";
  const { data, error } = await supabase
    .from(props.table)
    .select(selector ?? "(*)")
    .eq("id", props.id)
    .single();
  if (error) {
    isLoading.value = false;
    emit("show-error");
    errorMessage.value =
      "Gagal memuat data tautan dokumen. Pesan error: " + error.message;
  }
  // getting inside the data
  if (data) {
    currentData.value = data;
    if (props.type === "subcategories2") {
      currentData.value["subcategory1_id"] = data.subcategories1.id;
      currentData.value["category_id"] = data.subcategories1.categories.id;
      getDataInside(data.subcategories1.id,"subcategories1","id",subcategories1,defaultSelector
      );
    } else if (props.type === "subcategories3") {
      currentData.value["subcategory2_id"] = data.subcategories2.id;
      currentData.value["subcategory1_id"] =
        data.subcategories2.subcategories1.id;
      currentData.value["category_id"] =
        data.subcategories2.subcategories1.categories.id;
      getDataInside(data.subcategories2.id,"subcategories2","id",subcategories2,defaultSelector
      );
      getDataInside(data.subcategories2.subcategories1.id,"subcategories3","id",subcategories1,defaultSelector
      );
    } else {
      currentData.value["category_id"] = data.categories.id;
    }
    keyForm.value++;
  }
  isLoading.value = false;
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
    ...temp,
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
    errorMessage.value = `Gagal membuat subkategori ${subNumber}. Pesan error:  + ${error.message}`;
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
// cleanup
function reset() {
  emit('reset');
  errorMessage.value = "";
  subcategories1.value = [];
  subcategories2.value = [];
  resetIcon(() => {});
  resetPhoto(() => {});
  keyForm.value++;
  modal.value?.close();
}

// Vue lifecycle hooks
onMounted(() => {
  subNumber.value = Number(props.type.charAt(props.type.length - 1));
  useGetAllData("categories", categories, isLoading, supabase, defaultSelector); // get all category data
});
// Get Data when modal clicked
onUpdated(() => {
  getDetailData();
});
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
      <span>Ubah subkategori {{ subNumber }}</span>
    </template>
    <template #body>
      <div class="create-form">
        <Form
          :initial-values="currentData"
          :key="keyForm"
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
            <div class="flex gap-x-3 mt-2">
              <div v-if="values.icon_path">
                <img
                  :src="useGetImageUrl(values.icon_path, supabase)"
                  class="h-12 w-12 object-contain"
                />
                <span class="text-center">Icon Tersimpan</span>
              </div>
              <div v-if="iconPreview" class="flex gap-x-3 items-center">
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
            <div class="flex gap-x-3 mt-2">
              <div v-if="values.photo_path">
                <img
                  :src="useGetImageUrl(values.photo_path, supabase)"
                  class="h-12 w-12 object-contain"
                />
                <span class="text-center">Foto Tersimpan</span>
              </div>
            <div v-if="photoPreview" class="flex gap-x-3 items-center">
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
            </div></div>
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
              class="p-1.5 sm:p-3 min-w-18 sm:min-w-24 text-slate-50 font-medium bg-gradient-to-r from-blue-400 to-blue-500 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-400 rounded-lg disabled:opacity-50"
            >
              <div
                v-if="isLoading"
                class="px-2 flex gap-x-2 justify-center items-center"
              >
                <IconLoading class="inline w-6 h-6 fill-slate-300" />
                <span>Loading...</span>
              </div>
              <span v-else>Simpan Subkategori {{ subNumber }}</span>
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
          <div
            class="error-box text-red-600 py-3"
            v-if="errors.subcategory1_id || errors.subcategory2_id"
          >
            {{
              `Peringatan : Pastikan form terisi semua. ${
                errors.subcategory1_id ?? ""
              } ${errors.subcategory2_id ?? ""}`
            }}
          </div>
        </Form>
        <div class="error-box text-red-600 py-3" v-if="errorMessage">
          {{ errorMessage }}
        </div>
      </div>
    </template>
  </ModalBase>
</template>

<script setup lang="ts">
import { Form, Field, ErrorMessage } from "vee-validate";
import type { ModalBase } from "#components";
import type { Database } from "~/types/supabase";
import _ from "lodash";

const modal = ref<InstanceType<typeof ModalBase> | null>(null);
const supabase = useSupabaseClient();
const isLoading = ref(false);
const errorMessage = ref("");
// props : catch variable from parent
const props = defineProps<{
  id: string;
  table: string;
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
// handler passed to <Form>
async function handleSubmit(values: any) {
  isLoading.value = true;
  const icon_path: Ref<string | null> = ref(null);

  // If new image uploaded
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
    //delete previous photo
    const pathsToDelete = [];
    if (currentData.value?.icon_path) {
      pathsToDelete.push(currentData.value?.icon_path);
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
  } else {
    // no new image but already exist
    if (currentData.value?.icon_path)
      icon_path.value = currentData.value?.icon_path;
  }
  updateData(
    {
      name: values.name,
      url: values.url,
      description: values.description,
      icon_path: icon_path.value,
      activity_date: values.activity_date,
      category_id: values.category_id,
      subcategory1_id: useIfStringEmpty(values.subcategory1_id),
      subcategory2_id: useIfStringEmpty(values.subcategory2_id),
      subcategory3_id: useIfStringEmpty(values.subcategory3_id),
    },
    props.id
  );
  isLoading.value = false;
}
// update data to db
async function updateData(values: any, id: string) {
  console.log(values);
  if (errorMessage.value.length != 0) errorMessage.value = "";
  const { error } = await supabase
    .from(props.table)
    .update(values as never)
    .eq("id", id);
  if (error) {
    emit("show-error");
    errorMessage.value =
      "Gagal membuat tautan dokumen. Pesan error: " + error.message;
  } else {
    emit("show-success");
    emit("refresh");
    // modal.value?.close();
    reset();
  }
}

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
const subcategories3: Ref<
  Database["public"]["Tables"]["subcategories3"]["Row"][]
> = ref([]);
const dataCollection = { subcategories1, subcategories2, subcategories3 };
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
  targetTable: "subcategories1" | "subcategories2" | "subcategories3"
) {
  const target = e.target as HTMLSelectElement;
  if (targetTable == "subcategories1") {
    subcategories1.value = [];
    subcategories2.value = [];
    subcategories3.value = [];
    // target.value.subcategory1_id = null;
  } else if (targetTable == "subcategories2") {
    subcategories2.value = [];
    subcategories3.value = [];
  } else {
    subcategories3.value = [];
  }
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
async function getDetailData() {
  if (props.id.length < 1) return;
  await getData(`id, name,url,description,icon_path,activity_date, category_id,subcategory1_id,subcategory2_id,subcategory3_id,
  categories(id, name,
    subcategories1 (id, name)  
  ),
  subcategories1 (
      id, name,
      subcategories2 (
        id, name,
        subcategories3 (id, name)
      )
    ),
    subcategories2 (
      id, name,
      subcategories3 (id, name)
    )
  `);
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
  if (data) {
    currentData.value = data;
    subcategories1.value = data.categories.subcategories1;
    if (_.isObjectLike(data.subcategories1))
      subcategories2.value = data.subcategories1.subcategories2;
    if (_.isObjectLike(data.subcategories2))
      subcategories3.value = data.subcategories2.subcategories3;
    keyForm.value++;
  }
  isLoading.value = false;
}

// For preview the icon and photo
const iconPreview = ref<string | null>(null);
const fileInputIcon = ref<HTMLInputElement | null>(null);
// const photoPreview = ref<string | null>(null);

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
  if (field === "icon") useUpdatePreview(iconPreview, file);
}

// reset data
function reset() {
  emit("reset");
  errorMessage.value = "";
  subcategories1.value = [];
  subcategories2.value = [];
  subcategories3.value = [];
  currentData.value = undefined;
  resetIcon(() => {});
  keyForm.value++;
  modal.value?.close();
  console.log("reset component!")
}
function resetIcon(setFieldValue: Function) {
  if (fileInputIcon.value) fileInputIcon.value.value = ""; // reset DOM input
  if (iconPreview.value) URL.revokeObjectURL(iconPreview.value);
  iconPreview.value = null;
  setFieldValue("icon", null); // reset in vee-validate state
}

// Vue lifecycle hooks
onMounted(() => {
  useGetAllData("categories", categories, isLoading, supabase, defaultSelector); // get all category data
});
// Get Data when modal clicked
onUpdated(() => {
  // useGetAllData("categories", categories, isLoading, supabase, defaultSelector);
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
      <span>Ubah tautan dokumen baru</span>
    </template>
    <template #body>
      <div class="create-form">
        <Form
          :initial-values="currentData"
          :key="keyForm"
          :validation-schema="documentSchema"
          @submit="handleSubmit"
          v-slot="{ setFieldValue, resetForm, values, errors, meta }"
        >
          <!-- Nama tautan dokumen -->
          <div class="mb-4">
            <label :class="DEFAULT_LABEL" for="name">Nama :</label>
            <Field name="name" id="name" :class="DEFAULT_INPUT" />
            <ErrorMessage
              name="name"
              class="text-red-500 text-sm sm:text-base"
            />
          </div>
          <!-- Tautan dokumen -->
          <div class="mb-4">
            <label :class="DEFAULT_LABEL" for="url">Link/URL :</label>
            <Field name="url" id="url" :class="DEFAULT_INPUT" />
            <ErrorMessage
              name="url"
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

          <!-- Tanggal kegiatan -->
          <div class="mb-4">
            <label for="activity_date" :class="DEFAULT_LABEL"
              >Tanggal kegiatan</label
            >
            <Field
              id="activity_date"
              name="activity_date"
              type="date"
              :class="DEFAULT_INPUT_FILE"
            />
            <ErrorMessage name="activity_date" class="text-red-500 text-sm" />
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
              <option :value="null" class="hover:bg-sky-200" disabled>
                -- Pilih Sub Kategori 1 --
              </option>
              <option value="" class="hover:bg-sky-200">
                (( Tanpa Sub Kategori 1 ))
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
              @change="triggerGetDataInside($event, 'subcategories3')"
              :disabled="isLoading"
            >
              <option :value="null" class="hover:bg-sky-200" disabled selected>
                -- Pilih Sub Kategori 2 --
              </option>
              <option value="" class="hover:bg-sky-200">
                (( Tanpa Sub Kategori 2 ))
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
          <!-- Subkategori 3 kegiatan -->
          <div class="mb-4" v-if="subcategories3.length > 0">
            <label for="subcategory2_id" :class="DEFAULT_LABEL"
              >Sub kategori 3</label
            >
            <Field
              as="select"
              id="subcategory3_id"
              name="subcategory3_id"
              :class="DEFAULT_INPUT_FILE"
              :disabled="isLoading"
            >
              <option :value="null" class="hover:bg-sky-200" disabled>
                -- Pilih Sub Kategori 3 --
              </option>
              <option value="" class="hover:bg-sky-200">
                (( Tanpa Sub Kategori 3 ))
              </option>
              <option
                v-for="cat in subcategories3"
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
              <span v-else>Ubah Tautan Dokumen</span>
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
        </Form>
        <div class="error-box text-red-600 py-3" v-if="errorMessage">
          {{ errorMessage }}
        </div>
      </div>
    </template>
  </ModalBase>
</template>

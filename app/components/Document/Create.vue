<script setup lang="ts">
import { Form, Field, ErrorMessage } from "vee-validate";
import { vOnClickOutside } from "@vueuse/components";
import type { ModalBase } from "#components";
import type { Database } from "~/types/supabase";
const modal = ref<InstanceType<typeof ModalBase> | null>(null);
const supabase = useSupabaseClient();
const isLoading = ref(false);
// props : catch variable from parent
defineProps<{
  table: string;
}>();
// emit : pass event to parent to listen
const emit = defineEmits<{
  (e: "refresh"): void;
  (e: "show-error"): void;
  (e: "show-success"): void;
}>();

// handler passed to <Form>
async function handleSubmit(values: any) {
  isLoading.value = true;
  let icon_path = null;

  if (values.icon) {
    icon_path = await useUploadFile(values.icon, "icons", supabase);
  }
  insertData({
    name: values.name,
    description: values.description,
    icon_path,
    activity_date: values.activity_date,
  });
  isLoading.value = false;
}

// getdata category, subcategory123
const defaultSelector = "id, name,slug";
const categories: Ref<Database["public"]["Tables"]["categories"]["Row"][]> =
  ref([]);
const getData = async (table: string, selector?: string) => {
  isLoading.value = true;
  try {
    const { data, error } = await supabase
      .from(table)
      .select(selector ?? "(*)");
    if (!error) {
      categories.value = data;
    }
  } finally {
    isLoading.value = false;
  }
};
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
const getDataInside = async (
  e: Event,
  targetTable: string,
  filtered_id: string,
  targetData: Ref<any[]>,
  selector?: string
) => {
  isLoading.value = true;
  const target = e.target as HTMLSelectElement;
  console.log(target.value);
  if (target.value) {
    try {
      const { data, error } = await supabase
        .from(targetTable)
        .select(selector ?? "(*)")
        .eq(filtered_id, target.value);
      if (!error) {
        targetData.value = data;
      }
    } finally {
      isLoading.value = false;
    }
  }
};

async function triggerGetDataInside(e: Event, targetTable: string) {
  if (targetTable == "subcategories1") {
    await getDataInside(
      e,
      targetTable,
      "category_id",
      subcategories1,
      defaultSelector
    );
  }
  if (targetTable == "subcategories2") {
    await getDataInside(
      e,
      targetTable,
      "subcategory1_id",
      subcategories2,
      defaultSelector
    );
  }
  if (targetTable == "subcategories3") {
    await getDataInside(
      e,
      targetTable,
      "subcategory2_id",
      subcategories3,
      defaultSelector
    );
  }
}

// insert data to db
const errorMessage = ref("");
async function insertData(values: any) {
  if (errorMessage.value.length != 0) errorMessage.value = "";
  const { error } = await supabase.from("documents").insert(values);
  if (error) {
    emit("show-error");
    errorMessage.value =
      "Gagal membuat tautan dokumen. Pesan error: " + error.message;
  } else {
    emit("show-success");
    emit("refresh");
    modal.value?.close();
  }
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
onMounted(() => {
  getData("categories", defaultSelector);
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
      <span>Tambah tautan dokumen baru</span>
    </template>
    <template #body>
      <div class="create-form" v-on-click-outside="() => (errorMessage = '')">
        <Form
          :validation-schema="documentSchema"
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
            <div v-if="iconPreview" class="mt-2">
              <img
                :src="iconPreview"
                alt="Icon Preview"
                class="w-12 h-12 object-cover rounded border"
              />
            </div>
          </div>

          <!-- Tanggal kegiatan -->
          <div class="mb-4">
            <label for="activity_date" :class="DEFAULT_LABEL"
              >Tanggal kegiatan</label
            >
            <input
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
              <option value="" class="hover:bg-sky-200" disabled>
                -- Pilih Sub Kategori --
              </option>
              <option value="" class="hover:bg-sky-200">
                (( Tanpa Sub Kategori ))
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

          SUBKATEGORI 2 & 3

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
              <span v-else>Buat Tautan Dokumen</span>
            </button>
            <button
              @click="
                modal?.close();
                errorMessage;
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
  <ButtonDefault
    name="Tambah tautan dokumen"
    class="text-slate-50 bg-gradient-to-r from-orange-400 to-orange-500 hover:bg-gradient-to-br hover:from-orange-500 hover:to-orange-600 focus:ring-4 focus:outline-none focus:ring-orange-300 d shadow-lg shadow-orange-400/50 mb-3 sm:mb-6"
    @click="modal?.open()"
  >
    <IconAdd class="w-5 sm:w-6 lg:w-7 h-auto font-bold me-2" />
    <span>Tambah tautan dokumen</span>
  </ButtonDefault>
</template>

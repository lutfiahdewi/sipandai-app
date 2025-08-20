<script setup lang="ts">
import { Form, Field, ErrorMessage, useForm } from "vee-validate";
import { categorySchema } from "~/utils/schema";

const emit = defineEmits(["submit"]);
const supabase = useSupabaseClient();

const { handleSubmit, setFieldValue } = useForm({
  validationSchema: categorySchema,
});

// File upload handler
async function uploadFile(event: Event, field: string) {
  // field to specify folder in supabase storage
  const target = event.target as HTMLInputElement;
  if (!target.files?.length) return;

  const file = target.files[0];
  const filePath = `${field}/${Date.now()}-${file.name}`;
  // date to make sure uniqueness

  const { error } = await supabase.storage
    .from("uploads")
    .upload(filePath, file);
  if (error) {
    console.error(error);
    return;
  }
  console.log(filePath);

  // Save just the path to the form value
  setFieldValue(field, filePath);
}

// function onSubmit(values: any) {
//   console.log("handler called!");
//   console.log(JSON.stringify(values, null, 2));
//   emit("submit", values);
// }

const onSubmit = handleSubmit(async (values) => {
  console.log("handler called!");
  console.log(JSON.stringify(values, null, 2));
  const { error } = await supabase.from("categories").insert({
    name: values.name,
    description: values.description,
    icon_path: values.icon_path,
    name_path: values.name_path,
  });

  if (error) {
    console.error("❌ Insert failed:", error.message);
  } else {
    console.log("✅ Category saved");
  }
});


</script>

<template>
  <Form
    @submit="onSubmit"
    class="space-y-4 mx-auto"
    :validationSchema="categorySchema"
    keep-values
  >
    <!-- Name -->
    <div>
      <label class="block text-sm font-medium mb-1">Name</label>
      <Field
        name="name"
        type="text"
        placeholder="Enter category name"
        class="w-full border rounded p-2"
      />
      <ErrorMessage name="name" class="text-red-500 text-sm" />
    </div>

    <!-- Icon Upload -->
    <div>
      <label class="block text-sm font-medium mb-1">Icon (optional)</label>
      <input
        type="file"
        accept="image/*"
        class="w-full"
        @change="uploadFile($event, 'icons')"
        name="icon_path"
      />
      <ErrorMessage name="icon_path" class="text-red-500 text-sm" />
    </div>

    <!-- Description -->
    <div>
      <label class="block text-sm font-medium mb-1">Description</label>
      <Field
        name="description"
        as="textarea"
        rows="3"
        placeholder="Optional description"
        class="w-full border rounded p-2"
      />
      <ErrorMessage name="description" class="text-red-500 text-sm" />
    </div>

    <!-- Photo Upload -->
    <div>
      <label class="block text-sm font-medium mb-1">Photo (optional)</label>
      <input
        name="photo_path"
        type="file"
        accept="image/*"
        class="w-full"
        @change="uploadFile($event, 'photos')"
      />
      <ErrorMessage name="photo_path" class="text-red-500 text-sm" />
    </div>

    <!-- Submit -->
    <button
      type="submit"
      class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
    >
      Save Category
    </button>
  </Form>
</template>

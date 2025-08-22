<template>
  <div>
    <ClientOnly>
      <TinymceEditor
        :init="editorConfig"
        :model-value="value"
        @update:modelValue="handleChange"
      />
    </ClientOnly>

    <span v-if="errorMessage" class="text-red-500 text-sm">
      {{ errorMessage }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { useField } from "vee-validate"

const props = defineProps<{ name: string }>()

// Bind this field to vee-validate form
const { value, errorMessage, handleChange } = useField(() => props.name)

const editorConfig = {
  height: 400,
  menubar: false,
  plugins: "lists link image code table",
  toolbar:
    "undo redo | bold italic | alignleft aligncenter alignright | bullist numlist outdent indent | code",
  skin: false,
  content_css: false,
}
</script>

export default (preview: Ref<string | null>, file: File) => {
    if (preview.value) URL.revokeObjectURL(preview.value);
    preview.value = URL.createObjectURL(file);
}
export default function onFileChange(
    e: Event,
    field: "icon" | "photo",
    setFieldValue: Function, iconPreview: Ref<string | null>, photoPreview: Ref<string | null>,
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
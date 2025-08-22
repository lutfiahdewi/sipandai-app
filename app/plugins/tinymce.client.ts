
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component(
    "TinymceEditor",
    defineAsyncComponent(async () => {
      // Core + assets
      await import("tinymce/tinymce")
      await import("tinymce/icons/default")
      await import("tinymce/themes/silver")
      await import("tinymce/models/dom")

      // Plugins
      await import("tinymce/plugins/code")
      await import("tinymce/plugins/table")
      await import("tinymce/plugins/lists")
      await import("tinymce/plugins/link")
      await import("tinymce/plugins/image")

      // Vue wrapper: it exports `{ Editor }`, not default
      const mod = await import("@tinymce/tinymce-vue")
      return mod.Editor   // 👈 ensure we return the actual component
    })
  )
})
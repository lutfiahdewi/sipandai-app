<script setup lang="ts">
useHead({
  title: "Admin",
});
const isOpen = ref(false);
const toggleSidebar = () => {
  isOpen.value = !isOpen.value;
};
const supabase = useSupabaseClient()
const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  if (error){ console.log(error)
    reloadNuxtApp();
  }else[
    navigateTo('/')
  ]
}
const adminMenu = [
  {
    name: "Kategori utama",
    url: "/admin/category",
    deskripsi: "",
    icon: "hugeicons:paragraph-bullets-point-01",
  },
  {
    name: "Subkategori 1",
    url: "/admin/subcategory1",
    deskripsi: "",
    icon: "hugeicons:one-square",
  },
  {
    name: "Subkategori 2",
    url: "/admin/subcategory1",
    deskripsi: "",
    icon: "hugeicons:two-square",
  },
  {
    name: "Subkategori 3",
    url: "/admin/subcategory1",
    deskripsi: "",
    icon: "hugeicons:three-square",
  },
  { name: "Dokumen", url: "/admin/document", deskripsi: "", icon: "hugeicons:folder-02" },
];
</script>
<template>
  <div>
    <Header />
      <div class="sm:flex">
    <!-- left side -- sidebar -->
    <aside
      id="default-sidebar"
      class="fixed top-0 left-0 z-10 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0 duration-300"
      :class="{ 'translate-x-0': isOpen }"
    >
      <div
        class="flex flex-col justify-between h-full px-3 pt-16 sm:pt-24 overflow-y-auto bg-linear-to-t from-amber-300 to-orange-500 text-slate-50"
      >
        <div class="top-sectiom">
          <div class="admin-title text-center mb-3">
            <h3 class="font-bold text-3xl">SIPANDAI</h3>
            <p>Kelola tautan dokumen</p>
          </div>
          <ul
            class="space-y-2 font-medium bg-slate-50 text-slate-800 rounded-lg"
          >
            <li>
              <NuxtLink
                v-for="menu in adminMenu"
                :to="menu.url"
                class="flex items-center p-2 sm:p-3 hover:bg-slate-200 group border-t border-slate-500"
              >
                <Icon
                  :name="menu.icon"
                  size="20"
                  class="group-hover:text-black"
                />
                <span class="ms-3">{{ menu.name }}</span>
              </NuxtLink>
            </li>
          </ul>
        </div>
        <div class="bottom-section mb-24 sm:mb-8">
          <ButtonDefault name="logout" class="bg-blue-600 hover:bg-blue-700 w-full justify-center px-0" @click="signOut">
            <span> Logout</span>
          </ButtonDefault>
        </div>
      </div>
    </aside>
    <!-- right side -- content -->
    <div
      class="sm:flex-1 sm:ml-64 transition-all duration-300"
      :class="{ ' ml-64 ': isOpen }"
    >
      <button
        @click="toggleSidebar"
        type="button"
        class="inline-flex items-center p-2 mt-2 ms-3 text-sm text-orange-400 rounded-lg sm:hidden hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-300"
        :class="{ ' bg-slate-200': isOpen }"
      >
        <span class="sr-only">Open sidebar</span>
        <Icon name="hugeicons:menu-collapse" size="24" />
      </button>
      <div class="slot p-4 sm:p-8 lg:p-12 h-full" @click="isOpen = false">
        <slot/>      
      </div>
    </div>
  </div>
  </div>
</template>

<script setup lang="ts">
import { ErrorMessage } from "vee-validate";

definePageMeta({
  layout: false,
});
useHead({
  title: "Login",
});
const supabase = useSupabaseClient();
const user = useSupabaseUser();
const email = ref("");
const password = ref("");
const errorMessage = ref("");
const isLoading = ref(false);

watchEffect(() => {
  if (user.value) {
    console.log("✅ Logged in as:", user.value.email);
    navigateTo('/admin/category')
  } else {
    console.log("❌ Not logged in");
  }
});

async function login() {
  isLoading.value = true;
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value,
  });

  if (error) {
    errorMessage.value = error.message;
  } else {
    // User session is now stored in Supabase client
    console.log("Logged in as:", data.user);
    navigateTo("/admin/category"); // or your admin page
  }

  isLoading.value = false;
}
</script>

<template>
  <Header />
  <div
    class="content min-h-[75vh] flex justify-center items-center bg-slate-200"
  >
    <div class="wrapper py-8 sm:py-12 bg-slate-50">
      <h1
        class="mb-2 sm:mb-4 lg:mb-6 text-3xl sm:text-6xl lg:text-7xl font-bold text-orange-400 text-center text-shadow-lg"
      >
        SIPANDAI
      </h1>
      <h3 class="pb-4 sm:pb-6 text-xl sm:text-4xl font-bold text-center">
        Masuk Sebagai Admin
      </h3>
      <form
        @submit.prevent="login"
        class="w-screen sm:w-160 pb-3 sm:pb-6 px-12 sm:px-24"
      >
        <div class="mb-6">
          <label
            for="email"
            class="block mb-2 text-base sm:text-lg font-medium text-gray-900"
            >Email</label
          >
          <input
            type="email"
            id="email"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm sm:text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            v-model="email"
          />
        </div>
        <div class="mb-6">
          <label
            for="password"
            class="block mb-2 sm:text-lg font-medium text-gray-900"
            >Password</label
          >
          <input
            type="password"
            id="password"
            v-model="password"
            class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          />
        </div>
        <button
          type="submit"
          class=" hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-base sm:text-lg w-full px-5 py-2.5 text-center"
          :class="
            isLoading ? 'bg-blue-300 text-slate-100' : ' text-white bg-blue-700'
          "
          :disabled="isLoading"
        >
          <IconLoading v-if="isLoading" class="inline h-auto me-1" />
          Submit
        </button>
        <div
          v-if="errorMessage"
          class="text-red-400 mb-2 sm:text-lg font-medium"
        >
          {{ `Gagal Login: ${errorMessage}` }}
        </div>
      </form>
    </div>
  </div>
  <Footer />
</template>

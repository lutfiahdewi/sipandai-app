<script setup lang="ts">
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from 'yup'

definePageMeta({
  layout: false,
});
useHead({
  title: "Login",
});
const supabase = useSupabaseClient();
const user = useSupabaseUser();
const errorMessageLogin = ref("");
const isLoading = ref(false);

watchEffect(() => {
  if (user.value) {
    // console.log("✅ Logged in as:", user.value.email);
    navigateTo("/admin/category");
  } else {
    // console.log("❌ Not logged in");
  }
});

const loginSchema = yup.object({
  email: yup.string().required().email(),
  password: yup.string().required().min(8),
});

async function login(values: any) {
  isLoading.value = true;
  const { data, error } = await supabase.auth.signInWithPassword(values);
  if (error) {
    errorMessageLogin.value = error.message;
  } else {
    // User session is now stored in Supabase client
    // console.log("Logged in as:", data.user);
    await navigateTo("/admin/"); // or your admin page
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
      <Form
        @submit="login" :validation-schema="loginSchema"
        class="w-screen sm:w-160 pb-3 sm:pb-6 px-12 sm:px-24"
      >
        <div class="mb-6">
          <label
            for="email"
            class="block mb-2 text-base sm:text-lg font-medium text-gray-900"
            >Email</label
          >
          <Field
            type="email"
            name="email"
            id="email"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm sm:text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          />
          <ErrorMessage name="email" class="text-red-500 text-sm" />
        </div>
        <div class="mb-6">
          <label
            for="password"
            class="block mb-2 sm:text-lg font-medium text-gray-900"
            >Password</label
          >
          <Field
            type="password"
            name="password"
            id="password"
            class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          />
          <ErrorMessage name="password" class="text-red-500 text-sm" />
        </div>
        <button
          type="submit"
          class="focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-base sm:text-lg w-full px-5 py-2.5 text-center"
          :class="
            isLoading
              ? 'bg-blue-300 text-slate-100'
              : ' text-white bg-blue-700 hover:bg-blue-800 '
          "
          :disabled="isLoading"
        >
          <div
            v-if="isLoading"
            class="flex gap-x-2 justify-center items-center"
          >
            <IconLoading class="inline w-6 h-6" />
            <span>Loading...</span>
          </div>
          <span v-else>Submit</span>
        </button>
        <div
          v-if="errorMessageLogin"
          class="text-red-400 mb-2 sm:text-lg font-medium"
        >
          {{ `Gagal Login: ${errorMessageLogin}` }}
        </div>
      </Form>
    </div>
  </div>
  <Footer />
</template>

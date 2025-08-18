<script setup lang="ts">
definePageMeta({
  layout: false,
});
useHead({
  title: "Login",
});
const supabase = useSupabaseClient();
</script>

<template>
  <Header />
  <div
    class="content  sm:min-h-[75vh] flex justify-center items-center bg-slate-200"
  >
    <div class="wrapper py-8 sm:py-12 bg-slate-50">
      <h1
        class="mb-2 sm:mb-4 lg:mb-6 text-3xl sm:text-6xl lg:text-7xl font-bold text-orange-400 text-center text-shadow-lg "
      >
        SIPANDAI
      </h1>
      <h3 class="pb-4 sm:pb-6 text-xl sm:text-4xl font-bold text-center">
        Masuk Sebagai Admin
      </h3>
      <form action="" class="w-screen sm:w-160 pb-3 sm:pb-6 px-12 sm:px-24">
        <div class="mb-6">
          <label
            for="username"
            class="block mb-2 text-base sm:text-lg font-medium text-gray-900"
            >Username</label
          >
          <input
            type="text"
            id="username"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm sm:text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
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
            class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          />
        </div>
        <button
          type="submit"
          class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-base sm:text-lg w-full px-5 py-2.5 text-center"
        >
          Submit
        </button>
      </form>
    </div>
  </div>
  <Footer />
</template>

<script setup lang="ts">
import { DEFAULT_PADDING_X } from "@/utils/constants";
interface socmed {
  name: string;
  icon: string;
  url: string;
}
const socmedList: socmed[] = [
  {
    name: "youtube",
    icon: "logos:youtube-icon",
    url: "https://www.youtube.com/@bpskabupatenpolewalimandar6637",
  },
  {
    name: "instagram",
    icon: "skill-icons:instagram",
    url: "https://www.instagram.com/bpskabpolman/",
  },
  {
    name: "tiktok",
    icon: "logos:facebook",
    url: "https://www.tiktok.com/@bpskabpolman",
  },
  {
    name: "facebook",
    icon: "logos:tiktok-icon",
    url: "https://www.facebook.com/profile.php?id=61562282248459",
  },
];
//  bg-radial-[at_50%_75%] from-orange-400 from-66% to-orange-600
</script>
<template>
  <footer
    :class="
      DEFAULT_PADDING_X +
      DEFAULT_PADDING_Y_MD +
      ' bg-linear-to-t from-orange-300 to-amber-600  text-white z-98'
    "
  >
    <!-- konten -->
    <!-- logo bps dan berakhlak -->
    <div
      class="flex flex-col sm:flex-row items-center sm:justify-between pb-2 sm:pb-0 gap-y-2 sm:gap-y-0"
    >
      <BpsLogo color="white" class="self-start sm:self-center" />
      <img
        src="../assets/img/berakhlak.webp"
        class="h-12 sm:h-14 lg:h-18 object-contain self-start"
      />
    </div>
    <!-- alamat dan sosmed -->
    <div
      class="flex flex-col sm:flex-row items-center sm:justify-between pb-2 sm:pb-8 gap-y-2 sm:gap-y-0"
    >
      <div
        class="address self-start font-medium text-slate-50 text-xs sm:text-sm lg:text-lg"
      >
        <p>Badan Pusat Statistik Kabupaten Polewali Mandar</p>
        <p>Jl. Tritura Polewali Mandar 91315 Sulawesi Barat</p>
        <p>Telp (0428) 21406</p>
        <p>Faks (0428) 21406</p>
        <p>E-Mail : pst7602@bps.go.id</p>
      </div>
      <div class="socmed-group flex gap-x-2 sm:gap-x-4 self-start sm:self-end">
        <NuxtLink v-for="socmed in socmedList" :to="socmed.url" target="_blank">
          <div class="icon-wrapper-1 lg:hidden">
            <Icon
              :name="socmed.icon"
              :title="socmed.name + ' BPS Kabupaten Polewali Mandar'"
              size="24"
            />
          </div>
          <div class="icon-wrapper-2 hidden lg:inline">
            <Icon
              :name="socmed.icon"
              :title="socmed.name + ' BPS Kabupaten Polewali Mandar'"
              size="36"
            />
          </div>
        </NuxtLink>
      </div>
    </div>
    <!-- separator dan copyright -->
    <div class="cr pt-4 sm:pt-8 border-t border-white">
      <p class="text-xs sm:text-base lg:text-lg text-center">
        &copy; BPS Kabupaten Polewali Mandar 2025
      </p>
    </div>
  </footer>
</template>

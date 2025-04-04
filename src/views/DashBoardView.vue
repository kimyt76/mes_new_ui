<template>
  <div>
    <h1>대시보드</h1>
    <button @click="handleLogout">로그아웃</button>
  </div>
</template>

<script setup>
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();

const handleLogout = () => {
  authStore.logoutUser();
  router.push("/");
};
</script>

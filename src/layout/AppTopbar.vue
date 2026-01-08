<template>
    <div class="layout-topbar">
        <div class="layout-topbar-logo-container">
            <button class="layout-menu-button layout-topbar-action" @click="toggleMenu">
                <i class="pi pi-bars"></i>
            </button>
            <div class="layout-topbar-logo">
                <a href="http://jincostech.com/" target="_blank">
                    <img src="/logo_jincostech.jpg" alt="JINCOSTECH" style="width:30px; height:30px;" />
                </a>
                <span>JINCOSTECH</span>
            </div>
        </div>

        <div class="layout-topbar-actions flex items-center gap-4">
      <div class="layout-config-menu">
        <button type="button" class="layout-topbar-action" @click="toggleDarkMode">
          <i :class="['pi', { 'pi-moon': isDarkTheme, 'pi-sun': !isDarkTheme }]"></i>
        </button>
      </div>
    <div class="layout-topbar-menu hidden lg:block relative">
        <div class="flex items-center gap-2">
          <span @click="userMenu.toggle($event)" class="cursor-pointer flex items-center gap-1 font-medium px-3 mt-1">
            {{ deptNm }} / {{ memberNm }}
            <i class="pi pi-chevron-down text-sm"></i>
          </span>
        </div>

        <!-- OverlayPanel -->
        <OverlayPanel ref="userMenu" :dismissable="true" class="user-menu-overlay p-shadow-6">
          <div class="flex flex-col w-48">
            <button class="p-button-text w-full text-left py-2 px-2 hover:bg-gray-100 rounded flex items-center gap-2 text-base text-black" @click="openUserInfo">
              <i class="pi pi-info-circle mr-2"></i> 사용자 정보
            </button>
            <button class="p-button-text w-full text-left py-2 px-2 hover:bg-gray-100 rounded flex items-center gap-2 text-base text-black" @click="logout">
              <i class="pi pi-sign-out mr-2"></i> 로그아웃
            </button>
          </div>
        </OverlayPanel>
      </div>
        </div>
    </div>
</template>

<script setup>
import { useLayout } from '@/layout/composables/layout';
import { useAuthStore } from '@/stores/auth';
import UserDtlPop from '@/views/system/user/UserDtlPop.vue';
import { useDialog } from 'primevue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter()
const authStore = useAuthStore()
const { memberNm, deptNm, userId} = authStore
const dialog = useDialog()
const { toggleMenu, toggleDarkMode, isDarkTheme } = useLayout();
const userMenu = ref(null);

// 사용자 정보 팝업 열기
const openUserInfo = () => {
  // 예: PrimeVue Dialog 열기
  userMenu.value.hide();

  dialog.open(UserDtlPop, {
    props:{
        header: '사용자 정보',
        modal: true,
    },
    data: userId,
    onClose: () => {

    }
  })
}

// 로그아웃 처리
const logout = () => {
  userMenu.value.hide();
  // 실제 로그아웃 로직 호출
   authStore.logoutUser()
   authStore.user = null;
   router.push({name:'LogIn'})
}

</script>

<style scoped>
.user-menu-overlay .p-button-text {
  color: #000 !important;       /* 글씨 검정 */
  font-size: 1rem !important;   /* 글씨 조금 크게 */
}
.user-menu-overlay {
  border-radius: 0.5rem;
  font-family: "Arial", sans-serif;
  font-size: 1rem; /* 글씨 조금 더 크게 */
}

.cursor-pointer {
  cursor: pointer;
}

/* 버튼 hover 색상 */
.user-menu-overlay button:hover {
  background-color: #f0f4f8;
}
</style>

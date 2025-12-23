<script setup>
import Button from 'primevue/button';
import AppMenu from './AppMenu.vue';
</script>

<template>
    <div class="layout-sidebar flex flex-column">

        <!-- 상단: 메뉴 -->
        <div class="menu-wrapper flex-1 overflow-auto">
            <app-menu />
        </div>

        <!-- 하단: 바로가기 링크(버튼/아이콘 등) -->
        <div class="sidebar-footer p-3 text-center">
            <Button
                label="ChatGPT"
                icon="pi pi-external-link"
                class="w-full mt-2"
                rounded
                severity="info"
                as="a"
                target="_blank"
                href="https://chatgpt.com/"
            />
        </div>

    </div>
</template>

<style lang="scss" scoped>
.layout-sidebar {
    display: flex;
    flex-direction: column;
}
.sidebar-footer {
    padding: 1rem 0.5rem;
}
</style>

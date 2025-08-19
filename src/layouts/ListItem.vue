<template>
  <v-list-item
    :title="item.title"
    link
    :to="item.to"
    :prepend-icon="item.icon"
    selected-class="bg-primary"
    density="compact"
    style="min-height: 25px"
    >
  </v-list-item>
</template>

<script setup>
defineProps({
  item : {
    type:  [Array, Object],
    default: () => {},
  },
})
</script>

<style scoped>

</style>

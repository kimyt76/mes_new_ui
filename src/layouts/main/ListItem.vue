<template>
  <v-list-item
    :title="item.title"
    link
    :to="item.to"
    :prepend-icon="item.icon"
    active-class="primary white--text"
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

<style lang="scss" scoped>

</style>

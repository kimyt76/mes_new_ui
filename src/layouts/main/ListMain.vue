<template>
  <v-list
    dense
    expand
    nav
    >
    <template
      v-for="(item, index) in items"
      >
      <ListGroup
        v-if="item.items"
        :key="`group-${index}`"
        :item="item"
      />
      <ListItem
        v-else
        :key="`item-${index}`"
        :item="item"
      />
    </template>
  </v-list>
</template>

<script setup>
import ListGroup from './ListGroup.vue';
import ListItem from './ListItem.vue';


defineProps({
  items : {
    type:  [Array, Object],
    default: () => {},
  },
})

</script>

<style lang="scss" scoped>

</style>

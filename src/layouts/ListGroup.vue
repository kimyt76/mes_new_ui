<template>
  <v-list-group
      eager
      v-bind="$attrs"
    >
    <template v-slot:activator="{props}">
      <v-list-item
        v-bind="props"
        :prepend-icon="item.icon"
        :title="item.title"
      />
    </template>
    <template v-for="(child, i) in item.items">
      <ListGroup
        v-if="child.items"
        :key="`sub-group-${i}`"
        :item="child"
      />
      <ListItem
        v-else
        :key="`child-${i}`"
        :item="child"
        />
    </template>

  </v-list-group>
</template>

<script setup>
import ListItem from './ListItem.vue';

defineProps({
  item: [Array, Object],
  default:() => {},
})

// const availableMenuItems = computed(() =>
//   allMenuItems.filter(item =>
//     item.roles.some(role => user.roles.includes(role))
//   )
// );
</script>

<style lang="scss" scoped>

</style>

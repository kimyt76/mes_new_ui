<template>
  <div>
    <v-list v-model:opened="open">
      <!-- <v-list-item prepend-icon="mdi-home" title="Home"></v-list-item> -->

      <v-list-group value="systemMgmt">
        <template v-slot:activator="{ props }">
          <v-list-item
            v-bind="props"
            prepend-icon="mdi-account-circle"
            title="시스템관리 "
          ></v-list-item>
        </template>

          <v-list-item
            v-for="([title, icon, move], i) in subMenus"
            :key="i"
            :prepend-icon="icon"
            :title="title"
            :value="title"
            @click="movePath(move)"
          ></v-list-item>
        </v-list-group>
    </v-list>
  </div>
</template>

<script setup>




</script>

<style lang="scss" scoped>

</style>

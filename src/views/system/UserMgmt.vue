<template>
  <div class="mb-3">
    <v-breadcrumbs :items="['MES', '시스템관리', '사용자 관리']"></v-breadcrumbs>
    <hr/>
    <v-card
      >
    <div>
      <v-text-field
      flex
      >


      </v-text-field>
      <v-select>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>

      </v-select>
      <v-btn
        depressed
        stateless
      >
        검색
      </v-btn>
    </div>

    </v-card>
     <v-table>
      <thead>
        <th>
          <td>
            adfdd
          </td>
        </th>
      </thead>
      <tbody>
        <th>
          <td>

          </td>
        </th>
      </tbody>
    </v-table>

  </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>

</style>

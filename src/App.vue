<!-- корневой файл приложения .vue с корневым шаблоном, говорящим о том, что есть приложение с основной частью и роутером router-view -->
<template>
  <v-app>
    <DefaultLayout
      @search="onSearch"
      :selected-date="selectedDate"
      @update:selected-date="selectedDate = $event"
      @date-change="onDateChange"
      :selected-status="selectedStatus"
      @update:selected-status="selectedStatus = $event"
    >
      <router-view :searchQuery="searchQuery" :selectedDate="selectedDate" :selectedStatus="selectedStatus" />
    </DefaultLayout>
  </v-app>
</template>

<script>
import DefaultLayout from '@/layouts/DefaultLayout.vue'

export default {
  name: 'App',
  components: { DefaultLayout },
  data() {
    return {
      searchQuery: "",
      selectedDate: null,
      selectedStatus: 'all',
    };
  },
  methods: {
    onSearch(query) {
      this.searchQuery = query;
    },
    onDateChange() {
      // Передаем изменение даты в роутер
      this.$forceUpdate();
    }
  }
};
</script>

<style>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding: 2rem 0;
}
</style>
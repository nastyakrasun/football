<!-- корневой файл приложения .vue с корневым шаблоном, говорящим о том, что есть приложение с основной частью и роутером router-view -->
<template>
  <div class="app-container">
    <AppHeader
      @search="onSearch"
      :selected-date="selectedDate"
      @update:selected-date="selectedDate = $event"
      @date-change="onDateChange"
      :selected-status="selectedStatus"
      @update:selected-status="selectedStatus = $event"
    />

    <!-- Основное содержание -->
    <main class="main-content">
      <!-- router-view - этот роутер говорит о том, из каких элементов состоит наше приложение -->
      <router-view :searchQuery="searchQuery" :selectedDate="selectedDate" :selectedStatus="selectedStatus" />
    </main>

    <AppFooter />
  </div>
</template>

<script>
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'

export default {
  name: 'App',
  components: {
    AppHeader,
    AppFooter
  },
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

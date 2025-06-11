<template>
  <div class="app-container">
    <AppHeader
      @search="onSearch"
    />

    <!-- Основное содержание -->
    <main class="main-content">
      <router-view :searchQuery="searchQuery" />
    </main>

    <AppFooter/>
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
    };
  },
  methods: {
    onSearch(query) {
      this.searchQuery = query;
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

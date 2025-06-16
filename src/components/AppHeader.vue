<template>
  <header class="app-header">
    <div class="header-content">
      <!-- Logo and Brand -->
      <div class="brand-section">
        <img src="../assets/logo.png" alt="Logo" class="logo" />
        <h1 class="brand-name">Football Stats</h1>
      </div>

      <!-- Main Navigation -->
      <nav class="main-nav">
        <v-btn
          @click="$router.push('/')"
          :class="{ active: $route.path === '/' }"
          variant="text"
        >
          Главная
        </v-btn>
        <v-btn
          @click="$router.push('/leagues')"
          :class="{ active: $route.path === '/leagues' }"
          variant="text"
        >
          Лиги
        </v-btn>
        <v-btn
          @click="$router.push('/teams')"
          :class="{ active: $route.path === '/teams' }"
          variant="text"
        >
          Команды
        </v-btn>
      </nav>

      <!-- Right Section -->
      <div class="header-right">
        <!-- Search -->
        <v-text-field
          v-model="searchQuery"
          placeholder="Поиск..."
          prepend-inner-icon="mdi-magnify"
          clearable
          hide-details
          density="compact"
          variant="outlined"
          class="search-field"
          @input="onSearch"
        ></v-text-field>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: 'AppHeader',
  data() {
    return {
      searchQuery: "",
      };
  },
  methods: {
    onSearch() {
      this.$emit('search', this.searchQuery);
    }
  }
};
</script>

<style scoped>
.app-header {
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.brand-section {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.logo {
  height: 40px;
}

.brand-name {
  font-size: 1.5rem;
  font-weight: bold;
  color: #1976d2;
}

.main-nav {
  display: flex;
  gap: 1rem;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.search-field {
  width: 200px;
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 1rem;
  }

  .main-nav {
    width: 100%;
    justify-content: center;
  }

  .header-right {
    width: 100%;
    justify-content: center;
  }

  .search-field {
    width: 100%;
  }
}
</style> 
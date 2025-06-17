<template>
  <header class="app-header">
    <div class="header-content">
      <!-- Логотип и бренд -->
      <div class="brand-section">
        <!-- <img src="../assets/free-icon-app-919423.png" alt="Logo" class="logo" /> -->
        <img src="../assets/logo.png" alt="Logo" class="logo" /> 
        <h1 class="brand-name">SoccerStat</h1>
      </div>

      <!-- Основная навигация -->
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

      <!-- Правая секция -->
      <div class="header-right">
        <!-- Поиск -->
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
  box-shadow: 0 2px 12px rgba(44, 62, 80, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
  border-bottom: 1px solid rgba(44, 62, 80, 0.05);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0.75rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.brand-section {
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: transform 0.3s ease;
}

.brand-section:hover {
  transform: translateY(-1px);
}

.logo {
  height: 40px;
  transition: transform 0.3s ease;
}

.brand-section:hover .logo {
  transform: scale(1.05);
}

.brand-name {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2c3e50;
  letter-spacing: -0.5px;
}

.main-nav {
  display: flex;
  gap: 0.5rem;
}

.main-nav .v-btn {
  font-weight: 500;
  letter-spacing: 0.3px;
  transition: all 0.3s ease;
}

.main-nav .v-btn:hover {
  transform: translateY(-1px);
}

.main-nav .v-btn.active {
  color: #3498db;
  font-weight: 600;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.search-field {
  width: 240px;
}

.search-field :deep(.v-field) {
  border-radius: 8px;
  transition: all 0.3s ease;
}

.search-field :deep(.v-field:hover) {
  box-shadow: 0 2px 8px rgba(44, 62, 80, 0.1);
}

.search-field :deep(.v-field--focused) {
  box-shadow: 0 2px 12px rgba(52, 152, 219, 0.15);
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
  }

  .main-nav {
    width: 100%;
    justify-content: center;
    flex-wrap: wrap;
  }

  .header-right {
    width: 100%;
    justify-content: center;
  }

  .search-field {
    width: 100%;
    max-width: 400px;
  }
}
</style> 
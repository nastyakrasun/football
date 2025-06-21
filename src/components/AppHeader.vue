<template>
  <header class="app-header" :style="{ backgroundColor: headerBg + ' !important' }">
    <div class="header-content">
      <!-- Логотип и бренд -->
      <div class="brand-section">
        <!-- <img src="../assets/free-icon-app-919423.png" alt="Logo" class="logo" /> -->
        <img src="../assets/logo.png" alt="Logo" class="logo" /> 
        <h1 class="brand-name">{{$t('app.title')}}</h1>
      </div>

      <!-- Основная навигация -->
      <nav class="main-nav">
        <v-btn
          @click="$router.push('/')"
          :class="{ active: $route.path === '/' }"
          variant="text"
        >
          {{$t('app.home')}}
        </v-btn>
        <v-btn
          @click="$router.push('/leagues')"
          :class="{ active: $route.path === '/leagues' }"
          variant="text"
        >
          {{$t('app.leagues')}}
        </v-btn>
        <v-btn
          @click="$router.push('/teams')"
          :class="{ active: $route.path === '/teams' }"
          variant="text"
        >
          {{$t('app.teams')}}
        </v-btn>
      </nav>

      <!-- Правая секция -->
      <div class="header-right">
        <!-- Поиск, двусторонняя привязка -->
        <!-- v-model="searchQuery" связывает значение поля ввода с переменной searchQuery в data -->
        <!-- при изменении текста в поле ввода значение searchQuery автоматически обновляется, и наоборот -->
        <v-text-field
          v-model="searchQuery" 
          :placeholder="$t('app.search')"
          prepend-inner-icon="mdi-magnify"
          clearable
          hide-details
          density="compact"
          variant="outlined"
          class="search-field"
          @input="onSearch"
        ></v-text-field>
        <ThemeChange />
        <LanguageChange />
      </div>
    </div>
  </header>
</template>

<script>
import ThemeChange from './ThemeChange.vue'
import LanguageChange from './LanguageChange.vue'
import { useTheme } from 'vuetify'
import { computed } from 'vue'

export default {
  name: 'AppHeader',
  components: { ThemeChange, LanguageChange },
  setup() {
    const theme = useTheme()
    const headerBg = computed(() => theme.global.name.value === 'dark' ? '#2c3e50' : 'white')
    return { headerBg }
  },
  data() {
    return {
      searchQuery: "", // Реактивное свойство, связанное с v-model
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
  background-color: #2c3e50;
  box-shadow: 0 2px 12px rgba(44, 62, 80, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
  border-bottom: 1px solid rgba(44, 62, 80, 0.05);
  opacity: 1;
  transition: background-color 0.3s;
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
  color: #3498db;
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
  color: #3498db;
}

.main-nav .v-btn:hover {
  transform: translateY(-1px);
}

.main-nav .v-btn.active {
  color: #2980b9;
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

<style>
html, body {
  background: var(--v-theme-background, #f8f9fa) !important;
}
</style> 
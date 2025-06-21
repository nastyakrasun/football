<template>
  <div class="matches-list">
    <!-- Название страницы -->
    <div class="page-header">
      <h1>{{$t(pageTitleKey)}}</h1>
      <p class="subtitle">{{$t('app.page_subtitle')}}</p>
    </div>

    <!-- Состояние загрузки -->
    <div v-if="isLoading" class="loading-state">
      <v-progress-circular
        indeterminate
        color="primary"
        size="64"
      ></v-progress-circular>
    </div>

    <!-- Состояние ошибки - сообщение об ошибке отображается в пользовательском интерфейсе -->
    <v-alert 
      v-else-if="error"
      type="error"
      class="ma-4"
    >
      {{ error }}
    </v-alert>

    <!-- Состояние нет результатов -->
    <v-alert
      v-else-if="!isLoading && filteredItems.length === 0"
      type="info"
      class="ma-4"
    >
      {{ searchQuery
        ? $t(entityType === 'league' ? 'app.not_found_leagues' : 'app.not_found_teams')
        : $t(entityType === 'league' ? 'app.not_available_leagues' : 'app.not_available_teams')
      }}
    </v-alert>

    <!-- Сетка элементов -->
    <template v-else>
      <div :class="`${entityType}s-grid`">
        <v-card
          v-for="item in paginatedItems"
          :key="item.id"
          :class="`${entityType}-card`"
          @click="goToItem(item.id)"
        >
          <v-img
            :src="getItemImage(item)"
            :height="entityType === 'league' ? 100 : 150"
            center
            :class="`${entityType}-image`"
          >
            <template v-slot:placeholder>
              <v-row
                class="fill-height ma-0"
                align="center"
                justify="center"
              >
                <v-progress-circular
                  indeterminate
                  color="grey-lighten-4"
                ></v-progress-circular>
              </v-row>
            </template>
          </v-img>

          <v-card-title :class="`${entityType}-name`">
            {{ item.name }}
          </v-card-title>

          <v-card-text v-if="entityType === 'league'">
            <div class="item-info">
              <div class="info-item">
                <v-img
                  :src="'/src/assets/free-icon-pin-919412.png'"
                  width="24"
                  height="24"
                  class="info-icon"
                />
                <span>{{ item.area?.name || $t('app.not_specified') }}</span>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </div>

      <!-- Пагинация -->
      <Pagination
        v-if="filteredItems.length > 0"
        :total-pages="totalPages"
        :current-page="page"
        @update:currentPage="handlePageChange"
      />
    </template>
  </div>
</template>

<script>
import api from '@/api'
import Pagination from '@/components/Pagination.vue'

export default {
  name: 'MatchesList',
  components: {
    Pagination
  },
  props: {
    entityType: {
      type: String,
      required: true,
      validator: value => ['league', 'team'].includes(value)
    },
    searchQuery: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      items: [],        // REACTIVE: список лиг/команд
      isLoading: true,  // REACTIVE: состояние загрузки
      error: null,      // REACTIVE: сообщение об ошибке
      page: 1,          // REACTIVE: текущая страница пагинации
      itemsPerPage: this.entityType === 'league' ? 9 : 10 // REACTIVE: количество элементов данных на странице
    }
  },
  computed: {
    pageTitleKey() {
      return this.entityType === 'league' ? 'app.page_title_leagues' : 'app.page_title_teams'
    },
    entityTypeText() {
      return this.entityType === 'league' ? 'лиг' : 'команд'
    },
    filteredItems() {
      if (!this.searchQuery) return this.items
      
      const query = this.searchQuery.toLowerCase()
      return this.items.filter(item => {
        const nameMatch = item.name.toLowerCase().includes(query)
        const areaMatch = item.area?.name.toLowerCase().includes(query)
        const tlaMatch = this.entityType === 'team' ? item.tla?.toLowerCase().includes(query) : false
        
        return nameMatch || areaMatch || tlaMatch
      })
    },
    totalPages() {
      return Math.ceil(this.filteredItems.length / this.itemsPerPage)
    },
    paginatedItems() {
      const start = (this.page - 1) * this.itemsPerPage
      const end = start + this.itemsPerPage
      return this.filteredItems.slice(start, end)
    }
  },
  methods: {
    async fetchData() { // использую `async fetchData()" с "await api.get(...)" для получения данных с сервера
      this.isLoading = true
      this.error = null
      
      try { // пытается получить данные из API
        const endpoint = this.entityType === 'league' ? 'api/v4/competitions' : 'api/v4/teams'
        const response = await api.get(endpoint) // await api.get(...) используется для получения данных с сервера
        
        const dataKey = this.entityType === 'league' ? 'competitions' : 'teams'
        // результат сохраняется в реактивных переменных (this.items, this.entity, this.matches)
        if (response.data && Array.isArray(response.data[dataKey])) {
          this.items = response.data[dataKey]
          this.page = 1 // Reset to first page when new data is loaded
        } else {
          throw new Error('Неверный формат данных')
        }
        // Если запрос не выполняется или формат данных неверен, блок catch присваивает реактивной переменной error понятное сообщение об ошибке
      } catch (err) { // ошибки перехватываются и обрабатываются
        this.error = err.message === 'Неверный формат данных' 
          ? 'Ошибка в формате данных. Пожалуйста, попробуйте позже.'
          : `Не удалось загрузить список ${this.entityTypeText}. Пожалуйста, попробуйте позже.`
        console.error(`Loading error ${this.entityTypeText}:`, err)
      } finally {
        this.isLoading = false
      }
    },
    getItemImage(item) {
      if (this.entityType === 'league') {
        return item.emblem || '/src/assets/free-icon-football-club-919408.png'
      } else {
        return item.crest || '/src/assets/free-icon-soccer-player-919397.png'
      }
    },
    goToItem(itemId) {
      const route = this.entityType === 'league' ? `/league/${itemId}` : `/team/${itemId}`
      this.$router.push(route)
    },
    handlePageChange(newPage) {
      this.page = newPage
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  },
  watch: { // перехватчик жизненного цикла, используется для реагирования на изменения в prop 
    searchQuery() {
      this.page = 1 // перенаправление на страницу 1 при изменении searchQuery
    },
    entityType() { // при изменении entityType количество элементов на странице обновляется и извлекаются новые данные
      this.itemsPerPage = this.entityType === 'league' ? 9 : 10
      this.fetchData()
    }
  },
  mounted() {
    this.fetchData() // Метод вызывается в перехватчике жизненного цикла mounted(), поэтому данные загружаются при появлении компонента
  }
}
</script>

<style scoped>
.matches-list {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
  min-height: calc(100vh - 200px);
}

.page-header {
  text-align: center;
  margin-bottom: 3rem;
  position: relative;
}

.page-header::after {
  content: '';
  position: absolute;
  bottom: -1rem;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 4px;
  background: linear-gradient(90deg, #3498db, #2c3e50);
  border-radius: 2px;
}

.page-header h1 {
  font-size: 2.8rem;
  color: #3498db;
  margin-bottom: 0.75rem;
  font-weight: 700;
  letter-spacing: -0.5px;
}

.subtitle {
  color: #7f8c8d;
  font-size: 1.2rem;
  font-weight: 500;
}

.loading-state {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
}

/* Leagues Grid */
.leagues-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.league-card {
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 12px;
  overflow: hidden;
  border: 2px solid rgba(44, 62, 80, 0.22);
  background-color: var(--v-theme-surface);
}

@media (prefers-color-scheme: dark) {
  .league-card {
    border: 2px solid rgba(200, 220, 255, 0.22);
  }
}

.league-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(44, 62, 80, 0.15);
  border-color: #3498db;
}

.league-image {
  background-color: var(--v-theme-surface);
  padding: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.league-name {
  font-size: 1.3rem;
  font-weight: 600;
  color: #2c3e50;
  padding: 1rem 1rem 0.5rem;
  line-height: 1.4;
}

/* Teams Grid */
.teams-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.team-card {
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 12px;
  overflow: hidden;
  border: 2px solid rgba(44, 62, 80, 0.22);
  background-color: var(--v-theme-surface);
}

@media (prefers-color-scheme: dark) {
  .team-card {
    border: 2px solid rgba(200, 220, 255, 0.22);
  }
}

.team-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(44, 62, 80, 0.15);
  border-color: #3498db;
}

.team-image {
  background-color: var(--v-theme-surface);
  padding: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.team-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2c3e50;
  padding: 1rem;
  line-height: 1.4;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Common styles */
.item-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-right: 12rem;
  text-align: left;
}

.info-item {
  display: flex;
  align-items: left;
  gap: 0.5rem;
  color: #7f8c8d;
  font-size: 0.95rem;
}

.info-icon {
  opacity: 0.8;
  transition: opacity 0.3s ease;
  margin-right: 0;
}

.info-item:hover .info-icon {
  opacity: 1;
}

.v-alert {
  border-radius: 8px;
  margin: 1rem 0;
}

@media (max-width: 768px) {
  .matches-list {
    padding: 1.5rem 1rem;
  }

  .page-header h1 {
    font-size: 2rem;
  }

  .subtitle {
    font-size: 1.1rem;
  }

  .leagues-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .teams-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 1rem;
  }

  .league-card,
  .team-card {
    margin: 0 0.5rem;
  }

  .team-name {
    font-size: 1rem;
    padding: 0.75rem;
  }
}
</style> 
<template>
  <div class="leagues-page">
    <!-- Название страницы -->
    <div class="page-header">
      <h1>Футбольные лиги</h1>
      <p class="subtitle">и их статистика</p>
    </div>

    <!-- Состояние загрузки -->
    <div v-if="isLoading" class="loading-state">
      <v-progress-circular
        indeterminate
        color="primary"
        size="64"
      ></v-progress-circular>
    </div>

    <!-- Состояние ошибки -->
    <v-alert
      v-else-if="error"
      type="error"
      class="ma-4"
    >
      {{ error }}
    </v-alert>

    <!-- Состояние нет результатов -->
    <v-alert
      v-else-if="!isLoading && filteredLeagues.length === 0"
      type="info"
      class="ma-4"
    >
      {{ searchQuery ? "No leagues found" : "Нет доступных лиг" }}
    </v-alert>

    <!-- Сетка лиг -->
    <template v-else>
      <div class="leagues-grid">
        <v-card
          v-for="league in paginatedLeagues"
          :key="league.id"
          class="league-card"
          @click="goToLeague(league.id)"
        >
          <v-img
            :src="league.emblem || '/src/assets/free-icon-football-club-919408.png'"
            height="100"
            center
            class="league-emblem"
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

          <v-card-title class="league-name">
            {{ league.name }}
          </v-card-title>

          <v-card-text>
            <div class="league-info">
              <div class="info-item">
                <!-- <v-icon>mdi-map-marker</v-icon> -->
                <v-img
                  :src="'/src/assets/free-icon-pin-919412.png'"
                  width="24"
                  height="24"
                  class="info-icon"
                />
                <span>{{ league.area?.name || 'Не указано' }}</span>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </div>

      <!-- Пагинация -->
      <Pagination
        v-if="filteredLeagues.length > 0"
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
  name: 'LeaguesPage',
  components: {
    Pagination
  },
  props: {
    searchQuery: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      leagues: [],
      isLoading: true,
      error: null,
      page: 1,
      itemsPerPage: 9 // 3 columns * 3 rows
    }
  },
  computed: {
    filteredLeagues() {
      if (!this.searchQuery) return this.leagues
      
      const query = this.searchQuery.toLowerCase()
      return this.leagues.filter(league => 
        league.name.toLowerCase().includes(query) ||
        league.area?.name.toLowerCase().includes(query)
      )
    },
    totalPages() {
      return Math.ceil(this.filteredLeagues.length / this.itemsPerPage)
    },
    paginatedLeagues() {
      const start = (this.page - 1) * this.itemsPerPage
      const end = start + this.itemsPerPage
      return this.filteredLeagues.slice(start, end)
    }
  },
  methods: {
    async fetchLeagues() {
      this.isLoading = true
      this.error = null
      
      try {
        const response = await api.get('api/v4/competitions')
        if (response.data && Array.isArray(response.data.competitions)) {
          this.leagues = response.data.competitions
          this.page = 1 // Reset to first page when new data is loaded
        } else {
          throw new Error('Неверный формат данных')
        }
      } catch (err) {
        this.error = err.message === 'Неверный формат данных' 
          ? 'Ошибка в формате данных. Пожалуйста, попробуйте позже.'
          : 'Не удалось загрузить лиги. Пожалуйста, попробуйте позже.'
        console.error('Ошибка загрузки лиг:', err)
      } finally {
        this.isLoading = false
      }
    },
    goToLeague(leagueId) {
      this.$router.push(`/league/${leagueId}`)
    },
    handlePageChange(newPage) {
      this.page = newPage
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  },
  watch: {
    searchQuery() {
      this.page = 1 // Reset to first page when search query changes
    }
  },
  mounted() {
    this.fetchLeagues()
  }
}
</script>

<style scoped>
.leagues-page {
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
  color: #2c3e50;
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
  border: 1px solid rgba(44, 62, 80, 0.1);
  background: white;
}

.league-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(44, 62, 80, 0.15);
  border-color: #3498db;
}

.league-emblem {
  background-color: #f8f9fa;
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

.league-info {
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
  .leagues-page {
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

  .league-card {
    margin: 0 0.5rem;
  }
}
</style> 
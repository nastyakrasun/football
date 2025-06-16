<template>
  <div class="leagues-page">
    <!-- Page Title -->
    <div class="page-header">
      <h1>Футбольные лиги</h1>
      <p class="subtitle">и их статистика</p>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="loading-state">
      <v-progress-circular
        indeterminate
        color="primary"
        size="64"
      ></v-progress-circular>
    </div>

    <!-- Error State -->
    <v-alert
      v-else-if="error"
      type="error"
      class="ma-4"
    >
      {{ error }}
    </v-alert>

    <!-- No Results State -->
    <v-alert
      v-else-if="!isLoading && filteredLeagues.length === 0"
      type="info"
      class="ma-4"
    >
      {{ searchQuery ? "Ничего не найдено" : "Нет доступных лиг" }}
    </v-alert>

    <!-- Leagues Grid -->
    <template v-else>
      <div class="leagues-grid">
        <v-card
          v-for="league in paginatedLeagues"
          :key="league.id"
          class="league-card"
          @click="goToLeague(league.id)"
        >
          <v-img
            :src="league.emblem || '/src/assets/placeholder.svg'"
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
                <v-icon>mdi-map-marker</v-icon>
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
  padding: 1rem 1rem;
}

.page-header {
  text-align: center;
  margin-bottom: 2rem;
}

.page-header h1 {
  font-size: 2.5rem;
  color: #1976d2;
  margin-bottom: 0.5rem;
}

.subtitle {
  color: #666;
  font-size: 1.1rem;
}

.loading-state {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.leagues-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  padding: 1rem 0;
}

.league-card {
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.league-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.league-emblem {
  background-color: #f5f5f5;
}

.league-name {
  font-size: 1.2rem;
  font-weight: 600;
  padding: 1rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;
}

.league-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: flex-end;
  padding-right: 1rem;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #666;
  justify-content: flex-end;
}

.info-item .v-icon {
  font-size: 1.2rem;
  color: #1976d2;
  order: 2;
}

.info-item span {
  order: 1;
}

@media (max-width: 768px) {
  .page-header h1 {
    font-size: 2rem;
  }

  .leagues-grid {
    grid-template-columns: 1fr;
  }
}
</style> 
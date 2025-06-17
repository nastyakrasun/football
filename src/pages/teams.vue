<template>
  <div class="teams-page">
    <!-- Название страницы -->
    <div class="page-header">
      <h1>Футбольные команды</h1>
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
      v-else-if="!isLoading && filteredTeams.length === 0"
      type="info"
      class="ma-4"
    >
      {{ searchQuery ? "No teams found" : "Нет доступных команд" }}
    </v-alert>

    <!-- Сетка команд -->
    <div v-else class="teams-grid">
      <v-card
        v-for="team in paginatedTeams"
        :key="team.id"
        class="team-card"
        @click="goToTeam(team.id)"
      >
        <v-img
          :src="team.crest || '/src/assets/placeholder.svg'"
          height="150"
          center
          class="team-crest"
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

        <v-card-title class="team-name">
          {{ team.name }}
        </v-card-title>
      </v-card>
    </div>

    <!-- Пагинация -->
    <Pagination
        v-if="filteredTeams.length > 0"
        :total-pages="totalPages"
        :current-page="page"
        @update:currentPage="handlePageChange"
      />
  </div>
</template>

<script>
import api from '@/api'
import Pagination from '@/components/Pagination.vue'

export default {
  name: 'TeamsPage',
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
      teams: [],
      isLoading: true,
      error: null,
      page: 1,
      itemsPerPage: 10 // 5 columns * 2 rows
    }
  },
  computed: {
    filteredTeams() {
      if (!this.searchQuery) return this.teams
      
      const query = this.searchQuery.toLowerCase()
      return this.teams.filter(team => 
        team.name.toLowerCase().includes(query) ||
        team.area?.name.toLowerCase().includes(query) ||
        team.tla?.toLowerCase().includes(query)
      )
    },
    totalPages() {
      return Math.ceil(this.filteredTeams.length / this.itemsPerPage)
    },
    paginatedTeams() {
      const start = (this.page - 1) * this.itemsPerPage
      const end = start + this.itemsPerPage
      return this.filteredTeams.slice(start, end)
    }
  },
  methods: {
    async fetchTeams() {
      this.isLoading = true
      this.error = null
      
      try {
        const response = await api.get('api/v4/teams')
        if (response.data && Array.isArray(response.data.teams)) {
          this.teams = response.data.teams
          this.page = 1 // Reset to first page when new data is loaded
        } else {
          throw new Error('Неверный формат данных')
        }
      } catch (err) {
        this.error = err.message === 'Неверный формат данных' 
          ? 'Ошибка в формате данных. Пожалуйста, попробуйте позже.'
          : 'Не удалось загрузить команды. Пожалуйста, попробуйте позже.'
        console.error('Ошибка загрузки команд:', err)
      } finally {
        this.isLoading = false
      }
    },
    goToTeam(teamId) {
      this.$router.push(`/team/${teamId}`)
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
    this.fetchTeams()
  }
}
</script>

<style scoped>
.teams-page {
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
  border: 1px solid rgba(44, 62, 80, 0.1);
  background: white;
}

.team-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(44, 62, 80, 0.15);
  border-color: #3498db;
}

.team-crest {
  background-color: #f8f9fa;
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

.v-alert {
  border-radius: 8px;
  margin: 1rem 0;
}

@media (max-width: 768px) {
  .teams-page {
    padding: 1.5rem 1rem;
  }

  .page-header h1 {
    font-size: 2rem;
  }

  .subtitle {
    font-size: 1.1rem;
  }

  .teams-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 1rem;
  }

  .team-card {
    margin: 0 0.5rem;
  }

  .team-name {
    font-size: 1rem;
    padding: 0.75rem;
  }
}
</style> 
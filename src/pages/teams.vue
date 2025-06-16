<template>
  <div class="teams-page">
    <!-- Page Title -->
    <div class="page-header">
      <h1>Футбольные команды</h1>
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

    <!-- Teams Grid -->
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

    <!-- No Results State -->
    <v-alert
      v-if="!isLoading && !error && filteredTeams.length === 0"
      type="info"
      class="ma-4"
    >
      No teams found matching your search criteria.
    </v-alert>

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

.teams-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 1rem;
  padding: 1rem 0;
}

.team-card {
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.team-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.team-crest {
  background-color: #f5f5f5;
}

.team-name {
  font-size: 1.2rem;
  font-weight: 600;
  padding: 1rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;
}

.team-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #666;
}

.info-item .v-icon {
  font-size: 1.2rem;
  color: #1976d2;
}

@media (max-width: 1200px) {
  .teams-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 960px) {
  .teams-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .page-header h1 {
    font-size: 2rem;
  }

  .teams-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .teams-grid {
    grid-template-columns: 1fr;
  }
}
</style> 
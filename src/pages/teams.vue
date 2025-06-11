<template>
  <div class="teams-page">
    <!-- Page Title -->
    <div class="page-header">
      <h1>Football Teams</h1>
      <p class="subtitle">Explore all available football teams and their statistics</p>
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
        v-for="team in filteredTeams"
        :key="team.id"
        class="team-card"
        @click="goToTeam(team.id)"
      >
        <v-img
          :src="team.crest || '/src/assets/placeholder.svg'"
          height="200"
          cover
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

        <v-card-text>
          <div class="team-info">
            <div class="info-item">
              <v-icon>mdi-map-marker</v-icon>
              <span>{{ team.area?.name || 'Not specified' }}</span>
            </div>
            <div class="info-item">
              <v-icon>mdi-trophy</v-icon>
              <span>{{ team.tla || 'N/A' }}</span>
            </div>
          </div>
        </v-card-text>

        <v-card-actions>
          <v-btn
            color="primary"
            variant="text"
            @click.stop="goToTeam(team.id)"
          >
            View Details
          </v-btn>
        </v-card-actions>
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
  </div>
</template>

<script>
import api from '@/api'

export default {
  name: 'TeamsPage',
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
      error: null
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
    }
  },
  methods: {
    async fetchTeams() {
      this.isLoading = true
      this.error = null
      
      try {
        const response = await api.get('api/v4/teams')
        this.teams = response.data.teams
      } catch (err) {
        this.error = 'Failed to load teams. Please try again later.'
        console.error('Error fetching teams:', err)
      } finally {
        this.isLoading = false
      }
    },
    goToTeam(teamId) {
      this.$router.push(`/team/${teamId}`)
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
  padding: 2rem 1rem;
}

.page-header {
  text-align: center;
  margin-bottom: 3rem;
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
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
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

@media (max-width: 768px) {
  .page-header h1 {
    font-size: 2rem;
  }

  .teams-grid {
    grid-template-columns: 1fr;
  }
}
</style> 
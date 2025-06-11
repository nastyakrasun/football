<template>
  <div class="team-page">
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

    <!-- Team Content -->
    <div v-else class="team-content">
      <!-- Team Header -->
      <div class="team-header">
        <v-img
          :src="team.crest || '/src/assets/placeholder.svg'"
          max-width="200"
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

        <div class="team-info">
          <h1>{{ team.name }}</h1>
          <div class="team-details">
            <div class="detail-item">
              <v-icon>mdi-map-marker</v-icon>
              <span>{{ team.area?.name || 'Not specified' }}</span>
            </div>
            <div class="detail-item">
              <v-icon>mdi-trophy</v-icon>
              <span>{{ team.tla || 'N/A' }}</span>
            </div>
            <div class="detail-item">
              <v-icon>mdi-calendar</v-icon>
              <span>Founded: {{ team.founded || 'N/A' }}</span>
            </div>
            <div class="detail-item">
              <v-icon>mdi-stadium</v-icon>
              <span>{{ team.venue || 'N/A' }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Team Tabs -->
      <v-tabs v-model="activeTab" class="team-tabs">
        <v-tab value="matches">Matches</v-tab>
        <v-tab value="squad">Squad</v-tab>
        <v-tab value="stats">Statistics</v-tab>
      </v-tabs>

      <v-window v-model="activeTab" class="team-window">
        <!-- Matches Tab -->
        <v-window-item value="matches">
          <div class="matches-section">
            <h2>Recent Matches</h2>
            <v-list>
              <v-list-item
                v-for="match in matches"
                :key="match.id"
                class="match-item"
              >
                <div class="match-content">
                  <div class="match-date">
                    {{ new Date(match.utcDate).toLocaleDateString() }}
                  </div>
                  <div class="match-teams">
                    <span class="team">{{ match.homeTeam.name }}</span>
                    <span class="score">{{ match.score.fullTime.home || 0 }} - {{ match.score.fullTime.away || 0 }}</span>
                    <span class="team">{{ match.awayTeam.name }}</span>
                  </div>
                  <div class="match-status">
                    {{ match.status }}
                  </div>
                </div>
              </v-list-item>
            </v-list>
          </div>
        </v-window-item>

        <!-- Squad Tab -->
        <v-window-item value="squad">
          <div class="squad-section">
            <h2>Team Squad</h2>
            <v-list>
              <v-list-item
                v-for="player in squad"
                :key="player.id"
                class="player-item"
              >
                <div class="player-content">
                  <div class="player-name">{{ player.name }}</div>
                  <div class="player-position">{{ player.position }}</div>
                  <div class="player-number">#{{ player.shirtNumber || 'N/A' }}</div>
                </div>
              </v-list-item>
            </v-list>
          </div>
        </v-window-item>

        <!-- Statistics Tab -->
        <v-window-item value="stats">
          <div class="stats-section">
            <h2>Team Statistics</h2>
            <v-card class="stats-card">
              <v-card-text>
                <div class="stats-grid">
                  <div class="stat-item">
                    <div class="stat-label">Matches Played</div>
                    <div class="stat-value">{{ stats.matchesPlayed || 0 }}</div>
                  </div>
                  <div class="stat-item">
                    <div class="stat-label">Wins</div>
                    <div class="stat-value">{{ stats.wins || 0 }}</div>
                  </div>
                  <div class="stat-item">
                    <div class="stat-label">Draws</div>
                    <div class="stat-value">{{ stats.draws || 0 }}</div>
                  </div>
                  <div class="stat-item">
                    <div class="stat-label">Losses</div>
                    <div class="stat-value">{{ stats.losses || 0 }}</div>
                  </div>
                  <div class="stat-item">
                    <div class="stat-label">Goals For</div>
                    <div class="stat-value">{{ stats.goalsFor || 0 }}</div>
                  </div>
                  <div class="stat-item">
                    <div class="stat-label">Goals Against</div>
                    <div class="stat-value">{{ stats.goalsAgainst || 0 }}</div>
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </div>
        </v-window-item>
      </v-window>
    </div>
  </div>
</template>

<script>
import api from '@/api'

export default {
  name: 'TeamPage',
  data() {
    return {
      team: {},
      matches: [],
      squad: [],
      stats: {},
      isLoading: true,
      error: null,
      activeTab: 'matches'
    }
  },
  methods: {
    async fetchTeamData() {
      this.isLoading = true
      this.error = null
      
      try {
        const teamId = this.$route.params.id
        const [teamResponse, matchesResponse] = await Promise.all([
          api.get(`api/v4/teams/${teamId}`),
          api.get(`api/v4/teams/${teamId}/matches`)
        ])

        this.team = teamResponse.data
        this.matches = matchesResponse.data.matches
        this.squad = teamResponse.data.squad || []
        
        // Calculate basic statistics
        this.stats = this.calculateStats()
      } catch (err) {
        this.error = 'Failed to load team data. Please try again later.'
        console.error('Error fetching team data:', err)
      } finally {
        this.isLoading = false
      }
    },
    calculateStats() {
      const stats = {
        matchesPlayed: this.matches.length,
        wins: 0,
        draws: 0,
        losses: 0,
        goalsFor: 0,
        goalsAgainst: 0
      }

      this.matches.forEach(match => {
        if (match.status === 'FINISHED') {
          const isHomeTeam = match.homeTeam.id === this.team.id
          const teamScore = isHomeTeam ? match.score.fullTime.home : match.score.fullTime.away
          const opponentScore = isHomeTeam ? match.score.fullTime.away : match.score.fullTime.home

          stats.goalsFor += teamScore || 0
          stats.goalsAgainst += opponentScore || 0

          if (teamScore > opponentScore) stats.wins++
          else if (teamScore === opponentScore) stats.draws++
          else stats.losses++
        }
      })

      return stats
    }
  },
  mounted() {
    this.fetchTeamData()
  }
}
</script>

<style scoped>
.team-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.loading-state {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.team-header {
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 2rem;
  padding: 2rem;
  background: #f5f5f5;
  border-radius: 8px;
}

.team-crest {
  border-radius: 8px;
  overflow: hidden;
}

.team-info {
  flex: 1;
}

.team-info h1 {
  font-size: 2.5rem;
  color: #1976d2;
  margin-bottom: 1rem;
}

.team-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #666;
}

.detail-item .v-icon {
  color: #1976d2;
}

.team-tabs {
  margin-bottom: 2rem;
}

.match-item, .player-item {
  border-bottom: 1px solid #eee;
}

.match-content, .player-content {
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
}

.match-teams {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.score {
  font-weight: bold;
  color: #1976d2;
}

.player-name {
  flex: 1;
  font-weight: 500;
}

.player-position {
  color: #666;
  width: 120px;
}

.player-number {
  width: 60px;
  text-align: center;
  color: #1976d2;
  font-weight: 500;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1.5rem;
}

.stat-item {
  text-align: center;
  padding: 1rem;
  background: #f5f5f5;
  border-radius: 8px;
}

.stat-label {
  color: #666;
  margin-bottom: 0.5rem;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1976d2;
}

@media (max-width: 768px) {
  .team-header {
    flex-direction: column;
    text-align: center;
  }

  .team-details {
    grid-template-columns: 1fr;
  }

  .match-content {
    flex-direction: column;
    align-items: flex-start;
  }

  .match-teams {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style> 
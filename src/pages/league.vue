<template>
  <div class="league-page">
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

    <!-- League Content -->
    <div v-else-if="league" class="league-content">
      <!-- League Header -->
      <div class="league-header">
        <div class="league-info">
          <v-img
            :src="league.emblem || '/src/assets/placeholder.svg'"
            width="120"
            height="120"
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
          <div class="league-details">
            <h1>{{ league.name }}</h1>
            <div class="league-meta">
              <div class="meta-item">
                <v-icon>mdi-map-marker</v-icon>
                <span>{{ league.area?.name }}</span>
              </div>
              <div class="meta-item">
                <v-icon>mdi-calendar</v-icon>
                <span>{{ league.currentSeason?.startDate }} - {{ league.currentSeason?.endDate }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- League Tabs -->
      <v-tabs v-model="activeTab" class="league-tabs">
        <v-tab value="standings">Турнирная таблица</v-tab>
        <v-tab value="matches">Матчи</v-tab>
        <v-tab value="teams">Команды</v-tab>
      </v-tabs>

      <!-- Tab Content -->
      <v-window v-model="activeTab" class="tab-content">
        <!-- Standings Tab -->
        <v-window-item value="standings">
          <div v-if="standings.length" class="standings-table">
            <v-table>
              <thead>
                <tr>
                  <th>№</th>
                  <th>Команда</th>
                  <th>Сыграно матчей</th>
                  <th>Побед</th>
                  <th>В ничью</th>
                  <th>Поражений</th>
                  <th>Забито голов</th>
                  <th>Пропущено голов</th>
                  <th>Разница</th>
                  <th>Очков</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="team in standings" :key="team.team.id">
                  <td>{{ team.position }}</td>
                  <td class="team-cell">
                    <img :src="team.team.crest" :alt="team.team.name" class="team-crest" />
                    {{ team.team.name }}
                  </td>
                  <td>{{ team.playedGames }}</td>
                  <td>{{ team.won }}</td>
                  <td>{{ team.draw }}</td>
                  <td>{{ team.lost }}</td>
                  <td>{{ team.goalsFor }}</td>
                  <td>{{ team.goalsAgainst }}</td>
                  <td>{{ team.goalDifference }}</td>
                  <td><strong>{{ team.points }}</strong></td>
                </tr>
              </tbody>
            </v-table>
          </div>
          <v-alert v-else type="info" class="ma-4">
            Для выбранной лиги нет доступной турнирной таблицы.
          </v-alert>
        </v-window-item>

        <!-- Matches Tab -->
        <v-window-item value="matches">
          <div v-if="matches.length" class="matches-list">
            <v-card
              v-for="match in matches"
              :key="match.id"
              class="match-card mb-4"
            >
              <v-card-text>
                <div class="match-header">
                  <span class="match-date">{{ formatDate(match.utcDate) }}</span>
                  <span class="match-status">{{ match.status }}</span>
                </div>
                <div class="match-teams">
                  <div class="team home">
                    <img :src="match.homeTeam.crest" :alt="match.homeTeam.name" class="team-crest" />
                    <span>{{ match.homeTeam.name }}</span>
                  </div>
                  <div class="score">
                    {{ match.score.fullTime.home || 0 }} - {{ match.score.fullTime.away || 0 }}
                  </div>
                  <div class="team away">
                    <img :src="match.awayTeam.crest" :alt="match.awayTeam.name" class="team-crest" />
                    <span>{{ match.awayTeam.name }}</span>
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </div>
          <v-alert v-else type="info" class="ma-4">
            Для выбранной лиги нет доступных матчей.
          </v-alert>
        </v-window-item>

        <!-- Teams Tab -->
        <v-window-item value="teams">
          <div v-if="teams.length" class="teams-grid">
            <v-card
              v-for="team in teams"
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
              <v-card-title>{{ team.name }}</v-card-title>
              <v-card-text>
                <div class="team-info">
                  <div class="info-item">
                    <v-icon>mdi-map-marker</v-icon>
                    <span>{{ team.area?.name || 'Not specified' }}</span>
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </div>
          <v-alert v-else type="info" class="ma-4">
            Для выбранной лиги нет доступных команд.
          </v-alert>
        </v-window-item>
      </v-window>
    </div>
  </div>
</template>

<script>
import api from '@/api'

export default {
  name: 'LeaguePage',
  data() {
    return {
      league: null,
      standings: [],
      matches: [],
      teams: [],
      isLoading: true,
      error: null,
      activeTab: 'standings'
    }
  },
  methods: {
    async fetchLeagueData() {
      this.isLoading = true
      this.error = null
      const leagueId = this.$route.params.id

      try {
        // Fetch league details
        const leagueResponse = await api.get(`api/v4/competitions/${leagueId}`)
        this.league = leagueResponse.data

        // Fetch standings
        const standingsResponse = await api.get(`api/v4/competitions/${leagueId}/standings`)
        this.standings = standingsResponse.data.standings[0]?.table || []

        // Fetch matches
        const matchesResponse = await api.get(`api/v4/competitions/${leagueId}/matches`)
        this.matches = matchesResponse.data.matches

        // Fetch teams
        const teamsResponse = await api.get(`api/v4/competitions/${leagueId}/teams`)
        this.teams = teamsResponse.data.teams
      } catch (err) {
        this.error = 'Failed to load league data. Please try again later.'
        console.error('Error fetching league data:', err)
      } finally {
        this.isLoading = false
      }
    },
    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString()
    },
    goToTeam(teamId) {
      this.$router.push(`/team/${teamId}`)
    }
  },
  mounted() {
    this.fetchLeagueData()
  }
}
</script>

<style scoped>
.league-page {
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

.league-header {
  margin-bottom: 2rem;
}

.league-info {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.league-details h1 {
  font-size: 2.5rem;
  color: #1976d2;
  margin-bottom: 1rem;
}

.league-meta {
  display: flex;
  gap: 1.5rem;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #666;
}

.league-tabs {
  margin-bottom: 2rem;
}

.standings-table {
  overflow-x: auto;
}

.team-cell {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.team-crest {
  width: 24px;
  height: 24px;
  object-fit: contain;
}

.match-card {
  transition: transform 0.3s ease;
}

.match-card:hover {
  transform: translateY(-2px);
}

.match-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  color: #666;
}

.match-teams {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.team {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
}

.team.home {
  justify-content: flex-end;
}

.score {
  font-size: 1.2rem;
  font-weight: bold;
  padding: 0 1rem;
}

.teams-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
}

.team-card {
  cursor: pointer;
  transition: transform 0.3s ease;
}

.team-card:hover {
  transform: translateY(-5px);
}

@media (max-width: 768px) {
  .league-info {
    flex-direction: column;
    text-align: center;
  }

  .league-meta {
    justify-content: center;
  }

  .match-teams {
    flex-direction: column;
    text-align: center;
  }

  .team {
    justify-content: center !important;
  }
}
</style> 
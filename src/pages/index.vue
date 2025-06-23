<!-- Главная страница с таблицей всех матчей -->
<template>
  <div class="matches-page">
    <v-progress-circular
      v-if="isLoading"
      class="d-block mx-auto my-8"
            color="primary"
      indeterminate
    />
    <v-alert
      v-else-if="error"
      type="error"
      class="ma-4"
    >
      {{ error }}
    </v-alert>
    <v-alert
      v-else-if="filteredMatches.length === 0"
      type="info"
      class="ma-4"
    >
      {{ searchQuery ? $t('app.no_matches_found') : $t('app.no_matches_available') }}
    </v-alert>
    <div class="mobile-view" v-if="filteredMatches.length > 0">
      <div class="matches-cards">
        <v-card
          v-for="match in filteredMatches"
          :key="match.id"
          class="match-card"
          elevation="2"
        >
          <v-card-text class="match-card-content">
            <div class="match-competition">
              <v-icon icon="mdi-trophy" size="16" class="competition-icon"></v-icon>
              {{ match.competition?.name || '-' }}
            </div>
            <div class="match-date">
              <v-icon icon="mdi-calendar" size="16" class="date-icon"></v-icon>
              {{ formatMatchDate(match.utcDate) }}
            </div>
            <div class="match-status">
              <v-chip 
                :color="getStatusColor(match.status)" 
                size="small"
                class="status-chip"
              >
                {{ getStatusText(match.status) }}
              </v-chip>
            </div>
            <div class="match-teams">
              <div class="team home-team">
                <div class="team-name" :style="{ color: thColor, fontWeight: 'bold' }">{{ match.homeTeam?.name }}</div>
                <div class="team-score" :style="{ color: thColor }">{{ getHomeScore(match) }}</div>
              </div>
              <div class="vs-divider">
                <span>:</span>
              </div>
              <div class="team away-team">
                <div class="team-name" :style="{ color: thColor, fontWeight: 'normal' }">{{ match.awayTeam?.name }}</div>
                <div class="team-score" :style="{ color: thColor }">{{ getAwayScore(match) }}</div>
              </div>
            </div>
            <div v-if="match.status === 'SCHEDULED'" class="match-time">
              <v-icon icon="mdi-clock" size="16" class="time-icon"></v-icon>
              {{ formatMatchTime(match.utcDate) }}
            </div>
          </v-card-text>
        </v-card>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/api'
import { useTheme } from 'vuetify'
import { computed } from 'vue'

export default {
  name: 'HomePage',
  props: {
    searchQuery: {
      type: String,
      default: ''
    },
    selectedDate: {
      type: [String, Date],
      default: null
    },
    selectedStatus: {
      type: String,
      default: 'all'
    }
  },
  data() {
    return {
      matches: [],
      isLoading: true,
      error: null,
    }
  },
  setup() {
    const theme = useTheme()
    const thColor = computed(() => theme.global.name.value === 'dark' ? '#f8f9fa' : '#2c3e50')
    return { thColor }
  },
  computed: {
    filteredMatches() {
      let filtered = this.matches;
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(match => {
          const competitionMatch = match.competition?.name?.toLowerCase().includes(query);
          const homeTeamMatch = match.homeTeam?.name?.toLowerCase().includes(query);
          const awayTeamMatch = match.awayTeam?.name?.toLowerCase().includes(query);
          const homeTeamTlaMatch = match.homeTeam?.tla?.toLowerCase().includes(query);
          const awayTeamTlaMatch = match.awayTeam?.tla?.toLowerCase().includes(query);
          return competitionMatch || homeTeamMatch || awayTeamMatch || homeTeamTlaMatch || awayTeamTlaMatch;
        });
      }
      if (this.selectedDate) {
        let selectedDate;
        if (this.selectedDate instanceof Date) {
          selectedDate = this.selectedDate;
        } else if (typeof this.selectedDate === 'string') {
          selectedDate = new Date(this.selectedDate + 'T00:00:00');
        }
        if (selectedDate) {
          selectedDate.setHours(0, 0, 0, 0);
          filtered = filtered.filter(match => {
            const matchDate = new Date(match.utcDate);
            matchDate.setHours(0, 0, 0, 0);
            return matchDate.getTime() === selectedDate.getTime();
          });
        }
      }
      if (this.selectedStatus && this.selectedStatus !== 'all') {
        filtered = filtered.filter(match => match.status === this.selectedStatus);
      }
      return filtered;
    },
  },
  methods: {
    async fetchData() {
      this.isLoading = true
      this.error = null
      try {
        const competitions = [
          'PL', 'PD', 'SA', 'BL1', 'FL1', 'CL', 'EL',
        ]
        const matchPromises = competitions.map(competition =>
          api.get(`api/v4/competitions/${competition}/matches`).catch(err => {
            return { data: { matches: [] } }
          })
        )
        const responses = await Promise.all(matchPromises)
        const allMatches = responses.flatMap(response => response.data.matches || [])
        this.matches = allMatches.sort((a, b) => new Date(b.utcDate) - new Date(a.utcDate))
      } catch (err) {
        this.error = 'Не удалось загрузить матчи. Пожалуйста, попробуйте позже.'
      } finally {
        this.isLoading = false
      }
    },
    getStatusText(status) {
      const statusMap = {
        SCHEDULED: this.$t('app.status_scheduled'),
        LIVE: this.$t('app.status_live'),
        IN_PLAY: this.$t('app.status_in_play'),
        PAUSED: this.$t('app.status_paused'),
        FINISHED: this.$t('app.status_finished'),
        POSTPONED: this.$t('app.status_postponed'),
        SUSPENDED: this.$t('app.status_suspended'),
        CANCELLED: this.$t('app.status_cancelled'),
        TIMED: this.$t('app.status_timed'),
        ABANDONED: this.$t('app.status_abandoned'),
        TECHNICAL_LOSS: this.$t('app.status_technical_loss'),
      }
      return statusMap[status] || status
    },
    getStatusColor(status) {
      const statusMap = {        
        SCHEDULED: 'primary',
        LIVE: 'error',
        IN_PLAY: 'error',
        PAUSED: 'warning',
        FINISHED: 'success',
        POSTPONED: 'warning',        
        SUSPENDED: 'info',
        CANCELLED: 'warning',
        TIMED: 'primary',        
        ABANDONED: 'error',
        TECHNICAL_LOSS: 'error'
      }
      return statusMap[status] || 'grey'
    },
    getScoreText(item) {
      return item.score.fullTime.home !== null && item.score.fullTime.away !== null
        ? `${item.score.fullTime.home} - ${item.score.fullTime.away}`
        : '-'
    },
    getHomeScore(match) {
      return match.score.fullTime.home !== null ? match.score.fullTime.home : '-'
    },
    getAwayScore(match) {
      return match.score.fullTime.away !== null ? match.score.fullTime.away : '-'
    },
    formatMatchDate(dateString) {
      const date = new Date(dateString)
      return date.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
    },
    formatMatchTime(dateString) {
      const date = new Date(dateString)
      return date.toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  },
  mounted() {
    this.fetchData()
  }
}
</script>

<style scoped>
.matches-page {
  padding: 0;
}
.mobile-view {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 0 0 70px 0;
}
.matches-cards {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.match-card {
  border-radius: 18px;
  background: var(--v-theme-surface, #fff);
  box-shadow: 0 2px 8px rgba(44, 62, 80, 0.08);
  padding: 0;
}
.match-card-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 14px 16px 10px 16px;
}
.match-competition, .match-date, .match-status, .match-time {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #7f8c8d;
}
.match-status {
  margin-bottom: 2px;
}
.status-chip {
  font-size: 12px;
  font-weight: 600;
  border-radius: 10px;
  padding: 0 8px;
}
.match-teams {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin: 6px 0 0 0;
}
.team {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 70px;
}
.team-name {
  font-size: 15px;
  font-weight: 500;
  text-align: center;
  margin-bottom: 2px;
}
.team-score {
  font-size: 18px;
  font-weight: 700;
  text-align: center;
}
.vs-divider {
  font-size: 18px;
  font-weight: 700;
  color: #3498db;
  margin: 0 4px;
}
</style>
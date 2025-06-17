<template>
  <div class="league-page">
    <!-- Page Title -->
    <div class="page-header">
      <h1>{{ league.name }}</h1>
      <p class="subtitle">{{ league.area?.name }}</p>
    </div>

    <!-- Loading State -->
      <v-progress-circular
      v-if="isLoading"
      class="d-block mx-auto my-8"
      color="primary"
        indeterminate
    />

    <!-- Error State -->
    <v-alert
      v-else-if="error"
      type="error"
      class="ma-4"
    >
      {{ error }}
    </v-alert>

    <!-- No Matches State -->
    <v-alert
      v-else-if="matches.length === 0"
      type="info"
      class="ma-4"
    >
      {{ searchQuery ? "No matches found" : "Нет доступных матчей" }}
    </v-alert>

    <!-- Matches Content -->
    <template v-else>
      <v-row>
        <v-col>
          <v-date-picker
            v-model="dateFrom"
            @update:model-value="onDateChange"
          />
        </v-col>
        <v-col>
          <v-text-field 
            v-model="formattedDate" 
            label="Выбранная дата"
            readonly
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-btn @click="clearFilter">Очистить фильтр</v-btn>
        </v-col>
      </v-row>

      <v-data-table
        :headers="headers"
        :items="filteredMatches"
        :items-per-page="itemsPerPage"
        class="elevation-1"
              >
        <template #item.utcDate="{ item }">
          {{ new Date(item.utcDate).toLocaleString() }}
            </template>

        <template #item.status="{ item }">
          <v-chip :color="getStatusColor(item.status)" small>
            {{ getStatusText(item.status) }}
          </v-chip>
        </template>

        <template #item.hometeam="{ item }">
          <b>{{ item.homeTeam?.name }}</b>
        </template>

        <template #item.awayteam="{ item }">
          {{ item.awayTeam?.name }}
        </template>

        <template #item.score="{ item }">
          {{ item.score.fullTime.home !== null && item.score.fullTime.away !== null
            ? `${item.score.fullTime.home} - ${item.score.fullTime.away}`
            : '-'
          }}
        </template>
      </v-data-table>
                </template>
  </div>
</template>

<script>
import api from '@/api'

export default {
  name: 'LeaguePage',
  props: {
    searchQuery: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      league: {},
      matches: [],
      isLoading: true,
      error: null,
      page: 1,
      itemsPerPage: 12,
      dateFrom: null,
      headers: [
        { key: 'utcDate', title: 'Дата' },
        { key: 'status', title: 'Статус' },
        { key: 'hometeam', title: 'Хозяева' },
        { key: 'awayteam', title: 'Гости' },
        { key: 'score', title: 'Счет' },
      ],
    }
  },
  computed: {
    filteredMatches() {
      if (!this.dateFrom) return this.matches;
      
      const selectedDate = new Date(this.dateFrom);
      selectedDate.setHours(0, 0, 0, 0);
      
      return this.matches.filter(match => {
        const matchDate = new Date(match.utcDate);
        matchDate.setHours(0, 0, 0, 0);
        return matchDate.getTime() === selectedDate.getTime();
      });
    },
    formattedDate() {
      return this.dateFrom ? new Date(this.dateFrom).toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }) : '';
    },
    totalPages() {
      return Math.ceil(this.matches.length / this.itemsPerPage)
    },
    paginatedMatches() {
      const start = (this.page - 1) * this.itemsPerPage
      const end = start + this.itemsPerPage
      return this.matches.slice(start, end)
    }
  },
  methods: {
    async fetchLeagueData() {
      this.isLoading = true
      this.error = null
      
      try {
      const leagueId = this.$route.params.id
        const [leagueResponse, matchesResponse] = await Promise.all([
          api.get(`api/v4/competitions/${leagueId}`),
          api.get(`api/v4/competitions/${leagueId}/matches`)
        ])

        this.league = leagueResponse.data
        this.matches = matchesResponse.data.matches
      } catch (err) {
        this.error = 'Не удалось загрузить данные лиги. Пожалуйста, попробуйте позже.'
        console.error('Ошибка загрузки данных лиги:', err)
      } finally {
        this.isLoading = false
      }
    },
    clearFilter() {
      this.dateFrom = null
    },
    getStatusText(status) {
      const statusMap = {
        FINISHED: 'Завершен',
        SCHEDULED: 'Запланирован',
        LIVE: 'В прямом эфире',        
POSTPONED: 'Перенесен'
      }
      return statusMap[status] || status
    },
    getStatusColor(status) {
      const statusMap = {
        FINISHED: 'success',
        SCHEDULED: 'primary',
        LIVE: 'error',
        POSTPONED: 'warning',
        SUSPENDED: 'info',
        IN_PLAY: 'error',
        PAUSED: 'warning',
        POSTPONED: 'warning'
      }
      return statusMap[status] || 'grey'
    },
    onSearchInput() {
      this.page = 1
    },
    onDateChange() {
      this.page = 1; // Reset to first page when date changes
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
</style> 
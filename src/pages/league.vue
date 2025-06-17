<template>
  <div class="league-page">
    <!-- Название страницы -->
    <div class="page-header">
      <h1>{{ league.name }}</h1>
      <p class="subtitle">{{ league.area?.name }}</p>
    </div>

    <!-- Состояние загрузки -->
      <v-progress-circular
      v-if="isLoading"
      class="d-block mx-auto my-8"
      color="primary"
        indeterminate
    />

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
      v-else-if="matches.length === 0"
      type="info"
      class="ma-4"
    >
      {{ searchQuery ? "No matches found" : "Нет доступных матчей" }}
    </v-alert>

    <!-- Таблица матчей -->
    <template v-else>
      <v-card class="mb-4">
        <v-card-text>
          <v-row align="center">
            <v-col md="4">
              <v-date-picker
                v-model="dateFrom"
                @update:model-value="onDateChange"
                color="primary"
                elevation="2"
                class="rounded-lg"
                title="Выберите дату"
              />
            </v-col>
            <v-col md="7">
              <v-text-field 
                v-model="formattedDate" 
                label="Выбранная дата"
                readonly
                variant="outlined"
                density="comfortable"
                class="mt-4"
              />
              <v-btn
                @click="clearFilter"
                color="primary"
                variant="outlined"
                class="mt-4"
                block
              >
                Очистить фильтр
              </v-btn>
            </v-col>
          </v-row>
              </v-card-text>
            </v-card>

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
        console.error('League data error:', err)
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
        POSTPONED: 'Перенесен',
        CANCELLED: 'Отменен',
        SUSPENDED: 'Приостановлен',
        IN_PLAY: 'В игре',
        PAUSED: 'Пауза',
        ABANDONED: 'Прерван',
        TECHNICAL_LOSS: 'Техническое поражение'
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

.v-date-picker {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(44, 62, 80, 0.1);
  border: 1px solid rgba(44, 62, 80, 0.05);
  transition: all 0.3s ease;
}

.v-date-picker:hover {
  box-shadow: 0 6px 20px rgba(44, 62, 80, 0.15);
}

.v-date-picker :deep(.v-date-picker-header) {
  padding: 16px;
  background-color: #f8f9fa;
  border-bottom: 1px solid rgba(44, 62, 80, 0.05);
}

.v-date-picker :deep(.v-date-picker-header__title) {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2c3e50;
}

.v-date-picker :deep(.v-date-picker-table) {
  padding: 8px;
}

.v-date-picker :deep(.v-date-picker-table__current) {
  color: #3498db;
  font-weight: 600;
}

.v-date-picker :deep(.v-date-picker-table__day) {
  border-radius: 8px;
  transition: all 0.2s ease;
}

.v-date-picker :deep(.v-date-picker-table__day:hover) {
  background-color: rgba(52, 152, 219, 0.1);
}

.v-date-picker :deep(.v-date-picker-table__day--selected) {
  background-color: #3498db !important;
  color: white !important;
}

.v-date-picker :deep(.v-date-picker-table__day--selected:hover) {
  background-color: #2980b9 !important;
}

.v-date-picker :deep(.v-date-picker-table__day--disabled) {
  color: #bdc3c7 !important;
}

.v-date-picker :deep(.v-date-picker-table__day--adjacent-month) {
  color: #95a5a6;
}

.v-date-picker :deep(.v-date-picker-table__weekday) {
  color: #7f8c8d;
  font-weight: 500;
  font-size: 0.9rem;
}

.v-date-picker :deep(.v-date-picker-table__month) {
  color: #2c3e50;
  font-weight: 500;
}

.v-date-picker :deep(.v-date-picker-table__month--selected) {
  background-color: #3498db !important;
  color: white !important;
}

.v-date-picker :deep(.v-date-picker-table__month:hover) {
  background-color: rgba(52, 152, 219, 0.1);
}

.v-date-picker :deep(.v-date-picker-table__year) {
  color: #2c3e50;
  font-weight: 500;
}

.v-date-picker :deep(.v-date-picker-table__year--selected) {
  background-color: #3498db !important;
  color: white !important;
}

.v-date-picker :deep(.v-date-picker-table__year:hover) {
  background-color: rgba(52, 152, 219, 0.1);
}

.v-date-picker :deep(.v-date-picker-table__header) {
  padding: 8px;
  background-color: #f8f9fa;
}

.v-date-picker :deep(.v-date-picker-table__header-title) {
  font-weight: 600;
  color: #2c3e50;
}

.v-date-picker :deep(.v-date-picker-table__header-arrow) {
  color: #3498db;
}

.v-date-picker :deep(.v-date-picker-table__header-arrow:hover) {
  background-color: rgba(52, 152, 219, 0.1);
}

.v-date-picker :deep(.v-date-picker-table__header-arrow--disabled) {
  color: #bdc3c7;
}

.v-date-picker :deep(.v-date-picker-table__header-arrow--disabled:hover) {
  background-color: transparent;
}

.v-text-field {
  margin-bottom: 1rem;
}

.v-text-field :deep(.v-field) {
  border-radius: 8px;
  transition: all 0.3s ease;
}

.v-text-field :deep(.v-field:hover) {
  box-shadow: 0 2px 8px rgba(44, 62, 80, 0.1);
}

.v-text-field :deep(.v-field--focused) {
  box-shadow: 0 2px 12px rgba(52, 152, 219, 0.15);
}

.v-btn {
  text-transform: none;
  font-weight: 500;
  letter-spacing: 0.3px;
  transition: all 0.3s ease;
}

.v-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(52, 152, 219, 0.2);
}

.v-data-table {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(44, 62, 80, 0.1);
  margin-top: 1.5rem;
}

.v-data-table :deep(th) {
  background-color: #f8f9fa !important;
  color: #2c3e50 !important;
  font-weight: 600 !important;
  font-size: 0.95rem !important;
  text-transform: none !important;
  letter-spacing: 0.3px !important;
}

.v-data-table :deep(td) {
  color: #2c3e50 !important;
  font-size: 0.95rem !important;
}

.v-chip {
  font-weight: 500;
  letter-spacing: 0.3px;
}

.v-alert {
  border-radius: 8px;
  margin: 1rem 0;
}

@media (max-width: 768px) {
  .league-page {
    padding: 1.5rem 1rem;
  }

  .page-header h1 {
    font-size: 2rem;
  }

  .subtitle {
    font-size: 1.1rem;
  }

  .v-data-table {
    margin: 1rem -0.5rem;
    border-radius: 8px;
  }
}
</style> 
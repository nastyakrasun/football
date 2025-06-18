<template>
  <div class="matches-table">
    <!-- Название страницы -->
    <div class="page-header">
      <h1>{{ entity.name }}</h1>
      <p class="subtitle">{{ entity.area?.name }}</p>
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
      <!-- подключение компонента Календарь -->
      <DatePicker 
        v-model="dateFrom"
        @date-change="onDateChange"
      />

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
          {{ getScoreText(item) }}
        </template>
      </v-data-table>
    </template>
  </div>
</template>

<script>
import api from '@/api'
import DatePicker from '@/components/DatePicker.vue'

export default {
  name: 'MatchesTable',
  components: {
    DatePicker
  },
  props: {
    entityType: {
      type: String,
      required: true,
      validator: value => ['league', 'team'].includes(value)
    },
    entityId: {
      type: [String, Number],
      required: true
    },
    searchQuery: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      entity: {},
      matches: [],
      isLoading: true,
      error: null,
      page: 1,
      itemsPerPage: 10,
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
      
      // конвертируем dateFrom в единый формат для сравнения
      let selectedDate;
      if (this.dateFrom instanceof Date) {
        selectedDate = this.dateFrom;
      } else if (typeof this.dateFrom === 'string') {
        // парсим строку даты и приводим к полуночи для предотвращения расхождения часовых поясов
        selectedDate = new Date(this.dateFrom + 'T00:00:00');
      } else {
        return this.matches;
      }
      
      // приводим к полуночи для точного сравнения дат
      selectedDate.setHours(0, 0, 0, 0);
      
      return this.matches.filter(match => {
        const matchDate = new Date(match.utcDate);
        matchDate.setHours(0, 0, 0, 0);
        return matchDate.getTime() === selectedDate.getTime();
      });
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
    async fetchData() {
      this.isLoading = true
      this.error = null
      
      try {
        let entityResponse, matchesResponse;
        
        if (this.entityType === 'league') {
          [entityResponse, matchesResponse] = await Promise.all([
            api.get(`api/v4/competitions/${this.entityId}`),
            api.get(`api/v4/competitions/${this.entityId}/matches`)
          ])
        } else if (this.entityType === 'team') {
          [entityResponse, matchesResponse] = await Promise.all([
            api.get(`api/v2/teams/${this.entityId}`),
            api.get(`api/v2/teams/${this.entityId}/matches`)
          ])
        }

        this.entity = entityResponse.data
        this.matches = matchesResponse.data.matches
      } catch (err) {
        const entityName = this.entityType === 'league' ? 'лиги' : 'команды'
        this.error = `Не удалось загрузить данные ${entityName}. Пожалуйста, попробуйте позже.`
        console.error(`${this.entityType} data error:`, err)
      } finally {
        this.isLoading = false
      }
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
    getScoreText(item) {
      if (this.entityType === 'league') {
        return item.score.fullTime.home !== null && item.score.fullTime.away !== null
          ? `${item.score.fullTime.home} - ${item.score.fullTime.away}`
          : '-'
      } else {
        return item.score.fullTime.homeTeam !== null && item.score.fullTime.awayTeam !== null
          ? `${item.score.fullTime.homeTeam} - ${item.score.fullTime.awayTeam}`
          : '-'
      }
    },
    onSearchInput() {
      this.page = 1
    },
    onDateChange() {
      this.page = 1; // Reset to first page when date changes
    }
  },
  mounted() {
    this.fetchData()
  },
  watch: {
    entityId() {
      this.fetchData()
    }
  }
}
</script>

<style scoped>
.matches-table {
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
  .matches-table {
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
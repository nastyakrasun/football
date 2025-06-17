<template>
  <div class="team-page">
    <!-- Название страницы -->
    <div class="page-header">
      <h1>{{ team.name }}</h1>
      <p class="subtitle">{{ team.area?.name }}</p>
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
          {{ item.score.fullTime.homeTeam !== null && item.score.fullTime.awayTeam !== null
            ? `${item.score.fullTime.homeTeam} - ${item.score.fullTime.awayTeam}`
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
  name: 'TeamPage',
  props: {
    searchQuery: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      team: {},
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
    async fetchTeamData() {
      this.isLoading = true
      this.error = null
      
      try {
        const teamId = this.$route.params.id
        const [teamResponse, matchesResponse] = await Promise.all([
          api.get(`api/v2/teams/${teamId}`),
          api.get(`api/v2/teams/${teamId}/matches`)
        ])

        this.team = teamResponse.data
        this.matches = matchesResponse.data.matches
      } catch (err) {
        this.error = 'Не удалось загрузить данные команды. Пожалуйста, попробуйте позже.'
        console.error('Ошибка загрузки данных команды:', err)
      } finally {
        this.isLoading = false
      }
    },
    clearFilter() {
      this.dateFrom = null
      this.page = 1
      this.onDateChange()
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
        POSTPONED: 'warning',
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
    this.fetchTeamData()
  }
}
</script>

<style scoped>
.team-page {
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
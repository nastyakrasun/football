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
  
        <!-- No matches for selected date (both desktop and mobile) -->
        <v-alert
          v-if="filteredMatches.length === 0"
          type="info"
          class="ma-4"
        >
          Нет матчей на выбранную дату
        </v-alert>
  
        <!-- Desktop Table View -->
        <div class="desktop-view" v-if="filteredMatches.length > 0">
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
        </div>
  
        <!-- Mobile Card View -->
        <div class="mobile-view" v-if="entity && entity.name">
          <div class="matches-cards">
            <TeamCard
              :name="entity.name"
              :crest-url="entity.crest || entity.crestUrl"
              :area="entity.area?.name"
              :founded="entity.founded"
              :venue="entity.venue"
            />
          </div>
        </div>
      </template>
    </div>
  </template>
  
  <script>
  import api from '@/api'
  import DatePicker from '@/components/DatePicker.vue'
  import TeamCard from '@/components/TeamCard.vue'
  
  export default {
    name: 'TeamsTable',
    components: {
      DatePicker,
      TeamCard
    },
    props: {
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
          // Only fetch team data
          const [entityResponse, matchesResponse] = await Promise.all([
            api.get(`api/v4/teams/${this.entityId}`),
            api.get(`api/v4/teams/${this.entityId}/matches`)
          ])
          this.entity = entityResponse.data
          this.matches = matchesResponse.data.matches
        } catch (err) {
          this.error = `Не удалось загрузить данные команды. Пожалуйста, попробуйте позже.`
          console.error(`team data error:`, err)
        } finally {
          this.isLoading = false
        }
      },
      getStatusText(status) {
        const statusMap = {
          SCHEDULED: 'Запланирован',
          LIVE: 'В прямом эфире',
          IN_PLAY: 'В игре',
          PAUSED: 'Пауза',
          FINISHED: 'Завершен',
          POSTPONED: 'Перенесен',
          SUSPENDED: 'Приостановлен',
          CANCELLED: 'Отменен', 
          TIMED: 'Назначен',       
          ABANDONED: 'Прерван',
          TECHNICAL_LOSS: 'Техническое поражение'
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
        return item.score.fullTime.homeTeam !== null && item.score.fullTime.awayTeam !== null
          ? `${item.score.fullTime.homeTeam} - ${item.score.fullTime.awayTeam}`
          : '-'
      },
      getHomeScore(match) {
        return match.score.fullTime.homeTeam !== null ? match.score.fullTime.homeTeam : '-'
      },
      getAwayScore(match) {
        return match.score.fullTime.awayTeam !== null ? match.score.fullTime.awayTeam : '-'
      },
      formatMatchDate(dateString) { // форматирование даты с русской локализацией и учетом часового пояса
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
  
  /* Desktop Table Styles */
  .desktop-view {
    display: block;
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
  
  /* Mobile Card Styles */
  .mobile-view {
    display: none;
  }
  
  .matches-cards {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-top: 1.5rem;
  }
  
  .match-card {
    border-radius: 12px;
    transition: all 0.3s ease;
    border: 1px solid rgba(44, 62, 80, 0.1);
  }
  
  .match-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(44, 62, 80, 0.15);
  }
  
  .match-card-content {
    padding: 1.5rem;
  }
  
  .match-date {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #7f8c8d;
    font-size: 0.9rem;
    margin-bottom: 0.75rem;
  }
  
  .date-icon {
    color: #3498db;
  }
  
  .match-status {
    margin-bottom: 1rem;
  }
  
  .status-chip {
    font-weight: 500;
  }
  
  .match-teams {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
  }
  
  .team {
    flex: 1;
    text-align: center;
  }
  
  .home-team {
    text-align: left;
  }
  
  .away-team {
    text-align: right;
  }
  
  .team-name {
    font-weight: 600;
    color: #2c3e50;
    font-size: 1rem;
    margin-bottom: 0.25rem;
    line-height: 1.3;
  }
  
  .team-score {
    font-size: 1.5rem;
    font-weight: 700;
    color: #3498db;
  }
  
  .vs-divider {
    padding: 0 1rem;
    color: #7f8c8d;
    font-size: 2rem;
    font-weight: 500;
  }
  
  .match-time {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #7f8c8d;
    font-size: 0.9rem;
    justify-content: center;
  }
  
  .time-icon {
    color: #3498db;
  }
  
  .v-alert {
    border-radius: 8px;
    margin: 1rem 0;
  }
  
  /* Responsive Design */
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
  
    .desktop-view {
      display: none;
    }
  
    .mobile-view {
      display: block;
    }
  
    .match-card-content {
      padding: 1.25rem;
    }
  
    .team-name {
      font-size: 0.95rem;
    }
  
    .team-score {
      font-size: 1.25rem;
    }
  
    .vs-divider {
      padding: 0 0.75rem;
    }
  }
  
  @media (max-width: 480px) {
    .matches-table {
      padding: 1rem 0.75rem;
    }
  
    .page-header h1 {
      font-size: 1.75rem;
    }
  
    .match-card-content {
      padding: 1rem;
    }
  
    .team-name {
      font-size: 0.9rem;
    }
  
    .team-score {
      font-size: 1.1rem;
    }
  
    .vs-divider {
      padding: 0 0.5rem;
    }
  }
  </style> 
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
    <v-alert v-else-if="error" type="error" class="ma-4">
      {{ error }}
    </v-alert>

    <!-- Состояние нет результатов -->
    <v-alert v-else-if="matches.length === 0" type="info" class="ma-4">
      {{
        searchQuery
          ? $t("app.no_matches_found")
          : $t("app.no_matches_available")
      }}
    </v-alert>

    <!-- Таблица матчей -->
    <template v-else>
      <!-- No matches for selected date (both desktop and mobile) -->
      <v-alert v-if="filteredMatches.length === 0" type="info" class="ma-4">
        {{ $t("app.no_matches_selected_date") }}
      </v-alert>

      <!-- Desktop Table View -->
      <div class="desktop-view" v-if="filteredMatches.length > 0">
        <v-data-table
          :headers="headers"
          :items="paginatedMatches"
          :items-per-page="itemsPerPage"
          class="elevation-1"
          :footer-props="{ itemsPerPageOptions: [] }"
        >
          <template #headers="{ columns }">
            <tr>
              <th
                v-for="column in columns"
                :key="column.key"
                :style="{ backgroundColor: thBg, color: thColor }"
              >
                {{ column.title }}
              </th>
            </tr>
          </template>

          <template #item="{ item, columns }">
            <tr>
              <td
                v-for="column in columns"
                :key="column.key"
                :style="{ color: thColor }"
              >
                <span v-if="column.key === 'utcDate'">{{
                  new Date(item.utcDate).toLocaleString()
                }}</span>
                <span v-else-if="column.key === 'status'">
                  <v-chip :color="getStatusColor(item.status)" small>
                    {{ getStatusText(item.status) }}
                  </v-chip>
                </span>
                <span v-else-if="column.key === 'hometeam'">
                  <b>{{ item.homeTeam?.name }}</b>
                </span>
                <span v-else-if="column.key === 'awayteam'">
                  {{ item.awayTeam?.name }}
                </span>
                <span v-else-if="column.key === 'score'">
                  {{ getScoreText(item) }}
                </span>
              </td>
            </tr>
          </template>
        </v-data-table>
      </div>

      <!-- Mobile Card View -->
      <div class="mobile-view" v-if="filteredMatches.length > 0">
        <div class="matches-cards">
          <MatchCard
            type="match"
            v-for="match in filteredMatches"
            :key="match.id"
            :competitionName="match.competition?.name || entity.name || '-'"
            :matchDate="formatMatchDate(match.utcDate)"
            :statusColor="getStatusColor(match.status)"
            :statusText="getStatusText(match.status)"
            :homeTeamName="match.homeTeam?.name"
            :homeScore="getHomeScore(match)"
            :awayTeamName="match.awayTeam?.name"
            :awayScore="getAwayScore(match)"
            :thColor="thColor"
            :isScheduled="match.status === 'SCHEDULED'"
            :matchTime="formatMatchTime(match.utcDate)"
          />
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import api from "@/api";
import { useTheme } from "vuetify";
import { computed } from "vue";
import MatchCard from "@/components/MatchCard.vue";

export default {
  name: "LeaguesTable",
  props: {
    entityType: {
      type: String,
      required: true,
      validator: (value) => ["league", "team"].includes(value),
    },
    entityId: {
      type: [String, Number],
      required: true,
    },
    searchQuery: {
      type: String,
      default: "",
    },
    selectedDate: {
      type: [String, Date],
      default: null,
    },
    selectedStatus: {
      type: String,
      default: "all",
    },
  },
  data() {
    return {
      entity: {},
      matches: [],
      isLoading: true,
      error: null,
      page: 1,
      itemsPerPage: 10,
    };
  },
  setup() {
    const theme = useTheme();
    const thBg = computed(() =>
      theme.global.name.value === "dark" ? "#2c3e50" : "#f8f9fa"
    );
    const thColor = computed(() =>
      theme.global.name.value === "dark" ? "#f8f9fa" : "#2c3e50"
    );
    return { thBg, thColor };
  },
  computed: {
    filteredMatches() {
      let filtered = this.matches;
      // Фильтрация по дате
      if (this.selectedDate) {
        let selectedDate;
        if (this.selectedDate instanceof Date) {
          selectedDate = this.selectedDate;
        } else if (typeof this.selectedDate === "string") {
          selectedDate = new Date(this.selectedDate + "T00:00:00");
        }
        if (selectedDate) {
          selectedDate.setHours(0, 0, 0, 0);
          filtered = filtered.filter((match) => {
            const matchDate = new Date(match.utcDate);
            matchDate.setHours(0, 0, 0, 0);
            return matchDate.getTime() === selectedDate.getTime();
          });
        }
      }
      // Фильтрация по статусу
      if (this.selectedStatus && this.selectedStatus !== "all") {
        filtered = filtered.filter(
          (match) => match.status === this.selectedStatus
        );
      }
      return filtered;
    },
    totalPages() {
      return Math.ceil(this.matches.length / this.itemsPerPage);
    },
    paginatedMatches() {
      const start = (this.page - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.matches.slice(start, end);
    },
    headers() {
      return [
        { key: "utcDate", title: this.$t("app.table_date") },
        { key: "status", title: this.$t("app.table_status") },
        { key: "hometeam", title: this.$t("app.table_home") },
        { key: "awayteam", title: this.$t("app.table_away") },
        { key: "score", title: this.$t("app.table_score") },
      ];
    },
    isMobile() {
      return window.innerWidth <= 768;
    },
    tableFooterProps() {
      return this.isMobile
        ? { itemsPerPageOptions: [] } // Hide footer on mobile
        : { "items-per-page-text": this.$t("app.items_per_page") };
    },
  },
  methods: {
    async fetchData() {
      this.isLoading = true;
      this.error = null;
      try {
        let entityResponse, matchesResponse;
        if (this.entityType === "league") {
          [entityResponse, matchesResponse] = await Promise.all([
            api.get(`api/v4/competitions/${this.entityId}`),
            api.get(`api/v4/competitions/${this.entityId}/matches`),
          ]);
          this.entity = entityResponse.data;
          this.matches = matchesResponse.data.matches;
        } else if (this.entityType === "team") {
          [entityResponse, matchesResponse] = await Promise.all([
            api.get(`api/v4/teams/${this.entityId}`),
            api.get(`api/v4/teams/${this.entityId}/matches`),
          ]);
          this.entity = entityResponse.data;
          this.matches = matchesResponse.data.matches;
        }
      } catch (err) {
        this.error = `Не удалось загрузить данные лиги. Пожалуйста, попробуйте позже.`;
        console.error(`league data error:`, err);
      } finally {
        this.isLoading = false;
      }
    },
    getStatusText(status) {
      const statusMap = {
        SCHEDULED: this.$t("app.status_scheduled"),
        LIVE: this.$t("app.status_live"),
        IN_PLAY: this.$t("app.status_in_play"),
        PAUSED: this.$t("app.status_paused"),
        FINISHED: this.$t("app.status_finished"),
        POSTPONED: this.$t("app.status_postponed"),
        SUSPENDED: this.$t("app.status_suspended"),
        CANCELLED: this.$t("app.status_cancelled"),
        TIMED: this.$t("app.status_timed"),
        ABANDONED: this.$t("app.status_abandoned"),
        TECHNICAL_LOSS: this.$t("app.status_technical_loss"),
      };
      return statusMap[status] || status;
    },
    getStatusColor(status) {
      const statusMap = {
        SCHEDULED: "primary",
        LIVE: "error",
        IN_PLAY: "error",
        PAUSED: "warning",
        FINISHED: "success",
        POSTPONED: "warning",
        SUSPENDED: "info",
        CANCELLED: "warning",
        TIMED: "primary",
        ABANDONED: "error",
        TECHNICAL_LOSS: "error",
      };
      return statusMap[status] || "grey";
    },
    getScoreText(item) {
      return item.score.fullTime.home !== null &&
        item.score.fullTime.away !== null
        ? `${item.score.fullTime.home} - ${item.score.fullTime.away}`
        : "-";
    },
    getHomeScore(match) {
      return match.score.fullTime.home !== null
        ? match.score.fullTime.home
        : "-";
    },
    getAwayScore(match) {
      return match.score.fullTime.away !== null
        ? match.score.fullTime.away
        : "-";
    },
    formatMatchDate(dateString) {
      // форматирование даты с русской локализацией и учетом часового пояса
      const date = new Date(dateString);
      return date.toLocaleDateString("ru-RU", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    },
    formatMatchTime(dateString) {
      const date = new Date(dateString);
      return date.toLocaleTimeString("ru-RU", {
        hour: "2-digit",
        minute: "2-digit",
      });
    },
    onSearchInput() {
      this.page = 1;
    },
  },
  mounted() {
    this.fetchData();
  },
  watch: {
    entityId() {
      this.fetchData();
    },
  },
  components: {
    MatchCard,
  },
};
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
  content: "";
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
  background-color: var(--v-theme-surface);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(44, 62, 80, 0.1);
  margin-top: 1.5rem;
}

.v-data-table :deep(th) {
  font-weight: 600 !important;
  font-size: 0.95rem !important;
  text-transform: none !important;
  letter-spacing: 0.3px !important;
}

.v-data-table :deep(td) {
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
  background-color: var(--v-theme-surface);
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

/* Add styles for new match card layout */
.competition-name {
  font-weight: 700;
  color: #3498db;
  font-size: 1.05rem;
  margin-right: 0.5rem;
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.match-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}
.match-row-top {
  margin-bottom: 0.75rem;
}
.match-row-datetime {
  font-size: 0.92rem;
  color: #7f8c8d;
  gap: 1.5rem;
}
@media (max-width: 768px) {
  .competition-name {
    font-size: 0.98rem;
  }
  .match-row-datetime {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.2rem;
  }
}
</style>

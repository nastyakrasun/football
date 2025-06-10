<template>
  <div class="page-container">
    <!-- Лоадер при загрузке -->
    <v-progress-circular
      v-if="isLoading"
      class="d-block mx-auto my-8"
      color="primary"
      indeterminate
    />

    <!-- Сообщение, если команд нет -->
    <v-alert v-else-if="filteredTeams.length === 0" class="ma-4" type="info">
      {{ searchQuery ? "Ничего не найдено" : "Нет доступных команд" }}
    </v-alert>

    <!-- Карточки команд + пагинация -->
    <template v-else>
      <div class="content">
        <v-row>
          <v-col
            v-for="team in paginatedTeams"
            :key="team.id"
            cols="12"
            lg="2.4"
            md="4"
            sm="6"
            class="team-col"
          >
            <v-card class="ma-2 team-card" @click="goToTeam(team.id)">
              <v-img
                v-if="team.crest"
                class="grey lighten-2"
                contain
                height="100"
                :src="team.crest"
              />
              <v-img
                v-else
                class="grey lighten-2"
                contain
                height="100"
                src="/src/assets/placeholder.svg"
              />
              <div class="team-info">
                <div class="team-name">{{ team.name }}</div>
                <div class="team-area">
                  {{ team.area?.name || "Не указано" }}
                </div>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </div>

      <!-- Пагинация -->
      <div class="pagination-container">
        <Pagination v-model:currentPage="page" :totalPages="totalPages" />
      </div>
    </template>
  </div>
</template>

<script>
import api from "@/api";
import Pagination from "./Pagination.vue";

export default {
  components: {
    Pagination,
  },
  props: {
    searchQuery: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      page: 1,
      itemsPerPage: 10, // 5 columns * 2 rows
      teams: [],
      isLoading: false,
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.filteredTeams.length / this.itemsPerPage);
    },
    paginatedTeams() {
      const start = (this.page - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredTeams.slice(start, end);
    },
    filteredTeams() {
      if (!this.searchQuery) return this.teams;
      const query = this.searchQuery.toLowerCase();
      return this.teams.filter((team) =>
        team.name.toLowerCase().includes(query)
      );
    },
  },
  mounted() {
    this.loadTeams();
  },
  methods: {
    loadTeams() {
      this.isLoading = true;
      api
        .get("api/v4/teams")
        .then((response) => (this.teams = response.data.teams))
        .catch((error) => console.error(error))
        .finally(() => (this.isLoading = false));
    },
    goToTeam(teamId) {
      this.$router.push(`/team/?id=${teamId}`);
    },
  },
};
</script>

<style scoped>
.page-container {
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 120px); /* Adjust based on your header height */
}

.content {
  flex: 1;
}

.pagination-container {
  margin-top: auto;
  padding: 20px 0;
}

.team-col {
  flex: 0 0 20%; /* Exactly 5 columns */
  max-width: 20%;
}

.team-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  transition: transform 0.3s;
  margin-bottom: 16px;
  cursor: pointer;
}

.team-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.team-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 16px;
  text-align: center;
}

.team-name {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 4px;
}

.team-area {
  font-size: 16px;
  color: rgba(0, 0, 0, 0.6);
}

@media (max-width: 1264px) {
  .team-col {
    flex: 0 0 33.333%;
    max-width: 33.333%;
  }
}

@media (max-width: 960px) {
  .team-col {
    flex: 0 0 50%;
    max-width: 50%;
  }
}

@media (max-width: 600px) {
  .team-col {
    flex: 0 0 100%;
    max-width: 100%;
  }
}
</style>

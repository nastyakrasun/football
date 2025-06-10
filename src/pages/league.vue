<template>
  <div>
    <v-progress-circular
      v-if="isLoading"
      class="d-block mx-auto my-8"
      color="primary"
      indeterminate
    />
    <v-alert v-else-if="matches.length === 0" type="info">
      {{ searchQuery ? "Ни одного матча не найдено" : "Нет доступных матчей" }}
    </v-alert>
    <template v-else>
      <v-data-table :headers="headers" :items="matches" />
    </template>
  </div>
</template>

<script>
import api from "@/api";

export default {
  data() {
    return {
      page: 1,
      itemsPerPage: 12,
      matches: [],
      isLoading: false,
      headers: [
        {
          align: "start",
          key: "utcDate",
          sortable: false,
          title: "Дата",
        },
        { key: "status", title: "Статус" },
        { key: "homeTeam", title: "Хозяева" },
        { key: "awayTeam", title: "Гости" },
        { key: "score", title: "Счет" },
      ],
    };
  },
  mounted() {
    this.loadLeagueMatches();
  },
  methods: {
    loadLeagueMatches() {
      this.isLoading = true;
      const leagueId = this.$route.query.id;
      api
        .get(`api/v4/competitions/${leagueId}/matches`)
        .then((response) => {
          this.matches = response.data.matches.map((match) => ({
            ...match,
            homeTeam: match.homeTeam.name,
            awayTeam: match.awayTeam.name,
            score:
              match.score.fullTime.home !== null &&
              match.score.fullTime.away !== null
                ? `${match.score.fullTime.home} - ${match.score.fullTime.away}`
                : "-",
          }));
        })
        .catch((error) => console.error(error))
        .finally(() => (this.isLoading = false));
    },
  },
};
</script> 
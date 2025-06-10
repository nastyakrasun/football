<template>
  <div>
    <div
      v-if="isLoading"
      style="display: flex; justify-content: center; margin: 2rem 0"
    >
      <div
        style="
          width: 40px;
          height: 40px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #1976d2;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        "
      ></div>
    </div>
    <div
      v-else-if="matches.length === 0"
      style="
        padding: 1rem;
        margin: 1rem;
        background-color: #e3f2fd;
        border-radius: 4px;
        color: #1976d2;
      "
    >
      {{ searchQuery ? "No matches found" : "No matches available" }}
    </div>
    <div v-else style="padding: 1rem">
      <table style="width: 100%; border-collapse: collapse">
        <thead>
          <tr style="background-color: #f5f5f5">
            <th
              style="
                padding: 12px;
                text-align: left;
                border-bottom: 2px solid #ddd;
              "
            >
              Date
            </th>
            <th
              style="
                padding: 12px;
                text-align: left;
                border-bottom: 2px solid #ddd;
              "
            >
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="match in matches"
            :key="match.id"
            style="border-bottom: 1px solid #ddd"
          >
            <td style="padding: 12px">
              {{ new Date(match.utcDate).toLocaleDateString() }}
            </td>
            <td style="padding: 12px">{{ match.status }}</td>
          </tr>
        </tbody>
      </table>
    </div>
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
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.matches.length / this.itemsPerPage);
    },
    paginatedMatches() {
      const start = (this.page - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.matches.slice(start, end);
    },
  },
  mounted() {
    this.loadMatches();
  },
  methods: {
    loadMatches() {
      this.isLoading = true;
      const leagueId = this.$route.query.id;
      api
        .get(`api/v4/competitions/${leagueId}/matches`)
        .then((response) => (this.matches = response.data.matches))
        .catch((error) => console.error(error))
        .finally(() => (this.isLoading = false));
    },
    onSearchInput() {
      this.page = 1;
    },
  },
};
</script>

<style>
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

tr:hover {
  background-color: #f5f5f5;
}
</style>

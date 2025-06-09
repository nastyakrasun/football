<template>
  <v-container class="fill-height" fluid>
    <v-row>
      <v-col
        v-for="(league, index) in paginatedLeagues"
        :key="index"
        class="d-flex"
        cols="12"
        md="4"
        sm="6"
      >
        <v-card class="league-card flex-grow-1 d-flex flex-column">
          <v-card-title class="text-center flex-grow-0">{{ league.name }}</v-card-title>
          <v-card-subtitle class="text-center flex-grow-0">{{ league.area.name }}</v-card-subtitle>
          <v-spacer />
          <v-card-actions class="justify-center flex-grow-0">
            <v-btn color="primary">Подробнее</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="auto">
        <v-pagination
          v-model="page"
          class="mt-6"
          :length="totalPages"
          :total-visible="7"
        />
      </v-col>
    </v-row>
  </v-container>
</template>


<script>
  import axios from 'axios'
  export default {
    data () {
      return {
        page: 1,
        itemsPerPage: 12,
        leagues: [],
      }
    },
    computed: {
      totalPages () {
        return Math.ceil(this.leagues.length / this.itemsPerPage)
      },
      paginatedLeagues () {
        const start = (this.page - 1) * this.itemsPerPage
        const end = start + this.itemsPerPage
        return this.leagues.slice(start, end)
      },
    },
    mounted () {
      axios.get('api/v2/competitions')
        .then(response => this.leagues = response.data.competitions)
        .catch(error => console.error(error));
    },
  }
</script>
<style scoped>
.league-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  transition: transform 0.3s;
  margin-bottom: 16px;
}

.league-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.v-card-title {
  font-size: 1.2rem;
  font-weight: bold;
  padding-bottom: 0;
}

.v-card-subtitle {
  padding-top: 0;
  font-size: 1rem;
}

.v-pagination {
  justify-content: center;
}
</style>
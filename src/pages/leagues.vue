<template>
  <MatchesList
    entity-type="league"
    :search-query="searchQuery"
    page-title="Лиги"
    page-subtitle="Все футбольные лиги"
    placeholder-image="/src/assets/free-icon-football-club-919408.png"
  />
</template>

<script>
import MatchesList from "@/components/ListOfTitles.vue";

export default {
  name: "LeaguesPage",
  components: {
    MatchesList,
  },
  props: {
    searchQuery: {
      type: String,
      default: "",
    },
  },
};
</script>

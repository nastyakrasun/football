<template>
  <MatchesList
    entity-type="team"
    :search-query="searchQuery"
    page-title="Команды"
    page-subtitle="Все футбольные команды"
    placeholder-image="/src/assets/free-icon-soccer-player-919397.png"
  />
</template>

<script>
import MatchesList from "@/components/ListOfTitles.vue";

export default {
  name: "TeamsPage",
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

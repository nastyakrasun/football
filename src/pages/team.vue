<template>
  <MatchesTable
    entity-type="team"
    :entity-id="$route.params.id"
    :search-query="searchQuery"
    :selected-date="selectedDate"
    :selected-status="selectedStatus"
  />
</template>

<script>
import MatchesTable from "@/components/DataByTitle.vue";

export default {
  name: "TeamPage",
  components: {
    MatchesTable,
  },
  props: {
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
};
</script>

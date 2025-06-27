<template>
  <MatchesTable
    entity-type="league"
    :entity-id="$route.params.id"
    :search-query="searchQuery"
    :selected-date="selectedDate"
    :selected-status="selectedStatus"
  />
</template>

<script>
import MatchesTable from "@/components/DataByTitle.vue";

export default {
  name: "LeaguePage",
  components: {
    MatchesTable,
  },
  inject: ["selectedDate", "selectedStatus", "searchQuery"],
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

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
import MatchesTable from '@/components/MatchesTable.vue'

export default {
  name: 'LeaguePage',
  components: {
    MatchesTable
  },
  props: {
    searchQuery: {
      type: String,
      default: ''
    },
    selectedDate: {
      type: [String, Date],
      default: null
    },
    selectedStatus: {
      type: String,
      default: 'all'
    }
  }
}
</script> 
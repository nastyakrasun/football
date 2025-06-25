<template>
  <LeaguesTable 
    entity-type="league"
    :entity-id="$route.params.id"
    :search-query="searchQuery"
    :selected-date="selectedDate"
    :selected-status="selectedStatus"
  />
</template>

<script>
import LeaguesTable from '@/components/LeaguesTable.vue'

export default {
  name: 'LeaguePage',
  components: {
    LeaguesTable
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
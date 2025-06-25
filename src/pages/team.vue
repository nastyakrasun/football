<template>
  <TeamsTable 
    :entity-id="$route.params.id"
    :search-query="searchQuery"
    :selected-date="selectedDate"
    :selected-status="selectedStatus"
  />
</template>

<script>
import TeamsTable from '@/components/TeamsTable.vue'

export default {
  name: 'TeamPage',
  components: {
    TeamsTable
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
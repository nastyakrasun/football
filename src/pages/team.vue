<template>
  <MatchesTable 
    entity-type="team"
    :entity-id="$route.params.id"
    :search-query="searchQuery"
  />
</template>

<script>
import MatchesTable from '@/components/MatchesTable.vue'

export default {
  name: 'TeamPage',
  components: {
    MatchesTable
  },
  props: {
    searchQuery: {
      type: String,
      default: ''
    }
  }
}
</script> 
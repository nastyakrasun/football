<template>
  <MatchesTable 
    entity-type="league"
    :entity-id="$route.params.id"
    :search-query="searchQuery"
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
    }
  }
}
</script> 
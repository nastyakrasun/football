<template>
  <MatchesList 
    entity-type="team"
    :search-query="searchQuery"
  />
</template>

<script>
import MatchesList from '@/components/MatchesList.vue'

export default {
  name: 'TeamsPage',
  components: {
    MatchesList
  },
  props: {
    searchQuery: {
      type: String,
      default: ''
    }
  }
}
</script> 
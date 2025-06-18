<template>
  <MatchesList 
    entity-type="league"
    :search-query="searchQuery"
  />
</template>

<script>
import MatchesList from '@/components/MatchesList.vue'

export default {
  name: 'LeaguesPage',
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
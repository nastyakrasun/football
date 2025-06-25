<template>
  <TeamsTable 
    :entity-id="$route.params.id"
    :search-query="searchQuery"
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
    }
  }
}
</script> 
<template>
  <Teams :searchQuery="searchQuery" />
</template>

<script>
import Teams from "@/components/Teams.vue";

export default {
  components: {
    Teams,
  },
  data() {
    return {
      searchQuery: "",
    };
  },
};
</script> 
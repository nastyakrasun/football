<template>
  <div class="layout">
    <AppHeader v-bind="$attrs" :search-query="searchQuery" />
    <main>
      <slot />
    </main>
    <AppFooter @search="$emit('search', $event)" />
  </div>
</template>

<script>
import AppHeader from "./AppHeader.vue";
import AppFooter from "./AppFooter.vue";

export default {
  name: "DefaultLayout",
  components: { AppHeader, AppFooter },
  inheritAttrs: false,
  props: ["searchQuery"],
};
</script>

<style>
/*.layout {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }
  
  main {
    flex: 1;
    padding: 1rem;
  }*/
</style>

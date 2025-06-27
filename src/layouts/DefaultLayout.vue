<template>
  <div class="layout">
    <AppHeader
      v-bind="$attrs"
      :search-query="searchQuery"
      :selected-date="selectedDate"
      :selected-status="selectedStatus"
      @update:selectedDate="$emit('update:selected-date', $event)"
      @update:selectedStatus="$emit('update:selected-status', $event)"
      @date-change="$emit('date-change')"
    />
    <main>
      <slot
        :selectedDate="selectedDate"
        :selectedStatus="selectedStatus"
        :searchQuery="searchQuery"
      />
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
  props: ["searchQuery", "selectedDate", "selectedStatus"],
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

<template>
    <div class="layout">
      <AppHeader v-bind="$attrs" />
      <main>
        <slot />
      </main>
      <AppFooter />
    </div>
  </template>
  
  <script>
  import AppHeader from './AppHeader.vue'
  import AppFooter from './AppFooter.vue'
  
  export default {
    name: 'DefaultLayout',
    components: { AppHeader, AppFooter },
    inheritAttrs: false
  }
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
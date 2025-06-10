<template>
  <div style="display: flex; flex-direction: column; height: 100vh">
    <!-- Header -->
    <header
      style="
        display: flex;
        justify-content: left;
        align-items: center;
        padding: 10px;
        background-color: #f0f0f0;
      "
    >
      <div style="display: flex; align-items: center">
        <img src="./assets/logo.png" alt="Logo" style="height: 40px" />
      </div>
      <!-- Navigation -->
      <nav style="margin: 10px 0; padding: 0 10px">
        <button
          @click="$router.push('/')"
          :class="{ active: $route.path === '/' }"
          class="nav-button"
        >
          Лиги
        </button>
        <button
          @click="$router.push('/teams')"
          :class="{ active: $route.path === '/teams' }"
          class="nav-button"
        >
          Команды
        </button>
      </nav>
    </header>

    <!-- Search field -->
    <div style="display: flex; justify-content: left; padding: 10px">
      <v-text-field
        v-model="searchQuery"
        placeholder="Поиск..."
        prepend-inner-icon="mdi-magnify"
        clearable
        hide-details
        density="compact"
        variant="outlined"
        style="width: 300px; margin-left: 10px"
        class="custom-search"
      ></v-text-field>
    </div>

    <!-- Main content -->
    <main style="flex: 1; display: flex; flex-direction: column">
      <router-view :searchQuery="searchQuery" />
    </main>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchQuery: "",
    };
  },
};
</script>

<style>
.nav-button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  background-color: #f0f0f0;
  color: #303030;
  cursor: pointer;
  transition: all 0.3s;
  min-width: 100px;
  text-align: center;
  font-size: 14px;
  font-weight: 500;
  margin-left: 10px;
}

.nav-button:first-child {
  margin-left: 0;
}

.nav-button:hover {
  background-color: #d5d5d5;
}

.nav-button.active {
  background-color: #1976d2;
  color: white;
}

/* Custom styles for the Vuetify search field */
.custom-search .v-field__input {
  padding: 5px !important;
  min-height: 36px !important;
}

.custom-search .v-field__outline {
  border-color: #ddd !important;
}

.custom-search .v-field--focused .v-field__outline {
  border-color: #1976d2 !important;
}

.custom-search .v-field__prepend-inner {
  padding-top: 0 !important;
}

.custom-search .v-field__clearable {
  padding-top: 0 !important;
}
</style>

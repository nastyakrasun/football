<template>
  <header class="app-header" :style="{ backgroundColor: headerBg + ' !important' }">
    <!-- Mobile: First row: navigation dropdown and logo -->
    <div class="header-row">
      <v-select
        v-model="selectedNav"
        :items="navItems"
        item-title="label"
        item-value="route"
        hide-details
        dense
        variant="solo"
        class="nav-select"
        @update:model-value="onNavChange"
      />
      <img src="../assets/logo.png" alt="Logo" class="logo" />
    </div>
    <!-- Second row: calendar button -->
    <div class="header-row">
      <DatePicker :model-value="selectedDate" @update:model-value="$emit('update:selectedDate', $event)" />
    </div>
    <!-- Third row: status filter buttons -->
    <div class="header-row status-row">
      <v-btn
        v-for="status in statusOptions"
        :key="status.value"
        :color="selectedStatus === status.value ? 'primary' : 'default'"
        variant="outlined"
        class="status-btn"
        :class="{ 'status-btn-active': selectedStatus === status.value }"
        @click="$emit('update:selectedStatus', status.value)"
      >
        <v-icon 
          :icon="status.icon" 
          size="16" 
          class="status-icon"
          :class="{ 'status-icon-active': selectedStatus === status.value }"
        ></v-icon>
      </v-btn>
    </div>
  </header>
</template>

<script>
import DatePicker from './DatePicker.vue'
import { useTheme } from 'vuetify'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

export default {
  name: 'AppHeader',
  components: { DatePicker },
  props: {
    selectedDate: {
      type: [String, Date],
      default: null
    },
    selectedStatus: {
      type: String,
      default: 'all'
    }
  },
  emits: ['update:selectedDate', 'update:selectedStatus'],
  setup(props, { emit }) {
    const theme = useTheme()
    const headerBg = computed(() => theme.global.name.value === 'dark' ? '#2c3e50' : 'white')
    const { t } = useI18n()
    const router = useRouter()
    // Mobile nav
    const navItems = [
      { label: t('app.home'), route: '/' },
      { label: t('app.leagues'), route: '/leagues' },
      { label: t('app.teams'), route: '/teams' },
    ]
    const selectedNav = ref(router.currentRoute.value.path)
    function onNavChange(route) {
      if (route !== router.currentRoute.value.path) {
        router.push(route)
      }
    }
    const statusOptions = computed(() => [
      { value: 'all', label: t('app.status_all'), icon: 'mdi-view-list' },
      { value: 'LIVE', label: t('app.status_live'), icon: 'mdi-play-circle' },
      { value: 'SCHEDULED', label: t('app.status_scheduled'), icon: 'mdi-clock-outline' },
      { value: 'FINISHED', label: t('app.status_finished'), icon: 'mdi-check-circle' },
    ])
    return {
      headerBg,
      statusOptions,
      navItems,
      selectedNav,
      onNavChange
    }
  }
}
</script>

<style scoped>
.app-header {
  background-color: #2c3e50;
  box-shadow: 0 2px 12px rgba(44, 62, 80, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
  border-bottom: 1px solid rgba(44, 62, 80, 0.05);
  opacity: 1;
  transition: background-color 0.3s;
}
.header-row {
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  gap: 1rem;
}
.logo {
  height: 36px;
  margin-left: auto;
}
.nav-select {
  min-width: 160px;
  max-width: 160px;
}
.header-row :deep(.calendar-btn) {
  min-width: 160px;
  max-width: 160px;
}
.status-row {
  justify-content: center;
  gap: 0.5rem;
}
.status-btn {
  min-width: 44px;
  height: 36px;
  font-size: 12px;
  border-radius: 18px;
  padding: 0 10px;
  font-weight: 500;
  color: #3498db;
  border: 2px solid #3498db;
  background: transparent;
  transition: background 0.2s, border-color 0.2s;
}
.status-btn:active, .status-btn--active, .status-btn-active {
  background: linear-gradient(135deg, #3498db, #2980b9);
  color: #fff;
  border-color: #2980b9;
}
.status-btn:hover {
  background: rgba(52, 152, 219, 0.08);
  border-color: #2980b9;
}
.status-icon {
  margin-right: 4px;
}
</style>

<style>
html, body {
  background: var(--v-theme-background, #f8f9fa) !important;
}
</style> 
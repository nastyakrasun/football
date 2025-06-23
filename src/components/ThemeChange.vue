<template>
  <v-btn @click="toggleTheme" class="pill-btn" variant="outlined">
    <v-icon class="pill-icon" size="20">{{ themeIcon }}</v-icon>
    <span class="pill-label">{{ themeLabel }}</span>
  </v-btn>
</template>

<script setup>
import { computed } from 'vue'
import { useTheme } from 'vuetify'
import { useI18n } from 'vue-i18n'

const theme = useTheme()
const { t } = useI18n()

const isDark = computed(() => theme.global.name.value === 'dark')
const themeIcon = computed(() => isDark.value ? 'mdi-white-balance-sunny' : 'mdi-moon-waning-crescent')
const themeLabel = computed(() => isDark.value ? t('app.theme_light', 'Светлая') : t('app.theme_dark', 'Тёмная'))
const themeTitle = computed(() => isDark.value ? 'Светлая тема' : 'Тёмная тема')

function toggleTheme() {
  theme.global.name.value = isDark.value ? 'light' : 'dark'
}
</script>

<style scoped>
.pill-btn {
  border-radius: 18px;
  padding: 0 16px;
  height: 36px;
  font-weight: 500;
  color: #3498db;
  border: 2px solid #3498db;
  background: transparent;
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 110px;
  transition: background 0.2s, border-color 0.2s;
}
.pill-btn:active, .pill-btn--active {
  background: linear-gradient(135deg, #3498db, #2980b9);
  color: #fff;
  border-color: #2980b9;
}
.pill-btn:hover {
  background: rgba(52, 152, 219, 0.08);
  border-color: #2980b9;
}
.pill-icon {
  margin-right: 6px;
}
.pill-label {
  font-size: 15px;
  font-weight: 500;
}
</style> 
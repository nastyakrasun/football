<template>
  <v-btn @click="toggleLanguage" class="pill-btn" variant="outlined">
    <v-icon class="pill-icon" size="20">{{ langIcon }}</v-icon>
    <span class="pill-label">{{ langLabel }}</span>
  </v-btn>
</template>

<script setup>
import { computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useLocale } from 'vuetify'

const { locale, t } = useI18n()
const { current } = useLocale()

const isRu = computed(() => locale.value === 'ru')
const langIcon = computed(() => isRu.value ? 'mdi-alphabet-cyrillic' : 'mdi-alphabet-latin')
const langLabel = computed(() => isRu.value ? t('app.language_ru', 'Русский') : t('app.language_en', 'English'))
const langTitle = computed(() => isRu.value ? 'Switch to English' : 'Переключить на русский')

function toggleLanguage() {
  locale.value = isRu.value ? 'en' : 'ru'
  current.value = locale.value
}

// Ensure Vuetify locale stays in sync with i18n
watch(locale, (newLocale) => {
  current.value = newLocale
})
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
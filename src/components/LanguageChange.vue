<template>
  <v-btn @click="toggleLanguage" :title="langTitle" icon>
    <span style="display: flex; align-items: center; justify-content: center; width: 24px; height: 24px; font-weight: 600; font-size: 1rem;">
      <span v-if="isRu">Eng</span>
      <span v-else>Рус</span>
    </span>
  </v-btn>
</template>

<script setup>
import { computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useLocale } from 'vuetify'

const { locale } = useI18n()
const { current } = useLocale()

const isRu = computed(() => locale.value === 'ru')
const themeIcon = computed(() => isRu.value ? 'mdi-white-balance-sunny' : 'mdi-moon-waning-crescent')
const themeTitle = computed(() => isRu.value ? 'Светлая тема' : 'Тёмная тема')
const langIcon = computed(() => isRu.value ? 'mdi-alphabet-latin' : 'mdi-alphabet-cyrillic')
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
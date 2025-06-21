<template>
  <v-btn @click="toggleTheme" icon :title="themeTitle">
    <v-icon>{{ themeIcon }}</v-icon>
  </v-btn>
</template>

<script setup>
import { computed } from 'vue'
import { useTheme } from 'vuetify'

const theme = useTheme()

const isDark = computed(() => theme.global.name.value === 'dark')
const themeIcon = computed(() => isDark.value ? 'mdi-white-balance-sunny' : 'mdi-moon-waning-crescent')
const themeTitle = computed(() => isDark.value ? 'Светлая тема' : 'Тёмная тема')

function toggleTheme() {
  theme.global.name.value = isDark.value ? 'light' : 'dark'
}
</script> 
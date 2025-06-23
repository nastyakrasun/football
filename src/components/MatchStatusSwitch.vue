<template>
  <div class="status-row">
    <v-btn
      v-for="status in statusOptions"
      :key="status.value"
      :color="selectedStatus === status.value ? 'primary' : 'default'"
      variant="outlined"
      class="status-btn"
      :class="{ 'status-btn-active': selectedStatus === status.value }"
      @click="$emit('update:selectedStatus', status.value)"
    >
      <v-icon :icon="status.icon" size="16" class="status-icon" :class="{ 'status-icon-active': selectedStatus === status.value }"></v-icon>
      <span v-if="!mobile" class="status-label">{{ status.label }}</span>
    </v-btn>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
const props = defineProps({
  selectedStatus: { type: String, default: 'all' },
  mobile: { type: Boolean, default: false }
})
const { t } = useI18n()
const statusOptions = computed(() => [
  { value: 'all', label: t('app.status_all'), icon: 'mdi-view-list' },
  { value: 'LIVE', label: t('app.status_live'), icon: 'mdi-play-circle' },
  { value: 'SCHEDULED', label: t('app.status_scheduled'), icon: 'mdi-clock-outline' },
  { value: 'FINISHED', label: t('app.status_finished'), icon: 'mdi-check-circle' },
])
</script>

<style scoped>
.status-row {
  display: flex;
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
}
.status-btn-active {
  background: linear-gradient(135deg, #3498db, #2980b9);
  color: white;
  border-color: #3498db;
}
.status-label {
  margin-left: 4px;
}
</style> 
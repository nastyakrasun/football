<template>
  <v-card class="mb-4">
    <v-card-text>
      <v-row align="center">
        <v-col md="4">
          <v-date-picker
            v-model="selectedDate"
            @update:model-value="onDateChange"
            color="primary"
            elevation="2"
            class="rounded-lg"
            title="Календарь соревнований"
            header="выберите дату"
          />
        </v-col>
        <v-col md="7">
          <v-text-field 
            v-model="formattedDate" 
            label="Выбранная дата"
            readonly
            variant="outlined"
            density="comfortable"
            class="mt-4"
          />
          <v-btn
            @click="clearFilter"
            color="primary"
            variant="outlined"
            class="mt-4"
            block
          >
            Очистить фильтр
          </v-btn>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'DatePicker',
  props: {
    modelValue: {
      type: String,
      default: null
    }
  },
  emits: ['update:modelValue', 'date-change'],
  computed: {
    selectedDate: {
      get() {
        return this.modelValue
      },
      set(value) {
        this.$emit('update:modelValue', value)
      }
    },
    formattedDate() {
      return this.selectedDate ? new Date(this.selectedDate).toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }) : '';
    }
  },
  methods: {
    onDateChange() {
      this.$emit('date-change')
    },
    clearFilter() {
      this.selectedDate = null
      this.$emit('date-change')
    }
  }
}
</script>

<style scoped>
.v-date-picker {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(44, 62, 80, 0.1);
  border: 1px solid rgba(44, 62, 80, 0.05);
  transition: all 0.3s ease;
}

.v-date-picker:hover {
  box-shadow: 0 6px 20px rgba(44, 62, 80, 0.15);
}

.v-date-picker :deep(.v-date-picker-header) {
  padding: 16px;
  background-color: #f8f9fa;
  border-bottom: 1px solid rgba(44, 62, 80, 0.05);
}

.v-date-picker :deep(.v-date-picker-header__title) {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2c3e50;
}

.v-date-picker :deep(.v-date-picker-table) {
  padding: 8px;
}

.v-date-picker :deep(.v-date-picker-table__current) {
  color: #3498db;
  font-weight: 600;
}

.v-date-picker :deep(.v-date-picker-table__day) {
  border-radius: 8px;
  transition: all 0.2s ease;
}

.v-date-picker :deep(.v-date-picker-table__day:hover) {
  background-color: rgba(52, 152, 219, 0.1);
}

.v-date-picker :deep(.v-date-picker-table__day--selected) {
  background-color: #3498db !important;
  color: white !important;
}

.v-date-picker :deep(.v-date-picker-table__day--selected:hover) {
  background-color: #2980b9 !important;
}

.v-date-picker :deep(.v-date-picker-table__day--disabled) {
  color: #bdc3c7 !important;
}

.v-date-picker :deep(.v-date-picker-table__day--adjacent-month) {
  color: #95a5a6;
}

.v-date-picker :deep(.v-date-picker-table__weekday) {
  color: #7f8c8d;
  font-weight: 500;
  font-size: 0.9rem;
}

.v-date-picker :deep(.v-date-picker-table__month) {
  color: #2c3e50;
  font-weight: 500;
}

.v-date-picker :deep(.v-date-picker-table__month--selected) {
  background-color: #3498db !important;
  color: white !important;
}

.v-date-picker :deep(.v-date-picker-table__month:hover) {
  background-color: rgba(52, 152, 219, 0.1);
}

.v-date-picker :deep(.v-date-picker-table__year) {
  color: #2c3e50;
  font-weight: 500;
}

.v-date-picker :deep(.v-date-picker-table__year--selected) {
  background-color: #3498db !important;
  color: white !important;
}

.v-date-picker :deep(.v-date-picker-table__year:hover) {
  background-color: rgba(52, 152, 219, 0.1);
}

.v-date-picker :deep(.v-date-picker-table__header) {
  padding: 8px;
  background-color: #f8f9fa;
}

.v-date-picker :deep(.v-date-picker-table__header-title) {
  font-weight: 600;
  color: #2c3e50;
}

.v-date-picker :deep(.v-date-picker-table__header-arrow) {
  color: #3498db;
}

.v-date-picker :deep(.v-date-picker-table__header-arrow:hover) {
  background-color: rgba(52, 152, 219, 0.1);
}

.v-date-picker :deep(.v-date-picker-table__header-arrow--disabled) {
  color: #bdc3c7;
}

.v-date-picker :deep(.v-date-picker-table__header-arrow--disabled:hover) {
  background-color: transparent;
}

.v-text-field {
  margin-bottom: 1rem;
}

.v-text-field :deep(.v-field) {
  border-radius: 8px;
  transition: all 0.3s ease;
}
</style> 
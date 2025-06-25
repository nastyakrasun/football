<template>
  <div class="calendar-button-container">
    <!-- Кнопка календаря -->
    <v-btn
      @click="showDialog = true"
      variant="outlined"
      class="calendar-btn"
      color="#3498db"
    >
      <v-icon class="calendar-icon">mdi-calendar</v-icon>
      <span class="date-text">{{ formattedShortDate }}</span>
      <v-icon class="arrow-icon">mdi-chevron-right</v-icon>
    </v-btn>

    <!-- Модальное окно с календарем -->
    <v-dialog
      v-model="showDialog"
      max-width="380"
      :fullscreen="$vuetify.display.smAndDown"
      persistent
    >
      <v-card class="calendar-dialog">
        <v-card-title class="dialog-title">
          {{ $t('app.calendar') }}
          <v-btn
            icon
            @click="showDialog = false"
            class="close-btn"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        
        <v-card-text class="dialog-content">
          <v-date-picker
            v-model="selectedDate"
            @update:model-value="onDateChange"
            color="primary"
            elevation="2"
            class="calendar-picker"
          />
          
          <div class="selected-date-display">
          <v-text-field 
              v-model="selectedDateDisplay" 
              :label="$t('app.selectedDate')"
            readonly
            variant="outlined"
              density="compact"
              class="mt-3"
          />
          </div>
        </v-card-text>
        
        <v-card-actions class="dialog-actions">
          <v-btn
            @click="clearFilter"
            color="primary"
            variant="outlined"
            class="clear-btn"
            size="small"
          >
            {{ $t('app.clear') }}
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            @click="showDialog = false"
            color="primary"
            variant="elevated"
            size="small"
          >
            {{ $t('app.ok') }}
          </v-btn>
        </v-card-actions>
  </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { useTheme } from 'vuetify'
import { useI18n } from 'vue-i18n'
import { ref, computed } from 'vue'

export default {
  name: 'DatePicker',
  props: {
    modelValue: {
      type: [String, Date],
      default: null
    }
  },
  emits: ['update:modelValue', 'date-change'],
  setup(props, { emit }) {
    const theme = useTheme()
    const { t } = useI18n()
    const showDialog = ref(false)
    const selectedDate = computed({
      get() {
        if (!props.modelValue) return null;
        if (typeof props.modelValue === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(props.modelValue)) {
          return props.modelValue;
        }
        if (props.modelValue instanceof Date) {
          const year = props.modelValue.getFullYear();
          const month = String(props.modelValue.getMonth() + 1).padStart(2, '0');
          const day = String(props.modelValue.getDate()).padStart(2, '0');
          return `${year}-${month}-${day}`;
        }
        if (typeof props.modelValue === 'string') {
          const date = new Date(props.modelValue);
          if (!isNaN(date.getTime())) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
          }
        }
        return null;
      },
      set(value) {
        emit('update:modelValue', value)
      }
    })
    const formattedShortDate = computed(() => {
      if (!selectedDate.value) return t('app.selectDate')
      try {
        const date = new Date(selectedDate.value + 'T00:00:00')
        const day = String(date.getDate()).padStart(2, '0')
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const year = String(date.getFullYear()).slice(-2)
        return `${day}/${month}/${year}`
      } catch (error) {
        return t('app.selectDate')
      }
    })
    return { theme, t, showDialog, selectedDate, formattedShortDate }
  },
  data() {
    return {
      // selectedDateDisplay: '' // Removed to avoid conflict with computed property
    }
  },
  computed: {
    selectedDateDisplay() {
      if (!this.selectedDate) return '';
      
      try {
        const date = new Date(this.selectedDate + 'T00:00:00');
        return date.toLocaleDateString('ru-RU', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      } catch (error) {
        console.error('Error formatting date display:', error);
        return this.selectedDate;
      }
    },
    formattedDate() {
      if (!this.selectedDate) return '';
      
      try {
        const date = new Date(this.selectedDate + 'T00:00:00');
        return date.toLocaleDateString('ru-RU', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      } catch (error) {
        console.error('Error formatting date:', error);
        return this.selectedDate;
      }
    }
  },
  methods: {
    onDateChange() {
      this.$emit('date-change');
    },
    clearFilter() {
      this.selectedDate = null;
      this.$emit('update:modelValue', null);
      this.$emit('date-change');
    }
  }
}
</script>

<style scoped>
.calendar-button-container {
  /* Убираем фиксированное позиционирование */
}

.calendar-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border-radius: 12px;
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(44, 62, 80, 0.1);
  background: var(--v-theme-surface);
  border: 2px solid rgba(44, 62, 80, 0.18);
}

@media (prefers-color-scheme: dark) {
  .calendar-btn {
    border: 2px solid rgba(200, 220, 255, 0.22);
  }
}

.calendar-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(44, 62, 80, 0.15);
}

.calendar-icon {
  font-size: 20px;
  color: #3498db;
}

.date-text {
  font-size: 14px;
  font-weight: 600;
  color: var(--v-theme-on-surface);
  min-width: 60px;
  text-align: center;
}

.arrow-icon {
  font-size: 16px;
  color: #3498db;
  transition: transform 0.3s ease;
}

.calendar-btn:hover .arrow-icon {
  transform: translateX(2px);
}

.calendar-dialog {
  border-radius: 16px;
  overflow: hidden;
  max-height: 90vh;
}

.dialog-title {
  background: var(--v-theme-surface);
  color: var(--v-theme-on-surface);
  font-weight: 600;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid rgba(44, 62, 80, 0.1);
  font-size: 1.1rem;
}

.close-btn {
  color: var(--v-theme-on-surface);
}

.dialog-content {
  padding: 16px 20px;
  background: var(--v-theme-surface);
  max-height: calc(90vh - 120px);
  overflow-y: auto;
}

.calendar-picker {
  background: var(--v-theme-surface);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(44, 62, 80, 0.1);
  border: 1px solid rgba(44, 62, 80, 0.1);
  transition: all 0.3s ease;
}

@media (prefers-color-scheme: dark) {
  .calendar-picker {
    border: 1px solid rgba(200, 220, 255, 0.15);
  }
}

.calendar-picker:hover {
  box-shadow: 0 4px 12px rgba(44, 62, 80, 0.15);
}

.calendar-picker :deep(.v-date-picker-header) {
  padding: 12px;
  background-color: #f8f9fa;
  border-bottom: 1px solid rgba(44, 62, 80, 0.05);
  display: none; /* Скрываем весь блок заголовка */
}

.calendar-picker :deep(.v-date-picker-header__title) {
  font-size: 1rem;
  font-weight: 600;
  color: #2c3e50;
  display: none; /* Скрываем заголовок календаря */
}

.calendar-picker :deep(.v-date-picker-table) {
  padding: 6px;
}

.calendar-picker :deep(.v-date-picker-table__current) {
  color: #3498db;
  font-weight: 600;
}

.calendar-picker :deep(.v-date-picker-table__day) {
  border-radius: 6px;
  transition: all 0.2s ease;
  font-size: 0.9rem;
}

.calendar-picker :deep(.v-date-picker-table__day:hover) {
  background-color: rgba(52, 152, 219, 0.1);
}

.calendar-picker :deep(.v-date-picker-table__day--selected) {
  background-color: #3498db !important;
  color: white !important;
}

.calendar-picker :deep(.v-date-picker-table__day--selected:hover) {
  background-color: #2980b9 !important;
}

.calendar-picker :deep(.v-date-picker-table__day--disabled) {
  color: #bdc3c7 !important;
}

.calendar-picker :deep(.v-date-picker-table__day--adjacent-month) {
  color: #95a5a6;
}

.calendar-picker :deep(.v-date-picker-table__weekday) {
  color: #7f8c8d;
  font-weight: 500;
  font-size: 0.8rem;
}

.calendar-picker :deep(.v-date-picker-table__month) {
  color: #2c3e50;
  font-weight: 500;
}

.calendar-picker :deep(.v-date-picker-table__month--selected) {
  background-color: #3498db !important;
  color: white !important;
}

.calendar-picker :deep(.v-date-picker-table__month:hover) {
  background-color: rgba(52, 152, 219, 0.1);
}

.selected-date-display {
  margin-top: 12px;
}

.dialog-actions {
  padding: 12px 20px;
  background: var(--v-theme-surface);
  border-top: 1px solid rgba(44, 62, 80, 0.1);
}

.clear-btn {
  margin-right: 8px;
}

@media (max-width: 768px) {
  .calendar-btn {
    padding: 2px 4px;
    margin-left: 0px;
    margin-top: 6px;
    /*gap: 4px; */   
  }
  
  .date-text {
    font-size: 10px;
    min-width: 30px;    
  }
  
  .calendar-icon {
    font-size: 18px;
    display: none;
  }
  
  .arrow-icon {
    font-size: 14px;
  }

  .calendar-dialog {
    border-radius: 0;
    height: 100vh;
    display: flex;
    flex-direction: column;
    max-height: 100vh;
}

  .dialog-title {
    padding: 12px 16px;
    font-size: 1rem;
  }

  .dialog-content {
    padding: 12px 16px;
    flex: 1;
    overflow-y: auto;
    max-height: none;
  }

  .calendar-picker {
    border-radius: 6px;
    border: 1px solid rgba(44, 62, 80, 0.1);
}

  .calendar-picker :deep(.v-date-picker-header) {
  padding: 8px;
}

  .calendar-picker :deep(.v-date-picker-header__title) {
    font-size: 0.9rem;
}

  .calendar-picker :deep(.v-date-picker-table) {
    padding: 4px;
}

  .calendar-picker :deep(.v-date-picker-table__day) {
    border-radius: 4px;
    font-size: 0.8rem;
}

  .calendar-picker :deep(.v-date-picker-table__weekday) {
    font-size: 0.7rem;
}

  .selected-date-display {
    margin-top: 8px;
}

  .dialog-actions {
    padding: 8px 16px;
}
}
</style> 
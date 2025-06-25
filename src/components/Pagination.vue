<template>
  <div class="pagination">
    <button @click="prevPage" :disabled="currentPage === 1">&lt;</button>
    <span class="page-numbers">
      <button
        v-for="page in totalPages"
        :key="page"
        :class="{ active: page === currentPage }"
        @click="changePage(page)"
      >
        {{ page }}
      </button>
    </span>
    <button @click="nextPage" :disabled="currentPage === totalPages">
      &gt;
    </button>
  </div>
</template>

<script>
export default {
  props: {
    currentPage: {
      type: Number,
      required: true,
    },
    totalPages: {
      type: Number,
      required: true,
    },
  },
  methods: {
    changePage(page) {
      this.$emit("update:currentPage", page);
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.$emit("update:currentPage", this.currentPage - 1);
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.$emit("update:currentPage", this.currentPage + 1);
      }
    },
  },
};
</script>

<style scoped>
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  gap: 8px;
}

.pagination button {
  padding: 8px 12px;
  border: 1px solid #ddd;
  background-color: var(--v-theme-surface);
  cursor: pointer;
  border-radius: 4px;
  min-width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  transition: all 0.3s;
  color: var(--v-theme-text);
}

.pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination button:not(:disabled):hover {
  background-color: #f5f5f5;
}

.pagination button.active {
  background-color: var(--v-theme-primary);
  color: var(--v-theme-on-primary, #fff);
  border-color: var(--v-theme-primary);
}

.page-numbers {
  display: flex;
  gap: 4px;
}
</style>
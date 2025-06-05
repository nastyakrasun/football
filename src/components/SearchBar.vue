<template>
  <div class="search-bar">
    <!-- Поле поиска -->
    <input
      type="text"
      v-model="searchQuery"
      placeholder="Поиск..."
      @input="onInput"
    />
    <!-- Результаты поиска -->
    <ul v-if="filteredResults.length" class="search-results">
      <li
        v-for="result in filteredResults"
        :key="result.id"
        @click="selectResult(result)"
      >
        {{ result.name }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "SearchBar",
  props: {
    // Передаваемый список данных для поиска (команды или лиги)
    items: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      searchQuery: "", // текущий ввод пользователя
      filteredResults: [], // результаты фильтрации
    };
  },
  methods: {
    onInput() {
      const query = this.searchQuery.toLowerCase();
      if (query.length === 0) {
        this.filteredResults = [];
        return;
      }
      // Фильтрация элементов по совпадению с поисковым запросом
      this.filteredResults = this.items.filter((item) =>
        item.name.toLowerCase().includes(query)
      );
    },
    selectResult(result) {
      // Передача выбранного результата родительскому компоненту
      this.$emit("select", result);
      // Очистка поля поиска и результатов
      this.searchQuery = "";
      this.filteredResults = [];
    },
  },
};
</script>

<style scoped>
.search-bar {
  position: relative;
  width: 300px; /* ширина поля поиска */
}

input[type="text"] {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}

.search-results {
  position: absolute;
  top: 100%;
  max-height: 200px;
  overflow-y: auto;
  background-color: #fff;
  border: #bbb;
  border-top: none;
  list-style-type: none;
}

.search-results li {
  padding: 8px;
  cursor: pointer;
}

.search-results li:hover {
  background-color: #bbb;
}
</style>

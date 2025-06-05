<template>
  <div class="leagues-wrapper">
    <!-- Контейнер с grid для заполнения всего экрана -->
    <div class="grid-container">
      <div
        v-for="league in paginatedLeagues"
        :key="league.id"
        class="league-block"
      >
        <div class="league-info">
          <div class="league-name">{{ league.name }}</div>
          <div class="league-country">{{ league.country }}</div>
        </div>
      </div>
    </div>

    <!-- Навигация по страницам -->
    <div class="pagination">
      <button @click="prevPage" :disabled="currentPage === 1">&lt;</button>

      <span class="page-numbers">
        <button
          v-for="page in totalPages"
          :key="page"
          @click="goToPage(page)"
          :class="{ active: page === currentPage }"
        >
          {{ page }}
        </button>
      </span>

      <button @click="nextPage" :disabled="currentPage === totalPages">&gt;</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FootballLeagues',
  props: {
    searchQuery: String,
  },
  data() {
    return {
      leagues: [
        { id:1, name:'Лига чемпионов', country:'Европа' },
        { id:2, name:'Лига Европы', country:'Европа' },
        { id:3, name:'Азиатская лига', country:'Азия' },
        { id:4, name:'Африканская лига', country:'Африка' },
        { id:5, name:'Латинская Америка', country:'Америка' },
        { id:6, name:'Североамериканская лига', country:'Америка' },
        { id:7, name:'Австралийская лига', country:'Австралия' },
        { id:8, name:'Кубковая лига', country:'Европа' },
        { id:9, name:'Международная лига', country:'Мир' },
        { id:10, name:'Международная лига', country:'Мир' },
        { id:11, name:'Лига чемпионов', country:'Европа' },
        { id:12, name:'Лига Европы', country:'Европа' },
        { id:13, name:'Азиатская лига', country:'Азия' },
        { id:14, name:'Африканская лига', country:'Африка' },
        { id:15, name:'Латинская Америка', country:'Америка' },
        { id:16, name:'Североамериканская лига', country:'Америка' },
        { id:17, name:'Австралийская лига', country:'Австралия' },
        { id:18, name:'Кубковая лига', country:'Европа' },
        { id:19, name:'Международная лига', country:'Мир' },
      ],
      currentPage: 1,
      itemsPerPage: 9,
    };
  },
  computed: {
    filteredLeagues() {
      if (!this.searchQuery) return this.leagues;
      const q = this.searchQuery.toLowerCase();
      return this.leagues.filter(
        (l) =>
          l.name.toLowerCase().includes(q) ||
          l.country.toLowerCase().includes(q)
      );
    },
    totalPages() {
      return Math.ceil(this.filteredLeagues.length / this.itemsPerPage);
    },
    paginatedLeagues() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredLeagues.slice(start, end);
    },
  },
  methods: {
    nextPage() {
      if (this.currentPage < this.totalPages) this.currentPage++;
    },
    prevPage() {
      if (this.currentPage > 1) this.currentPage--;
    },
    goToPage(page) {
      if (page >= 1 && page <= this.totalPages) this.currentPage = page;
    },
  },
};
</script>

<style scoped>
.leagues-wrapper {
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding: 10px; /* внутренний отступ */
}

/* Контейнер с grid занимает всё доступное пространство */
.grid-container {
  display: grid; /* растягивается по вертикали */
  grid-template-columns: repeat(3, 1fr);
  gap: 15px; /* интервал между блоками лиг */
  flex-grow: 1; /* растягивается по высоте */
  }

/* Блоки лиг */
.league-block {
  border: 1px solid #ccc;
  display:flex;
  align-items:center;
  justify-content:center;  
  padding:10px;  
  background-color:#f9f9f9;  
  border-radius:8px;
}

.league-info {
  display:flex;
  flex-direction: column;
  align-items:center; /* центрируем содержимое по горизонтали */
}

.league-name {
  font-weight:bold;
}

.league-country {
  margin-top:8px; /* отступ сверху для разделения */
}

/* Стиль пагинации */
.pagination {
  margin-top: auto; /* чтобы расположить снизу */
  padding-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px; /* отступы между кнопками */
}

.page-numbers button {
  margin-right: 5px;
  padding: 5px 10px;
  border: none;
  background: #ddd;
  border-radius: 4px;
  cursor: pointer;
  transition: 0.2s all;
}

.page-numbers button.active {
  font-weight:bold;
}

.page-numbers button:hover:not(:disabled),
.page-numbers button.active {
  background: #bbb;
  font-weight: bold;
}

button[disabled] {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>

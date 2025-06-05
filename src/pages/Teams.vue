<template>
  <div class="teams-wrapper">
    <!-- Сетка команд -->
    <div class="grid-container">
      <div v-for="team in paginatedTeams" :key="team.id" class="team-block">
        <div class="team-name">{{ team.name }}</div>
        <div class="image-container">
          <img :src="team.image" alt="Логотип команды" class="team-logo" />
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

      <button @click="nextPage" :disabled="currentPage === totalPages">
        &gt;
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "FootballTeams",
  props: {
    searchQuery: String,
  },
  data() {
    return {
      teams: [
        {
          id: 101,
          name: "Барселона",
          image:
            "https://upload.wikimedia.org/wikipedia/commons/4/47/FC_Barcelona_%28crest%29.svg",
        },
        {
          id: 102,
          name: "Реал Мадрид",
          image:
            "https://upload.wikimedia.org/wikipedia/en/9/9a/Real_Madrid_CF.svg",
        },
        {
          id: 103,
          name: "Манчестер Юнайтед",
          image:
            "https://upload.wikimedia.org/wikipedia/en/7/7a/Manchester_United_FC_crest.svg",
        },
        {
          id: 104,
          name: "Ливерпуль",
          image:
            "https://upload.wikimedia.org/wikipedia/en/0/0c/Liverpool_FC.svg",
        },
        {
          id: 105,
          name: "Бавария",
          image:
            "https://upload.wikimedia.org/wikipedia/en/1/1f/FC_Bayern_München_logo_%282017%29.svg",
        },
        {
          id: 106,
          name: "Ювентус",
          image:
            "https://upload.wikimedia.org/wikipedia/en/1/15/Juventus_F.C._logo.svg",
        },
        {
          id: 107,
          name: "ПСЖ",
          image:
            "https://upload.wikimedia.org/wikipedia/en/a/a7/Paris_Saint-Germain_F.C..svg",
        },
        {
          id: 108,
          name: "Челси",
          image:
            "https://upload.wikimedia.org/wikipedia/en/c/cc/Chelsea_crest.svg",
        },
        {
          id: 109,
          name: "Милан",
          image:
            "https://upload.wikimedia.org/wikipedia/en/d/d0/A.C._Milan_logo.svg",
        },
        {
          id: 110,
          name: "Барнсли",
          image:
            "https://upload.wikimedia.org/wikipedia/en/e/e4/Barnsley_F.C._logo.svg",
        },
        {
          id: 111,
          name: "Арсенал",
          image:
            "https://upload.wikimedia.org/wikipedia/en/c/cd/Arsenal_FC_crest.svg",
        },
        {
          id: 112,
          name: "Боруссия Дортмунд",
          image:
            "https://upload.wikimedia.org/wikipedia/en/d/d4/Borussia_Dortmund_logo.svg",
        },
        {
          id: 113,
          name: "Интер Милан",
          image:
            "https://upload.wikimedia.org/wikipedia/en/9/9f/Inter_Milan_logo.svg",
        },
        {
          id: 114,
          name: "Атлетико Мадрид",
          image:
            "https://upload.wikimedia.org/wikipedia/en/f/f4/Athletic_Bilbao_logo.svg",
        },
        {
          id: 115,
          name: "Лион",
          image:
            "https://upload.wikimedia.org/wikipedia/en/c/c3/Olympique_Lyonnais.png",
        },
        {
          id: 116,
          name: "Марсель",
          image:
            "https://upload.wikimedia.org/wikipedia/en/c/cf/Olympique_Marseille_logo.png",
        },
        {
          id: 117,
          name: "Порту",
          image: "https://upload.wikimedia.org/wikipedia/en/f/fb/FCPorto.png",
        },
        {
          id: 118,
          name: "Бенфика",
          image:
            "https://upload.wikimedia.org/wikipedia/en/e/e0/Sporting_CP_logo.png",
        },
        {
          id: 119,
          name: "Зальцбург",
          image:
            "https://upload.wikimedia.org/wikipedia/en/e/e2/RB_Salzburg_logo.png",
        },
        {
          id: 120,
          name: "Аякс",
          image:
            "https://upload.wikimedia.org/wikipedia/en/c/cd/Ajax_Amsterdam.png",
        },
      ],
      currentPage: 1,
      itemsPerPage: 10,
    };
  },
  computed: {
    filteredTeams() {
      if (!this.searchQuery) return this.teams;
      const query = this.searchQuery.toLowerCase();
      return this.teams.filter((team) =>
        team.name.toLowerCase().includes(query)
      );
    },
    totalPages() {
      return Math.ceil(this.filteredTeams.length / this.itemsPerPage);
    },
    paginatedTeams() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredTeams.slice(start, end);
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
html,
body {
  height: 100%;
}

.teams-wrapper {
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding: 10px; /* внутренний отступ */
}

/* Контейнер сетки команд */
.grid-container {
  display: grid; /* растягивается по вертикали */
  grid-template-columns: repeat(5, 1fr);
  gap: 15px; /* интервал между блоками команд */
  flex-grow: 1; /* растягивается по высоте */
  }

/* Блоки команд */
.team-block {
  display: flex;
  flex-direction: column;
  height: auto; /* фиксированная высота для одинаковых блоков */
  background-color:#f9f9f9;
  /* background: #f0f0f0; */
  border: 1px solid #ccc;
  border-radius: 8px;
  padding-top: 20px; /* отступ сверху для имени */
  display: flex; /* для равных высот используем flex и выравнивание */
  flex-direction: flex-column;
  justify-content: flex-start; /* чтобы имя было сверху */
  align-items: center; /* центрирование изображения по вертикали внутри блока */
}

/* Имя команды */
.team-name {
  margin-top: 10px;
  margin-bottom: 10px;
  font-weight: bold;
  text-align: center;
}

/* Контейнер для изображения */
.image-container {
  flex-grow: auto; /* занимает оставшееся пространство между именем и изображением */
  display: flex;
  align-items: center; /* вертикальное центрирование изображения внутри контейнера */
  justify-content: center; /* горизонтальное центрирование — чтобы изображение было по центру */
  padding-top: 40px; /* добавление отступов */
  height: 100px; /* задание фиксированной высоты для равных размеров */
}

/* Само изображение команды */
.team-logo {
  max-width: 100px;
  height: auto;
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

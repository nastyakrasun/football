<template>
  <div style="display: flex; flex-direction: column; height: 100vh">
    <!-- Шапка -->
    <header
      style="
        display: flex;
        justify-content: left;
        align-items: center;
        padding: 10px;
        background-color: #f0f0f0;
      "
    >
      <div style="display: flex; align-items: center;">
        <img src="./assets/logo.png" alt="Логотип" style="height:40px;" />
      </div>
      <!-- Навигация -->
      <nav style="margin: 10px 0; padding: 0 10px">
        <button @click="currentPage='Лиги'">Лиги</button>
        <button @click="currentPage='Команды'" style="margin-left: 10px">
          Команды
        </button>
      </nav>
    </header>

    <!-- Поле поиска -->
    <div style="display:flex; justify-content:left; padding:10px;">
      <!-- Передача данных -->
      <input
        type="text"
        placeholder="Поиск..."
        v-model="searchQuery"
        style="padding:5px; width:300px; margin-left:10px;"
      />
    </div>

    <!-- Основной контент -->
    <main style="flex:1; display:flex; flex-direction:column;">
      <component
        :is="currentComponent"
        :searchQuery="searchQuery"
        @select-item="handleSelect"
        style="flex:1;"
      />
    </main>
  </div>
</template>

<script>
// Импорт компонентов
import SearchBar from './components/SearchBar.vue';
import Leagues from './pages/Leagues.vue';
import Teams from './pages/Teams.vue';

export default {
  components: {
    SearchBar,
    Leagues,
    Teams,
  },
  data() {
    return {
      currentPage: 'Лиги',
      searchQuery: '',
    };
  },
  computed: {
    currentComponent() {
      return this.currentPage === 'Лиги' ? 'Leagues' : 'Teams';
    },
    currentItems() {
      // Передаем в SearchBar список данных в зависимости от страницы
      if (this.currentPage === 'Лиги') {
        return [];
      } else if (this.currentPage === 'Команды') {
        return [];
      }
      return [];
    },
  },
  // methods: {
  //   handleSelect(item) {
  //     alert(`Вы выбрали ${item.name}`);
  //   },
  // },
};
</script>

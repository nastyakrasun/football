<!--serves as the root route (/) of application, renders the Leagues component, which displays a list of football leagues!-->More actions
<!-- то, что мы видим на главной странице -->
<template> <!-- элемент, в котором показывается основной шаблон, который отображает мои данные -->
  <div class="home-page">
    <!-- Секция Hero -->
    <section class="hero">
      <div class="hero-content">
        <h1>Добро пожаловать в SoccerStat</h1>
        <p>ваш главный источник информации о спортивной статистике</p>
        <div class="hero-buttons">
          <v-btn
            color="primary"
            size="large"
            @click="$router.push('/leagues')"
          >
            Список лиг
          </v-btn>
          <v-btn
            color="secondary"
            size="large"
            @click="$router.push('/teams')"
          >
            Список команд
          </v-btn>
        </div>
      </div>
    </section>

    <!-- Фичи -->
    <section class="features">
      <h2>Мы предлагаем</h2>
      <div class="features-grid">
        <v-card
          v-for="feature in features"
          :key="feature.title"
          class="feature-card"
          @click="$router.push(feature.route)"
        >
          <v-card-text>
            <!-- v-icon component designed to work with icon fonts (like Material Design Icons) -->
            <v-icon
              :icon="feature.icon"
              size="48"
              color="primary"
              class="feature-icon"
            ></v-icon>
            <!-- v-img instead of v-icon component to use image files -->
            <!-- <v-img
              :src="feature.icon"
              width="48"
              height="48"
              class="feature-icon mx-auto"
            ></v-img>  -->
            <h3>{{ feature.title }}</h3>
            <p>{{ feature.description }}</p>
          </v-card-text>
        </v-card>
      </div>
    </section>
  </div>
</template>

<script> // описываются действия, которые необходимо будет сделать для того, чтобы приложние работало
export default {
  name: 'HomePage',
  data() {
    return {
      features: [
        {
          icon: 'mdi-trophy',
          //icon: 'free-icon-football-club-919408.png',
          title: 'Лиги',
          description: 'Ознакомиться с футбольными лигами',
          route: '/leagues'
        },
        {
          icon: 'mdi-account-group',
          //icon: 'free-icon-soccer-player-919397.png',
          title: 'Команды',
          description: 'Просмотреть матчи и статистику команд',
          route: '/teams'
        }
      ]
    }
  }
}
</script>

<style scoped> /* прописываются параметры css */
.home-page {
  max-width: 1200px; /* максимальная ширина страницы */
  margin: 0 auto; /* центрирование страницы по горизонтали */
  padding: 1rem 1rem; /* добавление отступов вокруг содержимого */
  background-color: var(--v-theme-background);
}

.hero {
  text-align: center;
  padding: 3rem 1rem;
  background: linear-gradient(135deg, #2c3e50 0%, #3498db 100%);
  color: white;
  border-radius: 12px;
  margin-bottom: 2rem;
  box-shadow: 0 4px 15px rgba(44, 62, 80, 0.1);
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
}

.hero h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
  font-weight: 700;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

.hero p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.hero-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.features {
  margin-bottom: 2rem;
  padding: 2rem 0;
}

.features h2 {
  text-align: center;
  font-size: 2rem;
  margin-bottom: 2rem;
  color: #2c3e50;
  font-weight: 600;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  padding: 1rem;
}

.feature-card {
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
  background: var(--v-theme-surface);
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(44, 62, 80, 0.1);
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(44, 62, 80, 0.15);
  border-color: #3498db;
}

.feature-icon {
  margin-bottom: 1.5rem;
  color: #3498db;
}

.feature-card h3 {
  font-size: 1.5rem;
  margin-bottom: 0.75rem;
  color: #2c3e50;
  font-weight: 600;
}

.feature-card p {
  color: #7f8c8d;
  line-height: 1.6;
  padding: 0 1rem;
}

.quick-access {
  margin-bottom: 2rem;
  padding: 2rem 0;
  background-color: var(--v-theme-surface);
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(44, 62, 80, 0.05);
}

.quick-access h2 {
  text-align: center;
  font-size: 2rem;
  margin-bottom: 1.5rem;
  color: #2c3e50;
  font-weight: 600;
}

.quick-access-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  padding: 1rem;
}

.quick-access-card {
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
  background: #f8f9fa;
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid rgba(44, 62, 80, 0.1);
}

.quick-access-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(44, 62, 80, 0.15);
  border-color: #3498db;
}

.quick-access-card h3 {
  font-size: 1.2rem;
  margin: 1rem 0 0.5rem;
  color: #2c3e50;
  font-weight: 600;
}

.quick-access-card p {
  color: #7f8c8d;
  font-size: 0.9rem;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .hero h1 {
    font-size: 2rem;
  }

  .hero p {
    font-size: 1rem;
  }

  .hero-buttons {
    flex-direction: column; /* Stacks buttons vertically on mobile */
    align-items: center; /* Centers buttons horizontally */
    gap: 1rem;
  }

  .hero-buttons .v-btn {
    width: 100%;
    max-width: 280px;
  }

  .features-grid,
  .quick-access-grid {
    grid-template-columns: 1fr;
  }
  
  .feature-card,
  .quick-access-card {
    margin: 0 1rem;
  }
}

/* Add custom style for turquoise button */
.v-btn[color='turquose'] {
  background: linear-gradient(90deg, #2ec4b6, #259ea6);
  color: #fff !important;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(44, 62, 80, 0.10);
  border-radius: 8px;
  transition: background 0.2s, box-shadow 0.2s;
}
.v-btn[color='turquose']:hover {
  background: linear-gradient(90deg, #259ea6, #2ec4b6);
  box-shadow: 0 4px 16px rgba(44, 62, 80, 0.18);
}

.v-btn[color='custom-turquoise'] {
  background: linear-gradient(90deg, #2ec4b6 60%, #b0bec5 100%);
  color: #fff !important;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(44, 62, 80, 0.10);
  border-radius: 8px;
  transition: background 0.2s, box-shadow 0.2s;
}
.v-btn[color='custom-turquoise']:hover {
  background: linear-gradient(90deg, #b0bec5 0%, #2ec4b6 100%);
  box-shadow: 0 4px 16px rgba(44, 62, 80, 0.18);
}
</style>
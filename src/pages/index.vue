<!--serves as the root route (/) of application, renders the Leagues component, which displays a list of football leagues!-->
<template>
  <div class="home-page">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-content">
        <h1>Добро пожаловать в Football Stats</h1>
        <p>ваш главный источник информации о футбольной статистике</p>
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
            <v-icon
              :icon="feature.icon"
              size="48"
              color="primary"
              class="feature-icon"
            ></v-icon>
            <h3>{{ feature.title }}</h3>
            <p>{{ feature.description }}</p>
          </v-card-text>
        </v-card>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'HomePage',
  data() {
    return {
      features: [
        {
          icon: 'mdi-trophy',
          title: 'Лиги',
          description: 'Ознакомиться со всеми доступными футбольными лигами',
          route: '/leagues'
        },
        {
          icon: 'mdi-account-group',
          title: 'Команды',
          description: 'Просмотреть профили команд и статистику',
          route: '/teams'
        }
      ]
    }
  }
}
</script>

<style scoped>
.home-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 1rem;
}

.hero {
  text-align: center;
  padding: 3rem 1rem;
  background: linear-gradient(135deg, #1976d2 0%, #2196f3 100%);
  color: white;
  border-radius: 8px;
  margin-bottom: 2rem;
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
}

.hero h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
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
  margin-bottom: 1.5rem;
}

.features h2 {
  text-align: center;
  font-size: 2rem;
  margin-bottom: 1.5rem;
  color: #1976d2;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.feature-card {
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  text-align: center;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.feature-icon {
  margin-bottom: 1rem;
}

.feature-card h3 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: #1976d2;
}

.feature-card p {
  color: #666;
}

.quick-access {
  margin-bottom: 1rem;
}

.quick-access h2 {
  text-align: center;
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #1976d2;
}

.quick-access-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.quick-access-card {
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  text-align: center;
}

.quick-access-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.quick-access-card h3 {
  font-size: 1.2rem;
  margin: 1rem 0 0.5rem;
  color: #1976d2;
}

.quick-access-card p {
  color: #666;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .hero h1 {
    font-size: 2rem;
  }

  .hero p {
    font-size: 1rem;
  }

  .hero-buttons {
    flex-direction: column;
  }

  .features-grid,
  .quick-access-grid {
    grid-template-columns: 1fr;
  }
}
</style>
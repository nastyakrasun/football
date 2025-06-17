<template>
  <footer class="app-footer">
    <v-container>
      <div class="footer-content">
        <!-- Секция о нас -->
        <div class="footer-section">
          <h3>О нас</h3>
          <p>Предоставляем информацию о футбольных матчах в рамках лиги (соревнований) и матчах команд в режиме реального времени
            </p>
        </div>

        <!-- Секция перехода -->
        <div class="footer-section">
          <h3>Перейти</h3>
          <ul class="footer-links">
            <li><router-link to="/leagues">Лиги</router-link></li>
            <li><router-link to="/teams">Команды</router-link></li>
          </ul>
        </div>

        <!-- Секция обратной связи -->
        <div class="footer-section">
          <h3>Контакты</h3>
          <p>Email: info@soccerstat.com</p>
          <div class="social-links">
            <v-btn icon href="https://vk.com" target="_blank" rel="noopener noreferrer">
              <v-icon>mdi-vk</v-icon>
            </v-btn>
            <v-btn icon href="https://t.me" target="_blank" rel="noopener noreferrer">
              <v-icon>mdi-telegram</v-icon>
            </v-btn>
            <v-btn icon href="https://wa.me" target="_blank" rel="noopener noreferrer">
              <v-icon>mdi-whatsapp</v-icon>
            </v-btn>            
          </div>
        </div>
      </div>

      <!-- Авторское право -->
      <div class="footer-bottom">
        <p>&copy; {{ new Date().getFullYear() }} SoccerStat. Все права защищены.</p>
      </div>
    </v-container>
  </footer>
</template>

<script>
export default {
  name: 'AppFooter'
}
</script>

<style scoped>
.app-footer {
  background-color: #2c3e50;
  color: white;
  padding: 3rem 0 1.5rem;
  margin-top: 2rem;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.footer-section h3 {
  color: #3498db;
  margin-bottom: 1.25rem;
  font-size: 1.3rem;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.footer-section p {
  color: #ecf0f1;
  line-height: 1.7;
  opacity: 0.9;
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-links li {
  margin-bottom: 0.75rem;
}

.footer-links a {
  color: #ecf0f1;
  text-decoration: none;
  transition: all 0.3s ease;
  opacity: 0.9;
  font-size: 1.05rem;
  display: inline-block;
}

.footer-links a:hover {
  color: #3498db;
  opacity: 1;
  transform: translateX(5px);
}

.social-links {
  display: flex;
  gap: 1rem;
  margin-top: 1.25rem;
}

.social-links .v-btn {
  background-color: rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.social-links .v-btn:hover {
  background-color: #3498db;
  transform: translateY(-3px);
}

.social-links .v-icon {
  color: white;
}

.footer-bottom {
  text-align: center;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  color: #ecf0f1;
  opacity: 0.8;
  font-size: 0.95rem;
}

@media (max-width: 768px) {
  .app-footer {
    padding: 2rem 1rem 1rem;
  }

  .footer-content {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 2rem;
  }

  .footer-links a:hover {
    transform: none;
  }

  .social-links {
    justify-content: center;
  }

  .footer-section {
    padding: 0 1rem;
  }
}
</style>

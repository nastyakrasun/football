<template>
  <footer class="app-footer">
    <v-container>
      <div class="footer-content">
        <!-- Секция о нас -->
        <div class="footer-section">
          <h3>О нас</h3>
          <p>Предоставляем информацию о футбольных лигах, командах, матчах и игроках в режиме реального времени</p>
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
          <p>Email: info@footballstats.com</p>
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
        <p>&copy; {{ new Date().getFullYear() }} Football Stats. Все права защищены.</p>
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
  background-color: #f5f5f5;
  padding: 1rem 0 1rem;
  margin-top: 0.5rem;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
}

.footer-section h3 {
  color: #1976d2;
  margin-bottom: 1rem;
  font-size: 1.2rem;
}

.footer-section p {
  color: #666;
  line-height: 1.6;
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-links li {
  margin-bottom: 0.5rem;
}

.footer-links a {
  color: #666;
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer-links a:hover {
  color: #1976d2;
}

.social-links {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.footer-bottom {
  text-align: center;
  padding-top: 1.5rem;
  border-top: 1px solid #ddd;
  color: #666;
}

@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .social-links {
    justify-content: center;
  }
}
</style>

<template>
  <footer class="app-footer-mobile">
    <nav class="footer-nav">
      <v-btn class="footer-btn" variant="text" @click="favoritesDialog = true">
        <v-icon size="22">mdi-star</v-icon>
      </v-btn>
      <v-btn class="footer-btn" variant="text">
        <v-icon size="22">mdi-newspaper-variant-outline</v-icon>
      </v-btn>
      <v-btn class="footer-btn" variant="text" @click="profileDialog = true">
        <v-icon size="22">mdi-account</v-icon>
      </v-btn>
      <v-btn class="footer-btn" variant="text" @click="dialog = true">
        <v-icon size="22">mdi-cog</v-icon>
      </v-btn>
      <v-dialog v-model="favoritesDialog" width="340" persistent>
        <template #default>
          <div class="footer-favorites-modal">
            <div class="footer-favorites-header">
              <span>Избранное</span>
              <v-btn icon size="small" @click="favoritesDialog = false">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </div>
            <div class="footer-favorites-content">
              Здесь отображаются данные по выбранным лигам и командам
            </div>
          </div>
        </template>
      </v-dialog>
      <v-dialog v-model="dialog" width="340" persistent>
        <template #default>
          <div class="footer-settings-modal">
            <div class="footer-settings-header">
              <span>{{ $t('app.settings') }}</span>
              <v-btn icon size="small" @click="dialog = false">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </div>
            <div class="footer-settings-content">
              <LanguageChange />
              <ThemeChange />
            </div>
          </div>
        </template>
      </v-dialog>
      <v-dialog v-model="profileDialog" width="340" persistent>
        <template #default>
          <div class="footer-profile-modal">
            <div class="footer-profile-header">
              <span>Профиль</span>
              <v-btn icon size="small" @click="profileDialog = false">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </div>
            <div class="footer-profile-content">
              <v-icon class="profile-avatar-icon" size="80">mdi-account-circle</v-icon>
              <div class="profile-username">ИмяПользователя</div>
              <div class="profile-info-label">Личная информация</div>
              <!-- Здесь можно добавить больше информации -->
            </div>
          </div>
        </template>
      </v-dialog>
    </nav>
  </footer>
</template>

<script setup>
import { ref } from 'vue'
import LanguageChange from './LanguageChange.vue'
import ThemeChange from './ThemeChange.vue'

const dialog = ref(false)
const profileDialog = ref(false)
const favoritesDialog = ref(false)
</script>

<style scoped>
.app-footer-mobile {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background: #2c3e50;
  color: #fff;
  box-shadow: 0 -2px 12px rgba(44, 62, 80, 0.1);
  z-index: 1200;
  padding: 0;
}
.footer-nav {
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 60px;
}
.footer-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 0;
  color: #3498db;
  font-weight: 500;
  border-radius: 18px;
  padding: 0 8px;
  font-size: 12px;
  transition: background 0.2s, border-color 0.2s;
  border: 2px solid #3498db;
  background: transparent;
}
.footer-btn:active, .footer-btn--active {
  background: linear-gradient(135deg, #3498db, #2980b9);
  color: #fff;
  border-color: #2980b9;
}
.footer-btn:hover {
  background: rgba(52, 152, 219, 0.08);
  border-color: #2980b9;
}
.footer-favorites-modal {
  background: #2c3e50;
  border-radius: 18px;
  padding: 20px 18px 18px 18px;
  min-width: 280px;
  max-width: 340px;
  box-shadow: 0 4px 24px rgba(44, 62, 80, 0.18);
  color: #fff;
}
.footer-favorites-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #3498db;
}
.footer-favorites-content {
  font-size: 15px;
  font-weight: 500;
  color: #fff;
  margin-top: 8px;
}
.footer-settings-modal {
  background: #2c3e50;
  border-radius: 18px;
  padding: 20px 18px 18px 18px;
  min-width: 280px;
  max-width: 340px;
  box-shadow: 0 4px 24px rgba(44, 62, 80, 0.18);
  color: #fff;
}
.footer-settings-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #3498db;
}
.footer-settings-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.footer-profile-modal {
  background: #2c3e50;
  border-radius: 18px;
  padding: 20px 18px 18px 18px;
  min-width: 280px;
  max-width: 340px;
  box-shadow: 0 4px 24px rgba(44, 62, 80, 0.18);
  color: #fff;
}
.footer-profile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #3498db;
}
.footer-profile-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}
.profile-avatar {
  display: none;
}
.profile-avatar-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  color: #3498db;
  border: 3px solid #3498db;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
  font-size: 80px;
  box-sizing: border-box;
}
.profile-username {
  font-size: 20px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 4px;
}
.profile-info-label {
  font-size: 15px;
  font-weight: 500;
  color: #3498db;
  margin-top: 8px;
}
</style>

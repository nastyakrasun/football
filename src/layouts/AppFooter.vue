<template>
  <footer>
    <!-- Desktop Footer -->
    <div
      class="app-footer desktop-footer"
      :style="{ backgroundColor: footerBg }"
    >
      <v-container>
        <div class="footer-content">
          <!-- Секция о нас -->
          <div class="footer-section">
            <h3>{{ $t("app.about") }}</h3>
            <p>{{ $t("app.about_desc") }}</p>
          </div>
          <!-- Секция перехода -->
          <div class="footer-section">
            <h3>{{ $t("app.go_to") }}</h3>
            <ul class="footer-links">
              <li>
                <router-link to="/">{{ $t("app.home") }}</router-link>
              </li>
              <li>
                <router-link to="/leagues">{{ $t("app.leagues") }}</router-link>
              </li>
              <li>
                <router-link to="/teams">{{ $t("app.teams") }}</router-link>
              </li>
            </ul>
          </div>
          <!-- Секция обратной связи -->
          <div class="footer-section">
            <h3>{{ $t("app.contacts") }}</h3>
            <p>{{ $t("app.email") }}: info@soccerstat.com</p>
            <div class="social-links">
              <v-btn
                icon
                href="https://vk.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <title>{{ $t("app.social_vk") }}</title>
                  <path
                    d="M15.07 2H8.93C3.33 2 2 3.33 2 8.93v6.14C2 20.67 3.33 22 8.93 22h6.14c5.6 0 6.93-1.33 6.93-6.93V8.93C22 3.33 20.67 2 15.07 2zm3.48 14.27h-1.46c-.55 0-.71-.44-1.65-1.42-.86-.85-1.24-.95-1.45-.95-.31 0-.4.08-.4.52v1.3c0 .37-.12.56-1.04.56-1.53 0-3.23-.89-4.46-2.55-1.23-1.66-1.66-2.91-1.66-3.4 0-.19.08-.37.56-.37h1.46c.42 0 .57.19.73.63.72 2.08 1.92 3.91 2.42 3.91.19 0 .27-.08.27-.52V9.98c-.06-.95-.52-1.03-.52-1.36 0-.19.15-.37.39-.37h2.28c.33 0 .45.15.45.49v2.66c0 .28.14.37.23.37.19 0 .33-.09.65-.37 1.07-1.17 1.7-2.95 1.7-2.95.08-.19.25-.37.69-.37h1.46c.52 0 .63.26.52.56-.19.95-2.01 3.8-2.01 3.8-.15.23-.21.34 0 .6.15.23.66.63 1 1.04.62.72 1.08 1.33 1.21 1.74.19.49-.08.75-.56.75z"
                  />
                </svg>
              </v-btn>
              <v-btn
                icon
                href="https://t.me"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <title>{{ $t("app.social_telegram") }}</title>
                  <path
                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.02-1.96 1.25-5.54 3.69-.52.36-1 .53-1.42.52-.47-.01-1.37-.26-2.03-.48-.82-.27-1.47-.42-1.42-.88.03-.24.27-.48.74-.74 2.87-1.25 4.79-2.09 5.76-2.5 2.7-1.15 3.26-1.36 3.63-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"
                  />
                </svg>
              </v-btn>
              <v-btn
                icon
                href="https://wa.me"
                target="_blank"
                rel="noopener noreferrer"
              >
                <v-icon title="{{$t('app.social_whatsapp')}}"
                  >mdi-whatsapp</v-icon
                >
              </v-btn>
            </div>
          </div>
        </div>
        <!-- Авторское право -->
        <div class="footer-bottom">
          <p>
            &copy; {{ new Date().getFullYear() }} SoccerStat.
            {{ $t("app.copyright") }}
          </p>
        </div>
      </v-container>
    </div>
    <!-- Mobile Footer -->
    <div
      class="app-footer mobile-footer"
      :style="{ backgroundColor: headerBg }"
    >
      <div class="footer-middle-row">
        <v-text-field
          v-model="searchQuery"
          :placeholder="$t('app.search')"
          prepend-inner-icon="mdi-magnify"
          clearable
          hide-details
          density="compact"
          variant="outlined"
          class="search-field"
          @input="onSearch"
        ></v-text-field>
        <ThemeChange />
        <LanguageChange />
      </div>
    </div>
  </footer>
</template>

<script>
import ThemeChange from "../components/ThemeChange.vue";
import LanguageChange from "../components/LanguageChange.vue";
import { useTheme } from "vuetify";
import { computed } from "vue";

export default {
  name: "AppFooter",
  components: { ThemeChange, LanguageChange },
  emits: ["search"],
  setup() {
    const theme = useTheme();
    const footerBg = computed(() =>
      theme.global.name.value === "dark" ? "#2c3e50" : "white"
    );
    const headerBg = computed(() =>
      theme.global.name.value === "dark" ? "#2c3e50" : "white"
    );
    return { footerBg, headerBg };
  },
  data() {
    return {
      searchQuery: "",
    };
  },
  methods: {
    onSearch() {
      this.$emit("search", this.searchQuery);
    },
  },
};
</script>

<style scoped>
.app-footer.desktop-footer {
  background-color: #2c3e50 !important;
  padding: 3rem 0 1.5rem;
  margin-top: 2rem;
  display: block;
}
.app-footer.mobile-footer {
  display: none;
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

.social-links svg {
  color: white;
  fill: currentColor;
}

.footer-bottom {
  text-align: center;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  color: #ecf0f1;
  opacity: 0.8;
  font-size: 0.95rem;
}
.footer-middle-row {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.footer-middle-row :deep(.v-btn),
.footer-middle-row :deep(.v-btn .v-icon),
.footer-middle-row :deep(.v-btn span) {
  color: #3498db !important;
}

@media (max-width: 768px) {
  .app-footer.desktop-footer {
    display: none;
  }
  .app-footer.mobile-footer {
    display: block;
    border-top: 1px solid rgba(44, 62, 80, 0.1);
    box-shadow: 0 -2px 12px rgba(44, 62, 80, 0.08);
    padding: 0.5rem 1rem 1rem 1rem;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1000;
    opacity: 1;
    transition: background-color 0.3s;
  }
  .footer-middle-row {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    width: 100%;
    max-width: 400px;
    margin: 0 auto;
  }
  .search-field {
    width: 100%;
    max-width: 400px;
  }
  html,
  body {
    background: var(--v-theme-background, #f8f9fa) !important;
  }
}
</style>

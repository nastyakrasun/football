/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";

// Composables
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import { aliases, mdi } from "vuetify/iconsets/mdi";

// Locale add Russian locale support
import { ru, en } from "vuetify/locale";

export const vuetifyLocale = {
  locale: "ru",
  fallback: "en",
  messages: { ru, en },
};

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: "mdi",
    aliases,
    sets: {
      mdi,
    },
  },
  locale: vuetifyLocale,
  theme: {
    defaultTheme: "light",
    themes: {
      light: {
        dark: false,
        colors: {
          background: "#f8f9fa",
          surface: "#ffffff",
          primary: "#3498db",
          secondary: "#2c3e50",
          accent: "#2980b9",
          error: "#e74c3c",
          info: "#7f8c8d",
          success: "#27ae60",
          warning: "#f1c40f",
          text: "#2c3e50",
        },
      },
      dark: {
        dark: true,
        colors: {
          background: "#23272e",
          surface: "#2c3e50",
          primary: "#3498db",
          secondary: "#f8f9fa",
          accent: "#2980b9",
          error: "#e74c3c",
          info: "#bdc3c7",
          success: "#27ae60",
          warning: "#f1c40f",
          text: "#f8f9fa",
        },
      },
    },
  },
});

export default vuetify;

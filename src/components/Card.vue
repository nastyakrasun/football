<template>
  <v-card class="ma-2 card-root" @click="$emit('handle-card-click', { id })">
    <div class="card-content">
      <v-img
        class="grey lighten-2 card-img"
        contain
        :height="imgHeight"
        :src="image"
      />
      <div class="card-text-block">
        <v-card-title class="card-title">{{ name }}</v-card-title>
        <v-card-subtitle v-if="subtitle" class="card-subtitle">
          <template v-if="showPin">
            <img src="/src/assets/free-icon-pin-919412.png" alt="pin" class="pin-icon" />
          </template>
          {{ subtitle }}
        </v-card-subtitle>
      </div>
    </div>
  </v-card>
</template>

<script>
export default {
  name: 'Card',
  props: {
    id: {
      type: [Number, String],
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: () => '/src/assets/placeholder.svg',
    },
    subtitle: {
      type: String,
      default: '',
    },
    imgHeight: {
      type: [Number, String],
      default: 100,
    },
  },
  emits: ['handle-card-click'],
  computed: {
    showPin() {
      // Show pin only for league cards (when imgHeight is 100 and subtitle is present)
      return this.imgHeight == 100 && this.subtitle;
    }
  }
}
</script>

<style scoped>
.card-root {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  transition: transform 0.3s;
  margin-bottom: 16px;
  border-radius: 20px;
  overflow: hidden;
}
.card-root:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}
.card-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}
.card-img {
  width: 100%;
  max-width: 120px;
  min-width: 60px;
  object-fit: contain;
}
.card-text-block {
  width: 100%;
}
.card-title {
  font-size: 1.2rem;
  font-weight: bold;
  padding-bottom: 0;
  color: #3498db;
  text-align: center;
  white-space: normal;
  overflow: visible;
  text-overflow: unset;
}
.card-subtitle {
  padding-top: 0;
  font-size: 1rem;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  white-space: normal;
  overflow: visible;
  text-overflow: unset;
}
.pin-icon {
  width: 20px;
  height: 20px;
  margin-right: 4px;
}
@media (max-width: 600px) {
  .card-content {
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    padding-left: 12px;
  }
  .card-img {
    width: 70px;
    height: 70px !important;
    max-width: 70px;
    min-width: 50px;
    margin-right: 12px;
  }
  .card-text-block {
    width: auto;
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
  }
  .card-title, .card-subtitle {
    text-align: center;
    justify-content: center;
    align-items: center;
    width: 100%;
  }
}
</style> 
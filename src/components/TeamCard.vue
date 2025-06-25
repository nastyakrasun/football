<template>
  <v-card class="team-card" elevation="2">
    <v-card-text class="team-card-content">
      <div class="team-header-row">
        <img v-if="crestUrl" :src="crestUrl" alt="crest" class="team-crest" />
        <span class="team-name">{{ name }}</span>
      </div>
      <div class="team-info">
        <div v-if="area" class="team-area">
          <v-icon icon="mdi-earth" size="16" class="info-icon"></v-icon>
          <span>{{ area }}</span>
        </div>
        <div v-if="founded" class="team-founded">
          <v-icon icon="mdi-calendar" size="16" class="info-icon"></v-icon>
          <span>{{ $t ? $t('app.founded') : 'Основан' }}: {{ founded }}</span>
        </div>
        <div v-if="venue" class="team-venue">
          <v-icon icon="mdi-stadium" size="16" class="info-icon"></v-icon>
          <span>{{ venue }}</span>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'TeamCard',
  props: {
    name: String,
    crestUrl: String,
    area: String,
    founded: [String, Number],
    venue: String
  }
}
</script>

<style scoped>
.team-card {
  border-radius: 12px;
  transition: all 0.3s ease;
  border: 1px solid rgba(44, 62, 80, 0.1);
  background-color: var(--v-theme-surface);
  margin-bottom: 10px;
  overflow: hidden;
}
.team-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(44, 62, 80, 0.15);
}
.team-card-content {
  padding: 0.7rem 1rem 0.7rem 1rem;
}
.team-header-row {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  margin-bottom: 0.5rem;
}
.team-crest {
  width: 20px;
  height: 20px;
  object-fit: contain;
  border-radius: 50%;
  background: #fff;
  border: 1px solid #eee;
}
.team-name {
  font-size: 1rem;
  color: #3498db;
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.team-info {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  font-size: 0.97rem;
  color: #2c3e50;
}
.info-icon {
  color: #3498db;
  margin-right: 0.3em;
}
@media (max-width: 768px) {
  .team-card-content {
    padding: 0.5rem 0.5rem 0.5rem 0.5rem;
  }
  .team-header-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.3rem;
  }
  .team-name {
    font-size: 1rem;
    white-space: normal;
    overflow: visible;
    text-overflow: unset;
    word-break: break-word;
    line-height: 1.2;
    margin-bottom: 0.1rem;
  }
  .team-crest {
    width: 10px;
    height: 10px;
  }
  .team-area {
    font-size: 0.95rem;
    color: #7f8c8d;
    margin-bottom: 0.1rem;
  }
}
</style> 
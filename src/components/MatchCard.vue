<template>
  <v-card :class="type === 'team' ? 'team-card' : 'match-card'" elevation="2">
    <v-card-text
      :class="type === 'team' ? 'team-card-content' : 'match-card-content'"
    >
      <template v-if="type === 'match'">
        <!-- Match Layout -->
        <div class="match-header-row">
          <span class="competition-name">{{ competitionName }}</span>
          <v-chip :color="statusColor" size="small" class="status-chip">
            {{ statusText }}
          </v-chip>
        </div>
        <div class="match-teams">
          <div class="team home-team">
            <div
              class="team-name"
              :style="{ color: thColor, fontWeight: 'bold' }"
            >
              {{ homeTeamName }}
            </div>
          </div>
          <div class="score-block">
            <span class="team-score" :style="{ color: thColor }">{{
              homeScore
            }}</span>
            <span class="vs-divider">:</span>
            <span class="team-score" :style="{ color: thColor }">{{
              awayScore
            }}</span>
          </div>
          <div class="team away-team">
            <div
              class="team-name"
              :style="{ color: thColor, fontWeight: 'normal' }"
            >
              {{ awayTeamName }}
            </div>
          </div>
        </div>
        <div class="match-datetime">
          <template v-if="isScheduled && matchTime">
            <v-icon icon="mdi-clock" size="16" class="time-icon"></v-icon>
            <span>{{ matchTime }}</span>
          </template>
          <v-icon
            icon="mdi-calendar"
            size="16"
            class="date-icon"
            style="margin-left: 0.3em"
          ></v-icon>
          <span>{{ matchDate }}</span>
        </div>
      </template>
      <template v-else-if="type === 'team'">
        <!-- Team Layout -->
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
            <span>{{ $t ? $t("app.founded") : "Основан" }}: {{ founded }}</span>
          </div>
          <div v-if="venue" class="team-venue">
            <v-icon icon="mdi-stadium" size="16" class="info-icon"></v-icon>
            <span>{{ venue }}</span>
          </div>
        </div>
      </template>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "MatchCard",
  props: {
    type: {
      type: String,
      required: true,
      validator: (v) => ["match", "team"].includes(v),
    },
    // Match props
    competitionName: String,
    matchDate: String,
    statusColor: String,
    statusText: String,
    homeTeamName: String,
    homeScore: [String, Number],
    awayTeamName: String,
    awayScore: [String, Number],
    thColor: String,
    isScheduled: Boolean,
    matchTime: String,
    // Team props
    name: String,
    crestUrl: String,
    area: String,
    founded: [String, Number],
    venue: String,
  },
};
</script>

<style scoped>
/* --- Match styles (existing) --- */
.match-card {
  border-radius: 12px;
  transition: all 0.3s ease;
  border: 1px solid rgba(44, 62, 80, 0.1);
  background-color: var(--v-theme-surface);
  margin-bottom: 10px;
  overflow: hidden;
}
.match-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(44, 62, 80, 0.15);
}
.match-card-content {
  padding: 0.7rem 1rem 0.7rem 1rem;
}
.match-header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.3rem;
  gap: 0.5rem;
}
.competition-name {
  font-size: 0.95rem;
  color: #3498db;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.status-chip {
  font-weight: 500;
  font-size: 0.9rem;
  height: 22px;
}
.match-teams {
  display: flex;
  align-items: stretch;
  justify-content: space-between;
  margin-bottom: 0.3rem;
}
.team {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 32px;
}
.home-team {
}
.away-team {
}
.team-name {
  font-weight: 600;
  color: #2c3e50;
  font-size: 0.95rem;
  margin-bottom: 0.1rem;
  line-height: 1.2;
  width: 100%;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
}
.score-block {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 70px;
  gap: 0.2rem;
}
.team-score {
  font-size: 1.2rem;
  font-weight: 700;
  color: #3498db;
  min-width: 22px;
  text-align: center;
}
.vs-divider {
  padding: 0 0.2rem;
  color: #7f8c8d;
  font-size: 1rem;
  font-weight: 500;
}
.match-datetime {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #7f8c8d;
  font-size: 0.85rem;
  margin-top: 0.2rem;
  gap: 0.2rem;
}
.date-icon {
  color: #3498db;
}
.time-icon {
  color: #3498db;
}
@media (max-width: 768px) {
  .match-card-content {
    padding: 0.5rem 0.5rem 0.5rem 0.5rem;
  }
  .team-name {
    font-size: 0.85rem;
  }
  .team-score {
    font-size: 1rem;
  }
  .score-block {
    min-width: 50px;
  }
  .team {
    min-height: 24px;
  }
  .match-datetime {
    font-size: 0.8rem;
  }
}
/* --- Team styles (from TeamCard.vue) --- */
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

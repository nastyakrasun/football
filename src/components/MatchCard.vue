<template>
    <v-card class="match-card" elevation="2">
      <v-card-text class="match-card-content">
        <!-- Name and Status on one line -->
        <div class="match-header-row">
          <span class="competition-name">{{ competitionName }}</span>
          <v-chip :color="statusColor" size="small" class="status-chip">
            {{ statusText }}
          </v-chip>
        </div>
        <!-- Teams and Score  -->
        <div class="match-teams">
          <div class="team home-team">
            <div class="team-name" :style="{ color: thColor, fontWeight: 'bold' }">{{ homeTeamName }}</div>
          </div>
          <div class="score-block">
            <span class="team-score" :style="{ color: thColor }">{{ homeScore }}</span>
            <span class="vs-divider">:</span>
            <span class="team-score" :style="{ color: thColor }">{{ awayScore }}</span>
          </div>
          <div class="team away-team">
            <div class="team-name" :style="{ color: thColor, fontWeight: 'normal' }">{{ awayTeamName }}</div>
          </div>
        </div>
        <!-- Time, Date on one line at the bottom -->
        <div class="match-datetime">
          <template v-if="isScheduled && matchTime">
            <v-icon icon="mdi-clock" size="16" class="time-icon"></v-icon>
            <span>{{ matchTime }}</span>
          </template>
          <v-icon icon="mdi-calendar" size="16" class="date-icon" style="margin-left: 0.3em;"></v-icon>
          <span>{{ matchDate }}</span>
        </div>
      </v-card-text>
    </v-card>
  </template>
  
  <script>
  export default {
    name: 'MatchCard',
    props: {
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
      matchTime: String
    }
  }
  </script>
  
  <style scoped>
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
  .home-team {}
  .away-team {}
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
  </style> 
export const UPDATE_PERIOD_SIZE = 10;
export const FOOTBALL_MATCH_DURATION = 90;
export const PERIOD_TIME = 1000;

export enum CLIENT_EVENTS {
  START_TOURNAMENT_OBSERVATION = 'start-tournament-observation',
  STOP_TOURNAMENT_OBSERVATION = 'stop-tournament-observation',
}

export enum SERVER_EVENTS {
  TOURNAMENT_UPDATE = 'tournament-update',
  TOURNAMENT_OBSERVATION_END = 'tournament-observation-end',
}

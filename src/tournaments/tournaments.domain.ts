export interface FootballMatch {
  teams: [string, string];
}

export interface FootballTournament {
  name: string;
  matches: FootballMatch[];
  currentTime: number;
  duration: number;
  goals: string[];
}

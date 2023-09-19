import { Length, Matches } from 'class-validator';

export class TournamentObservationRequest {
  @Matches(/[a-zA-Z0-9 ]/)
  @Length(8, 30)
  name: string;
}

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

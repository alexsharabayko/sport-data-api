import { Injectable } from '@nestjs/common';
import { FootballTournament } from './tournaments.domain';
import {
  FOOTBALL_MATCH_DURATION,
  UPDATE_PERIOD_SIZE,
} from './tournaments.constants';

@Injectable()
export class TournamentsService {
  private readonly ALL_TEAMS = [
    'Poland',
    'Germany',
    'Argentina',
    'Uruguay',
    'Mexico',
    'Brazil',
  ];

  private readonly TOURNAMENT_SKELETON: FootballTournament = {
    name: '',
    matches: [
      { teams: [this.ALL_TEAMS[0], this.ALL_TEAMS[1]] },
      { teams: [this.ALL_TEAMS[2], this.ALL_TEAMS[3]] },
      { teams: [this.ALL_TEAMS[4], this.ALL_TEAMS[5]] },
    ],
    currentTime: 0,
    duration: FOOTBALL_MATCH_DURATION,
    goals: [],
  };

  private readonly GOALS_INFO_MAP = new Map<string, string[]>();

  getTournament(name: string, size: number): FootballTournament {
    return {
      ...this.TOURNAMENT_SKELETON,
      name,
      currentTime: size * UPDATE_PERIOD_SIZE,
      goals: this.getGoalInfo(name, size),
    };
  }

  private getGoalInfo(name: string, size: number): string[] {
    if (!this.GOALS_INFO_MAP.has(name)) {
      this.createGoalInfo(name);
    }

    return this.GOALS_INFO_MAP.get(name).slice(0, size);
  }

  private createGoalInfo(name: string): void {
    const data: string[] = [];

    for (let i = 0; i < 10; i++) {
      const randomIndex = Math.floor(Math.random() * this.ALL_TEAMS.length);
      data.push(this.ALL_TEAMS[randomIndex]);
    }

    this.GOALS_INFO_MAP.set(name, data);
  }
}

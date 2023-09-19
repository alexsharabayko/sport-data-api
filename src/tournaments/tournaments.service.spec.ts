import { Test, TestingModule } from '@nestjs/testing';
import { TournamentsService } from './tournaments.service';

describe('TournamentsService', () => {
  let service: TournamentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TournamentsService],
    }).compile();

    service = module.get<TournamentsService>(TournamentsService);

    const GOALS_INFO_MAP_MOCK = new Map<string, string[]>();
    GOALS_INFO_MAP_MOCK.set('test', ['a', 'b', 'c', 'd', 'e']);

    Reflect.set(service, 'GOALS_INFO_MAP', GOALS_INFO_MAP_MOCK);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Get tournament info', () => {
    it('returns info in good shape', () => {
      const tournament = service.getTournament('test', 0);

      expect(tournament.name).toBe('test');
      expect(tournament.goals).toHaveLength(0);
      expect(tournament.matches).toHaveLength(3);
      expect(tournament.currentTime).toBe(0);

      for (const match of tournament.matches) {
        expect(match.teams).toHaveLength(2);
      }
    });

    it('returns info according to parameter', () => {
      const tournament1 = service.getTournament('test', 1);
      const tournament3 = service.getTournament('test', 3);

      expect(tournament1.currentTime).toBe(10);
      expect(tournament1.goals).toEqual(['a']);

      expect(tournament3.currentTime).toBe(30);
      expect(tournament3.goals).toEqual(['a', 'b', 'c']);
    });

    it('creates goal info if not existed', () => {
      const tournament = service.getTournament('test1', 5);

      expect(tournament.goals).toHaveLength(5);
    });
  });
});

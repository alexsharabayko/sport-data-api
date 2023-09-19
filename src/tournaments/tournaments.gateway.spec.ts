import { Test, TestingModule } from '@nestjs/testing';
import { TournamentsGateway } from './tournaments.gateway';
import { TournamentsService } from './tournaments.service';
import { WsException } from '@nestjs/websockets';

enum SERVER_EVENTS {
  TOURNAMENT_UPDATE = '1',
  TOURNAMENT_OBSERVATION_END = '2',
}

jest.mock('./tournaments.constants', () => {
  return {
    PERIOD_TIME: 1,
    CLIENT_EVENTS: {},
    SERVER_EVENTS: {
      TOURNAMENT_UPDATE: '1',
      TOURNAMENT_OBSERVATION_END: '2',
    },
    FOOTBALL_MATCH_DURATION: 90,
    UPDATE_PERIOD_SIZE: 10,
  };
});

describe('TournamentsGateway', () => {
  let gateway: TournamentsGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TournamentsGateway, TournamentsService],
    }).compile();

    gateway = module.get<TournamentsGateway>(TournamentsGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  describe('startTournamentObservation', () => {
    it('returns data in good format', (done) => {
      gateway.startTournamentObservation({ name: 'test' }).subscribe({
        next: (response) => {
          expect(response.event).toEqual(SERVER_EVENTS.TOURNAMENT_UPDATE);
          expect(response.data.name).toEqual('test');
        },
        complete: () => {
          done();
        },
      });
    });

    it('triggers updates multiple till end of the tournament', (done) => {
      let amount = 0;

      gateway.startTournamentObservation({ name: 'test' }).subscribe({
        next: () => {
          amount += 1;
        },
        complete: () => {
          expect(amount).toEqual(10);
          done();
        },
      });
    });

    it('does not allow to subscribe multiple times', () => {
      gateway.startTournamentObservation({ name: 'test' }).subscribe(() => {});

      expect(() =>
        gateway.startTournamentObservation({ name: 'test' }),
      ).toThrow(WsException);
    });
  });

  describe('stopTournamentObservation', () => {
    it('stops triggering of data', (done) => {
      let amount = 0;

      gateway.startTournamentObservation({ name: 'test' }).subscribe({
        next: () => {
          amount += 1;

          if (amount === 2) {
            gateway.stopTournamentObservation();
          }
        },
        complete: () => {
          expect(amount).toEqual(2);
          done();
        },
      });
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { TournamentsGateway } from './tournaments.gateway';

describe('TournamentsGateway', () => {
  let gateway: TournamentsGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TournamentsGateway],
    }).compile();

    gateway = module.get<TournamentsGateway>(TournamentsGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});

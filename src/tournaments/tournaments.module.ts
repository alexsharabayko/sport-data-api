import { Module } from '@nestjs/common';
import { TournamentsGateway } from './tournaments.gateway';
import { TournamentsService } from './tournaments.service';

@Module({
  providers: [TournamentsGateway, TournamentsService]
})
export class TournamentsModule {}

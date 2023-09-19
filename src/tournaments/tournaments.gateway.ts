import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
  WsResponse,
} from '@nestjs/websockets';
import {
  finalize,
  interval,
  map,
  Observable,
  startWith,
  Subject,
  takeUntil,
  takeWhile,
} from 'rxjs';
import { TournamentsService } from './tournaments.service';
import {
  FootballTournament,
  TournamentObservationRequest,
} from './tournaments.domain';
import { ValidationPipe } from '@nestjs/common';
import { Server } from 'socket.io';
import {
  CLIENT_EVENTS,
  FOOTBALL_MATCH_DURATION,
  PERIOD_TIME,
  SERVER_EVENTS,
  UPDATE_PERIOD_SIZE,
} from './tournaments.constants';

@WebSocketGateway({
  path: '/tournaments/observe',
  cors: {
    origin: '*',
  },
})
export class TournamentsGateway {
  private readonly STOP_SUBJECT = new Subject<void>();

  private tournamentsInProgress = new Set<string>();

  @WebSocketServer() server: Server;

  constructor(private service: TournamentsService) {}

  @SubscribeMessage(CLIENT_EVENTS.START_TOURNAMENT_OBSERVATION)
  startTournamentObservation(
    @MessageBody(ValidationPipe) { name }: TournamentObservationRequest,
  ): Observable<WsResponse<FootballTournament>> {
    if (this.tournamentsInProgress.has(name)) {
      throw new WsException('Tournament observation is already in progress');
    }

    this.tournamentsInProgress.add(name);

    return interval(PERIOD_TIME).pipe(
      takeWhile((i) => (i + 1) * UPDATE_PERIOD_SIZE <= FOOTBALL_MATCH_DURATION),
      takeUntil(this.STOP_SUBJECT),
      map((i) => this.getTournamentUpdateResponse(name, i + 1)),
      startWith(this.getTournamentUpdateResponse(name, 0)),
      finalize(() => {
        this.tournamentsInProgress.delete(name);

        this.server.emit(SERVER_EVENTS.TOURNAMENT_OBSERVATION_END);
      }),
    );
  }

  @SubscribeMessage(CLIENT_EVENTS.STOP_TOURNAMENT_OBSERVATION)
  stopTournamentObservation(): void {
    this.STOP_SUBJECT.next();
  }

  private getTournamentUpdateResponse(
    name: string,
    size: number,
  ): WsResponse<FootballTournament> {
    return {
      event: SERVER_EVENTS.TOURNAMENT_UPDATE,
      data: this.service.getTournament(name, size),
    };
  }
}

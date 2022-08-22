import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventsModule } from './events/events.module';
import { EventsGateway } from './events/events.gateway';
@Module({
  imports: [EventsModule],
  controllers: [AppController],
  providers: [AppService, EventsGateway],
})
export class AppModule {
  constructor(
    private socketEvent: EventsGateway
  ) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const Binance = require('node-binance-api');
    const binance = new Binance().options({
      APIKEY:
        'NozXbOQkbY903Win9AYHsD92xhCPG4Oe340PUH3vN1EnXnAEDmPPxbqIxlZWFO9g',
      APISECRET:
        'AvzVxrsf0tY1V0DdVifFGAwymTiaJRvyQUdyl6qY09wRjJozHufhtHrlDcgkngQ5',
    });

    binance.futuresMiniTickerStream('BTCUSDT', (miniTicker) => {
      this.socketEvent.emitEvent(miniTicker);
    });
  }
}

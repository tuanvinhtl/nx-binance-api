import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { EventsGateway } from './events/events.gateway';
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private socketEvent: EventsGateway
  ) {}

  @Get()
  getData() {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const Binance = require('node-binance-api');
    const binance = new Binance().options({
      APIKEY:
        'NozXbOQkbY903Win9AYHsD92xhCPG4Oe340PUH3vN1EnXnAEDmPPxbqIxlZWFO9g',
      APISECRET:
        'AvzVxrsf0tY1V0DdVifFGAwymTiaJRvyQUdyl6qY09wRjJozHufhtHrlDcgkngQ5',
    });
    binance.futuresMiniTickerStream((miniTicker) => {
      // console.info( miniTicker );
      // this.server.emit('events', miniTicker);
      this.socketEvent.emitEvent(miniTicker)
    });
    return this.appService.getData();
  }
}

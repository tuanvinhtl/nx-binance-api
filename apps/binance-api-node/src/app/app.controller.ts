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
  async getData() {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const Binance = require('node-binance-api');
    const binance = new Binance().options({
      APIKEY:
        'NozXbOQkbY903Win9AYHsD92xhCPG4Oe340PUH3vN1EnXnAEDmPPxbqIxlZWFO9g',
      APISECRET:
        'AvzVxrsf0tY1V0DdVifFGAwymTiaJRvyQUdyl6qY09wRjJozHufhtHrlDcgkngQ5',
    });
    // binance.futuresMiniTickerStream((miniTicker) => {
    //   // console.info( miniTicker );
    //   // this.server.emit('events', miniTicker);
    //   this.socketEvent.emitEvent(miniTicker)
    // });

    binance.futuresMiniTickerStream('BTCUSDT', (miniTicker) => {
      //   // console.info( miniTicker );
      //   // this.server.emit('events', miniTicker);
      this.socketEvent.emitEvent(miniTicker);
    });
    return {
      close: '21210.90',
      eventTime: 1660989301083,
      eventType: '24hrMiniTicker',
      high: '21761.10',
      low: '20760.00',
      open: '21711.70',
      quoteVolume: '15212522618.92',
      symbol: 'BTCUSDT',
      volume: '715111.592',
    };
  }
}

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
    return { name: 'good' };
  }
}

import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  healthCheck() {
    return { status: 'ok', app: 'Electroshop API' };
  }
}

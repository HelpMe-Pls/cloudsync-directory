import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

interface HealthResponse {
  status: string;
  timestamp: string;
  services: {
    api: boolean;
    database: boolean;
  };
  details?: Record<string, any>;
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  async getHealth(): Promise<HealthResponse> {
    const healthInfo = await this.appService.getHealth();
    return {
      status: healthInfo.dbConnection ? 'ok' : 'degraded',
      timestamp: healthInfo.timestamp,
      services: {
        api: true,
        database: healthInfo.dbConnection,
      },
      details: healthInfo.details,
    };
  }
}

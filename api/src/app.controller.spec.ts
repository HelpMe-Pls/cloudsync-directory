import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });

  describe('health', () => {
    it('should return health status with API and database marked as available', () => {
      const healthResult = appController.getHealth();

      expect(healthResult.status).toBe('ok');
      expect(typeof healthResult.timestamp).toBe('string');
      expect(healthResult.services.api).toBe(true);
      expect(healthResult.services.database).toBe(true);
    });
  });
});

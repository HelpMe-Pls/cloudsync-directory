import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);
  private isConnected = false;

  constructor() {
    super({
      log:
        process.env.NODE_ENV === 'development'
          ? ['query', 'info', 'warn', 'error']
          : ['error'],
    });
  }

  async onModuleInit() {
    try {
      this.logger.log('Connecting to database...');

      // Set a connection timeout to prevent hanging
      const connectionPromise = this.$connect();
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error('Database connection timeout after 10 seconds'));
        }, 10000);
      });

      // Race the connection against the timeout
      await Promise.race([connectionPromise, timeoutPromise]);

      this.logger.log('Successfully connected to database');
      this.isConnected = true;

      // Verify database connection with a simple query
      const result = await this.$queryRaw`SELECT 1 as connected`;
      this.logger.log(
        `Database connection verified: ${JSON.stringify(result)}`,
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      const errorStack =
        error instanceof Error ? error.stack : 'No stack trace';

      this.logger.error(
        `Failed to connect to database: ${errorMessage}`,
        errorStack,
      );

      // Don't throw the error here, as it would prevent the application from starting
      // Instead, log it and let the application continue, allowing health checks to report the issue
    }
  }

  async onModuleDestroy() {
    if (this.isConnected) {
      this.logger.log('Disconnecting from database...');
      await this.$disconnect();
      this.logger.log('Disconnected from database');
    }
  }

  // Helper method to check connection status
  isHealthy(): boolean {
    return this.isConnected;
  }
}

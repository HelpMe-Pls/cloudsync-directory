import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(private readonly prisma: PrismaService) {}

  getHello(): string {
    return 'CloudSync Directory API is running!';
  }

  async getHealth(): Promise<{
    status: string;
    timestamp: string;
    dbConnection: boolean;
    details?: Record<string, any>;
  }> {
    this.logger.log('Performing health check');

    // Check database connection
    let dbConnection = false;
    const details: Record<string, any> = {};

    try {
      // First check if Prisma service reports as healthy
      if (this.prisma.isHealthy()) {
        // Double-check with a simple query
        await this.prisma.$queryRaw`SELECT 1`;
        dbConnection = true;
        details.database = { status: 'connected' };
      } else {
        details.database = {
          status: 'disconnected',
          message: 'PrismaService reports unhealthy state',
        };
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      this.logger.error(`Database health check failed: ${errorMessage}`);
      details.database = {
        status: 'error',
        message: errorMessage,
      };
    }

    // Get environment information
    details.environment = {
      nodeEnv: process.env.NODE_ENV ?? 'not set',
      databaseUrl: this.maskConnectionString(
        process.env.DATABASE_URL ?? 'not set',
      ),
    };

    const status = dbConnection ? 'ok' : 'degraded';
    this.logger.log(`Health check completed. Status: ${status}`);

    return {
      status,
      timestamp: new Date().toISOString(),
      dbConnection,
      details,
    };
  }

  // Utility method to mask sensitive information in connection strings
  private maskConnectionString(connectionString: string): string {
    if (!connectionString || connectionString === 'not set') {
      return connectionString;
    }

    try {
      // Replace password in connection string with asterisks
      return connectionString.replace(/\/\/([^:]+):([^@]+)@/, '//$1:********@');
    } catch {
      return 'invalid connection string format';
    }
  }
}

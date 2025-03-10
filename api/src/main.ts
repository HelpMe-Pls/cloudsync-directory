import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  // Enable CORS
  app.enableCors();

  // Use Helmet for security headers
  app.use(
    helmet({
      contentSecurityPolicy: false, // Disable CSP for development
    }),
  );

  // Enable validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Setup Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('CloudSync Directory API')
    .setDescription('The CloudSync Directory Service API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Start the application
  const port = process.env.PORT ?? 3000;
  const host = '0.0.0.0'; // Bind to all network interfaces

  try {
    await app.listen(port, host);
    console.log(`🚀 Application is running on: http://${host}:${port}`);
    console.log(
      `📚 API documentation available at: http://${host}:${port}/api`,
    );
    console.log(`🔄 Hot reload is enabled`);
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Execute the bootstrap function with proper error handling
void bootstrap().catch((err) => {
  console.error('Failed to start application:', err);
  process.exit(1);
});

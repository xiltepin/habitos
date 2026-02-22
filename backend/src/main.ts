import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  const allowedOrigins = [
    frontendUrl,
    'http://localhost',        // Capacitor Android
    'capacitor://localhost',   // Capacitor iOS
  ].filter(Boolean);

  // These two lines MUST appear in logs if code runs
  console.log(`[CORS] Allowed origins: ${allowedOrigins.join(', ')}`);
  console.log(`[Startup] Environment: ${config.get('NODE_ENV') || '(not set)'}`);

  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS: origin '${origin}' not allowed`));
      }
    },
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  app.setGlobalPrefix('api');

  const port = config.get<number>('PORT') || 3001;
  await app.listen(port);
  console.log(`API running on port ${port} | Allowed CORS: ${frontendUrl}`);
}

bootstrap();
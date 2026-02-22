import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  const frontendUrl = config.get<string>('FRONTEND_URL');

  const allowedOrigins = [
    frontendUrl,
    'http://localhost',
    'https://localhost',
    'capacitor://localhost',
    'ionic://localhost',
    'http://localhost:4201',
  ].filter(Boolean);

  console.log(`[CORS] Allowed origins: ${allowedOrigins.join(', ')}`);
  console.log(`[Startup] Environment: ${config.get('NODE_ENV') || '(not set)'}`);

  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps send no origin header)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn(`[CORS] Blocked origin: ${origin}`);
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
  console.log(`API running on port ${port} | Allowed CORS: ${allowedOrigins.join(', ')}`);
}

bootstrap();
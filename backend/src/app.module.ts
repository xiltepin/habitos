import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Joi from 'joi';

import { AuthModule } from './auth/auth.module';
import { HabitsModule } from './habits/habits.module';
import { UsersModule } from './users/users.module';
import { CompletionsModule } from './completions/completions.module';
import { WeightsModule } from './weights/weights.module'; // ← ADD THIS

import { User } from './users/user.entity';
import { Habit } from './habits/habit.entity';
import { Completion } from './completions/completion.entity';
import { Weight } from './weights/weight.entity'; // ← ADD THIS

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'production' ? '.env.production' : '.env',
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('development', 'production').default('development'),
        PORT: Joi.number().default(3001),
        FRONTEND_URL: Joi.string().uri().required(),
        JWT_SECRET: Joi.string().min(32).required(),
        JWT_EXPIRES_IN: Joi.string().default('7d'),
        DB_PATH: Joi.string().required(),
      }),
      validationOptions: {
        abortEarly: false,
      },
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        type: 'better-sqlite3' as const,
        database: config.get<string>('DB_PATH')!,
        entities: [User, Habit, Completion, Weight], // ← ADD Weight HERE
        synchronize: true,
        logging: config.get('NODE_ENV') === 'development',
      }),
      inject: [ConfigService],
    }),

    AuthModule,
    UsersModule,
    HabitsModule,
    CompletionsModule,
    WeightsModule, // ← ADD THIS
  ],
})
export class AppModule {}

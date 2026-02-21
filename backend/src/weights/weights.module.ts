import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Weight } from './weight.entity';
import { WeightsService } from './weights.service';
import { WeightsController } from './weights.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Weight])],
  controllers: [WeightsController],
  providers: [WeightsService],
  exports: [WeightsService],
})
export class WeightsModule {}

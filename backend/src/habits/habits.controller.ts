import {
  Controller, Get, Post, Put, Delete, Body, Param, Query,
  UseGuards, Request, ParseIntPipe
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { HabitsService } from './habits.service';
import { IsString, IsOptional, IsIn, IsNumber, IsBoolean } from 'class-validator';
import { HabitType, HabitFrequency, HabitTimeOfDay } from './habit.entity';

export class CreateHabitDto {
  @IsString()
  name: string;

  @IsOptional() @IsString()
  description?: string;

  @IsOptional() @IsString()
  icon?: string;

  @IsOptional() @IsString()
  color?: string;

  @IsOptional() @IsIn(['good', 'bad'])
  type?: HabitType;

  @IsOptional() @IsIn(['1', '2', '3', '4', '5', '6', '7', 'daily', 'weekly', 'custom'])
  frequency?: HabitFrequency;

  @IsOptional() @IsString()
  frequencyDays?: string;

  @IsOptional() @IsIn(['morning', 'afternoon', 'evening', 'anytime'])
  timeOfDay?: HabitTimeOfDay;

  @IsOptional() @IsString()
  reminderTime?: string;

  @IsOptional() @IsNumber()
  targetCount?: number;
}

export class UpdateHabitDto extends CreateHabitDto {
  @IsOptional() @IsBoolean()
  isActive?: boolean;

  @IsOptional() @IsNumber()
  order?: number;
}

@UseGuards(JwtAuthGuard)
@Controller('habits')
export class HabitsController {
  constructor(private habitsService: HabitsService) { }

  @Get()
  findAll(@Request() req) {
    return this.habitsService.findAll(req.user.id);
  }

  @Get('today')
  getToday(@Request() req, @Query('date') date?: string) {
    const dateStr = date || new Date().toISOString().split('T')[0];
    return this.habitsService.getWithStats(req.user.id, dateStr);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.habitsService.findOne(id, req.user.id);
  }

  @Post()
  create(@Body() dto: CreateHabitDto, @Request() req) {
    return this.habitsService.create(req.user.id, dto);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateHabitDto,
    @Request() req,
  ) {
    return this.habitsService.update(id, req.user.id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.habitsService.remove(id, req.user.id);
  }
}
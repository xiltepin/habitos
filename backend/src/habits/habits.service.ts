import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Habit } from './habit.entity';
import { Completion } from '../completions/completion.entity';

@Injectable()
export class HabitsService {
  constructor(
    @InjectRepository(Habit)
    private habitsRepo: Repository<Habit>,
    @InjectRepository(Completion)
    private completionsRepo: Repository<Completion>,
  ) { }

  async findAll(userId: number): Promise<Habit[]> {
    return this.habitsRepo.find({
      where: { userId, isActive: true },
      order: { order: 'ASC', createdAt: 'ASC' },
    });
  }

  async findOne(id: number, userId: number): Promise<Habit> {
    const habit = await this.habitsRepo.findOne({ where: { id } });
    if (!habit) throw new NotFoundException('Habit not found');
    if (habit.userId !== userId) throw new ForbiddenException();
    return habit;
  }

  async create(userId: number, data: Partial<Habit>): Promise<Habit> {
    const count = await this.habitsRepo.count({ where: { userId } });
    const habit = this.habitsRepo.create({ ...data, userId, order: count });
    return this.habitsRepo.save(habit);
  }

  async update(id: number, userId: number, data: Partial<Habit>): Promise<Habit> {
    const habit = await this.findOne(id, userId);
    Object.assign(habit, data);
    return this.habitsRepo.save(habit);
  }

  async remove(id: number, userId: number): Promise<void> {
    const habit = await this.findOne(id, userId);
    habit.isActive = false;
    await this.habitsRepo.save(habit);
  }

  async getWithStats(userId: number, dateStr: string): Promise<any[]> {
    const habits = await this.findAll(userId);
    const date = new Date(dateStr);
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);

    const results = await Promise.all(
      habits.map(async (habit) => {
        const todayCompletions = await this.completionsRepo.count({
          where: { habitId: habit.id, completedAt: Between(dayStart, dayEnd) },
        });

        const streak = await this.calculateStreak(habit.id, dateStr);
        const weeklyStats = await this.getWeeklyStats(habit, dateStr);

        return {
          ...habit,
          completedToday: todayCompletions > 0,
          completedCount: todayCompletions,
          streak,
          goalAccomplishedThisWeek: weeklyStats.goalAccomplishedThisWeek,
          totalGoalsAccomplished: weeklyStats.totalGoalsAccomplished,
        };
      }),
    );
    return results;
  }

  async calculateStreak(habitId: number, upToDateStr: string): Promise<number> {
    let streak = 0;
    const upTo = new Date(upToDateStr);

    for (let i = 0; i < 365; i++) {
      const d = new Date(upTo);
      d.setDate(d.getDate() - i);
      const start = new Date(d);
      start.setHours(0, 0, 0, 0);
      const end = new Date(d);
      end.setHours(23, 59, 59, 999);

      const count = await this.completionsRepo.count({
        where: { habitId, completedAt: Between(start, end) },
      });

      if (count > 0) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }
    return streak;
  }

  async getWeeklyStats(habit: Habit, dateStr: string): Promise<{ goalAccomplishedThisWeek: boolean, totalGoalsAccomplished: number }> {
    const completions = await this.completionsRepo.find({
      where: { habitId: habit.id },
    });

    let targetFreq = 7;
    if (['1', '2', '3', '4', '5', '6', '7'].includes(habit.frequency)) {
      targetFreq = parseInt(habit.frequency, 10);
    } else if (habit.frequency === 'weekly') {
      targetFreq = 1;
    }

    // group unique completion dates
    const uniqueDates = new Set<string>();
    completions.forEach(c => {
      // Local date string based on completedAt
      const d = new Date(c.completedAt);
      const ds = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      uniqueDates.add(ds);
    });

    // group by week (Sunday start)
    const weeksMap = new Map<string, Set<string>>();
    uniqueDates.forEach(ds => {
      const d = new Date(ds);
      // find Sunday
      const day = d.getDay();
      const diff = d.getDate() - day;
      const sunday = new Date(d);
      sunday.setDate(diff);
      const sundayStr = `${sunday.getFullYear()}-${String(sunday.getMonth() + 1).padStart(2, '0')}-${String(sunday.getDate()).padStart(2, '0')}`;

      if (!weeksMap.has(sundayStr)) {
        weeksMap.set(sundayStr, new Set<string>());
      }
      weeksMap.get(sundayStr).add(ds);
    });

    let totalGoalsAccomplished = 0;
    weeksMap.forEach((daysSet, sundayStr) => {
      if (daysSet.size >= targetFreq) {
        totalGoalsAccomplished++;
      }
    });

    // Check current week
    const currentDate = new Date(dateStr);
    const currDay = currentDate.getDay();
    const currSunday = new Date(currentDate);
    currSunday.setDate(currentDate.getDate() - currDay);
    const currSundayStr = `${currSunday.getFullYear()}-${String(currSunday.getMonth() + 1).padStart(2, '0')}-${String(currSunday.getDate()).padStart(2, '0')}`;

    const thisWeekDays = weeksMap.get(currSundayStr);
    const goalAccomplishedThisWeek = thisWeekDays ? thisWeekDays.size >= targetFreq : false;

    return { goalAccomplishedThisWeek, totalGoalsAccomplished };
  }
}
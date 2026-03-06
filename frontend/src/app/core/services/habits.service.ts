import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export interface Habit {
  id: number;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  type: 'good' | 'bad';
  frequency: '1' | '2' | '3' | '4' | '5' | '6' | '7' | 'daily' | 'weekly' | 'custom';
  frequencyDays?: string;
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'anytime';
  reminderTime?: string;
  targetCount: number;
  isActive: boolean;
  order: number;
  createdAt: string;
  // Computed from backend
  completedToday?: boolean;
  completedCount?: number;
  streak?: number;
  goalAccomplishedThisWeek?: boolean;
  totalGoalsAccomplished?: number;
}

@Injectable({ providedIn: 'root' })
export class HabitsService {
  private api = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getTodayHabits(date?: string) {
    const d = date || new Date().toISOString().split('T')[0];
    return this.http.get<Habit[]>(`${this.api}/habits/today?date=${d}`);
  }

  getAll() {
    return this.http.get<Habit[]>(`${this.api}/habits`);
  }

  getOne(id: number) {
    return this.http.get<Habit>(`${this.api}/habits/${id}`);
  }

  create(data: Partial<Habit>) {
    return this.http.post<Habit>(`${this.api}/habits`, data);
  }

  update(id: number, data: Partial<Habit>) {
    return this.http.put<Habit>(`${this.api}/habits/${id}`, data);
  }

  delete(id: number) {
    return this.http.delete(`${this.api}/habits/${id}`);
  }

  toggleCompletion(habitId: number, date?: string) {
    const d = date || new Date().toISOString().split('T')[0];
    return this.http.post<{ completed: boolean }>(
      `${this.api}/completions/toggle/${habitId}?date=${d}`,
      {},
    );
  }

  getHistory(habitId: number, days = 30) {
    return this.http.get<any[]>(`${this.api}/completions/history/${habitId}?days=${days}`);
  }

  getMonthStats(year: number, month: number) {
    return this.http.get<any>(`${this.api}/completions/stats/month?year=${year}&month=${month}`);
  }
}
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class OfflineService {
    private readonly OFFLINE_KEY = 'habitos_offline_mode';
    private readonly HABITS_KEY = 'offline_habits';
    private readonly COMPLETIONS_KEY = 'offline_completions';
    private readonly WEIGHTS_KEY = 'offline_weights';

    constructor() { }

    isOfflineMode(): boolean {
        return localStorage.getItem(this.OFFLINE_KEY) === 'true';
    }

    setOfflineMode(isOffline: boolean) {
        localStorage.setItem(this.OFFLINE_KEY, String(isOffline));
    }

    // --- Habits ---
    getHabits(): any[] {
        return JSON.parse(localStorage.getItem(this.HABITS_KEY) || '[]');
    }

    getHabit(id: number): any {
        return this.getHabits().find(h => h.id === id);
    }

    getActiveHabits(): any[] {
        return this.getHabits()
            .filter(h => h.isActive)
            .sort((a, b) => {
                if (a.order !== b.order) return (a.order || 0) - (b.order || 0);
                return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
            });
    }

    getTodayHabits(date: string): any[] {
        const habits = this.getActiveHabits();
        const completions = this.getCompletions(date);

        return habits.map(h => {
            const comp = completions.filter(c => c.habitId === h.id);
            const weeklyStats = this.getWeeklyStats(h, date);
            return {
                ...h,
                completedToday: comp.length >= (h.targetCount || 1),
                completedCount: comp.length,
                streak: this.calculateStreak(h.id, date),
                goalAccomplishedThisWeek: weeklyStats.goalAccomplishedThisWeek,
                totalGoalsAccomplished: weeklyStats.totalGoalsAccomplished
            };
        });
    }

    createHabit(data: any): any {
        const habits = this.getHabits();
        const id = Date.now();
        const newHabit = { ...data, id, isActive: true, order: habits.length + 1, createdAt: new Date().toISOString() };
        localStorage.setItem(this.HABITS_KEY, JSON.stringify([...habits, newHabit]));
        return newHabit;
    }

    updateHabit(id: number, data: any): any {
        let habits = this.getHabits();
        let updated = null;
        habits = habits.map(h => {
            if (h.id === id) {
                updated = { ...h, ...data };
                return updated;
            }
            return h;
        });
        localStorage.setItem(this.HABITS_KEY, JSON.stringify(habits));
        return updated;
    }

    deleteHabit(id: number) {
        let habits = this.getHabits();
        habits = habits.map(h => {
            if (h.id === id) {
                return { ...h, isActive: false };
            }
            return h;
        });
        localStorage.setItem(this.HABITS_KEY, JSON.stringify(habits));
    }

    // --- Completions ---
    getCompletionsAll(): any[] {
        return JSON.parse(localStorage.getItem(this.COMPLETIONS_KEY) || '[]');
    }

    getCompletions(date: string): any[] {
        return this.getCompletionsAll().filter(c => c.date.startsWith(date));
    }

    toggleCompletion(habitId: number, date: string): any {
        const all = this.getCompletionsAll();
        const habit = this.getHabit(habitId);
        const targetCount = habit?.targetCount || 1;
        const existing = all.filter(c => c.habitId === habitId && c.date.startsWith(date));

        let updatedCompletions;
        let isCompleted = false;

        if (existing.length >= targetCount) {
            // Un-complete (remove all for today)
            updatedCompletions = all.filter(c => !(c.habitId === habitId && c.date.startsWith(date)));
        } else {
            // Add one
            updatedCompletions = [...all, { id: Date.now(), habitId, date }];
            if (existing.length + 1 >= targetCount) {
                isCompleted = true;
            }
        }

        localStorage.setItem(this.COMPLETIONS_KEY, JSON.stringify(updatedCompletions));
        return { completed: isCompleted };
    }

    getHistory(habitId: number, days: number): any[] {
        const all = this.getCompletionsAll().filter(c => c.habitId === habitId);
        const map = new Map<string, number>();
        for (const c of all) {
            const d = c.date.split('T')[0];
            map.set(d, (map.get(d) || 0) + 1);
        }
        return Array.from(map.entries()).map(([date, count]) => ({ date, count }));
    }

    getMonthStats(year: number, month: number): any {
        const prefix = `${year}-${String(month).padStart(2, '0')}`;
        const all = this.getCompletionsAll().filter(c => c.date.startsWith(prefix));

        const stats: Record<string, number> = {};
        for (const c of all) {
            const dayStr = c.date.split('T')[0];
            const dayNum = parseInt(dayStr.split('-')[2], 10);
            stats[dayNum] = (stats[dayNum] || 0) + 1;
        }
        return stats;
    }

    calculateStreak(habitId: number, upToDateStr: string): number {
        const all = this.getCompletionsAll().filter(c => c.habitId === habitId);
        const completionDates = new Set(all.map(c => c.date.split('T')[0]));

        let streak = 0;
        const [upYear, upMonth, upDay] = upToDateStr.split('-').map(Number);
        const upTo = new Date(upYear, upMonth - 1, upDay);
        for (let i = 0; i < 365; i++) {
            const d = new Date(upTo);
            d.setDate(d.getDate() - i);
            const ds = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
            if (completionDates.has(ds)) {
                streak++;
            } else if (i > 0) {
                break;
            }
        }
        return streak;
    }

    getWeeklyStats(habit: any, dateStr: string): { goalAccomplishedThisWeek: boolean, totalGoalsAccomplished: number } {
        const completions = this.getCompletionsAll().filter(c => c.habitId === habit.id);

        let targetFreq = 7;
        if (['1', '2', '3', '4', '5', '6', '7'].includes(habit.frequency)) {
            targetFreq = parseInt(habit.frequency, 10);
        } else if (habit.frequency === 'weekly') {
            targetFreq = 1;
        }

        const uniqueDates = new Set<string>();
        completions.forEach(c => {
            uniqueDates.add(c.date.split('T')[0]);
        });

        const weeksMap = new Map<string, Set<string>>();
        uniqueDates.forEach(ds => {
            const [y, m, dayOfMonth] = ds.split('-').map(Number);
            const d = new Date(y, m - 1, dayOfMonth);
            const day = d.getDay();
            const diff = d.getDate() - day;
            const sunday = new Date(d);
            sunday.setDate(diff);
            const sundayStr = `${sunday.getFullYear()}-${String(sunday.getMonth() + 1).padStart(2, '0')}-${String(sunday.getDate()).padStart(2, '0')}`;
            if (!weeksMap.has(sundayStr)) {
                weeksMap.set(sundayStr, new Set<string>());
            }
            weeksMap.get(sundayStr)!.add(ds);
        });

        let totalGoalsAccomplished = 0;
        weeksMap.forEach((daysSet, sundayStr) => {
            if (daysSet.size >= targetFreq) {
                totalGoalsAccomplished++;
            }
        });

        const [cy, cm, cd] = dateStr.split('-').map(Number);
        const currentDate = new Date(cy, cm - 1, cd);
        const currDay = currentDate.getDay();
        const currSunday = new Date(currentDate);
        currSunday.setDate(currentDate.getDate() - currDay);
        const currSundayStr = `${currSunday.getFullYear()}-${String(currSunday.getMonth() + 1).padStart(2, '0')}-${String(currSunday.getDate()).padStart(2, '0')}`;

        const thisWeekDays = weeksMap.get(currSundayStr);
        const goalAccomplishedThisWeek = thisWeekDays ? thisWeekDays.size >= targetFreq : false;

        return { goalAccomplishedThisWeek, totalGoalsAccomplished };
    }

    // --- Weights ---
    getWeightsAll(): any[] {
        return JSON.parse(localStorage.getItem(this.WEIGHTS_KEY) || '[]');
    }

    getWeights(): any[] {
        return this.getWeightsAll().sort((a, b) => a.date.localeCompare(b.date));
    }

    getWeightsBetween(start: string, end: string): any[] {
        return this.getWeightsAll().filter(w => w.date >= start && w.date <= end).sort((a, b) => a.date.localeCompare(b.date));
    }

    getWeightByDate(date: string): any {
        return this.getWeightsAll().find(w => w.date === date) || null;
    }

    createWeight(data: any): any {
        const w = { id: Date.now(), ...data };
        const all = this.getWeightsAll();
        localStorage.setItem(this.WEIGHTS_KEY, JSON.stringify([...all, w]));
        return w;
    }

    updateWeight(id: number, data: any): any {
        let all = this.getWeightsAll();
        let updated = null;
        all = all.map(w => {
            if (w.id === id) {
                updated = { ...w, ...data };
                return updated;
            }
            return w;
        });
        localStorage.setItem(this.WEIGHTS_KEY, JSON.stringify(all));
        return updated;
    }

    deleteWeight(id: number) {
        const all = this.getWeightsAll().filter(w => w.id !== id);
        localStorage.setItem(this.WEIGHTS_KEY, JSON.stringify(all));
    }

    deleteWeightByDate(date: string) {
        const all = this.getWeightsAll().filter(w => w.date !== date);
        localStorage.setItem(this.WEIGHTS_KEY, JSON.stringify(all));
    }
}

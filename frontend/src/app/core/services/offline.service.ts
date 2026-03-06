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

    getTodayHabits(date: string): any[] {
        const habits = this.getHabits().filter(h => h.isActive);
        const dayOfWeek = new Date(date).getDay(); // 0-6
        const dayStr = String(dayOfWeek === 0 ? 7 : dayOfWeek); // map Sunday (0) to 7

        // Add completions locally for today
        const completions = this.getCompletions(date);

        return habits.map(h => {
            // Mock daily/weekly check, simplified
            let match = true;
            if (['1', '2', '3', '4', '5', '6', '7'].includes(h.frequency)) {
                match = h.frequencyDays?.includes(dayStr) ?? true;
            }
            if (!match) return null;

            const comp = completions.filter(c => c.habitId === h.id);
            return {
                ...h,
                completedToday: comp.length >= h.targetCount,
                completedCount: comp.length,
                streak: this.calculateStreak(h.id, date)
            };
        }).filter(h => !!h);
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
        const habits = this.getHabits().filter(h => h.id !== id);
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
        const existing = all.filter(c => c.habitId === habitId && c.date.startsWith(date));

        let updatedCompletions;
        let isCompleted = false;

        if (existing.length >= habit.targetCount) {
            // Un-complete (remove all for today)
            updatedCompletions = all.filter(c => !(c.habitId === habitId && c.date.startsWith(date)));
        } else {
            // Add one
            updatedCompletions = [...all, { id: Date.now(), habitId, date }];
            if (existing.length + 1 >= habit.targetCount) {
                isCompleted = true;
            }
        }

        localStorage.setItem(this.COMPLETIONS_KEY, JSON.stringify(updatedCompletions));
        return { completed: isCompleted };
    }

    getHistory(habitId: number, days: number): any[] {
        const all = this.getCompletionsAll().filter(c => c.habitId === habitId);
        // simplify by just returning all mapped by date counts
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

    calculateStreak(habitId: number, date: string): number {
        const all = this.getCompletionsAll().filter(c => c.habitId === habitId);
        return Math.min(Math.floor(all.length / 2) + 1, 10); // Dummy streak logic for local demo
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

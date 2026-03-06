import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HabitsService, Habit } from '../../core/services/habits.service';
import { WeightsService } from '../../core/services/weights.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="stats-page">
      <div class="page-header">
        <h2>Statistics</h2>
        <div class="month-nav">
          <button (click)="changeMonth(-1)">‹</button>
          <span>{{ monthLabel() }}</span>
          <button (click)="changeMonth(1)" [disabled]="isCurrentMonth()">›</button>
        </div>
      </div>

      <!-- Summary Cards -->
      <div class="summary-grid">
        <div class="summary-card">
          <div class="sc-value">{{ totalHabits() }}</div>
          <div class="sc-label">Active Habits</div>
        </div>
        <div class="summary-card">
          <div class="sc-value">{{ monthTotal() }}</div>
          <div class="sc-label">Completions</div>
        </div>
        <div class="summary-card">
          <div class="sc-value">{{ bestStreak() }}</div>
          <div class="sc-label">Best Streak</div>
        </div>
        <div class="summary-card">
          <div class="sc-value">{{ avgPerDay() }}%</div>
          <div class="sc-label">Completion Rate</div>
        </div>
      </div>

      <!-- Calendar Heatmap -->
      <div class="card">
        <h3>{{ monthlyActivityLabel() }}</h3>
        <div class="calendar-grid">
          @for (label of ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']; track label) {
            <div class="cal-dow-label">{{ label }}</div>
          }
          @for (day of calendarDays(); track day.date) {
            <div
              class="cal-day"
              [class.has-data]="day.count > 0"
              [class.today]="day.isToday"
              [class.has-weight]="day.weight !== null"
              [class.holiday]="day.holidayName !== null"
              [style.opacity]="day.count > 0 ? (0.3 + day.count * 0.15) : 1"
              [style.background]="day.count > 0 ? 'var(--primary)' : 'var(--bg)'"
              [title]="day.date + ': ' + day.count + ' completions' + (day.weight ? ' | ' + day.weight + ' kg' : '') + (day.holidayName ? ' | 🎌 ' + day.holidayName : '')"
              (click)="navigateToDate(day.date)"
            >
              <span class="day-num" [class.holiday-text]="day.holidayName !== null">{{ day.dayNum }}</span>
              @if (day.weight !== null) {
                <span class="day-weight">{{ day.weight }}</span>
              }
            </div>
          }
        </div>
        <div class="heatmap-legend">
          <span>Less</span>
          <div class="legend-boxes">
            @for (lvl of [0,1,2,3,4]; track lvl) {
              <div class="legend-box" [style.background]="'var(--primary)'" [style.opacity]="lvl === 0 ? 0.1 : lvl * 0.25"></div>
            }
          </div>
          <span>More</span>
        </div>
      </div>

      <!-- Habit Performance -->
      <div class="card">
        <h3>Habit Performance</h3>
        @if (habits().length === 0) {
          <p class="no-data">No habits to show</p>
        } @else {
          @for (habit of habits(); track habit.id) {
            <div class="habit-stat-row">
              <div class="hsr-icon" [style.background]="habit.color || 'var(--primary)'">
                {{ habit.icon || '✅' }}
              </div>
              <div class="hsr-body">
                <div class="hsr-name">{{ habit.name }}</div>
                <div class="hsr-bar-wrap">
                  <div class="hsr-bar">
                    <div
                      class="hsr-fill"
                      [style.width]="getHabitRate(habit.id) + '%'"
                      [style.background]="habit.color || 'var(--primary)'"
                    ></div>
                  </div>
                  <span class="hsr-pct">{{ getHabitRate(habit.id) }}%</span>
                </div>
              </div>
              <div class="hsr-streak">
                <span class="streak-fire">🔥 {{ habit.streak || 0 }}</span>
              </div>
            </div>
          }
        }
      </div>
    </div>
  `,
  styles: [`
    .stats-page { padding: 20px 16px; max-width: 600px; margin: 0 auto; padding-bottom: 80px; }
    .page-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;
    }
    .page-header h2 { margin: 0; font-size: 1.4rem; }
    .month-nav { display: flex; align-items: center; gap: 12px; }
    .month-nav button {
      background: none;
      border: 1.5px solid var(--border);
      width: 32px;
      height: 32px;
      border-radius: 8px;
      font-size: 1.2rem;
      cursor: pointer;
      color: var(--text);
    }
    .month-nav button:disabled { opacity: 0.3; }
    .month-nav span { font-weight: 600; font-size: 0.95rem; min-width: 110px; text-align: center; }

    .summary-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
      margin-bottom: 16px;
    }
    .summary-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 14px;
      padding: 16px;
      text-align: center;
    }
    .sc-value { font-size: 2rem; font-weight: 800; color: var(--primary); line-height: 1; }
    .sc-label { font-size: 0.78rem; color: var(--text-muted); margin-top: 4px; font-weight: 600; }

    .card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 14px;
      padding: 20px;
      margin-bottom: 16px;
    }
    .card h3 { margin: 0 0 12px; font-size: 1rem; color: var(--text); }

    .calendar-grid {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 4px;
    }

    .cal-dow-label {
      text-align: center;
      font-size: 0.65rem;
      font-weight: 700;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.03em;
      padding-bottom: 6px;
    }

    .cal-day {
      aspect-ratio: 1;
      border-radius: 6px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      border: 1px solid var(--border);
      transition: all 0.2s;
      cursor: pointer;
      position: relative;
      padding: 2px;
    }
    .cal-day:hover {
      transform: scale(1.05);
      border-color: var(--primary);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    .cal-day.today { outline: 2px solid var(--primary); outline-offset: 1px; }
    .day-num {
      font-size: 0.65rem;
      color: white;
      font-weight: 600;
      line-height: 1;
    }
    .cal-day:not(.has-data) .day-num { color: var(--text-muted); }
    .cal-day:not(.has-data) .holiday-text { color: #f97316; font-weight: 800; }
    .cal-day.holiday { border: 1.5px solid #f97316; box-shadow: inset 0 0 4px rgba(249,115,22,0.15); }

    .day-weight {
      font-size: 0.55rem;
      color: white;
      font-weight: 700;
      margin-top: 1px;
      background: rgba(0, 0, 0, 0.2);
      padding: 1px 3px;
      border-radius: 3px;
      line-height: 1;
    }
    .cal-day:not(.has-data) .day-weight {
      color: var(--text);
      background: rgba(0, 0, 0, 0.05);
    }

    .heatmap-legend {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 12px;
      justify-content: flex-end;
      font-size: 0.75rem;
      color: var(--text-muted);
    }
    .legend-boxes { display: flex; gap: 4px; }
    .legend-box { width: 14px; height: 14px; border-radius: 3px; }

    .no-data { color: var(--text-muted); font-size: 0.9rem; }

    .habit-stat-row {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 0;
      border-bottom: 1px solid var(--border);
    }
    .habit-stat-row:last-child { border-bottom: none; }
    .hsr-icon {
      width: 38px;
      height: 38px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.2rem;
      flex-shrink: 0;
    }
    .hsr-body { flex: 1; min-width: 0; }
    .hsr-name { font-size: 0.9rem; font-weight: 600; color: var(--text); margin-bottom: 6px; }
    .hsr-bar-wrap { display: flex; align-items: center; gap: 8px; }
    .hsr-bar { flex: 1; height: 6px; background: var(--bg); border-radius: 3px; overflow: hidden; }
    .hsr-fill { height: 100%; border-radius: 3px; transition: width 0.5s; }
    .hsr-pct { font-size: 0.78rem; color: var(--text-muted); min-width: 32px; text-align: right; }
    .hsr-streak { font-size: 0.8rem; color: #f97316; font-weight: 700; }
  `],
})
export class StatsComponent implements OnInit {
  habits = signal<Habit[]>([]);
  monthStats = signal<any>({ byDay: {}, total: 0 });
  weights = signal<Map<string, number>>(new Map());
  holidays = signal<Map<string, string>>(new Map());

  private _year = signal(new Date().getFullYear());
  private _month = signal(new Date().getMonth() + 1);

  constructor(
    private habitsService: HabitsService,
    private weightsService: WeightsService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadData();
    this.loadHolidays();
  }

  loadHolidays() {
    fetch('https://holidays-jp.github.io/api/v1/date.json')
      .then(res => res.json())
      .then(data => {
        const map = new Map<string, string>();
        Object.keys(data).forEach(k => map.set(k, data[k]));
        this.holidays.set(map);
      })
      .catch(err => console.error('Failed to load JP holidays:', err));
  }

  loadData() {
    this.habitsService.getAll().subscribe((h) => this.habits.set(h));
    this.habitsService.getMonthStats(this._year(), this._month()).subscribe((stats) => {
      this.monthStats.set(stats);
    });
    this.loadWeights();
  }

  loadWeights() {
    const year = this._year();
    const month = this._month();
    const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
    const endDate = `${year}-${String(month).padStart(2, '0')}-${new Date(year, month, 0).getDate()}`;

    this.weightsService.getWeightsByRange(startDate, endDate).subscribe({
      next: (weights) => {
        const weightMap = new Map<string, number>();
        weights.forEach((w) => weightMap.set(w.date, w.weight));
        this.weights.set(weightMap);
      },
      error: (err) => console.error('Failed to load weights:', err)
    });
  }

  monthLabel() {
    return new Date(this._year(), this._month() - 1, 1).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    });
  }

  monthlyActivityLabel() {
    const monthName = new Date(this._year(), this._month() - 1, 1).toLocaleDateString('en-US', {
      month: 'long'
    });
    return `${this._year()}, ${monthName} - Monthly Activity`;
  }

  isCurrentMonth() {
    const now = new Date();
    return this._year() === now.getFullYear() && this._month() === now.getMonth() + 1;
  }

  changeMonth(delta: number) {
    let m = this._month() + delta;
    let y = this._year();
    if (m > 12) { m = 1; y++; }
    if (m < 1) { m = 12; y--; }
    if (y > new Date().getFullYear() || (y === new Date().getFullYear() && m > new Date().getMonth() + 1)) return;
    this._month.set(m);
    this._year.set(y);
    this.loadData();
  }

  calendarDays() {
    const year = this._year();
    const month = this._month();
    const daysInMonth = new Date(year, month, 0).getDate();
    const today = new Date();
    const byDay = this.monthStats().byDay || {};
    const weightMap = this.weights();
    const holidayMap = this.holidays();

    return Array.from({ length: daysInMonth }, (_, i) => {
      const day = i + 1;
      const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const isToday =
        today.getFullYear() === year &&
        today.getMonth() + 1 === month &&
        today.getDate() === day;
      return {
        date: dateStr,
        dayNum: day,
        count: byDay[dateStr] || 0,
        weight: weightMap.get(dateStr) || null,
        holidayName: holidayMap.get(dateStr) || null,
        isToday,
      };
    });
  }

  totalHabits() {
    return this.habits().length;
  }

  monthTotal() {
    return this.monthStats().total || 0;
  }

  bestStreak() {
    return Math.max(0, ...this.habits().map((h) => h.streak || 0));
  }

  avgPerDay() {
    const days = new Date(this._year(), this._month(), 0).getDate();
    const total = this.monthTotal();
    const habits = this.totalHabits();
    if (!habits || !days) return 0;
    return Math.round((total / (days * habits)) * 100);
  }

  getHabitRate(habitId: number): number {
    const days = new Date(this._year(), this._month(), 0).getDate();
    const byDay = this.monthStats().byDay || {};
    const total = Object.values(byDay).reduce((a: number, b: any) => a + b, 0) as number;
    if (!days || !this.totalHabits()) return 0;
    return Math.min(100, Math.round((total / (days * this.totalHabits())) * 100));
  }

  navigateToDate(date: string) {
    this.router.navigate(['/today'], { queryParams: { date } });
  }
}
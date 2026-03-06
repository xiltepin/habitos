import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HabitsService, Habit } from '../../../core/services/habits.service';

@Component({
  selector: 'app-habit-list',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="habit-list-page">
      <div class="page-header">
        <h2>My Habits</h2>
        <a routerLink="/habits/new" class="btn-add">+ Add Habit</a>
      </div>

      @if (loading()) {
        <div class="loading">Loading...</div>
      } @else if (habits().length === 0) {
        <div class="empty-state">
          <div class="empty-icon">📋</div>
          <h3>No habits yet</h3>
          <p>Create your first habit to get started</p>
          <a routerLink="/habits/new" class="btn-primary">+ Add Habit</a>
        </div>
      } @else {
        <div class="habits-list">
          @for (habit of goodHabits(); track habit.id) {
            <div class="habit-item">
              <div class="hi-icon" [style.background]="habit.color || 'var(--primary)'">
                {{ habit.icon || '✅' }}
              </div>
              <div class="hi-body">
                <div class="hi-name">{{ habit.name }}</div>
                <div class="hi-meta">
                  <span class="hi-tag">{{ formatFrequency(habit.frequency) }}</span>
                  <span class="hi-tag">{{ habit.timeOfDay }}</span>
                </div>
              </div>
              <div class="hi-actions">
                <a [routerLink]="['/habits', habit.id, 'edit']" class="btn-edit">✏️</a>
                <button class="btn-delete" (click)="deleteHabit(habit)">🗑️</button>
              </div>
            </div>
          }

          @if (badHabits().length > 0) {
            <div class="section-sep">
              <span>Break Habits</span>
            </div>
            @for (habit of badHabits(); track habit.id) {
              <div class="habit-item bad">
                <div class="hi-icon" [style.background]="'var(--danger)'">
                  {{ habit.icon || '🚫' }}
                </div>
                <div class="hi-body">
                  <div class="hi-name">{{ habit.name }}</div>
                  <div class="hi-meta">
                    <span class="hi-tag bad-tag">break habit</span>
                    <span class="hi-tag">{{ formatFrequency(habit.frequency) }}</span>
                  </div>
                </div>
                <div class="hi-actions">
                  <a [routerLink]="['/habits', habit.id, 'edit']" class="btn-edit">✏️</a>
                  <button class="btn-delete" (click)="deleteHabit(habit)">🗑️</button>
                </div>
              </div>
            }
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .habit-list-page { padding: 20px 16px; max-width: 600px; margin: 0 auto; }
    .page-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;
    }
    .page-header h2 { margin: 0; font-size: 1.4rem; color: var(--text); }
    .btn-add {
      background: var(--primary);
      color: white;
      text-decoration: none;
      padding: 8px 16px;
      border-radius: 10px;
      font-weight: 700;
      font-size: 0.9rem;
    }

    .loading { text-align: center; padding: 40px; color: var(--text-muted); }
    .empty-state { text-align: center; padding: 60px 20px; }
    .empty-icon { font-size: 3rem; margin-bottom: 12px; }
    .empty-state h3 { margin: 0 0 8px; color: var(--text); }
    .empty-state p { color: var(--text-muted); font-size: 0.9rem; margin-bottom: 24px; }
    .btn-primary {
      display: inline-block;
      padding: 12px 24px;
      background: var(--primary);
      color: white;
      border-radius: 12px;
      text-decoration: none;
      font-weight: 700;
    }

    .habits-list { display: flex; flex-direction: column; gap: 10px; }

    .habit-item {
      display: flex;
      align-items: center;
      gap: 14px;
      background: var(--surface);
      border: 1.5px solid var(--border);
      border-radius: 14px;
      padding: 14px 16px;
    }
    .habit-item.bad { border-color: #ffd6d6; }

    .hi-icon {
      width: 44px;
      height: 44px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.4rem;
      flex-shrink: 0;
    }
    .hi-body { flex: 1; min-width: 0; }
    .hi-name { font-weight: 600; font-size: 0.95rem; color: var(--text); }
    .hi-meta { display: flex; gap: 6px; margin-top: 4px; flex-wrap: wrap; }
    .hi-tag {
      font-size: 0.72rem;
      background: var(--bg);
      color: var(--text-muted);
      padding: 2px 8px;
      border-radius: 6px;
      border: 1px solid var(--border);
      text-transform: capitalize;
    }
    .bad-tag { background: #fff0f0; color: var(--danger); border-color: #ffd6d6; }

    .hi-actions { display: flex; gap: 8px; }
    .btn-edit, .btn-delete {
      background: none;
      border: 1px solid var(--border);
      border-radius: 8px;
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 1rem;
      text-decoration: none;
      transition: background 0.2s;
    }
    .btn-edit:hover { background: var(--bg); }
    .btn-delete:hover { background: #fff0f0; border-color: #ffd6d6; }

    .section-sep {
      display: flex;
      align-items: center;
      gap: 12px;
      color: var(--text-muted);
      font-size: 0.8rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      margin: 8px 0 4px;
    }
    .section-sep::before, .section-sep::after {
      content: '';
      flex: 1;
      height: 1px;
      background: var(--border);
    }
  `],
})
export class HabitListComponent implements OnInit {
  habits = signal<Habit[]>([]);
  loading = signal(true);

  constructor(private habitsService: HabitsService) { }

  ngOnInit() {
    this.loadHabits();
  }

  loadHabits() {
    this.loading.set(true);
    this.habitsService.getAll().subscribe({
      next: (h) => {
        this.habits.set(h);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  formatFrequency(freq: string) {
    if (['1', '2', '3', '4', '5', '6', '7'].includes(freq)) {
      return `${freq}x weekly`;
    }
    return freq;
  }

  goodHabits() {
    return this.habits().filter((h) => h.type !== 'bad');
  }

  badHabits() {
    return this.habits().filter((h) => h.type === 'bad');
  }

  deleteHabit(habit: Habit) {
    if (!confirm(`Delete "${habit.name}"?`)) return;
    this.habitsService.delete(habit.id).subscribe(() => {
      this.habits.update((h) => h.filter((x) => x.id !== habit.id));
    });
  }
}
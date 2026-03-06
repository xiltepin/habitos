import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HabitsService, Habit } from '../../../core/services/habits.service';

const ICONS = ['✅', '🏃', '💪', '🧘', '📚', '💧', '🥗', '😴', '🚫', '🎯', '🌿', '🧠', '❤️', '🎵', '✍️', '🌅', '🚶', '🍎', '☕', '🛡️', '🍺'];
const COLORS = ['#4CAF50', '#2196F3', '#9C27B0', '#FF5722', '#FF9800', '#00BCD4', '#E91E63', '#607D8B', '#795548', '#009688'];

@Component({
  selector: 'app-habit-form',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="form-page">
      <div class="form-header">
        <button class="back-btn" (click)="goBack()">← Back</button>
        <h2>{{ isEdit() ? 'Edit Habit' : 'New Habit' }}</h2>
        <div></div>
      </div>

      <div class="form-body">
        <!-- Name -->
        <div class="field">
          <label>Habit Name *</label>
          <input
            type="text"
            [(ngModel)]="form.name"
            placeholder="e.g. Morning run, Drink water..."
            maxlength="60"
          />
        </div>

        <!-- Description -->
        <div class="field">
          <label>Description</label>
          <input
            type="text"
            [(ngModel)]="form.description"
            placeholder="Optional description"
            maxlength="120"
          />
        </div>

        <!-- Type -->
        <div class="field">
          <label>Habit Type</label>
          <div class="radio-group">
            <label class="radio-btn" [class.selected]="form.type === 'good'">
              <input type="radio" [(ngModel)]="form.type" name="type" value="good" />
              ✅ Good Habit (build)
            </label>
            <label class="radio-btn" [class.selected]="form.type === 'bad'">
              <input type="radio" [(ngModel)]="form.type" name="type" value="bad" />
              🚫 Bad Habit (break)
            </label>
          </div>
        </div>

        <!-- Icon -->
        <div class="field">
          <label>Icon</label>
          <div class="icon-grid">
            @for (icon of icons; track icon) {
              <button
                type="button"
                class="icon-btn"
                [class.selected]="form.icon === icon"
                (click)="form.icon = icon"
              >{{ icon }}</button>
            }
          </div>
        </div>

        <!-- Color -->
        <div class="field">
          <label>Color</label>
          <div class="color-grid">
            @for (color of colors; track color) {
              <button
                type="button"
                class="color-btn"
                [class.selected]="form.color === color"
                [style.background]="color"
                (click)="form.color = color"
              ></button>
            }
          </div>
        </div>

        <!-- Frequency -->
        <div class="field">
          <label>Frequency (Times per week)</label>
          <select [(ngModel)]="form.frequency">
            <option value="1">1 time a week</option>
            <option value="2">2 times a week</option>
            <option value="3">3 times a week</option>
            <option value="4">4 times a week</option>
            <option value="5">5 times a week</option>
            <option value="6">6 times a week</option>
            <option value="7">7 times a week (Daily)</option>
          </select>
        </div>



        <!-- Time of Day -->
        <div class="field">
          <label>Time of Day</label>
          <div class="radio-group four">
            @for (t of timeOptions; track t.value) {
              <label class="radio-btn" [class.selected]="form.timeOfDay === t.value">
                <input type="radio" [(ngModel)]="form.timeOfDay" name="tod" [value]="t.value" />
                {{ t.icon }} {{ t.label }}
              </label>
            }
          </div>
        </div>

        <!-- [Hidden for now - may be needed in the future] Target Count -->
        <!-- <div class="field">
          <label>Daily Target (times)</label>
          <input type="number" [(ngModel)]="form.targetCount" min="1" max="100" />
        </div> -->

        @if (error()) {
          <div class="error-msg">{{ error() }}</div>
        }

        <div class="form-actions">
          <button type="button" class="btn-cancel" (click)="goBack()">Cancel</button>
          <button type="button" class="btn-save" (click)="submit()" [disabled]="saving()">
            {{ saving() ? 'Saving...' : (isEdit() ? 'Update Habit' : 'Create Habit') }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .form-page {
      max-width: 600px;
      margin: 0 auto;
      padding-bottom: 80px;
    }

    /* NOT sticky — just a normal block header so it never overlaps content */
    .form-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 20px;
      background: var(--surface);
      border-bottom: 1px solid var(--border);
    }

    .form-header h2 { margin: 0; font-size: 1.1rem; }

    .back-btn {
      background: none;
      border: none;
      color: var(--primary);
      font-size: 0.95rem;
      cursor: pointer;
      font-weight: 600;
    }

    .form-body { padding: 24px 16px; }

    .field { margin-bottom: 20px; }
    .field label {
      display: block;
      font-size: 0.85rem;
      font-weight: 700;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 8px;
    }
    .field input[type="text"],
    .field input[type="number"],
    .field select {
      width: 100%;
      padding: 12px 16px;
      border: 1.5px solid var(--border);
      border-radius: 10px;
      font-size: 1rem;
      background: var(--surface);
      color: var(--text);
      box-sizing: border-box;
    }
    .field input:focus, .field select:focus {
      outline: none;
      border-color: var(--primary);
    }

    .radio-group {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }
    .radio-btn {
      flex: 1;
      min-width: 120px;
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 14px;
      border: 1.5px solid var(--border);
      border-radius: 10px;
      cursor: pointer;
      font-size: 0.9rem;
      transition: all 0.2s;
      background: var(--surface);
    }
    .radio-btn input { display: none; }
    .radio-btn.selected {
      border-color: var(--primary);
      background: var(--primary-light);
      color: var(--primary);
      font-weight: 600;
    }

    .icon-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    .icon-btn {
      width: 44px;
      height: 44px;
      border: 1.5px solid var(--border);
      border-radius: 10px;
      font-size: 1.4rem;
      background: var(--surface);
      cursor: pointer;
      transition: all 0.2s;
    }
    .icon-btn.selected {
      border-color: var(--primary);
      background: var(--primary-light);
      transform: scale(1.1);
    }

    .color-grid {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }
    .color-btn {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      border: 3px solid transparent;
      cursor: pointer;
      transition: all 0.2s;
    }
    .color-btn.selected {
      border-color: var(--text);
      transform: scale(1.2);
    }

    .day-picker { display: flex; gap: 6px; flex-wrap: wrap; }
    .day-btn {
      padding: 8px 12px;
      border: 1.5px solid var(--border);
      border-radius: 8px;
      background: var(--surface);
      cursor: pointer;
      font-size: 0.85rem;
      font-weight: 600;
      transition: all 0.2s;
    }
    .day-btn.selected {
      background: var(--primary);
      border-color: var(--primary);
      color: white;
    }

    .error-msg {
      background: #fff1f0;
      border: 1px solid #ffa39e;
      color: #cf1322;
      padding: 10px 14px;
      border-radius: 8px;
      font-size: 0.85rem;
      margin-bottom: 16px;
    }

    .form-actions { display: flex; gap: 12px; margin-top: 24px; }
    .btn-cancel {
      flex: 1;
      padding: 14px;
      background: none;
      border: 1.5px solid var(--border);
      border-radius: 12px;
      font-size: 1rem;
      cursor: pointer;
      color: var(--text);
    }
    .btn-save {
      flex: 2;
      padding: 14px;
      background: var(--primary);
      color: white;
      border: none;
      border-radius: 12px;
      font-size: 1rem;
      font-weight: 700;
      cursor: pointer;
    }
    .btn-save:disabled { opacity: 0.6; cursor: default; }
  `],
})
export class HabitFormComponent implements OnInit {
  icons = ICONS;
  colors = COLORS;

  timeOptions = [
    { label: 'Morning', value: 'morning', icon: '🌅' },
    { label: 'Afternoon', value: 'afternoon', icon: '☀️' },
    { label: 'Evening', value: 'evening', icon: '🌙' },
    { label: 'Anytime', value: 'anytime', icon: '⏰' },
  ];

  form: Partial<Habit> = {
    name: '',
    description: '',
    icon: '✅',
    color: '#4CAF50',
    type: 'good',
    frequency: '7',
    frequencyDays: '',
    timeOfDay: 'anytime',
    targetCount: 1,
  };

  saving = signal(false);
  error = signal('');
  private editId: number | null = null;

  constructor(
    private habitsService: HabitsService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.editId = +id;
      this.habitsService.getOne(this.editId).subscribe((h) => {
        this.form = { ...h };
      });
    }
  }

  isEdit() {
    return !!this.editId;
  }



  goBack() {
    this.router.navigate(['/habits']);
  }

  submit() {
    if (!this.form.name?.trim()) {
      this.error.set('Please enter a habit name.');
      return;
    }
    this.error.set('');
    this.saving.set(true);

    const obs = this.isEdit()
      ? this.habitsService.update(this.editId!, this.form)
      : this.habitsService.create(this.form);

    obs.subscribe({
      next: () => this.router.navigate(['/habits']),
      error: (e) => {
        this.error.set(e.error?.message || 'Failed to save habit.');
        this.saving.set(false);
      },
    });
  }
}
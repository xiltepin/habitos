import { Component, signal, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface WeightEntry {
  date: string;
  weight: number;
}

@Component({
  selector: 'app-weight-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    @if (isOpen()) {
      <div class="modal-backdrop" (click)="closeModal()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>Weight Entry</h3>
            <button class="close-btn" (click)="closeModal()">×</button>
          </div>

          <div class="modal-body">
            <p class="date-label">{{ formatDate(selectedDate()) }}</p>

            @if (errorMessage()) {
              <div class="error-msg">{{ errorMessage() }}</div>
            }

            @if (successMessage()) {
              <div class="success-msg">{{ successMessage() }}</div>
            }

            <div class="input-group">
              <label>Weight (kg)</label>
              <input
                type="number"
                [(ngModel)]="weightValue"
                step="0.1"
                min="1"
                max="500"
                placeholder="Enter weight"
                (keyup.enter)="saveWeight()"
                autofocus
              />
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn-secondary" (click)="closeModal()">Cancel</button>
            <button class="btn-primary" (click)="saveWeight()" [disabled]="isSaving()">
              {{ isSaving() ? 'Saving...' : 'Save' }}
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 20px;
    }

    .modal-content {
      background: var(--surface);
      border-radius: 16px;
      width: 100%;
      max-width: 400px;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
      animation: slideUp 0.2s ease-out;
    }

    @keyframes slideUp {
      from { transform: translateY(20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }

    .modal-header {
      padding: 20px;
      border-bottom: 1px solid var(--border);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .modal-header h3 {
      margin: 0;
      font-size: 1.1rem;
      color: var(--text);
    }

    .close-btn {
      background: none;
      border: none;
      font-size: 1.8rem;
      color: var(--text-muted);
      cursor: pointer;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      transition: all 0.2s;
    }

    .close-btn:hover {
      background: var(--bg);
      color: var(--text);
    }

    .modal-body {
      padding: 20px;
    }

    .date-label {
      font-size: 0.9rem;
      color: var(--text-muted);
      margin-bottom: 16px;
      text-align: center;
    }

    .error-msg, .success-msg {
      padding: 12px;
      border-radius: 8px;
      margin-bottom: 16px;
      font-size: 0.9rem;
      text-align: center;
    }

    .error-msg {
      background: #fee2e2;
      color: #dc2626;
      border: 1px solid #fecaca;
    }

    .success-msg {
      background: #dcfce7;
      color: #16a34a;
      border: 1px solid #bbf7d0;
    }

    .input-group {
      margin-bottom: 16px;
    }

    .input-group label {
      display: block;
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--text);
      margin-bottom: 8px;
    }

    .input-group input {
      width: 100%;
      padding: 12px;
      border: 1.5px solid var(--border);
      border-radius: 8px;
      font-size: 1rem;
      background: var(--bg);
      color: var(--text);
      transition: border-color 0.2s;
    }

    .input-group input:focus {
      outline: none;
      border-color: var(--primary);
    }

    .modal-footer {
      padding: 16px 20px;
      border-top: 1px solid var(--border);
      display: flex;
      gap: 12px;
      justify-content: flex-end;
    }

    .btn-secondary, .btn-primary {
      padding: 10px 20px;
      border-radius: 8px;
      font-size: 0.9rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      border: none;
    }

    .btn-secondary {
      background: var(--bg);
      color: var(--text);
      border: 1px solid var(--border);
    }

    .btn-secondary:hover {
      background: var(--border);
    }

    .btn-primary {
      background: var(--primary);
      color: white;
    }

    .btn-primary:hover {
      opacity: 0.9;
    }

    .btn-primary:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `]
})
export class WeightModalComponent {
  isOpen = signal(false);
  selectedDate = signal('');
  weightValue = 0;
  isSaving = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  onSave = output<WeightEntry>();
  onClose = output<void>();

  open(date: string, currentWeight?: number) {
    this.selectedDate.set(date);
    this.weightValue = currentWeight || 0;
    this.isOpen.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');
  }

  closeModal() {
    this.isOpen.set(false);
    this.errorMessage.set('');
    this.successMessage.set('');
    this.onClose.emit();
  }

  async saveWeight() {
    this.errorMessage.set('');
    this.successMessage.set('');

    // Validation
    if (!this.weightValue || this.weightValue <= 0) {
      this.errorMessage.set('Please enter a valid weight');
      return;
    }

    if (this.weightValue > 500) {
      this.errorMessage.set('Weight must be less than 500 kg');
      return;
    }

    this.isSaving.set(true);

    try {
      this.onSave.emit({
        date: this.selectedDate(),
        weight: this.weightValue
      });

      this.successMessage.set('Weight saved!');

      // Close after 1 second
      setTimeout(() => {
        this.closeModal();
      }, 1000);
    } catch (error) {
      this.errorMessage.set('Failed to save weight. Please try again.');
      this.isSaving.set(false);
    }
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '';
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}
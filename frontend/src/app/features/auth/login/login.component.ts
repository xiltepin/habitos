import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { OfflineService } from '../../../core/services/offline.service';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="auth-page">
      <div class="auth-card">
        <div class="auth-logo">🌱</div>
        <h1>Habitos</h1>
        <p class="auth-subtitle">Build better habits, one day at a time</p>

        <form (ngSubmit)="submit()" #f="ngForm" class="auth-form">
          <div class="field">
            <label>Email</label>
            <input
              type="email"
              [(ngModel)]="email"
              name="email"
              required
              placeholder="you@example.com"
              autocomplete="email"
            />
          </div>
          <div class="field">
            <label>Password</label>
            <input
              type="password"
              [(ngModel)]="password"
              name="password"
              required
              placeholder="••••••••"
              autocomplete="current-password"
            />
          </div>

          @if (error()) {
            <div class="error-msg">{{ error() }}</div>
          }

          <button type="submit" class="btn-primary" [disabled]="loading()">
            {{ loading() ? 'Signing in...' : 'Sign In' }}
          </button>
          
          @if (isAndroid) {
            <div class="divider">
              <span>OR</span>
            </div>
            <button type="button" class="btn-offline" (click)="loginOffline()" [disabled]="loading()">
              Login without credentials (Offline Mode)
            </button>
          }
        </form>

        <p class="auth-link">
          Don't have an account? <a routerLink="/register">Sign up</a>
        </p>
      </div>
    </div>
  `,
  styles: [`
    .auth-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--bg);
      padding: 20px;
    }
    .auth-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 20px;
      padding: 40px 32px;
      width: 100%;
      max-width: 400px;
      text-align: center;
      box-shadow: 0 8px 32px rgba(0,0,0,0.08);
    }
    .auth-logo { font-size: 3rem; margin-bottom: 8px; }
    h1 {
      font-family: 'Nunito', sans-serif;
      font-size: 1.8rem;
      color: var(--primary);
      margin: 0 0 4px;
    }
    .auth-subtitle {
      color: var(--text-muted);
      font-size: 0.9rem;
      margin-bottom: 32px;
    }
    .auth-form { text-align: left; }
    .field { margin-bottom: 16px; }
    .field label {
      display: block;
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--text);
      margin-bottom: 6px;
    }
    .field input {
      width: 100%;
      padding: 12px 16px;
      border: 1.5px solid var(--border);
      border-radius: 10px;
      font-size: 1rem;
      background: var(--bg);
      color: var(--text);
      transition: border-color 0.2s;
      box-sizing: border-box;
    }
    .field input:focus {
      outline: none;
      border-color: var(--primary);
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
    .btn-primary {
      width: 100%;
      padding: 14px;
      background: var(--primary);
      color: white;
      border: none;
      border-radius: 12px;
      font-size: 1rem;
      font-weight: 700;
      cursor: pointer;
      transition: opacity 0.2s;
      margin-top: 8px;
    }
    .btn-primary:disabled { opacity: 0.6; cursor: default; }
    .divider {
      margin: 20px 0;
      text-align: center;
      position: relative;
    }
    .divider::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 0;
      right: 0;
      height: 1px;
      background: var(--border);
    }
    .divider span {
      background: var(--surface);
      padding: 0 10px;
      color: var(--text-muted);
      font-size: 0.85rem;
      position: relative;
    }
    .btn-offline {
      width: 100%;
      padding: 14px;
      background: transparent;
      color: var(--primary);
      border: 2px solid var(--primary);
      border-radius: 12px;
      font-size: 1rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s;
    }
    .btn-offline:disabled { opacity: 0.6; cursor: default; }
    .auth-link {
      margin-top: 24px;
      font-size: 0.9rem;
      color: var(--text-muted);
    }
    .auth-link a { color: var(--primary); text-decoration: none; font-weight: 600; }
  `],
})
export class LoginComponent {
  email = '';
  password = '';
  loading = signal(false);
  error = signal('');
  isAndroid = Capacitor.getPlatform() === 'android';

  constructor(
    private auth: AuthService,
    private offlineService: OfflineService,
    private router: Router,
  ) { }

  submit() {
    this.error.set('');
    this.loading.set(true);
    this.offlineService.setOfflineMode(false);
    this.auth.login(this.email, this.password).subscribe({
      next: () => this.router.navigate(['/today']),
      error: (e) => {
        this.error.set(e.error?.message || 'Login failed. Check your credentials.');
        this.loading.set(false);
      },
    });
  }

  loginOffline() {
    this.error.set('');
    this.loading.set(true);
    this.offlineService.setOfflineMode(true);
    // Interceptor will mock this automatically
    this.auth.login('offline@localhost', 'offline').subscribe({
      next: () => this.router.navigate(['/today']),
      error: () => {
        this.error.set('Failed to initialize local tracking.');
        this.loading.set(false);
      },
    });
  }
}
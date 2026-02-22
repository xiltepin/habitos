import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="shell">
      <header class="topbar">
        <span class="logo">🌱 HabitNow</span>
        <div class="user-info">
          <span class="user-name">{{ auth.user()?.name }}</span>
          <button class="btn-logout" (click)="auth.logout()">Sign out</button>
        </div>
      </header>

      <main class="content">
        <router-outlet />
      </main>

      <nav class="bottom-nav">
        <a routerLink="/today" routerLinkActive="active" class="nav-item">
          <span class="nav-icon">☀️</span>
          <span class="nav-label">Today</span>
        </a>
        <a routerLink="/habits" routerLinkActive="active" class="nav-item">
          <span class="nav-icon">✅</span>
          <span class="nav-label">Habits</span>
        </a>
        <a routerLink="/stats" routerLinkActive="active" class="nav-item">
          <span class="nav-icon">📊</span>
          <span class="nav-label">Stats</span>
        </a>
        <a routerLink="/weight" routerLinkActive="active" class="nav-item">
          <span class="nav-icon">⚖️</span>
          <span class="nav-label">Weight</span>
        </a>
      </nav>
    </div>
  `,
  styles: [`
    .shell {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      background: var(--bg);
    }
    .topbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      /* Push content below status bar on Android/iOS */
      padding-top: env(safe-area-inset-top);
      padding-left: 20px;
      padding-right: 20px;
      padding-bottom: 0;
      /* Height = base 56px + status bar inset */
      min-height: calc(56px + env(safe-area-inset-top));
      background: var(--surface);
      border-bottom: 1px solid var(--border);
      position: sticky;
      top: 0;
      z-index: 100;
    }
    .logo {
      font-size: 1.2rem;
      font-weight: 700;
      color: var(--primary);
      font-family: 'Nunito', sans-serif;
    }
    .user-info {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .user-name {
      font-size: 0.85rem;
      color: var(--text-muted);
      display: none;
    }
    @media (min-width: 640px) {
      .user-name { display: block; }
    }
    .btn-logout {
      background: none;
      border: 1px solid var(--border);
      color: var(--text-muted);
      padding: 4px 12px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.8rem;
      transition: all 0.2s;
    }
    .btn-logout:hover {
      background: var(--danger);
      border-color: var(--danger);
      color: white;
    }
    .content {
      flex: 1;
      overflow-y: auto;
      padding-bottom: 70px;
    }
    .bottom-nav {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      /* Push content above home indicator on Android/iOS */
      padding-bottom: env(safe-area-inset-bottom);
      height: calc(60px + env(safe-area-inset-bottom));
      background: var(--surface);
      border-top: 1px solid var(--border);
      display: flex;
      z-index: 100;
    }
    .nav-item {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 2px;
      text-decoration: none;
      color: var(--text-muted);
      transition: color 0.2s;
      /* Don't include bottom padding in flex layout */
      padding-bottom: env(safe-area-inset-bottom);
      margin-bottom: calc(-1 * env(safe-area-inset-bottom));
    }
    .nav-item.active {
      color: var(--primary);
    }
    .nav-icon { font-size: 1.4rem; }
    .nav-label { font-size: 0.7rem; font-weight: 600; }
  `],
})
export class ShellComponent {
  auth = inject(AuthService);
}
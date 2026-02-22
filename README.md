# 🌱 Habitos - Habit Tracker

A full-stack habit tracking application. Built with NestJS (backend) and Angular (frontend), fully containerized with Docker.

**Live Demo:** https://habitos.xiltepin.me

---

## 📋 Table of Contents

- [Quick Start](#-quick-start)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Deployment Options](#-deployment-options)
- [Environment Configuration](#-environment-configuration)
- [API Documentation](#-api-documentation)
- [Development](#-development)
- [Production Deployment](#-production-deployment)
- [Android APK](#-android-apk)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)

---

## 🚀 Quick Start

### Prerequisites

- **Docker & Docker Compose** (recommended)
  ```bash
  docker --version          # 20.10+
  docker-compose --version  # 2.0+
  ```

OR for manual setup:

- **Node.js 20+** (use nvm)
  ```bash
  nvm install 20
  nvm use 20
  ```

### Deploy with Docker (Recommended)

```bash
cd ~/tools/habitnow

# Start everything
./start.sh

# Access the app
# Frontend: http://localhost:4201
# Backend: http://localhost:3001/api

# Stop everything
./stop.sh
```

---

## ✨ Features

### Core Functionality
- ✅ User authentication (JWT-based)
- ✅ Create good/bad habits
- ✅ Daily/weekly frequency tracking
- ✅ Time-of-day categorization (morning/afternoon/evening/anytime)
- ✅ One-tap completion toggle
- ✅ Streak calculation
- ✅ Historical data view
- ✅ Weight tracking with chart visualization
- ✅ Monthly calendar heatmap with weight overlay

### UI Features
- ✅ Mobile-responsive design
- ✅ Dark mode support
- ✅ Progress ring visualization
- ✅ Monthly calendar heatmap
- ✅ Statistics dashboard with day-of-week labels
- ✅ Bottom navigation
- ✅ FAB button for quick habit creation
- ✅ Weight entry modal from calendar

### Customization
- ✅ 21 icon choices (including 🍺)
- ✅ 10 color options
- ✅ Custom habit names and descriptions
- ✅ Habit archiving

---

## 🛠 Tech Stack

### Backend
- **NestJS** - Node.js framework
- **TypeORM** - ORM with SQLite
- **Passport JWT** - Authentication
- **bcrypt** - Password hashing
- **class-validator** - DTO validation

### Frontend
- **Angular 17** - Frontend framework
- **RxJS** - Reactive programming
- **Signals** - State management
- **CSS Variables** - Theming & dark mode

### Infrastructure
- **Docker** - Containerization
- **Nginx** - Frontend web server
- **SQLite** - Database
- **Docker Volumes** - Data persistence

---

## 📁 Project Structure

```
habitnow/
├── docker-compose.yml          # Container orchestration
├── start.sh                    # Quick start script
├── stop.sh                     # Quick stop script
├── .env.example                # Environment template
├── .gitignore                  # Git exclusions
├── README.md                   # This file
├── DOCKER.md                   # Docker deployment guide
├── QUICKSTART.md               # Quick reference
│
├── backend/
│   ├── Dockerfile              # Backend container config
│   ├── .dockerignore           # Docker build exclusions
│   ├── .env                    # Development config (git-ignored)
│   ├── .env.production         # Production config (git-ignored)
│   ├── package.json            # Node dependencies
│   ├── tsconfig.json           # TypeScript config
│   ├── nest-cli.json           # NestJS CLI config
│   └── src/
│       ├── main.ts             # Application entry point
│       ├── app.module.ts       # Root module
│       ├── auth/               # Authentication module
│       │   ├── auth.controller.ts
│       │   ├── auth.service.ts
│       │   ├── auth.module.ts
│       │   ├── jwt.strategy.ts
│       │   └── jwt-auth.guard.ts
│       ├── users/              # User management
│       │   ├── user.entity.ts
│       │   ├── users.service.ts
│       │   └── users.module.ts
│       ├── habits/             # Habit CRUD
│       │   ├── habit.entity.ts
│       │   ├── habits.controller.ts
│       │   ├── habits.service.ts
│       │   └── habits.module.ts
│       ├── completions/        # Habit completions
│       │   ├── completion.entity.ts
│       │   ├── completions.controller.ts
│       │   ├── completions.service.ts
│       │   └── completions.module.ts
│       └── weights/            # Weight tracking
│           ├── weight.entity.ts
│           ├── weight.dto.ts
│           ├── weights.controller.ts
│           ├── weights.service.ts
│           └── weights.module.ts
│
└── frontend/
    ├── Dockerfile              # Frontend container (multi-stage)
    ├── .dockerignore           # Docker build exclusions
    ├── nginx.conf              # Nginx configuration
    ├── package.json            # Node dependencies
    ├── angular.json            # Angular CLI config
    ├── tsconfig.json           # TypeScript config
    └── src/
        ├── main.ts             # Application entry point
        ├── index.html          # HTML template
        ├── styles.css          # Global styles (CSS variables, dark mode)
        ├── environments/
        │   ├── environment.ts      # Dev config
        │   └── environment.prod.ts # Prod config (git-ignored)
        └── app/
            ├── app.component.ts    # Root component
            ├── app.config.ts       # App configuration
            ├── app.routes.ts       # Route definitions
            ├── core/               # Core services & infrastructure
            │   ├── guards/
            │   │   └── auth.guard.ts
            │   ├── interceptors/
            │   │   └── auth.interceptor.ts
            │   ├── layout/
            │   │   └── shell/
            │   │       └── shell.component.ts   # Topbar + bottom nav
            │   └── services/
            │       ├── auth.service.ts
            │       ├── habits.service.ts
            │       └── weights.service.ts
            ├── shared/             # Reusable components
            │   └── weight-modal/
            │       └── weight-modal.component.ts
            └── features/           # Feature pages
                ├── auth/
                │   ├── login/
                │   │   └── login.component.ts
                │   └── register/
                │       └── register.component.ts
                ├── today/
                │   └── today.component.ts       # Daily habit view
                ├── habits/
                │   ├── habit-list/
                │   │   └── habit-list.component.ts
                │   └── habit-form/
                │       └── habit-form.component.ts
                ├── stats/
                │   └── stats.component.ts       # Calendar heatmap + stats
                └── weight/
                    └── weight.component.ts      # Weight chart
```

---

## 🐳 Deployment Options

### Option 1: Docker (Production - Recommended)

```bash
cd ~/tools/habitnow
./start.sh
```

**Access:**
- Frontend: http://localhost:4201
- Backend: http://localhost:3001/api

---

### Option 2: Manual (Development)

```bash
# Terminal 1 - Backend
cd ~/tools/habitnow/backend
npm install
npm run start:dev

# Terminal 2 - Frontend
cd ~/tools/habitnow/frontend
npm install
npm start
```

---

## 🔐 Environment Configuration

### Root `.env` (for Docker Compose)

```bash
cp .env.example .env
nano .env
```

```env
JWT_SECRET=your_super_secret_jwt_key_here
BACKEND_PORT=3001
FRONTEND_PORT=4201
FRONTEND_URL=https://habitos.xiltepin.me
BACKEND_URL=https://habitos-api.xiltepin.me
NODE_ENV=production
```

---

### Backend `.env` (Development)

```env
PORT=3001
JWT_SECRET=dev_secret_change_me
JWT_EXPIRES_IN=7d
DB_PATH=./habitnow.db
FRONTEND_URL=http://localhost:4201
NODE_ENV=development
```

---

### Backend `.env.production` (Production/Docker)

```env
PORT=3001
JWT_SECRET=long_random_production_secret
JWT_EXPIRES_IN=7d
DB_PATH=/app/data/habitnow.db
FRONTEND_URL=https://habitos.xiltepin.me
NODE_ENV=production
```

---

### Frontend Environment (Production)

Location: `frontend/src/environments/environment.prod.ts`

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://habitos-api.xiltepin.me/api',
};
```

---

## 📡 API Documentation

### Base URL

- **Development:** `http://localhost:3001/api`
- **Production:** `https://habitos-api.xiltepin.me/api`

### Authentication

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{ "email": "user@example.com", "name": "John Doe", "password": "password123" }
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{ "email": "user@example.com", "password": "password123" }
```

### Habits

```http
GET    /api/habits
GET    /api/habits/today?date=YYYY-MM-DD
GET    /api/habits/:id
POST   /api/habits
PUT    /api/habits/:id
DELETE /api/habits/:id
```

### Completions

```http
POST /api/completions/toggle/:habitId?date=YYYY-MM-DD
GET  /api/completions/history/:habitId?days=30
GET  /api/completions/stats/month?year=2026&month=2
```

### Weights

```http
POST   /api/weights                              # Create or update
GET    /api/weights                              # Get all
GET    /api/weights?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
GET    /api/weights/date/:date                   # Get by date
PUT    /api/weights/:id                          # Update by id
DELETE /api/weights/:id                          # Delete by id
DELETE /api/weights/date/:date                   # Delete by date
```

---

## 💻 Development

### Backend

```bash
cd backend
npm install
npm run start:dev   # hot reload
npm run build
npm run start:prod
```

### Frontend

```bash
cd frontend
npm install
npm start           # dev server at :4201
npm run build       # production build
```

### Database

```bash
# Access SQLite in Docker
docker exec -it habitnow-backend sh
sqlite3 /app/data/habitnow.db
.tables
.exit

# Backup
docker cp habitnow-backend:/app/data/habitnow.db ~/backups/habitnow-$(date +%Y%m%d).db
```

---

## 🚀 Production Deployment

### 1. Clone & Configure

```bash
cd ~/tools
git clone <your-repo-url> habitnow
cd habitnow
cp .env.example .env
openssl rand -base64 32   # generate JWT secret
nano .env
```

### 2. Deploy

```bash
chmod +x start.sh stop.sh
./start.sh
docker compose ps
```

### 3. Reverse Proxy (Nginx Proxy Manager)

| Host | Forward To | SSL |
|------|-----------|-----|
| `habitos.xiltepin.me` | `192.168.0.6:4201` | Let's Encrypt |
| `habitos-api.xiltepin.me` | `192.168.0.6:3001` | Let's Encrypt |

---

## 📱 Android APK

You can build a real Android APK using **Capacitor** — a tool that wraps your existing Angular web app in a native Android shell. You reuse 100% of the existing frontend code and the same backend API. No Android experience needed.

### How it works

```
Your Angular app (unchanged)
        ↓
   Capacitor wraps it
        ↓
  Android WebView shows it
        ↓
     .apk file
```

---

### Prerequisites

Install these on your machine:

1. **Node.js 20+** — you already have this
2. **Android Studio** — https://developer.android.com/studio
   - During install, make sure to include: Android SDK, Android SDK Platform, Android Virtual Device
3. **Java JDK 17** — Android Studio usually installs this automatically

---

### Step 1 — Install Capacitor in the frontend

```bash
cd ~/tools/habitnow/frontend

npm install @capacitor/core @capacitor/cli @capacitor/android
```

---

### Step 2 — Initialize Capacitor

```bash
npx cap init
```

It will ask:
- **App name:** `Habitos`
- **App ID:** `me.xiltepin.habitos` (reverse domain, make up anything like `com.yourname.habitos`)
- **Web assets directory:** `dist/frontend/browser`

This creates a `capacitor.config.ts` file. Open it and make sure it looks like this:

```typescript
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'me.xiltepin.habitos',
  appName: 'Habitos',
  webDir: 'dist/frontend/browser',
  server: {
    androidScheme: 'https'
  }
};

export default config;
```

---

### Step 3 — Build the Angular app

```bash
npm run build
```

This produces the static files in `dist/frontend/browser/`.

---

### Step 4 — Add Android platform

```bash
npx cap add android
```

This creates an `android/` folder in your frontend directory — that's the native Android project.

---

### Step 5 — Sync web assets into Android

```bash
npx cap sync android
```

Run this every time you change the Angular code.

---

### Step 6 — Open in Android Studio

```bash
npx cap open android
```

Android Studio opens the project. Wait for Gradle to finish syncing (bottom progress bar). This can take a few minutes the first time.

---

### Step 7 — Build the APK

In Android Studio:

1. Menu → **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
2. Wait for it to finish
3. A notification pops up: **"APK(s) generated successfully"** → click **locate**
4. The APK is at:
   ```
   android/app/build/outputs/apk/debug/app-debug.apk
   ```

---

### Step 8 — Install on your phone

**Option A — USB cable:**
1. On your Android phone: Settings → Developer Options → Enable USB Debugging
   - To enable Developer Options: Settings → About Phone → tap "Build Number" 7 times
2. Connect phone via USB
3. In Android Studio: select your phone in the device dropdown → click the green ▶ Run button

**Option B — Copy APK directly:**
1. Copy `app-debug.apk` to your phone (via USB, Google Drive, email, etc.)
2. On your phone: open the APK file
3. Allow "Install from unknown sources" when prompted
4. Install

---

### Making it use the live backend

Your Angular code already points to `https://habitos-api.xiltepin.me/api` in `environment.ts`. The APK will use that same URL — so as long as your backend is running and reachable from the internet, the app just works.

If you want it to work on the same local network without internet, change the API URL in `environment.ts` to your local IP before building:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://192.168.0.6:3001/api',  // your server's local IP
};
```

Then rebuild and sync:
```bash
npm run build
npx cap sync android
```

---

### Updating the APK after code changes

```bash
# Make your changes to Angular code, then:
npm run build
npx cap sync android
# Then rebuild APK in Android Studio as before
```

---

### Troubleshooting APK

**App shows blank white screen:**
- Check that `webDir` in `capacitor.config.ts` matches your actual build output folder
- Run `npm run build` again and check for errors
- Verify `dist/frontend/browser/index.html` exists

**Network requests fail (API calls don't work):**
- Your backend must be on HTTPS if `androidScheme: 'https'` is set
- Or change to `androidScheme: 'http'` and add this to `android/app/src/main/AndroidManifest.xml`:
  ```xml
  <application android:usesCleartextTraffic="true" ...>
  ```

**Gradle sync fails in Android Studio:**
- File → Invalidate Caches → Restart
- Make sure Android SDK is installed: Android Studio → SDK Manager

**"SDK location not found" error:**
- In the `android/` folder, create `local.properties`:
  ```
  sdk.dir=/Users/yourname/AppData/Local/Android/Sdk
  ```
  (find the actual path in Android Studio → SDK Manager)

---

## 🐛 Troubleshooting

### Backend won't start

```bash
docker compose logs habitnow-backend
sudo lsof -i :3001   # check port conflict
```

### Frontend shows 404 on refresh

Nginx handles this via `try_files $uri $uri/ /index.html`.

### CORS errors

```bash
docker compose logs habitnow-backend | grep CORS
# Should show: [CORS] Allowed origin: https://habitos.xiltepin.me
```

### Database lost after restart

```bash
docker volume ls | grep habitnow
docker cp habitnow-backend:/app/data/habitnow.db ~/backups/habitnow-$(date +%Y%m%d).db
```

---

## 📦 Port Configuration

| Service | Port |
|---------|------|
| Frontend | 4201 |
| Backend | 3001 |

No conflicts with Open WebUI (3000), Subtitle Frontend (4200), Subtitle Backend (5001), Ollama (11434).

---

## 🔒 Security Checklist

- [ ] Change `JWT_SECRET` to a strong random value
- [ ] Use HTTPS in production (via reverse proxy)
- [ ] Keep dependencies updated (`npm audit fix`)
- [ ] Never commit `.env` files
- [ ] Regular database backups

---

## 🗺 Roadmap

- [ ] Android APK via Capacitor
- [ ] Push notifications for habit reminders
- [ ] Habit templates
- [ ] Data export/import (CSV)
- [ ] Multi-language support
- [ ] Gamification (achievements, badges)
- [ ] PostgreSQL option for larger deployments

---

**Happy Habit Tracking! 🌱
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

### UI Features
- ✅ Mobile-responsive design
- ✅ Dark mode support
- ✅ Progress ring visualization
- ✅ Monthly calendar heatmap
- ✅ Statistics dashboard
- ✅ Bottom navigation
- ✅ FAB button for quick habit creation

### Customization
- ✅ 20 icon choices
- ✅ 10 color options
- ✅ Custom habit names
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
- **Tailwind CSS** - Styling (utility classes only)

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
│       └── completions/        # Habit completions
│           ├── completion.entity.ts
│           ├── completions.controller.ts
│           ├── completions.service.ts
│           └── completions.module.ts
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
        ├── styles.css          # Global styles
        ├── environments/
        │   ├── environment.ts      # Dev config
        │   └── environment.prod.ts # Prod config (git-ignored)
        └── app/
            ├── app.component.ts    # Root component
            ├── app.config.ts       # App configuration
            ├── app.routes.ts       # Route definitions
            ├── core/               # Core services
            │   ├── guards/
            │   ├── interceptors/
            │   ├── layout/
            │   └── services/
            └── features/           # Feature modules
                ├── auth/
                ├── habits/
                ├── today/
                └── stats/
```

---

## 🐳 Deployment Options

### Option 1: Docker (Production - Recommended)

**Pros:**
- ✅ Isolated environment
- ✅ Auto-restart on reboot
- ✅ Easy scaling
- ✅ Consistent across environments

```bash
cd ~/tools/habitnow
./start.sh
```

**Access:**
- Frontend: http://localhost:4201
- Backend: http://localhost:3001/api

---

### Option 2: Manual (Development)

**Pros:**
- ✅ Hot reload
- ✅ Easy debugging
- ✅ Direct file access

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

**Access:**
- Frontend: http://localhost:4201
- Backend: http://localhost:3001/api

---

## 🔐 Environment Configuration

### Root `.env` (for Docker Compose)

```bash
# Copy template
cp .env.example .env

# Edit variables
nano .env
```

**Example:**
```env
# JWT Secret (CHANGE THIS!)
JWT_SECRET=your_super_secret_jwt_key_here

# Ports
BACKEND_PORT=3001
FRONTEND_PORT=4201

# URLs (update with your domains)
FRONTEND_URL=https://habitos.xiltepin.me
BACKEND_URL=https://habitos-api.xiltepin.me

# Environment
NODE_ENV=production
```

---

### Backend `.env` (Development)

Location: `backend/.env`

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

Location: `backend/.env.production`

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

**⚠️ Important:** This file is git-ignored. Update with your actual API URL.

---

## 📡 API Documentation

### Base URL

- **Development:** `http://localhost:3001/api`
- **Production:** `https://habitos-api.xiltepin.me/api`

---

### Authentication

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "name": "John Doe",
  "password": "password123"
}

Response:
{
  "access_token": "jwt_token_here",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response: (same as register)
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer {jwt_token}

Response:
{
  "id": 1,
  "email": "user@example.com",
  "name": "John Doe"
}
```

---

### Habits

#### Get All Habits
```http
GET /api/habits
Authorization: Bearer {jwt_token}

Response:
[
  {
    "id": 1,
    "name": "Morning Exercise",
    "type": "good",
    "frequency": "daily",
    "timeOfDay": "morning",
    "icon": "fitness",
    "color": "blue",
    "streak": 5,
    "archived": false
  }
]
```

#### Get Today's Habits
```http
GET /api/habits/today?date=2026-02-18
Authorization: Bearer {jwt_token}

Response: (same as above, filtered for today)
```

#### Create Habit
```http
POST /api/habits
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "name": "Drink Water",
  "type": "good",
  "frequency": "daily",
  "timeOfDay": "anytime",
  "icon": "water",
  "color": "blue"
}
```

#### Update Habit
```http
PUT /api/habits/:id
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "name": "Updated Name",
  "archived": true
}
```

#### Delete Habit
```http
DELETE /api/habits/:id
Authorization: Bearer {jwt_token}
```

---

### Completions

#### Toggle Completion
```http
POST /api/completions/toggle/:habitId
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "date": "2026-02-18"
}

Response:
{
  "completed": true,
  "date": "2026-02-18"
}
```

#### Get Completion History
```http
GET /api/completions/history/:habitId
Authorization: Bearer {jwt_token}

Response:
[
  {
    "id": 1,
    "date": "2026-02-18",
    "habitId": 1
  }
]
```

#### Get Monthly Stats
```http
GET /api/completions/stats/month?year=2026&month=2
Authorization: Bearer {jwt_token}

Response:
{
  "2026-02-01": 3,
  "2026-02-02": 5,
  ...
}
```

---

## 💻 Development

### Backend Development

```bash
cd backend

# Install dependencies
npm install

# Run in dev mode (hot reload)
npm run start:dev

# Run in production mode
npm run build
npm run start:prod

# Run tests
npm test
npm run test:e2e
```

---

### Frontend Development

```bash
cd frontend

# Install dependencies
npm install

# Run dev server
npm start

# Build for production
npm run build

# Run tests
npm test
```

---

### Database Management

**Location (Docker):** Docker volume `habitnow-data`
**Location (Manual):** `backend/habitnow.db`

```bash
# Access SQLite in Docker
docker exec -it habitnow-backend sh
cd /app/data
sqlite3 habitnow.db

# View tables
.tables

# Query users
SELECT * FROM users;

# Exit
.exit
```

---

## 🚀 Production Deployment

### 1. Clone Repository

```bash
cd ~/tools
git clone <your-repo-url> habitnow
cd habitnow
```

---

### 2. Configure Environment

```bash
# Copy template
cp .env.example .env

# Generate secure JWT secret
openssl rand -base64 32

# Edit .env
nano .env
```

Update:
- `JWT_SECRET` with generated value
- `FRONTEND_URL` with your domain
- `BACKEND_URL` with your API domain

---

### 3. Deploy with Docker

```bash
# Make scripts executable
chmod +x start.sh stop.sh

# Start containers
./start.sh

# Verify
docker compose ps
```

---

### 4. Configure Reverse Proxy (Nginx Proxy Manager)

**Frontend Proxy Host:**
- Domain: `habitos.xiltepin.me`
- Forward to: `192.168.0.6:4201`
- SSL: Enabled (Let's Encrypt)
- Force SSL: Yes

**Backend Proxy Host:**
- Domain: `habitos-api.xiltepin.me`
- Forward to: `192.168.0.6:3001`
- SSL: Enabled (Let's Encrypt)
- Force SSL: Yes

**Advanced Config (both):**
```nginx
proxy_hide_header Permissions-Policy;

location / {
    proxy_pass http://192.168.0.6:4201;  # or 3001 for backend
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

---

### 5. Setup Auto-Start on Reboot

The `docker-compose.yml` already includes `restart: unless-stopped`.

**Verify:**
```bash
docker inspect habitnow-backend | grep -A 5 RestartPolicy
```

**Test:**
```bash
# Reboot WSL
wsl --shutdown

# Start WSL again
wsl

# Check containers
docker compose ps
```

---

## 📦 Port Configuration

### Development
- Frontend: `4201`
- Backend: `3001`

### Production (Docker)
- Frontend: `4201:80` (container:host)
- Backend: `3001:3001`

### No Conflicts With
- Open WebUI: `3000`
- Subtitle Frontend: `4200`
- Subtitle Backend: `5001`
- Ollama: `11434`

---

## 🐛 Troubleshooting

### Backend won't start

```bash
# Check logs
docker compose logs habitnow-backend

# Common issues:
# 1. Port 3001 already in use
sudo lsof -i :3001
kill -9 <PID>

# 2. Database permission issues
docker exec habitnow-backend ls -la /app/data/

# 3. Environment variables not loaded
docker exec habitnow-backend env | grep JWT_SECRET
```

---

### Frontend shows 404 on refresh

This is normal for SPAs. Nginx is configured to handle this.

**Verify nginx.conf:**
```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

---

### CORS errors

**Check backend CORS configuration:**
```bash
docker compose logs habitnow-backend | grep CORS
```

Should show:
```
[CORS] Allowed origin: https://habitos.xiltepin.me
```

**If wrong, update:**
1. `docker-compose.yml` → `FRONTEND_URL` env var
2. Rebuild: `docker compose up -d --build habitnow-backend`

---

### Can't login from external network

**Check frontend API URL:**
```bash
docker exec habitnow-frontend sh -c "cat /usr/share/nginx/html/*.js | grep -o 'habitos-api' | head -1"
```

Should output: `habitos-api`

**If shows localhost:**
1. Update `frontend/src/environments/environment.prod.ts`
2. Rebuild: `docker compose up -d --build habitnow-frontend`

---

### Database lost after restart

**Check volume:**
```bash
docker volume ls | grep habitnow
docker volume inspect habitnow-data
```

**Backup database:**
```bash
# Create backup
docker cp habitnow-backend:/app/data/habitnow.db ~/backups/habitnow-$(date +%Y%m%d).db

# Restore backup
docker cp ~/backups/habitnow-20260218.db habitnow-backend:/app/data/habitnow.db
docker compose restart habitnow-backend
```

---

## 🔒 Security Checklist

- [ ] Change `JWT_SECRET` to a strong random value
- [ ] Use HTTPS in production (via reverse proxy)
- [ ] Keep dependencies updated (`npm audit fix`)
- [ ] Use environment variables (never commit secrets)
- [ ] Enable firewall rules
- [ ] Regular database backups
- [ ] Monitor logs for suspicious activity
- [ ] Use strong passwords for user accounts

---

## 📊 Monitoring

### View Logs

```bash
# All services
docker compose logs -f

# Just backend
docker compose logs -f habitnow-backend

# Just frontend
docker compose logs -f habitnow-frontend

# Last 50 lines
docker compose logs --tail=50 habitnow-backend
```

---

### Health Checks

```bash
# Container status
docker compose ps

# Test backend
curl http://localhost:3001/api/auth/me

# Test frontend
curl http://localhost:4201
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgments

- Inspired by the Android HabitNow app
- Built with NestJS and Angular
- Containerized with Docker

---

## 📞 Support

For issues, questions, or contributions:
- Open an issue on GitHub
- Check the troubleshooting section above
- Review Docker logs for error details

---

## 🗺 Roadmap

- [ ] Add habit templates
- [ ] Social features (share habits)
- [ ] Data export/import
- [ ] Mobile app (React Native)
- [ ] Habit reminders/notifications
- [ ] Gamification (achievements, badges)
- [ ] Multi-language support
- [ ] PostgreSQL option for larger deployments

---

**Happy Habit Tracking! 🌱**
# WebPad - Project Plan

## Project Overview

**WebPad** is a production-ready webtoon platform for Myanmar audience. It consists of **TWO SEPARATE PROJECTS** that are connected via API:

- **WebPad Website (Frontend)** - Main platform for users to browse, read, and interact with webtoons
- **WebPad Admin (Frontend)** - Admin dashboard for managing webtoons, users, and analytics
- **WebPad Backend (API)** - Shared backend API for both frontend projects

---

## ⚠️ IMPORTANT: Project Separation

### Backend/Frontend Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        WebPad Backend                        │
│                    (NodeJS + MongoDB + API)                  │
│                                                              │
│  - REST API / GraphQL                                        │
│  - Authentication (Auth0)                                    │
│  - Database (MongoDB)                                        │
│  - Image Storage (Cloudinary)                                │
│  - Business Logic                                            │
└─────────────────────────────────────────────────────────────┘
                    │                       │
                    ▼                       ▼
┌─────────────────────────┐   ┌─────────────────────────┐
│    WebPad Website       │   │     WebPad Admin        │
│    (Frontend)           │   │     (Frontend)          │
│                         │   │                         │
│  - React + TypeScript   │   │  - React + TypeScript   │
│  - Vite                 │   │  - Vite                 │
│  - Tailwind CSS         │   │  - Tailwind CSS         │
│  - User-facing UI       │   │  - Admin Dashboard UI   │
└─────────────────────────┘   └─────────────────────────┘
```

### Key Principles

1. **NEVER mix backend and frontend code** - They are completely separate projects
2. **Shared API** - Both frontends communicate with the same backend API
3. **Separate Deployments** - Each project deploys independently
4. **Separate Repositories** - Each project has its own Git repository

---

## Project Information

| Category            | Details                                     |
| ------------------- | ------------------------------------------- |
| **Project Type**    | Production-ready, Full Product              |
| **Target Audience** | Myanmar (All ages)                          |
| **Language**        | Myanmar (Multi-language support later)      |
| **Platform**        | Web (Responsive: Desktop + Tablet + Mobile) |
| **Future**          | iOS/Android Native Apps                     |

---

## Tech Stack

### Frontend (WebPad Website & WebPad Admin)

| Technology               | Purpose       |
| ------------------------ | ------------- |
| React                    | UI Library    |
| TypeScript               | Type Safety   |
| Vite                     | Build Tool    |
| Tailwind CSS v4          | Styling       |
| Tailwind Catalyst UI Kit | UI Components |
| Lucide Icons             | Icon Library  |
| Framer Motion            | Animations    |

### Backend (WebPad API)

| Technology      | Purpose         |
| --------------- | --------------- |
| NodeJS          | Backend Runtime |
| Express/Fastify | Web Framework   |
| MongoDB         | Database        |
| Auth0           | Authentication  |
| Cloudinary      | Image Storage   |

### Deployment

| Project        | Platform              |
| -------------- | --------------------- |
| WebPad Website | Vercel                |
| WebPad Admin   | Vercel                |
| WebPad Backend | Vercel/Railway/Render |

### Development Tools

| Technology | Purpose                 |
| ---------- | ----------------------- |
| ESLint     | Code Linting            |
| Prettier   | Code Formatting         |
| Storybook  | Component Documentation |

---

## Theme Colors (Tailwind CSS)

| Color Name     | Tailwind Class | Usage                            |
| -------------- | -------------- | -------------------------------- |
| Primary        | `primary-600`  | CTA buttons, Logo, Active states |
| Primary Light  | `primary-100`  | Tags, Episode backgrounds        |
| Primary Dark   | `primary-700`  | Hover states                     |
| Text Dark      | `gray-900`     | Primary text                     |
| Text Secondary | `gray-500`     | Secondary text                   |
| Background     | `gray-50`      | Page backgrounds                 |

---

### Frontend Structure (WebPad Website)

```
project-root/
├── index.html                    # HTML entry point
├── package.json
├── vite.config.ts
├── vitest.config.ts              # Vitest test runner config
├── tsconfig.json                 # TS refs router config
├── tsconfig.app.json             # App TS config (for src/)
├── tsconfig.node.json            # Node TS config (for vite/vitest/eslint configs)
├── eslint.config.js              # ESLint flat config
├── .prettierrc.json              # Prettier config
├── .prettierignore               # Prettier ignore
├── .gitignore
├── .husky/                       # Husky git hooks
├── .cursor/                      # Cursor editor rules and skills
├── .trae/                        # Trae editor skills
├── .antigravity/                 # Antigravity project planning, rules, and skills backups
│   ├── rules/                    # Centralized editor rules (.mdc files)
│   ├── skills/                   # Centralized editor skills (wiki skill)
│   ├── PROJECT_PLAN.md
│   ├── PROJECT_RULES.md
│   ├── CHANGELOG.md
│   └── LAST_SESSION.md
├── wiki/                         # Long-term knowledge base (markdown docs)
├── docs/sessions/                # Local daily session logs (gitignored)
├── .storybook/
│   ├── main.ts
│   └── preview.ts
└── src/
    ├── main.tsx                  # Application entry point
    ├── App.tsx                   # Root component
    ├── vite-env.d.ts
    ├── index.css                 # Tailwind v4 entry stylesheet
    ├── components/               # Shared modular UI components
    │   ├── Button/
    │   │   ├── Button.tsx        # UI Component
    │   │   ├── Button.stories.tsx # Storybook (SAME FOLDER)
    │   │   └── index.ts
    │   └── ...
    ├── layouts/                  # Shared layouts (MainLayout, AuthLayout, ReaderLayout)
    ├── features/                 # Modular feature-centric code directories
    │   ├── auth/                 # Authentication features (Login/Register, useAuth context store)
    │   ├── home/                 # Home page catalog
    │   ├── reader/               # Reader core page
    │   ├── info/                 # Unified static informational pages (About, Terms, Help, etc.)
    │   └── ...
    ├── lib/                      # Core utility libraries and settings
    │   ├── i18n/                 # Localization setup and translation JSON files
    │   └── utils/                # General utility helper files (formatters)
    ├── test/                     # Centralized test workspace (setup configs & test files)
    │   ├── setup.ts              # Jest-dom initialization setup
    │   ├── Card.test.tsx         # Centralized test suites
    │   └── ...
    ├── types/                    # Frontend TypeScript type declarations
    ├── constants/                # Global configurations and constants
    └── demo/                     # Mock database re-exports
        └── mocks/
            └── data.ts
```

### Backend Structure (WebPad API)

```
webpad-backend/
├── src/
│   ├── index.ts                  # Entry point
│   ├── app.ts                    # Express/Fastify app
│   ├── routes/                   # API routes
│   ├── controllers/              # Request handlers
│   ├── services/                 # Business logic
│   ├── models/                   # MongoDB models
│   ├── middleware/               # Express middleware
│   ├── utils/                    # Utilities
│   ├── types/                    # TypeScript types
│   └── config/                   # Configuration
├── package.json
├── tsconfig.json
└── .env
```

---

## Features

### User Features (WebPad Website)

#### Authentication

- [x] User Registration (Email/Password)
- [x] User Login (Email/Password)
- [ ] OAuth Login (Google, Facebook) - UI Ready, needs backend
- [x] Password Reset
- [ ] Email Verification - needs backend
- [x] Session Management (Mock)

#### Webtoon Browsing

- [x] Home Page (Featured, Trending, New)
- [x] Categories/Genres Page
- [x] Search with Filters
- [x] Webtoon Detail Page
- [x] Episode List
- [x] Cover Image Rendering (Real Images + Fallback)

#### Webtoon Reading

- [x] Vertical Scroll Reader (like LINE Webtoon)
- [x] Responsive Reading (Desktop + Tablet + Mobile)
- [x] Font Size Customization
- [x] Reading Progress Auto-save
- [x] Episode Navigation
- [x] Dark Mode Reading

#### User Library

- [x] Bookmarks
- [x] Reading History
- [ ] Downloaded Episodes (Future)

#### User Profile

- [x] Profile Settings
- [x] Reading Preferences
- [x] Notification Settings
- [x] Account Management

#### Social Features

- [x] Comments
- [x] Reactions (Like, Love, etc.)
- [ ] Follow Writers - needs backend
- [x] Share Webtoons

#### Notifications

- [x] New Episode Notifications
- [x] Comment Replies
- [x] System Notifications

#### Coins & Payment
- [x] Coins Balance
- [x] Purchase Coins (Mock Data)
- [x] Payment Gateway (MMQR, A+) (Mock Data)
- [x] Premium Episodes

#### Static Pages
- [x] Company: About, Careers, Press
- [x] Support: Help Center, Contact, FAQ
- [x] Legal: Privacy Policy, Terms of Service, Cookie Policy

### Admin Features (WebPad Admin) ✅

> **Note:** Admin Dashboard is a separate project at `webpad-admin-dashboard`

#### Dashboard

- [x] Overview Statistics
- [x] Revenue Analytics
- [x] User Statistics
- [x] Popular Webtoons

#### Webtoon Management

- [x] Upload Webtoons
- [x] Edit Webtoons
- [x] Delete Webtoons
- [x] Episode Management
- [x] Content Moderation

#### User Management

- [x] View Users
- [x] Ban Users
- [x] User Statistics

#### Analytics

- [x] View Counts
- [x] Revenue Reports
- [x] User Engagement

---

## Payment System

### Coins System

- Fixed Packages
- Custom Amount
- Balance Management

### Payment Gateway (Mock Data for now)

- MMQR
- A+

### Premium Content

- Free Episodes
- Paid Episodes (Admin Control)
- Coin Unlock System

---

## Development Phases

### Phase 1: Project Setup ✅

- [x] Initialize React + TypeScript + Vite
- [x] Setup Tailwind CSS v3
- [x] Setup ESLint + Prettier
- [x] Setup Storybook
- [x] Create Folder Structure
- [ ] Setup Git

### Phase 2: Core Components ✅

- [x] Button Component
- [x] Input Component
- [x] Card Component
- [x] Modal Component
- [x] Navigation Component
- [x] Footer Component

### Phase 3: Authentication ✅

- [x] Login Page
- [x] Register Page
- [x] Password Reset
- [ ] OAuth Integration - UI Ready, needs backend
- [x] Protected Routes

### Phase 4: Webtoon Browsing ✅

- [x] Home Page
- [x] Categories Page
- [x] Search Page
- [x] Webtoon Detail Page

### Phase 5: Webtoon Reading ✅

- [x] Reader Component
- [x] Episode Navigation
- [x] Reading Progress
- [x] Font Customization

### Phase 6: User Features ✅

- [x] User Profile
- [x] Library/Bookmarks
- [x] Comments & Reactions
- [x] Notifications

### Phase 7: Coins & Payment ✅

- [x] Coins System (Mock)
- [x] Payment Integration (Mock)
- [x] Premium Content

### Phase 8: Backend API

- [ ] Setup NodeJS Backend
- [ ] MongoDB Models
- [ ] API Routes
- [ ] Authentication Middleware
- [ ] Cloudinary Integration

### Phase 9: Admin Dashboard ✅

> **Note:** Admin Dashboard is a separate project at `webpad-admin-dashboard`

- [x] Admin Authentication
- [x] Dashboard Overview
- [x] Webtoon Management
- [x] User Management
- [x] Analytics
- [x] Media Library
- [x] Reports Management
- [x] Activity Log
- [x] Revenue & Payments
- [x] Notifications System
- [x] Scheduled Publish

### Phase 10: Testing & Optimization ✅

- [x] Unit Tests
- [x] Integration Tests
- [x] Performance Optimization
- [x] SEO Optimization

### Phase 11: Internationalization (i18n) ✅

- [x] Setup react-i18next
- [x] Create Myanmar translations (default)
- [x] Create English translations
- [x] Add Language Switcher component
- [x] Update Navigation with Language Switcher
- [x] Update HomePage with translations
- [x] Update mock data with bilingual format

### Phase 12: Deployment

- [ ] Production Build
- [ ] Vercel Deployment
- [ ] Domain Setup
- [ ] Monitoring Setup

---

## Responsive Design

### Breakpoints

| Device  | Breakpoint     |
| ------- | -------------- |
| Mobile  | < 640px        |
| Tablet  | 640px - 1024px |
| Desktop | > 1024px       |

### Reading Experience

- Vertical Scroll (Primary)
- Horizontal Scroll (Optional)
- Responsive Image Loading
- Lazy Loading for Images

---

## Security

- HTTPS Only
- JWT Token Authentication
- Password Encryption (bcrypt)
- XSS Protection
- CSRF Protection
- Rate Limiting

---

## Performance

- Lazy Loading Images
- Code Splitting
- Caching Strategies
- Optimized Assets
- CDN for Images (Cloudinary)

---

## Future Enhancements

- [ ] Multi-language Support
- [ ] iOS Native App
- [ ] Android Native App
- [ ] PWA Support
- [ ] Offline Reading
- [ ] Writer Dashboard
- [ ] Community Features
- [x] Upgrade to Tailwind CSS v4

---

## Project Locations

| Project            | Path                                                                    |
| ------------------ | ----------------------------------------------------------------------- |
| WebPad Website     | `C:\Users\keych\Development\Projects\SNS\webpad`                        |
| WebPad Admin       | `C:\Users\keych\Development\Projects\SNS\webpad-admin-dashboard`        |
| WebPad Backend     | `C:\Users\keych\Development\Projects\SNS\webpad-backend` (TODO)         |
| Shared Package     | `webpad\packages\shared`                                                |

---

## Last Updated

**Date:** 2026-07-13
**Status:** Project Restructure, Tooling setup, and Tailwind v4 upgrade complete. Phase 8 (Backend API) and Phase 12 (Deployment) remaining.

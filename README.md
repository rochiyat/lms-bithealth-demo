<div align="center">

# 🎓 Bithealth Learning Hub

**Enterprise-grade Learning Management System — Multi-tenant, Role-based, Gamified**

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-7.0-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.1-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vite.dev/)
[![HeroUI](https://img.shields.io/badge/HeroUI-v3-000000?style=flat-square)](https://www.heroui.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.3-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

A fully functional **demo frontend** for an internal multi-tenant LMS, showcasing modern UI patterns, role-based access control, and gamification mechanics — all running client-side with a pluggable backend adapter.

</div>

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 📚 Learning Management
- Courses, modules, quizzes & assignments
- Enrollment, progress tracking & certificates
- Learning Paths & Learning Campaigns
- Course feedback after completion

</td>
<td width="50%">

### 🏢 Organization & Multi-tenancy
- Groups, tenants & departments
- Job families & project squads
- Employee management
- Scoped data per tenant context

</td>
</tr>
<tr>
<td width="50%">

### 🏆 Gamification Engine
- Points, badges & level progression
- Milestones, streaks & missions
- Leaderboards & point ledger
- Weekly Knowledge Challenge

</td>
<td width="50%">

### 📊 Analytics & Reporting
- Role-specific dashboards (Super Admin, HR, Manager, Employee)
- Knowledge Gap Dashboard
- Audit logs & activity reports
- Import / Export JSON & seed data reset

</td>
</tr>
<tr>
<td width="50%">

### 🔐 Access Control
- Full RBAC on navigation & routes
- Unauthorized page handling
- Role switching via profile menu

</td>
<td width="50%">

### 📱 Responsive Design
- Desktop, tablet & mobile layouts
- Adaptive navigation & sidebars
- Touch-friendly interactions

</td>
</tr>
</table>

---

## 🛠 Tech Stack

| Layer | Technology |
|:---|:---|
| **Framework** | React 19 + TypeScript 7.0 |
| **Build Tool** | Vite 8.1 |
| **UI Library** | HeroUI v3 |
| **Styling** | Tailwind CSS 4.3 |
| **Routing** | React Router 7 |
| **Icons** | Lucide React |
| **Storage** | LocalStorage (default) · REST API adapter (optional) |

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9

### Installation

```bash
# Clone the repository
git clone https://github.com/rochiyat/lms-bithealth-demo.git
cd lms-bithealth-demo

# Install dependencies
npm install

# Start development server
npm run dev
```

### Production Build

```bash
npm run build
npm run preview
```

---

## 🔑 Demo Accounts

All accounts use password: **`demo123`**

| Role | Email | Access Level |
|:---|:---|:---|
| 🛡 Super Admin | `superadmin@bithealth.co.id` | Full system access |
| 👥 HR Admin | `hr@bithealth.co.id` | Employee & learning management |
| 📋 Manager | `manager@bithealth.co.id` | Team oversight & reports |
| 👤 Employee | `employee@bithealth.co.id` | Personal learning dashboard |

> **💡 Tip:** You can switch roles on-the-fly via the profile menu in the top-right corner.

---

## 🏗 Architecture

```
src/
├── app/                    # App shell, routing & layout
├── components/             # Reusable UI components
├── contexts/               # React context providers
├── data/                   # Seed data & fixtures
├── domain/                 # Domain types & business logic
├── infrastructure/         # Repository adapters (localStorage / HTTP)
├── pages/                  # Page-level components
├── utils/                  # Shared utilities & helpers
├── main.tsx                # Application entry point
└── styles.css              # Global styles & design tokens
```

### Data Layer

The application uses a **repository pattern** — all pages depend on the `AppRepository` interface, not directly on localStorage. This makes swapping the data layer trivial.

| Mode | Description |
|:---|:---|
| `LocalStorageRepository` *(default)* | Persists data in browser storage under key `bithealth-learning-hub-db-v3` |
| `HttpRepository` | Proxies all operations to a REST API backend |

---

## 🔌 Backend Integration

To connect a real backend, configure the environment variables:

```bash
# Copy the example env file
cp .env.example .env
```

```env
VITE_DATA_SOURCE=api
VITE_API_BASE_URL=http://localhost:3000/api
```

### Required API Endpoints

| Method | Endpoint | Description |
|:---|:---|:---|
| `GET` | `/demo/database` | Export full database |
| `PUT` | `/demo/database` | Import full database |
| `POST` | `/demo/database/reset` | Reset to seed data |
| `GET` | `/:collection` | List collection items |
| `POST` | `/:collection` | Create item |
| `PATCH` | `/:collection/:id` | Update item |
| `DELETE` | `/:collection/:id` | Delete item |

> For production, endpoints can be replaced with domain-specific services. The frontend repository interface remains unchanged — mapping is handled in the adapter layer.

### Production Checklist

When moving to a real backend, consider the following:

- [ ] Replace demo login with **access token / refresh token** or session-based auth
- [ ] Derive tenant context from **JWT claims & membership**, not client state
- [ ] Use **signed URLs** for video, documents & certificate assets
- [ ] Process bulk operations (mass assignment, export, certificate generation, notifications) via **background jobs**
- [ ] Implement **pagination, filtering, sorting & error contracts** server-side
- [ ] Add **permission guards & audit logging** at the API layer
- [ ] **Hash passwords** — plaintext fields exist only for demo purposes

---

## 💾 Data Management

The **Settings & Data** page provides built-in tools:

| Action | Description |
|:---|:---|
| 📤 Export | Download the entire database as JSON |
| 📥 Import | Upload a previously exported JSON file |
| 🔄 Reset | Restore the database to its initial seed state |

All data created or modified through the UI persists across browser refreshes.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Built with ❤️ by [Rochiyat](https://github.com/rochiyat)**

</div>

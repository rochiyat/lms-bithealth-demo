# Bithealth Learning Hub

Demo frontend LMS internal multi-tenant untuk Bithealth berdasarkan `prd-lms-v3.md`.

## Stack

- React + Vite + TypeScript
- HeroUI v3 + Tailwind CSS v4
- React Router
- LocalStorage repository dengan REST API adapter

## Menjalankan aplikasi

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
npm run preview
```

## Akun demo

Semua akun memakai password `demo123`.

| Role | Email |
|---|---|
| Super Admin | `superadmin@bithealth.co.id` |
| HR Admin | `hr@bithealth.co.id` |
| Manager | `manager@bithealth.co.id` |
| Employee | `employee@bithealth.co.id` |

Role juga dapat diganti melalui profile menu di kanan atas.

## Modul demo

- Multi-tenant organization: groups, tenants, departments, job families, project squads, employees
- Course, modules, quiz, assignment, enrollment, progress, certificate
- Learning Path dan Learning Campaign
- Weekly Knowledge Challenge yang dapat dikerjakan
- Course feedback setelah completion
- Knowledge Gap Dashboard
- Points, point ledger, badges, levels, milestones, streaks, missions, leaderboards
- Dashboard khusus Super Admin, HR, Manager, dan Employee
- RBAC pada navigasi dan route, termasuk halaman unauthorized
- Audit log, reports, import/export JSON, reset seed data
- Responsive desktop, tablet, dan mobile

## Penyimpanan data

Default menggunakan `LocalStorageRepository` dengan key:

```text
bithealth-learning-hub-db-v3
```

Semua halaman bergantung pada interface `AppRepository`, bukan langsung ke localStorage.

## Mengganti dengan backend

1. Salin `.env.example` menjadi `.env`.
2. Set konfigurasi:

```env
VITE_DATA_SOURCE=api
VITE_API_BASE_URL=http://localhost:3000/api
```

3. Implementasikan endpoint sesuai adapter `src/infrastructure/repositories/httpRepository.ts`:

```text
GET    /demo/database
PUT    /demo/database
POST   /demo/database/reset
GET    /:collection
POST   /:collection
PATCH  /:collection/:id
DELETE /:collection/:id
```

Untuk backend produksi, endpoint dapat diganti menjadi service per domain. Interface repository frontend tetap dapat dipertahankan dan mapping dilakukan di adapter.

## Catatan integrasi backend

- Ganti login demo dengan access token/refresh token atau session.
- Tambahkan tenant context dari token dan membership, bukan hanya client state.
- Gunakan signed URL untuk video, dokumen, dan sertifikat.
- Jalankan mass assignment, export, certificate generation, notification, dan recurrence melalui background job.
- Terapkan pagination, filter, sort, error contract, permission guard, dan audit log di backend.
- Hash password; field password di seed hanya untuk kebutuhan demo frontend.

## Reset dan migrasi data demo

Menu **Settings & Data** menyediakan:

- Export seluruh database ke JSON
- Import database JSON
- Reset ke seed awal

Data dummy dapat diedit melalui CRUD dan tetap tersedia setelah browser di-refresh.

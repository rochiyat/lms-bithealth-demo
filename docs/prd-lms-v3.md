# Product Requirements Document (PRD)
## Bithealth Learning Hub — LMS Internal Multi-Tenant

**Nama Produk:** Bithealth Learning Hub  
**Versi:** 3.0  
**Tanggal:** 15 Juli 2026  
**Status:** Draft untuk Review Internal HR dan Manajemen  
**Product Owner:** Human Resources Bithealth  
**Disusun oleh:** Bithealth Product & Engineering  

---

## 1. Tujuan Dokumen

Dokumen ini menjadi sumber kebutuhan utama untuk pengembangan Learning Management System internal Bithealth.

PRD ini mendefinisikan:

- tujuan bisnis dan masalah yang ingin diselesaikan;
- ruang lingkup MVP dan fase lanjutan;
- pengguna dan hak akses;
- functional requirements;
- business rules;
- acceptance criteria;
- model data tingkat tinggi;
- kebutuhan keamanan dan multi-tenancy;
- kebutuhan reporting dan analytics;
- strategi pengujian;
- milestone implementasi;
- risiko dan open decisions.

Apabila terdapat perbedaan antara PRD, mockup, backlog, proposal, atau hasil diskusi, urutan referensi yang digunakan adalah:

1. Perubahan scope tertulis yang telah disetujui.
2. PRD versi terbaru yang telah disetujui.
3. Requirement Traceability Matrix.
4. Proposal internal.
5. Mockup dan backlog.
6. Catatan diskusi.

Perubahan setelah PRD menjadi baseline harus melalui proses Change Request apabila memengaruhi scope, timeline, biaya, arsitektur, atau acceptance criteria.

---

## 2. Ringkasan Eksekutif

Bithealth Learning Hub adalah Learning Management System internal untuk mengelola pembelajaran, assessment, sertifikasi, pengembangan kompetensi, dan budaya knowledge sharing di Bithealth.

Platform dirancang untuk kebutuhan perusahaan konsultan IT dengan karakteristik:

- karyawan bekerja dalam berbagai department, job family, dan project squad;
- kompetensi yang dibutuhkan mencakup kemampuan teknis, healthcare domain, delivery, komunikasi klien, keamanan, dan leadership;
- proses pembelajaran perlu dapat dipantau oleh HR dan manager;
- hasil quiz perlu dimanfaatkan untuk mendeteksi knowledge gap;
- kontribusi berbagi pengetahuan perlu mendapatkan apresiasi;
- pengalaman belajar perlu lebih menarik melalui gamifikasi yang tetap profesional.

Produk mendukung struktur organisasi:

```text
Group
└── Tenant / Company
    └── Department
        └── Employee
```

Platform tidak menggunakan role instruktur. Pengelolaan course, quiz, learning path, campaign, sertifikat, dan gamifikasi dilakukan oleh HR Admin atau admin yang memiliki permission terkait.

Fitur inti meliputi:

- multi-tenancy berbasis `group_id`, `tenant_id`, dan `department_id`;
- user, role, permission, department, job family, dan manager;
- course dan materi;
- quiz dan assessment;
- assignment dan enrollment;
- progress tracking;
- sertifikat;
- dashboard dan export laporan;
- Learning Path;
- Learning Campaign;
- Course Feedback;
- Knowledge Gap Dashboard;
- gamifikasi: points, badges, streaks, levels, milestones, leaderboards, missions, dan Weekly Knowledge Challenge.

---

## 3. Latar Belakang Masalah

Pembelajaran internal Bithealth dapat berasal dari berbagai sumber:

- materi onboarding;
- dokumen teknis;
- video pembelajaran;
- sesi knowledge sharing;
- materi keamanan informasi;
- healthcare domain knowledge;
- training project delivery;
- pembelajaran eksternal;
- sertifikasi teknis.

Tanpa platform terpusat, beberapa masalah yang berpotensi muncul adalah:

- materi sulit ditemukan kembali;
- progress belajar tidak tercatat konsisten;
- HR kesulitan mengetahui siapa yang sudah menyelesaikan training;
- manager tidak memiliki visibility atas progress tim;
- course belum tersusun menjadi learning path yang jelas;
- hasil quiz hanya menjadi nilai, belum digunakan untuk mengidentifikasi knowledge gap;
- kontribusi knowledge sharing tidak terdokumentasi;
- pembelajaran hanya aktif saat ada program tertentu;
- sertifikat dan riwayat pembelajaran tersebar;
- laporan membutuhkan rekap manual;
- karyawan kurang termotivasi karena tidak melihat milestone pribadi.

---

## 4. Visi Produk

Menjadi platform pembelajaran internal Bithealth yang:

- terpusat;
- sederhana digunakan;
- terukur;
- mendukung pengembangan kompetensi;
- mendorong budaya knowledge sharing;
- membantu kesiapan karyawan terhadap kebutuhan proyek;
- memberikan insight kepada HR dan manajemen;
- aman untuk penggunaan multi-tenant;
- dapat berkembang tanpa kompleksitas berlebihan.

---

## 5. Tujuan Produk

| ID | Tujuan |
|---|---|
| G-01 | Menyediakan platform pembelajaran internal terpusat |
| G-02 | Memudahkan HR membuat course dan quiz |
| G-03 | Memudahkan HR menugaskan course berdasarkan organisasi dan individu |
| G-04 | Memantau progress, completion, overdue, dan hasil assessment |
| G-05 | Menerbitkan sertifikat digital yang dapat diverifikasi |
| G-06 | Menyusun course menjadi Learning Path |
| G-07 | Menjalankan Learning Campaign tematik |
| G-08 | Mengukur kualitas course melalui feedback sederhana |
| G-09 | Mengidentifikasi knowledge gap berdasarkan hasil assessment |
| G-10 | Meningkatkan engagement melalui gamifikasi profesional |
| G-11 | Mendorong knowledge sharing dan kontribusi internal |
| G-12 | Mendukung reporting berdasarkan tenant, department, job family, dan periode |
| G-13 | Menjamin isolasi data antar-tenant |
| G-14 | Menyediakan fondasi integrasi HRIS dan SSO pada fase berikutnya |

---

## 6. Non-Tujuan dan Out of Scope MVP

Fitur berikut tidak termasuk MVP:

- marketplace course;
- pembayaran;
- pengguna publik;
- live streaming;
- video conference;
- aplikasi mobile native;
- mode offline;
- SCORM, xAPI, dan LTI;
- proctoring;
- essay dengan manual grading;
- forum diskusi;
- social network internal;
- AI course generator;
- AI grading;
- reward catalog dengan penukaran uang atau voucher;
- integrasi HRIS langsung;
- Single Sign-On;
- integrasi performance appraisal;
- multi-language content management;
- custom domain per tenant;
- white-label kompleks;
- marketplace sertifikasi;
- sinkronisasi otomatis sertifikasi eksternal.

---

## 7. Asumsi dan Batasan

### 7.1 Asumsi Bisnis

- Pengguna utama adalah karyawan internal Bithealth.
- HR menjadi pemilik operasional LMS.
- Manager hanya melihat data anggota tim sesuai scope.
- Tidak ada role instruktur terpisah.
- Course dapat dibuat oleh HR atau admin yang diberi permission.
- Learning point dan level tidak menjadi penentu jabatan, gaji, promosi, atau performance rating.
- Knowledge Gap Dashboard digunakan untuk kebutuhan pembelajaran, bukan untuk mempermalukan individu.
- Semua aktivitas manual yang menghasilkan poin harus dapat diverifikasi.
- Sertifikat eksternal hanya diakui setelah diverifikasi HR.

### 7.2 Baseline Kapasitas Awal

| Parameter | Baseline |
|---|---:|
| Group | 1–5 |
| Tenant | Hingga 20 |
| User aktif | Hingga 5.000 |
| Concurrent users | Hingga 300 |
| Course aktif | Hingga 500 |
| Quiz aktif | Hingga 1.000 |
| Enrollment per assignment massal | Hingga 2.500 |
| Baris export per proses | Hingga 50.000 |
| Aplikasi pengguna | Responsive web |
| Timezone default | Asia/Jakarta |

Baseline digunakan untuk desain, pengujian, dan sizing awal. Baseline bukan batas permanen produk.

---

## 8. Terminologi

| Istilah | Definisi |
|---|---|
| Group | Organisasi induk yang memiliki satu atau lebih tenant |
| Tenant | Perusahaan, unit bisnis, atau organisasi dalam sistem |
| Department | Unit organisasi dalam tenant |
| Job Family | Kelompok pekerjaan seperti Engineering, QA, PM, BA, atau Corporate Function |
| Project Squad | Tim proyek lintas department atau job family |
| Employee | Karyawan yang menjadi learner |
| HR Admin | Pengelola utama LMS |
| Manager | Pengguna yang melihat progress anggota tim |
| Course | Program pembelajaran yang terdiri dari satu atau lebih modul |
| Module | Bagian dari course yang memiliki materi atau quiz |
| Assignment | Instruksi pemberian course atau learning path kepada target tertentu |
| Enrollment | Hubungan antara employee dan course, learning path, campaign, atau challenge |
| Learning Path | Rangkaian course untuk mencapai kompetensi tertentu |
| Learning Campaign | Program pembelajaran tematik dalam periode tertentu |
| Weekly Knowledge Challenge | Quiz singkat berkala yang menjadi bagian dari gamifikasi |
| Knowledge Gap | Area pengetahuan dengan performa assessment yang masih rendah |
| Point | Nilai gamifikasi yang diperoleh dari aktivitas valid |
| Badge | Penghargaan digital karena mencapai kondisi tertentu |
| Streak | Konsistensi melakukan aktivitas belajar dalam periode berturut-turut |
| Level | Status gamifikasi berdasarkan total poin |
| Milestone | Progress menuju achievement tertentu |
| Mission | Kumpulan target pembelajaran dalam periode tertentu |
| Leaderboard | Peringkat berdasarkan poin atau metrik yang dikonfigurasi |
| Certificate | Bukti digital completion atau kompetensi |

---

## 9. Persona dan Role

### 9.1 Super Admin

Tujuan:

- mengelola platform;
- mengelola group dan tenant;
- memantau penggunaan;
- membantu operasional teknis.

Hak akses utama:

- CRUD group dan tenant;
- mengaktifkan atau menonaktifkan tenant;
- mengelola platform configuration;
- melihat audit log platform;
- melihat usage summary.

### 9.2 HR Admin

Tujuan:

- mengelola pembelajaran internal;
- mengelola employee;
- membuat course dan assessment;
- memantau progress;
- mengelola sertifikat dan gamifikasi.

Hak akses utama:

- CRUD employee, department, job family, dan manager mapping;
- import employee;
- CRUD course dan quiz;
- CRUD learning path dan campaign;
- membuat assignment;
- melihat progress dan analytics;
- mengelola certificate;
- mengelola point rules, badges, missions, challenges, dan leaderboard;
- melihat feedback dan knowledge gap;
- export laporan.

### 9.3 Manager

Tujuan:

- memantau anggota tim;
- memastikan course wajib diselesaikan;
- mengetahui knowledge gap tim.

Hak akses utama:

- melihat progress anggota tim;
- melihat overdue anggota tim;
- melihat hasil assessment agregat;
- melihat certificate anggota tim;
- mengirim reminder;
- melihat achievement tim.

### 9.4 Employee

Tujuan:

- mengikuti pembelajaran;
- mengerjakan assessment;
- melihat achievement dan sertifikat.

Hak akses utama:

- melihat course dan learning path yang ditugaskan;
- mengikuti campaign dan challenge;
- mengerjakan quiz;
- memberikan course feedback;
- melihat progress, point, badge, level, streak, milestone, dan leaderboard;
- mengunduh certificate;
- melihat learning history.

---

## 10. Matriks Hak Akses Tingkat Tinggi

| Fitur | Super Admin | HR Admin | Manager | Employee |
|---|:---:|:---:|:---:|:---:|
| Kelola group | Ya | Tidak | Tidak | Tidak |
| Kelola tenant | Ya | Sesuai scope | Tidak | Tidak |
| Kelola department | Bantuan operasional | Ya | Tidak | Tidak |
| Kelola employee | Bantuan operasional | Ya | Tidak | Profil sendiri |
| Buat course | Tidak secara bisnis | Ya | Tidak | Tidak |
| Buat quiz | Tidak secara bisnis | Ya | Tidak | Tidak |
| Buat learning path | Tidak secara bisnis | Ya | Tidak | Tidak |
| Buat campaign | Tidak secara bisnis | Ya | Tidak | Tidak |
| Buat weekly challenge | Tidak secara bisnis | Ya | Tidak | Tidak |
| Assign learning | Tidak secara bisnis | Ya | Tidak | Tidak |
| Lihat progress tenant | Platform support | Ya | Tidak | Tidak |
| Lihat progress tim | Tidak | Ya | Ya | Tidak |
| Mengikuti course | Opsional | Opsional | Opsional | Ya |
| Kelola badge dan poin | Tidak secara bisnis | Ya | Tidak | Tidak |
| Lihat leaderboard | Platform support | Ya | Ya | Ya |
| Export laporan | Platform usage | Ya | Terbatas | Tidak |

Permission final harus granular dan tidak hanya bergantung pada nama role.

---

# 11. Functional Requirements

Prioritas:

- **MUST:** wajib untuk MVP;
- **SHOULD:** penting, dapat disesuaikan berdasarkan kapasitas;
- **COULD:** nilai tambah fase lanjutan.

---

## 11.1 Organization dan Multi-Tenancy

### FR-ORG-001 — Mengelola Group

**Prioritas:** MUST

Super Admin dapat membuat, mengubah, mengaktifkan, dan menonaktifkan Group.

**Acceptance Criteria:**

- kode Group unik;
- Group tidak dapat melihat data Group lain;
- perubahan status tercatat pada audit log;
- Group nonaktif tidak dapat digunakan untuk login operasional.

### FR-ORG-002 — Mengelola Tenant

**Prioritas:** MUST

Super Admin atau HR dengan permission dapat mengelola Tenant.

**Acceptance Criteria:**

- Tenant selalu terkait satu Group;
- kode Tenant unik dalam Group;
- Tenant nonaktif tidak menerima assignment baru;
- data historis tetap tersedia;
- user tidak dapat mengakses tenant tanpa membership.

### FR-ORG-003 — Mengelola Department

**Prioritas:** MUST

HR Admin dapat CRUD department dalam tenant yang menjadi scope-nya.

**Acceptance Criteria:**

- department tidak dapat digunakan lintas tenant;
- department dapat dinonaktifkan;
- department nonaktif tidak muncul pada assignment baru;
- riwayat employee tetap tersimpan.

### FR-ORG-004 — Mengelola Job Family dan Job Title

**Prioritas:** MUST

HR Admin dapat mengelola Job Family dan Job Title.

**Acceptance Criteria:**

- Job Family dapat digunakan sebagai target assignment;
- Job Title dapat digunakan sebagai informasi profil dan filter;
- perubahan Job Family tidak menghapus riwayat enrollment;
- data dibatasi berdasarkan tenant.

### FR-ORG-005 — Manager Mapping

**Prioritas:** MUST

HR Admin dapat menetapkan manager untuk employee.

**Acceptance Criteria:**

- satu employee dapat memiliki satu primary manager;
- manager hanya melihat anggota tim yang aktif dalam scope;
- perubahan manager tercatat;
- riwayat assignment dan learning tidak berubah.

### FR-ORG-006 — Project Squad

**Prioritas:** SHOULD

HR Admin dapat membuat Project Squad dan menambahkan employee lintas department.

**Acceptance Criteria:**

- squad berada dalam satu tenant;
- assignment dapat ditargetkan ke squad;
- squad challenge dapat menggunakan persentase partisipasi;
- penghapusan squad tidak menghapus learning history.

### FR-ORG-007 — Tenant Resolution

**Prioritas:** MUST

Backend menentukan tenant dari konteks autentikasi dan membership.

**Acceptance Criteria:**

- request tenant mismatch ditolak;
- tenant tidak ditentukan hanya dari parameter client;
- seluruh query resource tenant-aware memiliki tenant scope;
- cross-tenant automated test tersedia.

---

## 11.2 Authentication, User, dan Permission

### FR-AUTH-001 — Login

**Prioritas:** MUST

User dapat login menggunakan email dan password.

**Acceptance Criteria:**

- password di-hash;
- rate limiting diterapkan;
- user nonaktif tidak dapat login;
- error login tidak mengungkap apakah email terdaftar;
- aktivitas login penting dicatat.

### FR-AUTH-002 — Reset Password

**Prioritas:** MUST

User dapat meminta reset password melalui email.

**Acceptance Criteria:**

- token reset sekali pakai;
- token memiliki masa berlaku;
- token lama tidak berlaku setelah password berubah;
- aktivitas dicatat.

### FR-AUTH-003 — Session dan Token

**Prioritas:** MUST

Sistem mendukung access token dan refresh token.

**Acceptance Criteria:**

- refresh token dapat dicabut;
- logout mengakhiri session;
- pergantian password dapat mencabut session aktif;
- token tidak dapat digunakan untuk tenant tanpa membership.

### FR-USER-001 — Mengelola Employee

**Prioritas:** MUST

HR Admin dapat CRUD employee sesuai scope.

**Data minimum:**

- employee ID;
- nama;
- email;
- tenant;
- department;
- job family;
- job title;
- manager;
- join date;
- status.

**Acceptance Criteria:**

- email dinormalisasi;
- employee nonaktif mempertahankan riwayat;
- employee tidak dihapus secara fisik jika memiliki riwayat learning;
- tenant dan department tervalidasi.

### FR-USER-002 — Bulk Import Employee

**Prioritas:** MUST

HR Admin dapat mengimpor employee melalui CSV atau XLSX.

**Acceptance Criteria:**

- tersedia template;
- validasi dilakukan sebelum commit;
- error ditampilkan per baris;
- duplicate ditangani sesuai business rule;
- hasil import menampilkan summary;
- proses besar menggunakan background job.

### FR-USER-003 — Profil Employee

**Prioritas:** MUST

Employee dapat melihat dan mengubah field profil yang diizinkan.

**Acceptance Criteria:**

- employee tidak dapat mengubah tenant, department, job family, atau manager sendiri;
- perubahan field sensitif dicatat;
- foto profil opsional.

### FR-USER-004 — Permission Granular

**Prioritas:** MUST

Sistem mendukung permission granular.

**Acceptance Criteria:**

- satu user dapat memiliki lebih dari satu role;
- role dapat dibatasi per tenant;
- permission efektif dapat diaudit;
- UI dan backend menggunakan permission yang konsisten.

---

## 11.3 Course Management

### FR-COURSE-001 — Membuat Course

**Prioritas:** MUST

HR Admin dapat membuat course.

**Data minimum:**

- title;
- description;
- thumbnail;
- category;
- skill tags;
- difficulty level;
- estimated duration;
- mandatory default;
- completion rule;
- certificate rule;
- point reward;
- owner tenant;
- status.

**Acceptance Criteria:**

- course baru berstatus Draft;
- course tidak terlihat employee sebelum Published;
- tenant scope tervalidasi;
- perubahan tercatat.

### FR-COURSE-002 — Course Lifecycle

**Prioritas:** MUST

Course memiliki status:

- Draft;
- Published;
- Archived.

**Acceptance Criteria:**

- Draft hanya dapat diakses admin;
- Published dapat diassign;
- Archived tidak menerima assignment baru;
- historical enrollment tetap tersedia.

### FR-COURSE-003 — Course Difficulty

**Prioritas:** MUST

Course memiliki tingkat kesulitan:

- General;
- Beginner;
- Intermediate;
- Advanced.

**Acceptance Criteria:**

- default General;
- terlihat pada course card dan detail;
- dapat digunakan sebagai filter;
- tidak otomatis menjadi prerequisite.

### FR-COURSE-004 — Module dan Content Item

**Prioritas:** MUST

Course terdiri dari satu atau lebih module.

Jenis content item:

- text;
- video;
- PDF;
- document;
- external link;
- quiz.

**Acceptance Criteria:**

- module memiliki urutan;
- content item memiliki urutan;
- draft dapat diedit;
- published content tidak boleh berubah secara destruktif tanpa revisi.

### FR-COURSE-005 — Navigation Mode

**Prioritas:** MUST

Course dapat menggunakan mode:

- Linear;
- Flexible.

**Acceptance Criteria:**

- linear mengunci module berikutnya;
- flexible memperbolehkan urutan bebas;
- mode disimpan pada course;
- perubahan pada course aktif tidak merusak progress existing.

### FR-COURSE-006 — Completion Rule

**Prioritas:** MUST

Course dapat menentukan kombinasi completion rule:

- seluruh module selesai;
- video mencapai threshold;
- document ditandai selesai;
- quiz lulus;
- final assessment lulus.

**Acceptance Criteria:**

- completion hanya terjadi setelah seluruh syarat terpenuhi;
- perhitungan idempotent;
- timestamp completion disimpan;
- status per komponen dapat dijelaskan.

### FR-COURSE-007 — Course Revision

**Prioritas:** SHOULD

Course Published yang mengalami perubahan material menggunakan revisi baru.

**Acceptance Criteria:**

- revisi memiliki nomor;
- enrollment menyimpan revisi yang diikuti;
- sertifikat menyimpan snapshot revisi;
- revisi lama tetap dapat diaudit.

### FR-COURSE-008 — Course Ownership dan Visibility

**Prioritas:** MUST

Course dapat dimiliki tenant atau Group.

**Acceptance Criteria:**

- Group course hanya tersedia dalam Group yang sama;
- tenant course hanya tersedia dalam tenant pemilik;
- HR tidak dapat mengubah course tenant lain;
- visibility dibatasi sesuai permission.

---

## 11.4 Quiz dan Assessment

### FR-QUIZ-001 — Membuat Quiz

**Prioritas:** MUST

HR Admin dapat membuat quiz untuk course atau standalone challenge.

Jenis pertanyaan:

- single choice;
- multiple choice;
- true or false.

**Acceptance Criteria:**

- draft quiz tidak terlihat employee;
- jawaban benar tidak dikirim sebelum submit;
- question dapat memiliki topic dan skill tag;
- quiz dapat dihubungkan ke module atau course.

### FR-QUIZ-002 — Passing Score

**Prioritas:** MUST

Quiz memiliki passing score.

**Acceptance Criteria:**

- passing score berada pada rentang valid;
- status pass atau fail tersimpan;
- perhitungan konsisten;
- perubahan score pada quiz aktif tidak mengubah attempt historis.

### FR-QUIZ-003 — Attempt Limit

**Prioritas:** MUST

Quiz dapat memiliki jumlah attempt maksimal.

**Acceptance Criteria:**

- attempt melebihi batas ditolak;
- seluruh attempt disimpan;
- HR dapat reset attempt dengan permission khusus;
- reset memiliki alasan dan audit log.

### FR-QUIZ-004 — Timer dan Randomization

**Prioritas:** MUST

Quiz dapat memiliki timer, random question order, dan random option order.

**Acceptance Criteria:**

- timer menggunakan server time;
- quiz otomatis submit saat waktu habis jika dikonfigurasi;
- randomization tidak mengubah kunci jawaban;
- attempt menyimpan urutan yang ditampilkan.

### FR-QUIZ-005 — Auto-Grading

**Prioritas:** MUST

Quiz dinilai otomatis.

**Acceptance Criteria:**

- submission ganda idempotent;
- nilai dan status disimpan;
- jawaban tidak dapat diubah setelah final submit;
- waktu mulai dan selesai tersimpan.

### FR-QUIZ-006 — Topic dan Skill Tag

**Prioritas:** MUST

Setiap question dapat memiliki topic, category, skill tag, dan difficulty.

**Acceptance Criteria:**

- topic digunakan pada Knowledge Gap Dashboard;
- pertanyaan tanpa topic ditandai incomplete;
- HR dapat memfilter question bank berdasarkan tag.

---

## 11.5 Assignment dan Enrollment

### FR-ASSIGN-001 — Membuat Assignment

**Prioritas:** MUST

HR Admin dapat memberikan course atau learning path kepada:

- seluruh Group;
- tenant;
- department;
- job family;
- job title;
- project squad;
- employee tertentu;
- kombinasi target.

**Acceptance Criteria:**

- target hanya berasal dari scope pembuat;
- preview jumlah peserta tersedia;
- assignment idempotent;
- duplicate enrollment dicegah.

### FR-ASSIGN-002 — Mandatory dan Optional

**Prioritas:** MUST

Assignment dapat ditandai mandatory atau optional.

**Acceptance Criteria:**

- mandatory terlihat jelas;
- mandatory dapat memiliki deadline;
- optional tidak menjadi overdue kecuali dikonfigurasi.

### FR-ASSIGN-003 — Start Date, Due Date, dan Reminder

**Prioritas:** MUST

Assignment dapat memiliki start date, due date, dan reminder.

**Acceptance Criteria:**

- due date tidak lebih awal dari start date;
- overdue dihitung berdasarkan timezone Asia/Jakarta;
- perubahan deadline tercatat;
- reminder tidak terkirim berulang tanpa aturan.

### FR-ASSIGN-004 — Recurring Assignment

**Prioritas:** SHOULD

Assignment dapat berulang setiap N bulan atau N tahun.

**Acceptance Criteria:**

- siklus baru tidak menghapus siklus lama;
- enrollment baru memiliki cycle ID;
- duplicate cycle dicegah;
- scheduler dapat di-retry.

### FR-ASSIGN-005 — Auto-Assignment Employee Baru

**Prioritas:** MUST

Employee baru dapat otomatis menerima onboarding learning path berdasarkan rule.

Rule dapat menggunakan:

- tenant;
- department;
- job family;
- job title;
- join date.

**Acceptance Criteria:**

- rule dievaluasi saat employee aktif;
- assignment idempotent;
- deadline dihitung dari join date atau assignment date;
- manager dan employee menerima notifikasi.

### FR-ENROLL-001 — Enrollment Status

**Prioritas:** MUST

Enrollment memiliki status:

- Not Started;
- In Progress;
- Completed;
- Overdue;
- Failed;
- Expired;
- Cancelled.

**Acceptance Criteria:**

- transition status tervalidasi;
- Completed tidak kembali menjadi In Progress tanpa koreksi admin;
- Overdue dapat menjadi Completed;
- history status tersedia.

---

## 11.6 Learning Experience dan Progress

### FR-LEARN-001 — Employee Dashboard

**Prioritas:** MUST

Employee dapat melihat:

- course mandatory;
- course optional;
- learning path;
- campaign aktif;
- Weekly Knowledge Challenge;
- deadline;
- due soon;
- overdue;
- progress;
- certificate;
- point, level, badge, streak, milestone, dan leaderboard.

**Acceptance Criteria:**

- employee hanya melihat data miliknya;
- urutan memprioritaskan mandatory dan due soon;
- data konsisten dengan dashboard HR.

### FR-LEARN-002 — Resume Learning

**Prioritas:** MUST

Employee dapat melanjutkan dari aktivitas terakhir.

**Acceptance Criteria:**

- module terakhir tersimpan;
- posisi video tersimpan;
- resume tidak melewati locked module;
- progress tersedia setelah login ulang.

### FR-LEARN-003 — Video Progress

**Prioritas:** MUST

Sistem menyimpan progress video.

**Acceptance Criteria:**

- default completion threshold 90%;
- seek ke akhir tidak otomatis dianggap selesai;
- duplicate event tidak membuat progress di atas 100%;
- progress dapat dilanjutkan.

### FR-LEARN-004 — Module Completion

**Prioritas:** MUST

Sistem menghitung completion per module.

**Acceptance Criteria:**

- completion sesuai syarat item;
- timestamp disimpan;
- perhitungan idempotent;
- status dapat dijelaskan.

---

## 11.7 Certificate

### FR-CERT-001 — Generate Certificate

**Prioritas:** MUST

Sistem menerbitkan certificate setelah completion.

**Acceptance Criteria:**

- hanya terbit jika syarat terpenuhi;
- generate idempotent;
- file disimpan aman;
- employee dapat mengunduh certificate miliknya.

### FR-CERT-002 — Certificate Data

**Prioritas:** MUST

Certificate memuat minimal:

- nama employee;
- employee ID;
- course atau learning path;
- revision atau version;
- tenant;
- completion date;
- issue date;
- validity mode;
- expiry date jika berlaku;
- unique code;
- QR code atau verification URL.

### FR-CERT-003 — Validity Mode

**Prioritas:** MUST

Certificate memiliki mode:

- EXPIRING;
- NON_EXPIRING.

**Acceptance Criteria:**

- EXPIRING wajib memiliki `expires_at`;
- NON_EXPIRING wajib memiliki `expires_at = null`;
- reminder expiry hanya dikirim untuk EXPIRING;
- NON_EXPIRING tetap valid sampai revoked.

### FR-CERT-004 — Verification

**Prioritas:** MUST

Sistem menyediakan halaman verifikasi certificate.

**Acceptance Criteria:**

- menggunakan unique code;
- menampilkan data minimum;
- status valid, expired, atau revoked terlihat;
- data sensitif tidak bocor.

### FR-CERT-005 — Revocation

**Prioritas:** MUST

HR berwenang dapat mencabut certificate.

**Acceptance Criteria:**

- alasan wajib;
- certificate tidak dihapus;
- status menjadi Revoked;
- aktivitas tercatat;
- employee menerima notifikasi jika dikonfigurasi.

### FR-CERT-006 — External Certification Verification

**Prioritas:** SHOULD

Employee dapat mengajukan sertifikasi eksternal untuk diverifikasi HR.

**Acceptance Criteria:**

- employee mengunggah bukti;
- HR dapat approve atau reject;
- approval dapat memberikan point dan badge;
- sertifikasi eksternal tidak dianggap resmi sebelum approval;
- seluruh perubahan tercatat.

---

## 11.8 Learning Path

### FR-PATH-001 — Membuat Learning Path

**Prioritas:** MUST

HR Admin dapat membuat Learning Path.

**Data minimum:**

- title;
- description;
- target skill;
- job family;
- course list;
- order;
- navigation mode;
- deadline;
- final assessment;
- certificate rule;
- point reward;
- badge reward;
- status.

### FR-PATH-002 — Path Navigation

**Prioritas:** MUST

Learning Path mendukung mode Linear dan Flexible.

**Acceptance Criteria:**

- Linear mengunci course berikutnya;
- Flexible memperbolehkan urutan bebas;
- completion rule dapat mensyaratkan seluruh course atau minimum tertentu.

### FR-PATH-003 — Path Completion

**Prioritas:** MUST

Learning Path selesai ketika completion rule terpenuhi.

**Acceptance Criteria:**

- completion idempotent;
- point dan badge hanya diberikan sekali per siklus;
- certificate path dapat diterbitkan;
- progress tersedia per course.

### FR-PATH-004 — Path Assignment

**Prioritas:** MUST

Learning Path dapat ditugaskan menggunakan target assignment standar.

**Acceptance Criteria:**

- employee mendapatkan enrollment path dan course terkait;
- duplicate course enrollment ditangani;
- perubahan target tidak menghapus riwayat.

---

## 11.9 Learning Campaign

### FR-CAMP-001 — Membuat Campaign

**Prioritas:** MUST

HR Admin dapat membuat Learning Campaign.

**Data minimum:**

- title;
- description;
- banner;
- start date;
- end date;
- target audience;
- activities;
- completion rule;
- point reward;
- badge reward;
- leaderboard setting;
- status.

Status:

- Draft;
- Scheduled;
- Active;
- Completed;
- Archived.

### FR-CAMP-002 — Campaign Activities

**Prioritas:** MUST

Campaign dapat berisi:

- course;
- learning path;
- Weekly Knowledge Challenge;
- final assessment;
- mission.

**Acceptance Criteria:**

- activity memiliki mandatory atau optional flag;
- urutan dapat ditentukan;
- progress campaign dapat dihitung;
- activity yang sama tidak menghasilkan reward ganda tanpa rule.

### FR-CAMP-003 — Campaign Completion Rule

**Prioritas:** MUST

Campaign dapat memiliki rule:

- semua mandatory activity selesai;
- minimum challenge participation;
- minimum average score;
- final assessment pass.

**Acceptance Criteria:**

- rule tervalidasi sebelum publish;
- completion dapat dijelaskan;
- reward hanya diberikan sekali;
- historical campaign tetap tersedia.

### FR-CAMP-004 — Campaign Dashboard

**Prioritas:** MUST

HR dapat melihat:

- peserta;
- participation rate;
- completion rate;
- progress per department;
- average score;
- overdue;
- leaderboard;
- top knowledge gap;
- daftar peserta belum selesai.

### FR-CAMP-005 — Campaign Leaderboard

**Prioritas:** SHOULD

Campaign dapat memiliki leaderboard tersendiri.

**Acceptance Criteria:**

- hanya menghitung aktivitas campaign;
- periode mengikuti campaign;
- tie-breaker terdokumentasi;
- employee dapat disembunyikan jika privacy setting aktif.

---

## 11.10 Course Feedback

### FR-FEED-001 — Memberikan Feedback

**Prioritas:** MUST

Employee dapat memberikan feedback setelah course selesai.

Pertanyaan minimum:

- relevansi;
- kemudahan materi;
- kualitas materi;
- kesesuaian durasi;
- recommendation;
- komentar opsional.

**Acceptance Criteria:**

- hanya employee yang Completed dapat memberi feedback;
- satu feedback per enrollment;
- feedback tidak memengaruhi completion;
- anonymous mode dapat dikonfigurasi.

### FR-FEED-002 — Feedback Dashboard

**Prioritas:** MUST

HR dapat melihat:

- rating rata-rata;
- relevance score;
- clarity score;
- duration score;
- recommendation rate;
- komentar;
- course rating tertinggi dan terendah;
- trend periode.

### FR-FEED-003 — Feedback Moderation

**Prioritas:** SHOULD

HR dapat menyembunyikan komentar yang melanggar kebijakan.

**Acceptance Criteria:**

- rating numerik tidak dihapus;
- alasan moderation wajib;
- aktivitas dicatat;
- komentar asli tetap tersedia untuk audit terbatas.

---

## 11.11 Knowledge Gap Dashboard

### FR-KG-001 — Knowledge Gap Calculation

**Prioritas:** MUST

Sistem menghitung knowledge gap berdasarkan hasil quiz dan challenge.

Metrik dasar:

- jumlah jawaban;
- correct answer rate;
- average score;
- jumlah participant;
- trend score;
- difficulty-adjusted score jika diaktifkan.

### FR-KG-002 — Gap Classification

**Prioritas:** MUST

Knowledge gap memiliki klasifikasi awal:

- Low: correct answer rate >= 80%;
- Medium: 60%–79%;
- High: < 60%.

Threshold dapat dikonfigurasi.

### FR-KG-003 — Breakdown

**Prioritas:** MUST

Dashboard dapat difilter berdasarkan:

- tenant;
- department;
- job family;
- job title;
- project squad;
- topic;
- skill tag;
- course;
- campaign;
- periode.

### FR-KG-004 — Course Recommendation

**Prioritas:** SHOULD

Sistem dapat memberikan rekomendasi rule-based.

Contoh rule:

```text
Jika correct answer rate topik < 60%,
rekomendasikan course dengan skill tag terkait.
```

**Acceptance Criteria:**

- recommendation dapat dijelaskan;
- HR harus mengonfirmasi sebelum assignment;
- sistem tidak melakukan auto-assignment tanpa konfigurasi.

### FR-KG-005 — Privacy Threshold

**Prioritas:** MUST

Breakdown knowledge gap individu atau kelompok kecil harus dilindungi.

**Acceptance Criteria:**

- data agregat hanya tampil jika minimum participant terpenuhi;
- default minimum participant adalah 5;
- HR dengan permission khusus dapat melihat detail individual;
- Manager melihat data sesuai kebijakan privacy.

---

## 11.12 Gamification

### FR-GAME-001 — Point Rules

**Prioritas:** MUST

HR Admin dapat mengelola point rules.

Aktivitas yang dapat menghasilkan point:

- course completion;
- quiz pass;
- first attempt pass;
- perfect score;
- challenge completion;
- path completion;
- campaign completion;
- feedback submission;
- early completion;
- internal certification;
- external certification verified;
- knowledge contribution approved;
- knowledge sharing speaker;
- mentoring milestone approved.

**Acceptance Criteria:**

- point rule dapat aktif atau nonaktif;
- nominal point tervalidasi;
- perubahan rule tidak mengubah transaksi historis;
- rule dapat dibatasi per tenant.

### FR-GAME-002 — Point Transaction Ledger

**Prioritas:** MUST

Setiap perubahan point disimpan sebagai transaksi.

Data minimum:

- user;
- tenant;
- source type;
- source ID;
- point value;
- reason;
- timestamp;
- created by;
- reversal reference jika ada.

**Acceptance Criteria:**

- total point dihitung dari ledger;
- duplicate reward dicegah;
- manual adjustment memerlukan alasan;
- reversal tidak menghapus transaksi asli.

### FR-GAME-003 — Badge Management

**Prioritas:** MUST

HR Admin dapat mengelola badge.

Kategori badge:

- learning;
- assessment;
- consistency;
- contribution;
- competency;
- campaign;
- ranking.

**Acceptance Criteria:**

- badge memiliki nama, icon, description, rule, dan status;
- badge dapat tenant-specific atau Group-wide;
- badge dapat memiliki level Bronze, Silver, Gold;
- badge award idempotent.

### FR-GAME-004 — Default Badges

**Prioritas:** MUST

Sistem menyediakan badge awal:

- First Step;
- Active Learner;
- Learning Explorer;
- Perfect Score;
- First Attempt Pass;
- Quiz Master;
- Knowledge Challenger;
- Consistent Learner;
- Never Overdue;
- Path Master;
- Campaign Finisher;
- Knowledge Contributor;
- Knowledge Speaker;
- Healthcare Domain Ready;
- Security Awareness Certified.

### FR-GAME-005 — Weekly Learning Streak

**Prioritas:** MUST

Sistem menghitung streak mingguan.

Aktivitas valid:

- menyelesaikan module;
- menyelesaikan quiz;
- mengikuti Weekly Knowledge Challenge;
- menyelesaikan course;
- menyelesaikan campaign activity.

**Acceptance Criteria:**

- streak bukan daily streak;
- minimum satu aktivitas per minggu;
- minggu dihitung berdasarkan Asia/Jakarta;
- cuti atau kebijakan khusus dapat ditangani pada fase lanjutan;
- streak history tersedia.

### FR-GAME-006 — Learning Levels

**Prioritas:** MUST

Sistem memiliki level berdasarkan lifetime point.

Default:

| Level | Poin |
|---|---:|
| Explorer | 0–499 |
| Learner | 500–999 |
| Practitioner | 1.000–1.999 |
| Specialist | 2.000–3.999 |
| Knowledge Champion | 4.000+ |

**Acceptance Criteria:**

- threshold dapat dikonfigurasi;
- perubahan level mengirim notification;
- historical level change disimpan;
- level tidak terkait performance appraisal.

### FR-GAME-007 — Milestones

**Prioritas:** MUST

Employee dapat melihat progress menuju badge atau level berikutnya.

**Acceptance Criteria:**

- sistem menampilkan current value dan target;
- milestone diperbarui setelah event relevan;
- milestone tidak menampilkan rule rahasia jika ada.

### FR-GAME-008 — Leaderboard

**Prioritas:** MUST

Leaderboard dapat dibuat berdasarkan:

- tenant;
- department;
- job family;
- campaign;
- challenge;
- periode bulanan;
- kuartalan;
- tahunan.

**Acceptance Criteria:**

- leaderboard menggunakan point pada periode;
- lifetime point tetap tersimpan;
- employee dapat menyembunyikan nama jika diaktifkan;
- tidak ada tampilan khusus peringkat terendah;
- tie-breaker terdokumentasi;
- HR dapat menonaktifkan leaderboard.

### FR-GAME-009 — Monthly Learning Mission

**Prioritas:** MUST

HR dapat membuat mission berkala.

Mission dapat berisi target:

- menyelesaikan course;
- mengikuti challenge;
- mencapai average score;
- menyelesaikan learning path;
- memberikan feedback;
- melakukan contribution.

**Acceptance Criteria:**

- mission memiliki periode;
- target dapat job-family specific;
- reward diberikan setelah seluruh syarat terpenuhi;
- mission history tersedia.

### FR-GAME-010 — Achievement Notification

**Prioritas:** MUST

Employee menerima notifikasi saat memperoleh point, badge, level, streak, atau mission completion.

**Acceptance Criteria:**

- duplicate notification dicegah;
- notifikasi menjelaskan alasan;
- dapat diarahkan ke achievement detail;
- HR dapat mengatur jenis notifikasi.

---

## 11.13 Weekly Knowledge Challenge

### FR-CHAL-001 — Membuat Challenge

**Prioritas:** MUST

HR Admin dapat membuat Weekly Knowledge Challenge.

Data minimum:

- title;
- description;
- topic;
- skill tags;
- target audience;
- active period;
- question set;
- passing score;
- attempt limit;
- point rules;
- badge rule;
- leaderboard setting;
- campaign relation opsional.

### FR-CHAL-002 — Challenge Participation

**Prioritas:** MUST

Employee dapat mengikuti challenge selama periode aktif.

**Acceptance Criteria:**

- challenge belum aktif tidak dapat dikerjakan;
- challenge expired tidak menerima attempt baru;
- attempt limit diterapkan;
- result tersimpan.

### FR-CHAL-003 — Challenge Reward

**Prioritas:** MUST

Challenge dapat memberikan reward:

- participation point;
- pass point;
- perfect score bonus;
- streak bonus;
- badge.

**Acceptance Criteria:**

- point kecepatan tidak digunakan pada default rule;
- duplicate reward dicegah;
- reward hanya diberikan setelah final submission.

### FR-CHAL-004 — Challenge Streak

**Prioritas:** SHOULD

Sistem menghitung jumlah periode challenge berturut-turut yang diikuti.

**Acceptance Criteria:**

- streak berdasarkan periode challenge, bukan kalender harian;
- employee yang tidak menjadi target tidak dianggap memutus streak;
- riwayat streak tersimpan.

### FR-CHAL-005 — Challenge Analytics

**Prioritas:** MUST

HR dapat melihat:

- participation rate;
- pass rate;
- average score;
- top incorrect question;
- topic gap;
- breakdown department dan job family;
- leaderboard challenge.

---

## 11.14 Knowledge Contribution

### FR-CONTRIB-001 — Submit Contribution

**Prioritas:** SHOULD

Employee dapat mengajukan kontribusi:

- technical note;
- course material;
- quiz;
- reusable checklist;
- knowledge sharing session;
- mentoring milestone.

### FR-CONTRIB-002 — Approval

**Prioritas:** SHOULD

HR atau reviewer dapat approve atau reject contribution.

**Acceptance Criteria:**

- status Draft, Submitted, Approved, Rejected;
- alasan rejection dapat diberikan;
- point hanya diberikan setelah approval;
- duplicate submission dapat ditandai.

### FR-CONTRIB-003 — Contribution Badge

**Prioritas:** COULD

Contribution yang disetujui dapat menghasilkan badge seperti Knowledge Contributor atau Knowledge Speaker.

---

## 11.15 Dashboard dan Reporting

### FR-DASH-001 — HR Dashboard

**Prioritas:** MUST

HR dapat melihat:

- active employee;
- total course;
- published course;
- completion rate;
- not started;
- in progress;
- completed;
- overdue;
- average quiz score;
- certificate issued;
- certificate expiring;
- learning path completion;
- campaign performance;
- challenge participation;
- knowledge gap summary;
- course feedback summary;
- top badges;
- point distribution.

### FR-DASH-002 — Manager Dashboard

**Prioritas:** MUST

Manager dapat melihat:

- team member count;
- mandatory learning status;
- overdue members;
- learning path progress;
- campaign progress;
- average assessment score;
- team knowledge gap;
- certificate status;
- achievements.

### FR-DASH-003 — Employee Dashboard

**Prioritas:** MUST

Employee dapat melihat:

- active assignments;
- deadlines;
- learning path;
- campaign;
- weekly challenge;
- certificate;
- point;
- level;
- badges;
- streak;
- milestones;
- leaderboard position;
- learning history.

### FR-REPORT-001 — XLSX Export

**Prioritas:** MUST

HR dapat mengekspor laporan XLSX.

Kolom minimum:

- employee name;
- employee ID;
- tenant;
- department;
- job family;
- job title;
- manager;
- course;
- path;
- campaign;
- assignment date;
- due date;
- status;
- progress;
- quiz score;
- attempt count;
- completion date;
- certificate code;
- certificate validity;
- point earned;
- badge;
- feedback rating.

**Acceptance Criteria:**

- export mengikuti filter dan permission;
- hingga 50.000 baris diproses sebagai background job;
- file memiliki masa berlaku;
- tenant lain tidak dapat mengakses file.

### FR-REPORT-002 — Scheduled Report

**Prioritas:** COULD

HR dapat menjadwalkan laporan berkala melalui email.

---

## 11.16 Notification

### FR-NOTIF-001 — In-App Notification

**Prioritas:** MUST

Trigger minimum:

- assignment baru;
- deadline mendekat;
- overdue;
- challenge tersedia;
- challenge hampir berakhir;
- campaign dimulai;
- path ditugaskan;
- completion;
- certificate issued;
- certificate expiring;
- badge earned;
- level up;
- mission available;
- mission completed.

### FR-NOTIF-002 — Email Notification

**Prioritas:** MUST

Email dikirim untuk trigger yang dikonfigurasi.

**Acceptance Criteria:**

- delivery status dicatat;
- kegagalan dapat di-retry;
- duplicate dicegah;
- digest dapat digunakan untuk mengurangi notification fatigue.

### FR-NOTIF-003 — Manager Reminder

**Prioritas:** SHOULD

Manager dapat mengirim reminder kepada anggota tim yang belum menyelesaikan learning.

**Acceptance Criteria:**

- hanya kepada anggota tim;
- rate limit diterapkan;
- reminder tercatat.

---

## 11.17 Audit dan Operations

### FR-AUDIT-001 — Audit Log

**Prioritas:** MUST

Sistem mencatat:

- login dan security event;
- role dan permission change;
- employee change;
- course publish;
- quiz change;
- assignment;
- deadline change;
- attempt reset;
- certificate issue dan revocation;
- point adjustment;
- badge rule change;
- contribution approval;
- report export;
- tenant configuration.

**Acceptance Criteria:**

- log memiliki actor, timestamp, tenant, action, dan target;
- log tidak dapat diubah oleh role biasa;
- secret dan token tidak dicatat;
- retensi minimum satu tahun.

### FR-OPS-001 — Background Job Monitoring

**Prioritas:** MUST

Job minimum:

- import employee;
- mass enrollment;
- recurring assignment;
- notification;
- certificate generation;
- report export;
- point calculation;
- leaderboard refresh;
- knowledge gap aggregation.

**Acceptance Criteria:**

- status Pending, Processing, Success, Failed;
- retry tersedia;
- error reference tersedia;
- job idempotent jika diperlukan.

---

# 12. Business Rules

## 12.1 Multi-Tenancy

- Resource tenant-aware harus memiliki `group_id` dan/atau `tenant_id`.
- User hanya dapat mengakses tenant dengan membership aktif.
- Backend wajib melakukan tenant scoping.
- Query lintas tenant hanya diperbolehkan untuk Super Admin atau Group reporting dengan permission khusus.

## 12.2 Course

- Course Draft tidak terlihat employee.
- Course Published dapat diassign.
- Course Archived tidak menerima assignment baru.
- Perubahan material pada course aktif sebaiknya menggunakan revisi baru.
- Completion dan certificate menyimpan course revision.

## 12.3 Quiz

- Jawaban benar tidak dikirim sebelum submission.
- Attempt yang selesai bersifat immutable.
- Reset attempt memerlukan permission dan audit log.
- Topic tagging wajib untuk question yang digunakan dalam Knowledge Gap Dashboard.

## 12.4 Assignment

- Assignment menjadi sumber target, mandatory flag, deadline, dan recurrence.
- Duplicate enrollment untuk assignment dan cycle yang sama tidak diperbolehkan.
- Perubahan department atau job family tidak menghapus learning history.

## 12.5 Completion

- Completion hanya terjadi setelah seluruh syarat terpenuhi.
- Completion timestamp tidak ditimpa.
- Koreksi completion memerlukan permission khusus dan audit trail.

## 12.6 Certificate

- Certificate merupakan snapshot.
- Certificate lama tidak berubah ketika employee profile atau course berubah.
- Certificate dapat EXPIRING atau NON_EXPIRING.
- Expired dan Revoked tidak sama dengan Deleted.

## 12.7 Point

- Point disimpan sebagai ledger transaksi.
- Point tidak diberikan untuk login atau sekadar membuka halaman.
- Duplicate reward tidak diperbolehkan.
- Manual adjustment memerlukan alasan.
- Reversal dibuat sebagai transaksi baru.

## 12.8 Badge

- Badge diberikan berdasarkan rule yang dapat diaudit.
- Badge kompetensi harus terkait learning path atau assessment.
- Badge internal tidak boleh menyesatkan seolah-olah merupakan sertifikasi eksternal resmi.

## 12.9 Streak

- Streak default bersifat mingguan.
- Minimum satu aktivitas valid per minggu.
- Daily streak tidak digunakan pada MVP.

## 12.10 Leaderboard

- Leaderboard tidak menjadi dasar tunggal performance appraisal.
- Leaderboard tidak menonjolkan peringkat terbawah.
- Perbandingan sebaiknya berdasarkan kelompok relevan.
- Department atau squad challenge menggunakan persentase, bukan jumlah mentah.

## 12.11 Knowledge Gap

- Knowledge gap digunakan untuk perencanaan pembelajaran.
- Data agregat mengikuti minimum privacy threshold.
- Rekomendasi course tidak otomatis menjadi assignment tanpa konfirmasi HR.

## 12.12 Timezone

- Timestamp disimpan dalam UTC.
- Tampilan default Asia/Jakarta.
- Deadline, streak, challenge period, dan scheduler diuji terhadap pergantian tanggal.

---

# 13. Status dan State Transition

## 13.1 Course

```text
Draft → Published → Archived
Draft → Archived
```

## 13.2 Enrollment

```text
Not Started → In Progress → Completed
      ↘ Overdue ↗
      ↘ Failed
      ↘ Expired
      ↘ Cancelled
```

## 13.3 Certificate

```text
EXPIRING:
Valid → Expired
Valid → Revoked
Expired → Revoked

NON_EXPIRING:
Valid → Revoked
```

## 13.4 Campaign

```text
Draft → Scheduled → Active → Completed → Archived
Draft → Archived
Scheduled → Archived
```

## 13.5 Contribution

```text
Draft → Submitted → Approved
                 ↘ Rejected
```

## 13.6 Background Job

```text
Pending → Processing → Success
                    ↘ Failed → Retry
```

---

# 14. Model Data Tingkat Tinggi

## 14.1 Organization dan Identity

- `groups`
- `tenants`
- `departments`
- `job_families`
- `job_titles`
- `project_squads`
- `project_squad_members`
- `users`
- `memberships`
- `roles`
- `permissions`
- `membership_roles`
- `manager_relations`

## 14.2 Course dan Content

- `courses`
- `course_revisions`
- `course_modules`
- `module_items`
- `video_assets`
- `documents`
- `categories`
- `skills`
- `course_skills`

## 14.3 Quiz dan Assessment

- `quizzes`
- `quiz_questions`
- `quiz_options`
- `question_topics`
- `question_skills`
- `quiz_attempts`
- `quiz_attempt_answers`

## 14.4 Assignment dan Progress

- `assignments`
- `assignment_targets`
- `enrollments`
- `enrollment_cycles`
- `enrollment_status_history`
- `module_progress`
- `content_progress`
- `video_progress_events`

## 14.5 Learning Path

- `learning_paths`
- `learning_path_items`
- `learning_path_assignments`
- `learning_path_enrollments`
- `learning_path_progress`

## 14.6 Campaign

- `learning_campaigns`
- `campaign_activities`
- `campaign_assignments`
- `campaign_enrollments`
- `campaign_progress`

## 14.7 Feedback

- `course_feedback_forms`
- `course_feedback_questions`
- `course_feedback_responses`
- `course_feedback_answers`
- `feedback_moderation_events`

## 14.8 Gamification

- `point_rules`
- `point_transactions`
- `badges`
- `badge_rules`
- `user_badges`
- `learning_levels`
- `user_level_history`
- `learning_streaks`
- `missions`
- `mission_targets`
- `mission_enrollments`
- `mission_progress`
- `leaderboards`
- `leaderboard_snapshots`
- `achievements`

## 14.9 Weekly Challenge

- `weekly_challenges`
- `challenge_targets`
- `challenge_questions`
- `challenge_attempts`
- `challenge_rewards`

## 14.10 Knowledge Gap

- `knowledge_gap_aggregates`
- `topic_performance_snapshots`
- `skill_performance_snapshots`
- `learning_recommendations`

## 14.11 Certificate

- `certificate_templates`
- `certificates`
- `certificate_status_history`
- `external_certification_submissions`

## 14.12 Contribution, Notification, dan Audit

- `knowledge_contributions`
- `contribution_reviews`
- `notifications`
- `email_deliveries`
- `audit_logs`
- `background_jobs`

### 14.13 Prinsip Model Data

- identitas user dipisahkan dari membership;
- setiap resource tenant-aware memiliki tenant scope;
- foreign key dan constraint mencegah referensi lintas tenant;
- completion, certificate, point transaction, dan audit tidak dihapus secara destruktif;
- soft delete digunakan untuk master data tertentu;
- aggregate analytics dapat direbuild dari source data;
- transaksi reward harus idempotent.

---

# 15. Arsitektur Sistem Tingkat Tinggi

## 15.1 Stack Rekomendasi

- **Frontend:** React + Vite + TypeScript.
- **Backend:** NestJS atau Go service sesuai keputusan technical design.
- **Database:** PostgreSQL.
- **Cache dan Job Queue:** Redis.
- **Object Storage:** S3-compatible storage.
- **Video:** Cloudflare Stream atau provider abstraction.
- **Authentication:** JWT access token dan refresh token.
- **Deployment:** Cloud infrastructure milik Bithealth.
- **CI/CD:** Repository dan pipeline internal.

## 15.2 Modul Backend

- Authentication.
- Identity dan Membership.
- Group dan Tenant.
- Department, Job Family, Manager, dan Squad.
- Course dan Content.
- Quiz dan Assessment.
- Assignment dan Enrollment.
- Progress.
- Learning Path.
- Campaign.
- Feedback.
- Gamification.
- Weekly Challenge.
- Knowledge Gap.
- Certificate.
- Notification.
- Reporting.
- Audit.
- Background Operations.

## 15.3 Tenant Security

Lapisan keamanan:

1. tenant resolution di backend;
2. authentication dan membership validation;
3. permission guard;
4. tenant-aware service dan repository;
5. database constraint;
6. cross-tenant integration test;
7. audit log;
8. signed URL untuk file;
9. optional PostgreSQL Row-Level Security.

## 15.4 Background Processing

Background job digunakan untuk:

- bulk import;
- mass enrollment;
- recurring assignment;
- notification;
- certificate generation;
- report export;
- point calculation;
- badge evaluation;
- mission evaluation;
- leaderboard refresh;
- knowledge gap aggregation.

Job harus memiliki retry, idempotency, monitoring, dan error reference.

---

# 16. Non-Functional Requirements

## 16.1 Security

| ID | Requirement |
|---|---|
| NFR-SEC-001 | Seluruh production traffic menggunakan HTTPS |
| NFR-SEC-002 | Password di-hash dengan algoritma aman |
| NFR-SEC-003 | Seluruh endpoint memiliki authentication dan authorization |
| NFR-SEC-004 | Cross-tenant test wajib lulus sebelum go-live |
| NFR-SEC-005 | Signed URL digunakan untuk asset nonpublik |
| NFR-SEC-006 | Rate limiting diterapkan pada endpoint sensitif |
| NFR-SEC-007 | Secret tidak disimpan di source code |
| NFR-SEC-008 | Critical security defect = 0 saat go-live |
| NFR-SEC-009 | Audit log tidak menyimpan password atau token |
| NFR-SEC-010 | Export mengikuti permission dan tenant scope |

## 16.2 Performance

| ID | Requirement |
|---|---|
| NFR-PERF-001 | Dashboard API p95 <= 2 detik untuk query normal |
| NFR-PERF-002 | Halaman course siap digunakan <= 3 detik pada jaringan normal |
| NFR-PERF-003 | Assignment 2.500 enrollment diproses idempotent |
| NFR-PERF-004 | Export 50.000 baris tidak memblokir request utama |
| NFR-PERF-005 | Leaderboard dan knowledge gap menggunakan aggregation atau cache |
| NFR-PERF-006 | Quiz submission response p95 <= 2 detik |

## 16.3 Availability

- target awal 99,5% per bulan;
- maintenance terjadwal dikecualikan;
- health check tersedia;
- monitoring service utama tersedia;
- job failure memiliki alert.

## 16.4 Scalability

- aplikasi stateless diutamakan;
- worker dapat diskalakan terpisah;
- object storage terpisah dari application server;
- query analytics menggunakan index dan aggregate;
- arsitektur dapat menambah tenant tanpa perubahan besar.

## 16.5 Reliability

- operasi massal idempotent;
- job penting dapat di-retry;
- certificate tidak dibuat duplikat;
- point reward tidak dibuat duplikat;
- database migration aman;
- error penting memiliki correlation ID.

## 16.6 Compatibility

Browser yang didukung:

- Chrome versi terkini dan dua versi mayor sebelumnya;
- Edge versi terkini dan dua versi mayor sebelumnya;
- Safari versi terkini dan satu versi mayor sebelumnya;
- Firefox versi terkini dan dua versi mayor sebelumnya.

Aplikasi responsive untuk desktop, tablet, dan mobile browser.

## 16.7 Accessibility

**Prioritas:** SHOULD

- navigasi keyboard untuk alur utama;
- kontras teks memadai;
- label form jelas;
- error message dapat dipahami;
- chart memiliki alternatif teks atau tabel.

## 16.8 Auditability

- audit log minimum satu tahun;
- course revision, enrollment, completion, certificate, point, dan badge dapat ditelusuri;
- export memiliki actor dan timestamp;
- perubahan rule penting tercatat.

---

# 17. Privasi dan Data Governance

## 17.1 Data yang Diperbolehkan

- employee ID;
- nama;
- email;
- tenant;
- department;
- job family;
- job title;
- manager;
- learning history;
- quiz result;
- certificate;
- badge dan point;
- feedback;
- knowledge contribution.

## 17.2 Data Sensitif

- data employee hanya dapat dilihat sesuai permission;
- knowledge gap individu tidak ditampilkan secara terbuka;
- leaderboard dapat menggunakan privacy mode;
- feedback anonim tidak menampilkan identitas kepada viewer biasa;
- document upload harus mengikuti kebijakan keamanan internal.

## 17.3 Retensi Awal

- audit log: minimum satu tahun;
- completion dan certificate: selama masih dibutuhkan untuk audit internal;
- employee nonaktif: dipertahankan jika memiliki riwayat;
- point transaction dan badge history: dipertahankan selama akun masih relevan;
- feedback: sesuai kebijakan HR.

---

# 18. Backup dan Disaster Recovery

| Item | Target Awal |
|---|---|
| Backup database | Harian |
| Retensi | 14–30 hari |
| Restore test | Sebelum go-live dan berkala |
| RPO | Maksimal 24 jam |
| RTO | Maksimal 8 jam |

Backup tidak dianggap valid sebelum restore pernah diuji.

---

# 19. Logging, Monitoring, dan Alerting

Monitoring minimum:

- availability;
- error rate;
- API latency;
- database health;
- Redis health;
- job queue;
- failed job;
- email delivery failure;
- certificate generation failure;
- point calculation failure;
- leaderboard refresh failure;
- knowledge gap aggregation failure;
- storage error.

Log minimum:

- timestamp;
- environment;
- correlation ID;
- tenant context;
- actor context;
- error reference;
- tanpa secret.

---

# 20. Product Success Metrics

| Metrik | Target Awal |
|---|---:|
| Employee aktif menggunakan LMS | >= 80% |
| Mandatory course completion rate | >= 90% |
| Course overdue rate | < 10% |
| Weekly Challenge participation | >= 60% |
| Learning Path completion | >= 75% |
| Course feedback response rate | >= 50% |
| Course average rating | >= 4 dari 5 |
| Monthly active learner | >= 70% |
| Course dengan skill tag lengkap | 100% |
| Question dengan topic tag | 100% |
| Knowledge gap yang ditindaklanjuti | >= 70% |
| Duplicate point incident | 0 |
| Critical cross-tenant incident | 0 |
| Critical defect saat go-live | 0 |

Target final harus disepakati HR dan manajemen berdasarkan baseline aktual.

---

# 21. Acceptance Testing Strategy

## 21.1 Jenis Pengujian

- unit test;
- integration test;
- API test;
- permission test;
- cross-tenant test;
- end-to-end test;
- background job test;
- performance test;
- UAT;
- backup restore test;
- gamification calculation test;
- analytics reconciliation test.

## 21.2 Skenario Wajib

- HR tenant A mencoba membaca employee tenant B;
- Manager mencoba membaca employee di luar tim;
- Employee mengganti resource ID pada URL;
- quiz answer key diminta sebelum submission;
- duplicate quiz submission;
- duplicate point reward;
- duplicate badge award;
- certificate generate dipanggil dua kali;
- employee nonaktif menggunakan refresh token lama;
- leaderboard menghitung point di luar periode;
- knowledge gap breakdown dengan participant di bawah privacy threshold;
- campaign completion dengan activity belum selesai;
- path Linear mencoba membuka course berikutnya sebelum course sebelumnya selesai.

## 21.3 Definition of Done

Fitur selesai apabila:

- acceptance criteria terpenuhi;
- code review selesai;
- automated test relevan lulus;
- tenant scoping diuji;
- permission diuji;
- audit log ditambahkan jika relevan;
- dokumentasi diperbarui;
- tidak ada Critical atau High defect yang menghambat;
- Product Owner menerima hasil demo atau UAT.

---

# 22. Milestone dan Fase Implementasi

Estimasi awal: **14–20 minggu**, bergantung pada jumlah developer, kualitas desain awal, dan scope final.

| Fase | Scope Utama | Estimasi |
|---|---|---:|
| Fase 0 | Discovery, PRD final, permission matrix, wireframe, architecture | 1–2 minggu |
| Fase 1 | Auth, multi-tenancy, employee, department, job family, import | 2–3 minggu |
| Fase 2 | Course, module, content, quiz, assignment, progress | 3–4 minggu |
| Fase 3 | Certificate, dashboard, reporting, notification | 2–3 minggu |
| Fase 4 | Learning Path, Course Feedback, onboarding assignment | 2–3 minggu |
| Fase 5 | Gamification dan Weekly Knowledge Challenge | 2–3 minggu |
| Fase 6 | Campaign dan Knowledge Gap Dashboard | 2–3 minggu |
| Fase 7 | Hardening, performance, UAT, go-live, handover | 2 minggu |

---

# 23. Requirement Traceability Matrix Ringkas

| Scope | Requirement | Fase |
|---|---|---:|
| Multi-tenancy | FR-ORG-* | 1 |
| Authentication dan user | FR-AUTH-*, FR-USER-* | 1 |
| Course | FR-COURSE-* | 2 |
| Quiz | FR-QUIZ-* | 2 |
| Assignment dan enrollment | FR-ASSIGN-*, FR-ENROLL-* | 2 |
| Learning experience | FR-LEARN-* | 2 |
| Certificate | FR-CERT-* | 3 |
| Dashboard dan reporting | FR-DASH-*, FR-REPORT-* | 3 |
| Notification | FR-NOTIF-* | 3 |
| Learning Path | FR-PATH-* | 4 |
| Course Feedback | FR-FEED-* | 4 |
| Gamification | FR-GAME-* | 5 |
| Weekly Challenge | FR-CHAL-* | 5 |
| Learning Campaign | FR-CAMP-* | 6 |
| Knowledge Gap | FR-KG-* | 6 |
| Audit dan operations | FR-AUDIT-*, FR-OPS-* | Semua fase |

---

# 24. Risiko dan Mitigasi

| Risiko | Dampak | Mitigasi |
|---|---|---|
| Kebocoran data antar-tenant | Tinggi | Multi-layer tenant security dan automated test |
| Karyawan mengejar poin tanpa belajar | Sedang | Reward hanya untuk aktivitas valid dan hasil assessment |
| Leaderboard memicu kompetisi tidak sehat | Sedang | Leaderboard per kelompok, privacy mode, tanpa peringkat terbawah |
| Daily streak membebani karyawan | Sedang | Gunakan weekly streak |
| Duplicate point atau badge | Tinggi | Ledger, unique constraint, idempotency |
| Knowledge gap disalahgunakan | Tinggi | Privacy threshold dan penggunaan agregat |
| Materi cepat usang | Sedang | Course revision dan review period |
| Quiz terlalu berorientasi hafalan | Sedang | Gunakan studi kasus, topic, dan skill tag |
| Notification fatigue | Sedang | Digest dan preference |
| HR kesulitan membuat konten | Sedang | Mulai dari course prioritas dan template |
| Analytics tidak konsisten | Tinggi | Reconciliation test dan source-of-truth metric |
| Scope terlalu besar | Tinggi | Fase implementasi dan MVP locking |

---

# 25. Open Decisions

| ID | Keputusan |
|---|---|
| OD-01 | Apakah tenant awal hanya Bithealth atau langsung mendukung beberapa perusahaan |
| OD-02 | Struktur Group dan Tenant final |
| OD-03 | Daftar role dan permission granular |
| OD-04 | Job Family resmi yang digunakan |
| OD-05 | Apakah Project Squad masuk MVP |
| OD-06 | Course mandatory awal |
| OD-07 | Learning Path prioritas |
| OD-08 | Formula point final |
| OD-09 | Daftar badge awal |
| OD-10 | Threshold level final |
| OD-11 | Definisi aktivitas valid untuk streak |
| OD-12 | Periode leaderboard |
| OD-13 | Apakah employee dapat menyembunyikan nama |
| OD-14 | Rule quiz final: highest score atau latest score |
| OD-15 | Default attempt limit |
| OD-16 | Default reminder deadline |
| OD-17 | Masa berlaku certificate per jenis learning |
| OD-18 | Minimum participant untuk Knowledge Gap Dashboard |
| OD-19 | Approval flow sertifikasi eksternal |
| OD-20 | Approval flow knowledge contribution |
| OD-21 | Provider video final |
| OD-22 | Media notifikasi final |
| OD-23 | Apakah Learning Campaign masuk MVP atau fase berikutnya |
| OD-24 | Branding dan nama resmi produk |
| OD-25 | Target KPI final |

---

# 26. Post-MVP

Kandidat fase lanjutan:

- SSO;
- integrasi HRIS;
- scheduled report;
- reward catalog;
- mentoring workflow;
- project squad challenge lanjutan;
- AI-assisted course recommendation;
- AI-assisted question generation;
- pre-assessment dan post-assessment analysis;
- competency matrix;
- skill passport lanjutan;
- mobile application;
- offline learning;
- SCORM dan xAPI;
- multi-language;
- public API;
- integration dengan calendar dan collaboration tool;
- advanced certification journey;
- manager learning plan approval;
- content review workflow;
- learning budget tracking.

---

# 27. Handover dan Kepemilikan Teknis

Minimum handover:

- source code repository;
- database schema dan migration;
- architecture document;
- API documentation;
- deployment guide;
- environment variable checklist;
- backup dan restore guide;
- admin manual;
- user manual;
- permission matrix;
- test report;
- monitoring guide;
- dependency dan license list;
- knowledge transfer session.

Source code, data, dan infrastructure account mengikuti kebijakan internal Bithealth.

---

# 28. Checklist Sebelum Development

- [ ] PRD final disetujui.
- [ ] Scope MVP dikunci.
- [ ] Permission matrix disetujui.
- [ ] Job Family final tersedia.
- [ ] Course mandatory awal ditentukan.
- [ ] Learning Path prioritas ditentukan.
- [ ] Point rule awal disetujui.
- [ ] Badge awal disetujui.
- [ ] Privacy policy leaderboard disetujui.
- [ ] Knowledge gap threshold disetujui.
- [ ] Wireframe alur utama disetujui.
- [ ] Arsitektur dan stack disetujui.
- [ ] Baseline kapasitas dikonfirmasi.
- [ ] Repository dan CI/CD tersedia.
- [ ] Object storage dan video provider tersedia.
- [ ] Email provider dipilih.
- [ ] Test strategy disetujui.
- [ ] UAT owner ditetapkan.
- [ ] Mekanisme Change Request disetujui.

---

# 29. Contoh Skenario End-to-End

## Skenario 1 — Onboarding Employee Baru

1. HR menambahkan employee baru.
2. Sistem membaca tenant, department, dan job family.
3. Sistem memberikan New Employee Onboarding Path.
4. Employee menerima notifikasi.
5. Employee menyelesaikan course secara berurutan.
6. Employee lulus final assessment.
7. Sistem mencatat completion.
8. Employee mendapatkan certificate, point, dan badge Onboarding Graduate.
9. Manager dan HR melihat status selesai.

## Skenario 2 — Weekly Knowledge Challenge

1. HR membuat challenge Secure API Design.
2. Challenge ditargetkan kepada Backend Engineering.
3. Challenge aktif Senin hingga Jumat.
4. Employee mengerjakan lima pertanyaan.
5. Sistem menghitung nilai.
6. Employee mendapatkan participation point dan pass point.
7. Nilai sempurna mendapatkan bonus.
8. Data topic masuk Knowledge Gap Dashboard.
9. HR melihat topik Authentication memiliki correct answer rate rendah.
10. HR merekomendasikan course Secure API Authentication.

## Skenario 3 — Learning Campaign

1. HR membuat Cybersecurity Awareness Month.
2. Campaign berisi dua course, empat challenge, dan final assessment.
3. Campaign ditargetkan kepada seluruh tenant.
4. Employee mengikuti aktivitas selama satu bulan.
5. Sistem menghitung progress campaign.
6. Employee menyelesaikan semua mandatory activity.
7. Employee mendapatkan Campaign Finisher badge dan point.
8. HR melihat completion, feedback, leaderboard, dan knowledge gap.

## Skenario 4 — Course Feedback

1. Employee menyelesaikan course.
2. Sistem menampilkan form feedback.
3. Employee memberi rating dan komentar.
4. HR melihat agregat feedback.
5. Course dengan clarity score rendah ditandai untuk perbaikan.

## Skenario 5 — External Certification

1. Employee mengajukan sertifikasi eksternal.
2. Employee mengunggah bukti.
3. HR melakukan verifikasi.
4. HR menyetujui submission.
5. Sistem memberikan point dan badge yang sesuai.
6. Sertifikasi tampil pada skill passport employee.

---

# 30. Persetujuan Baseline PRD

Dokumen ini menjadi baseline setelah disetujui oleh pihak yang berwenang.

### Human Resources Bithealth

Nama: __________________________  
Jabatan: _______________________  
Tanggal: _______________________  
Persetujuan: ___________________  

### Product / Engineering Bithealth

Nama: __________________________  
Jabatan: _______________________  
Tanggal: _______________________  
Persetujuan: ___________________  

### Manajemen Bithealth

Nama: __________________________  
Jabatan: _______________________  
Tanggal: _______________________  
Persetujuan: ___________________  

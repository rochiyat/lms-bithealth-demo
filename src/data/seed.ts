import type { AppDatabase, QuizQuestion } from '@/domain/types';

const now = '2026-07-15T08:00:00.000Z';
const base = (id: string, tenantId = 'tenant_bithealth') => ({ id, tenantId, createdAt: now, updatedAt: now });

const securityQuestions: QuizQuestion[] = [
  { id: 'q_sec_1', text: 'Apa langkah pertama ketika menerima email mencurigakan?', type: 'SINGLE_CHOICE', options: ['Klik link untuk memeriksa', 'Laporkan melalui kanal keamanan', 'Balas pengirim', 'Teruskan ke rekan'], correctOptionIndexes: [1], topic: 'Phishing Detection', skillTag: 'Security Awareness', difficulty: 'BEGINNER' },
  { id: 'q_sec_2', text: 'Password yang paling aman adalah...', type: 'SINGLE_CHOICE', options: ['Nama perusahaan123', 'Tanggal lahir', 'Passphrase unik dan panjang', 'Password yang sama di semua aplikasi'], correctOptionIndexes: [2], topic: 'Password Security', skillTag: 'Security Awareness', difficulty: 'BEGINNER' },
  { id: 'q_sec_3', text: 'MFA membantu mengurangi risiko akun diambil alih.', type: 'TRUE_FALSE', options: ['Benar', 'Salah'], correctOptionIndexes: [0], topic: 'Identity Security', skillTag: 'Security Awareness', difficulty: 'GENERAL' },
];

const apiQuestions: QuizQuestion[] = [
  { id: 'q_api_1', text: 'Status HTTP yang tepat saat resource berhasil dibuat?', type: 'SINGLE_CHOICE', options: ['200', '201', '204', '302'], correctOptionIndexes: [1], topic: 'HTTP Semantics', skillTag: 'API Design', difficulty: 'BEGINNER' },
  { id: 'q_api_2', text: 'Praktik keamanan API yang direkomendasikan?', type: 'MULTIPLE_CHOICE', options: ['Validasi input', 'Simpan secret di source code', 'Rate limiting', 'Authorization per resource'], correctOptionIndexes: [0, 2, 3], topic: 'API Security', skillTag: 'Secure Coding', difficulty: 'INTERMEDIATE' },
  { id: 'q_api_3', text: 'Idempotency key berguna untuk mencegah operasi duplikat.', type: 'TRUE_FALSE', options: ['Benar', 'Salah'], correctOptionIndexes: [0], topic: 'API Reliability', skillTag: 'API Design', difficulty: 'INTERMEDIATE' },
];

export const createSeedDatabase = (): AppDatabase => ({
  groups: [
    { ...base('group_bithealth', ''), name: 'Bithealth Group', code: 'BHG', status: 'ACTIVE' },
  ],
  tenants: [
    { ...base('tenant_bithealth'), groupId: 'group_bithealth', name: 'PT Bithealth Teknologi Pintar', code: 'BITHEALTH', industry: 'IT Consulting & Healthcare Technology', status: 'ACTIVE' },
    { ...base('tenant_lab'), groupId: 'group_bithealth', name: 'Bithealth Innovation Lab', code: 'BILAB', industry: 'Research & Development', status: 'ACTIVE' },
  ],
  departments: [
    { ...base('dept_engineering'), name: 'Engineering', code: 'ENG', managerId: 'user_manager', status: 'ACTIVE' },
    { ...base('dept_qa'), name: 'Quality Assurance', code: 'QA', managerId: 'user_maya', status: 'ACTIVE' },
    { ...base('dept_delivery'), name: 'Project Delivery', code: 'DEL', managerId: 'user_raka', status: 'ACTIVE' },
    { ...base('dept_product'), name: 'Product & Business Analysis', code: 'PBA', managerId: 'user_nisa', status: 'ACTIVE' },
    { ...base('dept_hr'), name: 'People & Culture', code: 'HR', managerId: 'user_hr', status: 'ACTIVE' },
  ],
  jobFamilies: [
    { ...base('jf_engineering'), name: 'Software Engineering', code: 'ENG', description: 'Backend, frontend, mobile, and architecture roles.', status: 'ACTIVE' },
    { ...base('jf_qa'), name: 'Quality Engineering', code: 'QE', description: 'Manual, automation, performance, and quality practices.', status: 'ACTIVE' },
    { ...base('jf_pm'), name: 'Project Management', code: 'PM', description: 'Project planning, delivery, risk, and client management.', status: 'ACTIVE' },
    { ...base('jf_ba'), name: 'Business Analysis', code: 'BA', description: 'Requirement engineering and healthcare process analysis.', status: 'ACTIVE' },
    { ...base('jf_corporate'), name: 'Corporate Function', code: 'CORP', description: 'HR, finance, legal, and operations.', status: 'ACTIVE' },
  ],
  squads: [
    { ...base('squad_atlas'), name: 'Project Atlas', client: 'Hospital Group Alpha', leadId: 'user_manager', memberIds: ['user_employee', 'user_sinta', 'user_bima'], status: 'ACTIVE' },
    { ...base('squad_nova'), name: 'Project Nova', client: 'Health Insurance Beta', leadId: 'user_raka', memberIds: ['user_maya', 'user_nisa', 'user_doni'], status: 'ACTIVE' },
  ],
  users: [
    { ...base('user_super', 'tenant_bithealth'), employeeId: 'BTH-0001', name: 'Aditya Pratama', email: 'superadmin@bithealth.co.id', password: 'demo123', role: 'SUPER_ADMIN', departmentId: 'dept_hr', jobFamilyId: 'jf_corporate', jobTitle: 'Platform Administrator', status: 'ACTIVE', joinDate: '2022-01-10', points: 4200, level: 'Knowledge Champion', streakWeeks: 8 },
    { ...base('user_hr'), tenantId: undefined, groupId: 'group_bithealth', allowedTenants: ['tenant_bithealth', 'tenant_lab'], employeeId: 'BTH-0012', name: 'Alya Rahma', email: 'hr@bithealth.co.id', password: 'demo123', role: 'HR_ADMIN', departmentId: 'dept_hr', jobFamilyId: 'jf_corporate', jobTitle: 'Learning & Development Lead', status: 'ACTIVE', joinDate: '2023-02-01', points: 2450, level: 'Specialist', streakWeeks: 6 },
    { ...base('user_manager'), employeeId: 'BTH-0033', name: 'Fajar Nugraha', email: 'manager@bithealth.co.id', password: 'demo123', role: 'MANAGER', departmentId: 'dept_engineering', jobFamilyId: 'jf_engineering', jobTitle: 'Engineering Manager', status: 'ACTIVE', joinDate: '2021-06-12', points: 3120, level: 'Specialist', streakWeeks: 9 },
    { ...base('user_employee'), employeeId: 'BTH-0078', name: 'Dimas Saputra', email: 'employee@bithealth.co.id', password: 'demo123', role: 'EMPLOYEE', departmentId: 'dept_engineering', jobFamilyId: 'jf_engineering', jobTitle: 'Senior Backend Engineer', managerId: 'user_manager', status: 'ACTIVE', joinDate: '2024-01-15', points: 1680, level: 'Practitioner', streakWeeks: 4 },
    { ...base('user_sinta'), employeeId: 'BTH-0081', name: 'Sinta Maharani', email: 'sinta@bithealth.co.id', password: 'demo123', role: 'EMPLOYEE', departmentId: 'dept_engineering', jobFamilyId: 'jf_engineering', jobTitle: 'Frontend Engineer', managerId: 'user_manager', status: 'ACTIVE', joinDate: '2024-02-12', points: 1840, level: 'Practitioner', streakWeeks: 7 },
    { ...base('user_bima'), employeeId: 'BTH-0090', name: 'Bima Kurnia', email: 'bima@bithealth.co.id', password: 'demo123', role: 'EMPLOYEE', departmentId: 'dept_engineering', jobFamilyId: 'jf_engineering', jobTitle: 'Backend Engineer', managerId: 'user_manager', status: 'ACTIVE', joinDate: '2024-05-20', points: 1390, level: 'Practitioner', streakWeeks: 3 },
    { ...base('user_maya'), employeeId: 'BTH-0040', name: 'Maya Prameswari', email: 'maya@bithealth.co.id', password: 'demo123', role: 'MANAGER', departmentId: 'dept_qa', jobFamilyId: 'jf_qa', jobTitle: 'QA Lead', status: 'ACTIVE', joinDate: '2022-08-08', points: 2240, level: 'Specialist', streakWeeks: 5 },
    { ...base('user_raka'), employeeId: 'BTH-0048', name: 'Raka Wijaya', email: 'raka@bithealth.co.id', password: 'demo123', role: 'MANAGER', departmentId: 'dept_delivery', jobFamilyId: 'jf_pm', jobTitle: 'Delivery Manager', status: 'ACTIVE', joinDate: '2022-11-01', points: 1930, level: 'Practitioner', streakWeeks: 2 },
    { ...base('user_nisa'), employeeId: 'BTH-0051', name: 'Nisa Azzahra', email: 'nisa@bithealth.co.id', password: 'demo123', role: 'MANAGER', departmentId: 'dept_product', jobFamilyId: 'jf_ba', jobTitle: 'Lead Business Analyst', status: 'ACTIVE', joinDate: '2023-01-17', points: 2050, level: 'Specialist', streakWeeks: 5 },
    { ...base('user_doni'), employeeId: 'BTH-0102', name: 'Doni Setiawan', email: 'doni@bithealth.co.id', password: 'demo123', role: 'EMPLOYEE', departmentId: 'dept_delivery', jobFamilyId: 'jf_pm', jobTitle: 'Project Manager', managerId: 'user_raka', status: 'ACTIVE', joinDate: '2025-01-06', points: 980, level: 'Learner', streakWeeks: 2 },
  ],
  courses: [
    { ...base('course_security'), title: 'Information Security Awareness', code: 'SEC-101', description: 'Dasar keamanan informasi, phishing, password, MFA, dan pelaporan insiden.', category: 'Compliance', skillTags: ['Security Awareness', 'Phishing Detection'], difficulty: 'GENERAL', estimatedMinutes: 65, mandatoryDefault: true, navigationMode: 'LINEAR', passingScore: 80, certificateEnabled: true, certificateValidity: 'EXPIRING', certificateValidityDays: 365, points: 100, thumbnail: 'linear-gradient(135deg,#4338ca,#0ea5e9)', status: 'PUBLISHED', revision: 2, modules: [
      { id: 'mod_sec_1', title: 'Ancaman Keamanan Modern', type: 'VIDEO', durationMinutes: 18, url: 'https://example.com/video/security', required: true },
      { id: 'mod_sec_2', title: 'Panduan Password dan MFA', type: 'TEXT', durationMinutes: 12, content: 'Gunakan passphrase unik, password manager, dan MFA.', url: 'https://drive.google.com/file/d/1KrkQh8rytzkqB5RGtPLoeRT-hZCdT-55/view?usp=sharing', required: true },
      { id: 'mod_sec_3', title: 'Quiz Security Awareness', type: 'QUIZ', durationMinutes: 15, required: true },
    ] },
    { ...base('course_api'), title: 'Secure API Design', code: 'ENG-API-201', description: 'Prinsip desain REST API yang aman, konsisten, idempotent, dan observable.', category: 'Engineering', skillTags: ['API Design', 'Secure Coding'], difficulty: 'INTERMEDIATE', estimatedMinutes: 120, mandatoryDefault: false, navigationMode: 'LINEAR', passingScore: 80, certificateEnabled: true, certificateValidity: 'NON_EXPIRING', points: 140, thumbnail: 'linear-gradient(135deg,#0f766e,#14b8a6)', status: 'PUBLISHED', revision: 1, modules: [
      { id: 'mod_api_1', title: 'REST and HTTP Semantics', type: 'TEXT', durationMinutes: 25, content: 'Resource modeling, methods, status codes, and error contracts.', required: true },
      { id: 'mod_api_2', title: 'Authentication & Authorization', type: 'VIDEO', durationMinutes: 35, url: 'https://www.youtube.com/embed/Rrd6xkyjPB8?si=CQ0YC6NjyZvfvHk5', required: true },
      { id: 'mod_api_3', title: 'API Design Case Study', type: 'DOCUMENT', durationMinutes: 25, url: '/dummy/api-case-study.pdf', required: true },
      { id: 'mod_api_4', title: 'Final Quiz', type: 'QUIZ', durationMinutes: 20, required: true },
    ] },
    { ...base('course_healthcare'), title: 'Healthcare Domain Fundamentals', code: 'HCD-101', description: 'Pengenalan alur layanan rumah sakit, terminologi, dan peran sistem informasi kesehatan.', category: 'Healthcare Domain', skillTags: ['Healthcare Workflow', 'Domain Knowledge'], difficulty: 'BEGINNER', estimatedMinutes: 90, mandatoryDefault: false, navigationMode: 'FLEXIBLE', passingScore: 75, certificateEnabled: true, certificateValidity: 'NON_EXPIRING', points: 120, thumbnail: 'linear-gradient(135deg,#be123c,#fb7185)', status: 'PUBLISHED', revision: 1, modules: [
      { id: 'mod_hc_1', title: 'Patient Journey Overview', type: 'VIDEO', durationMinutes: 22, url: 'https://example.com/video/healthcare', required: true },
      { id: 'mod_hc_2', title: 'Clinical and Administrative Terms', type: 'DOCUMENT', durationMinutes: 25, url: '/dummy/healthcare-terms.pdf', required: true },
      { id: 'mod_hc_3', title: 'Domain Assessment', type: 'QUIZ', durationMinutes: 20, required: true },
    ] },
    { ...base('course_client'), title: 'Client Communication Essentials', code: 'PRO-110', description: 'Komunikasi profesional, expectation management, meeting, dan penyampaian risiko.', category: 'Professional Skills', skillTags: ['Client Communication', 'Consulting'], difficulty: 'BEGINNER', estimatedMinutes: 75, mandatoryDefault: false, navigationMode: 'FLEXIBLE', passingScore: 75, certificateEnabled: true, certificateValidity: 'NON_EXPIRING', points: 100, thumbnail: 'linear-gradient(135deg,#a16207,#fbbf24)', status: 'PUBLISHED', revision: 1, modules: [
      { id: 'mod_cli_1', title: 'Consultant Communication Mindset', type: 'VIDEO', durationMinutes: 20, url: 'https://example.com/video/client', required: true },
      { id: 'mod_cli_2', title: 'Difficult Conversation Playbook', type: 'TEXT', durationMinutes: 20, content: 'Fokus pada fakta, dampak, opsi, dan rekomendasi.', required: true },
      { id: 'mod_cli_3', title: 'Scenario Quiz', type: 'QUIZ', durationMinutes: 15, required: true },
    ] },
    { ...base('course_testing'), title: 'Testing Pyramid & Automation Strategy', code: 'QA-201', description: 'Menyusun strategi unit, integration, API, dan end-to-end test yang efektif.', category: 'Quality Engineering', skillTags: ['Test Automation', 'Quality Strategy'], difficulty: 'INTERMEDIATE', estimatedMinutes: 105, mandatoryDefault: false, navigationMode: 'LINEAR', passingScore: 80, certificateEnabled: true, certificateValidity: 'NON_EXPIRING', points: 130, thumbnail: 'linear-gradient(135deg,#6d28d9,#a78bfa)', status: 'DRAFT', revision: 1, modules: [
      { id: 'mod_test_1', title: 'Testing Pyramid', type: 'TEXT', durationMinutes: 20, content: 'Prinsip membagi test berdasarkan biaya, kecepatan, dan confidence.', required: true },
    ] },
  ],
  quizzes: [
    { ...base('quiz_security'), title: 'Security Awareness Assessment', courseId: 'course_security', description: 'Assessment akhir keamanan informasi.', passingScore: 80, attemptLimit: 3, durationMinutes: 15, randomizeQuestions: true, showAnswers: true, status: 'PUBLISHED', questions: securityQuestions },
    { ...base('quiz_api'), title: 'Secure API Design Assessment', courseId: 'course_api', description: 'Assessment desain API aman.', passingScore: 80, attemptLimit: 2, durationMinutes: 20, randomizeQuestions: true, showAnswers: true, status: 'PUBLISHED', questions: apiQuestions },
  ],
  learningPaths: [
    { ...base('path_backend'), name: 'Backend Developer Foundation', code: 'PATH-BE-01', description: 'Fondasi engineer backend Bithealth yang siap bekerja pada proyek klien.', targetJobFamilyId: 'jf_engineering', courseIds: ['course_security', 'course_api', 'course_healthcare'], navigationMode: 'LINEAR', deadlineDays: 90, certificateEnabled: true, points: 240, badgeId: 'badge_backend', status: 'PUBLISHED' },
    { ...base('path_onboarding'), name: 'New Employee Onboarding', code: 'PATH-ONB-01', description: 'Pembelajaran awal untuk seluruh karyawan baru Bithealth.', courseIds: ['course_security', 'course_healthcare', 'course_client'], navigationMode: 'LINEAR', deadlineDays: 30, certificateEnabled: true, points: 200, badgeId: 'badge_onboarding', status: 'PUBLISHED' },
  ],
  campaigns: [
    { ...base('campaign_security'), name: 'Cybersecurity Awareness Month', description: 'Program sebulan untuk memperkuat kebiasaan keamanan digital seluruh karyawan.', banner: 'linear-gradient(120deg,#312e81,#2563eb,#06b6d4)', startDate: '2026-07-01', endDate: '2026-07-31', targetDepartmentIds: ['dept_engineering', 'dept_qa', 'dept_delivery', 'dept_product', 'dept_hr'], courseIds: ['course_security'], pathIds: [], challengeIds: ['challenge_phishing', 'challenge_api'], requiredChallengeCount: 1, minimumAverageScore: 80, points: 250, badgeId: 'badge_campaign', status: 'ACTIVE' },
    { ...base('campaign_consulting'), name: 'Consultant Readiness Sprint', description: 'Persiapan skill domain dan komunikasi untuk konsultan yang akan masuk proyek baru.', banner: 'linear-gradient(120deg,#7c2d12,#ea580c,#fbbf24)', startDate: '2026-08-01', endDate: '2026-08-31', targetDepartmentIds: ['dept_engineering', 'dept_qa', 'dept_delivery', 'dept_product'], courseIds: ['course_healthcare', 'course_client'], pathIds: [], challengeIds: [], requiredChallengeCount: 0, minimumAverageScore: 75, points: 220, badgeId: 'badge_consultant', status: 'SCHEDULED' },
  ],
  assignments: [
    { ...base('assign_security'), title: 'Mandatory Security Awareness 2026', type: 'COURSE', resourceId: 'course_security', targetType: 'ALL', targetIds: [], mandatory: true, startDate: '2026-07-01', dueDate: '2026-07-31', recurrence: 'YEARLY', autoEnrollNewEmployee: true, status: 'ACTIVE' },
    { ...base('assign_backend'), title: 'Backend Foundation - Engineering', type: 'PATH', resourceId: 'path_backend', targetType: 'JOB_FAMILY', targetIds: ['jf_engineering'], mandatory: false, startDate: '2026-06-01', dueDate: '2026-09-30', recurrence: 'NONE', autoEnrollNewEmployee: true, status: 'ACTIVE' },
    { ...base('assign_campaign'), title: 'Cybersecurity Campaign', type: 'CAMPAIGN', resourceId: 'campaign_security', targetType: 'ALL', targetIds: [], mandatory: false, startDate: '2026-07-01', dueDate: '2026-07-31', recurrence: 'NONE', autoEnrollNewEmployee: false, status: 'ACTIVE' },
  ],
  enrollments: [
    { ...base('enr_dimas_sec'), userId: 'user_employee', assignmentId: 'assign_security', type: 'COURSE', resourceId: 'course_security', status: 'IN_PROGRESS', progress: 66, score: 70, startedAt: '2026-07-02T03:00:00Z', dueDate: '2026-07-31', currentModuleId: 'mod_sec_3' },
    { ...base('enr_dimas_api'), userId: 'user_employee', assignmentId: 'assign_backend', type: 'COURSE', resourceId: 'course_api', status: 'IN_PROGRESS', progress: 40, startedAt: '2026-06-11T03:00:00Z', dueDate: '2026-09-30', currentModuleId: 'mod_api_2' },
    { ...base('enr_dimas_hc'), userId: 'user_employee', assignmentId: 'assign_backend', type: 'COURSE', resourceId: 'course_healthcare', status: 'COMPLETED', progress: 100, score: 88, startedAt: '2026-06-01T03:00:00Z', completedAt: '2026-06-18T07:00:00Z', dueDate: '2026-09-30' },
    { ...base('enr_dimas_path'), userId: 'user_employee', assignmentId: 'assign_backend', type: 'PATH', resourceId: 'path_backend', status: 'IN_PROGRESS', progress: 48, dueDate: '2026-09-30' },
    { ...base('enr_dimas_campaign'), userId: 'user_employee', assignmentId: 'assign_campaign', type: 'CAMPAIGN', resourceId: 'campaign_security', status: 'IN_PROGRESS', progress: 55, dueDate: '2026-07-31' },
    { ...base('enr_sinta_sec'), userId: 'user_sinta', assignmentId: 'assign_security', type: 'COURSE', resourceId: 'course_security', status: 'COMPLETED', progress: 100, score: 95, startedAt: '2026-07-01T03:00:00Z', completedAt: '2026-07-08T07:00:00Z', dueDate: '2026-07-31' },
    { ...base('enr_bima_sec'), userId: 'user_bima', assignmentId: 'assign_security', type: 'COURSE', resourceId: 'course_security', status: 'NOT_STARTED', progress: 0, dueDate: '2026-07-31' },
    { ...base('enr_maya_sec'), userId: 'user_maya', assignmentId: 'assign_security', type: 'COURSE', resourceId: 'course_security', status: 'COMPLETED', progress: 100, score: 100, completedAt: '2026-07-05T07:00:00Z', dueDate: '2026-07-31' },
    { ...base('enr_doni_sec'), userId: 'user_doni', assignmentId: 'assign_security', type: 'COURSE', resourceId: 'course_security', status: 'IN_PROGRESS', progress: 35, dueDate: '2026-07-31' },
  ],
  certificates: [
    { ...base('cert_dimas_hc'), userId: 'user_employee', type: 'COURSE', resourceId: 'course_healthcare', title: 'Healthcare Domain Fundamentals', code: 'BTH-CERT-2026-00142', issuedAt: '2026-06-18', status: 'VALID', provider: 'Bithealth Learning Hub', verificationUrl: '/verify/BTH-CERT-2026-00142' },
    { ...base('cert_sinta_sec'), userId: 'user_sinta', type: 'COURSE', resourceId: 'course_security', title: 'Information Security Awareness', code: 'BTH-CERT-2026-00155', issuedAt: '2026-07-08', expiresAt: '2027-07-08', status: 'VALID', provider: 'Bithealth Learning Hub', verificationUrl: '/verify/BTH-CERT-2026-00155' },
    { ...base('cert_external_dimas'), userId: 'user_employee', type: 'EXTERNAL', title: 'AWS Certified Developer – Associate', code: 'AWS-DVA-DEMO-0192', issuedAt: '2026-03-12', expiresAt: '2029-03-12', status: 'VALID', provider: 'Amazon Web Services', verificationUrl: 'https://example.com/verify/aws-demo' },
  ],
  challenges: [
    { ...base('challenge_phishing'), title: 'Kenali Email Phishing', description: 'Challenge singkat untuk mengenali pola email dan tautan berbahaya.', topic: 'Phishing Detection', skillTag: 'Security Awareness', targetDepartmentIds: [], startDate: '2026-07-13', endDate: '2026-07-19', passingScore: 80, attemptLimit: 1, durationMinutes: 5, participationPoints: 10, passPoints: 20, perfectScoreBonus: 10, status: 'ACTIVE', questions: securityQuestions },
    { ...base('challenge_api'), title: 'Secure API Design Challenge', description: 'Uji pengetahuan API design dan security.', topic: 'API Security', skillTag: 'Secure Coding', targetDepartmentIds: ['dept_engineering', 'dept_qa'], startDate: '2026-07-20', endDate: '2026-07-26', passingScore: 80, attemptLimit: 1, durationMinutes: 7, participationPoints: 10, passPoints: 25, perfectScoreBonus: 15, status: 'SCHEDULED', questions: apiQuestions },
  ],
  challengeAttempts: [
    { ...base('attempt_sinta_phishing'), challengeId: 'challenge_phishing', userId: 'user_sinta', score: 100, passed: true, attemptNumber: 1, submittedAt: '2026-07-14T04:00:00Z' },
    { ...base('attempt_maya_phishing'), challengeId: 'challenge_phishing', userId: 'user_maya', score: 100, passed: true, attemptNumber: 1, submittedAt: '2026-07-13T05:00:00Z' },
  ],
  pointRules: [
    { ...base('rule_course'), key: 'COURSE_COMPLETED', name: 'Course Completed', description: 'Menyelesaikan course.', points: 100, approvalRequired: false, active: true },
    { ...base('rule_first_pass'), key: 'FIRST_ATTEMPT_PASS', name: 'First Attempt Pass', description: 'Lulus quiz pada attempt pertama.', points: 20, approvalRequired: false, active: true },
    { ...base('rule_perfect'), key: 'PERFECT_SCORE', name: 'Perfect Score', description: 'Mendapat nilai 100.', points: 15, approvalRequired: false, active: true },
    { ...base('rule_path'), key: 'PATH_COMPLETED', name: 'Learning Path Completed', description: 'Menyelesaikan learning path.', points: 200, approvalRequired: false, active: true },
    { ...base('rule_campaign'), key: 'CAMPAIGN_COMPLETED', name: 'Campaign Completed', description: 'Menyelesaikan learning campaign.', points: 250, approvalRequired: false, active: true },
    { ...base('rule_feedback'), key: 'COURSE_FEEDBACK', name: 'Course Feedback', description: 'Memberikan feedback course.', points: 5, approvalRequired: false, active: true },
    { ...base('rule_contribution'), key: 'KNOWLEDGE_CONTRIBUTION', name: 'Knowledge Contribution', description: 'Materi atau sharing disetujui.', points: 150, approvalRequired: true, active: true },
  ],
  pointTransactions: [
    { ...base('pt_1'), userId: 'user_employee', ruleKey: 'COURSE_COMPLETED', points: 120, description: 'Healthcare Domain Fundamentals selesai', referenceType: 'COURSE', referenceId: 'course_healthcare' },
    { ...base('pt_2'), userId: 'user_employee', ruleKey: 'FIRST_ATTEMPT_PASS', points: 20, description: 'Lulus assessment pada attempt pertama', referenceType: 'QUIZ', referenceId: 'quiz_security' },
    { ...base('pt_3'), userId: 'user_employee', ruleKey: 'COURSE_FEEDBACK', points: 5, description: 'Memberikan feedback course', referenceType: 'COURSE', referenceId: 'course_healthcare' },
    { ...base('pt_4'), userId: 'user_sinta', ruleKey: 'PERFECT_SCORE', points: 15, description: 'Perfect score pada Security Awareness', referenceType: 'QUIZ', referenceId: 'quiz_security' },
  ],
  badges: [
    { ...base('badge_first'), name: 'First Step', code: 'FIRST_STEP', description: 'Menyelesaikan course pertama.', icon: '🎓', category: 'LEARNING', conditionType: 'COURSE_COUNT', threshold: 1, active: true },
    { ...base('badge_perfect'), name: 'Perfect Score', code: 'PERFECT_SCORE', description: 'Mendapatkan nilai 100.', icon: '💯', category: 'ASSESSMENT', conditionType: 'PERFECT_SCORE_COUNT', threshold: 1, active: true },
    { ...base('badge_consistent'), name: 'Consistent Learner', code: 'CONSISTENT', description: 'Aktif belajar selama empat minggu berturut-turut.', icon: '🔥', category: 'CONSISTENCY', conditionType: 'STREAK_WEEKS', threshold: 4, active: true },
    { ...base('badge_backend'), name: 'Backend Foundation', code: 'BACKEND_FOUNDATION', description: 'Menyelesaikan Backend Developer Foundation.', icon: '⚙️', category: 'COMPETENCY', conditionType: 'PATH_COMPLETED', threshold: 1, active: true },
    { ...base('badge_onboarding'), name: 'Onboarding Graduate', code: 'ONBOARDING_GRAD', description: 'Menyelesaikan New Employee Onboarding.', icon: '🚀', category: 'COMPETENCY', conditionType: 'PATH_COMPLETED', threshold: 1, active: true },
    { ...base('badge_campaign'), name: 'Security Champion', code: 'SECURITY_CHAMP', description: 'Menyelesaikan Cybersecurity Awareness Month.', icon: '🛡️', category: 'COMPETENCY', conditionType: 'CAMPAIGN_COMPLETED', threshold: 1, active: true },
    { ...base('badge_consultant'), name: 'Consultant Ready', code: 'CONSULTANT_READY', description: 'Menyelesaikan Consultant Readiness Sprint.', icon: '🤝', category: 'COMPETENCY', conditionType: 'CAMPAIGN_COMPLETED', threshold: 1, active: true },
  ],
  userBadges: [
    { ...base('ub_dimas_first'), userId: 'user_employee', badgeId: 'badge_first', earnedAt: '2026-04-11' },
    { ...base('ub_dimas_consistent'), userId: 'user_employee', badgeId: 'badge_consistent', earnedAt: '2026-07-07' },
    { ...base('ub_sinta_first'), userId: 'user_sinta', badgeId: 'badge_first', earnedAt: '2025-10-02' },
    { ...base('ub_sinta_perfect'), userId: 'user_sinta', badgeId: 'badge_perfect', earnedAt: '2026-07-08' },
  ],
  levels: [
    { ...base('level_explorer'), name: 'Explorer', minimumPoints: 0, maximumPoints: 499, icon: '🧭' },
    { ...base('level_learner'), name: 'Learner', minimumPoints: 500, maximumPoints: 999, icon: '📘' },
    { ...base('level_practitioner'), name: 'Practitioner', minimumPoints: 1000, maximumPoints: 1999, icon: '🛠️' },
    { ...base('level_specialist'), name: 'Specialist', minimumPoints: 2000, maximumPoints: 3999, icon: '⭐' },
    { ...base('level_champion'), name: 'Knowledge Champion', minimumPoints: 4000, icon: '🏆' },
  ],
  missions: [
    { ...base('mission_july'), name: 'July Learning Mission', description: 'Jaga momentum belajar selama bulan Juli.', startDate: '2026-07-01', endDate: '2026-07-31', tasks: [
      { id: 'task_1', label: 'Selesaikan 1 course', target: 1, metric: 'COURSE_COMPLETED' },
      { id: 'task_2', label: 'Ikuti 2 weekly challenge', target: 2, metric: 'CHALLENGE_COMPLETED' },
      { id: 'task_3', label: 'Berikan 1 feedback course', target: 1, metric: 'FEEDBACK_GIVEN' },
    ], rewardPoints: 100, badgeId: 'badge_consistent', status: 'ACTIVE' },
    { ...base('mission_engineering'), name: 'Engineering Secure Delivery Mission', description: 'Target khusus engineering untuk secure delivery.', startDate: '2026-07-01', endDate: '2026-08-15', targetJobFamilyId: 'jf_engineering', tasks: [
      { id: 'task_eng_1', label: 'Selesaikan Secure API Design', target: 1, metric: 'COURSE_API_COMPLETED' },
      { id: 'task_eng_2', label: 'Ikuti API Design Challenge', target: 1, metric: 'CHALLENGE_API_COMPLETED' },
    ], rewardPoints: 140, badgeId: 'badge_backend', status: 'ACTIVE' },
  ],
  feedback: [
    { ...base('fb_1'), courseId: 'course_healthcare', userId: 'user_employee', relevance: 5, clarity: 4, quality: 5, durationFit: 4, recommended: true, comment: 'Studi kasusnya relevan untuk memahami alur rumah sakit.', anonymous: false, status: 'VISIBLE' },
    { ...base('fb_2'), courseId: 'course_security', userId: 'user_sinta', relevance: 5, clarity: 5, quality: 4, durationFit: 4, recommended: true, comment: 'Materi phishing praktis dan mudah dipahami.', anonymous: true, status: 'VISIBLE' },
    { ...base('fb_3'), courseId: 'course_client', userId: 'user_doni', relevance: 5, clarity: 4, quality: 4, durationFit: 3, recommended: true, comment: 'Perlu lebih banyak contoh percakapan dengan klien.', anonymous: false, status: 'VISIBLE' },
  ],
  notifications: [
    { ...base('notif_1'), userId: 'user_employee', title: 'Weekly Challenge tersedia', message: 'Kenali Email Phishing aktif sampai 19 Juli.', type: 'INFO', read: false, link: '/gamification/challenges' },
    { ...base('notif_2'), userId: 'user_employee', title: 'Streak bertambah!', message: 'Anda aktif belajar selama 4 minggu berturut-turut.', type: 'ACHIEVEMENT', read: false, link: '/achievements' },
    { ...base('notif_3'), userId: 'user_employee', title: 'Deadline mendekat', message: 'Information Security Awareness jatuh tempo 31 Juli.', type: 'WARNING', read: true, link: '/my-learning' },
  ],
  auditLogs: [
    { ...base('audit_1'), actorId: 'user_hr', action: 'PUBLISH', entityType: 'COURSE', entityId: 'course_security', description: 'Menerbitkan Information Security Awareness revision 2.' },
    { ...base('audit_2'), actorId: 'user_hr', action: 'CREATE', entityType: 'CAMPAIGN', entityId: 'campaign_security', description: 'Membuat Cybersecurity Awareness Month.' },
    { ...base('audit_3'), actorId: 'user_manager', action: 'SEND_REMINDER', entityType: 'DEPARTMENT', entityId: 'dept_engineering', description: 'Mengirim reminder mandatory training kepada tim Engineering.' },
  ],
});

export type Role = 'SUPER_ADMIN' | 'HR_ADMIN' | 'MANAGER' | 'EMPLOYEE';
export type Status = 'ACTIVE' | 'INACTIVE';
export type PublishStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
export type Difficulty = 'GENERAL' | 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
export type EnrollmentStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'OVERDUE' | 'FAILED' | 'EXPIRED' | 'CANCELLED';
export type CampaignStatus = 'DRAFT' | 'SCHEDULED' | 'ACTIVE' | 'COMPLETED' | 'ARCHIVED';

export interface BaseEntity {
  id: string;
  tenantId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Group extends BaseEntity { name: string; code: string; status: Status; }
export interface Tenant extends BaseEntity { groupId: string; name: string; code: string; industry: string; status: Status; }
export interface Department extends BaseEntity { name: string; code: string; managerId?: string; status: Status; }
export interface JobFamily extends BaseEntity { name: string; code: string; description: string; status: Status; }
export interface Squad extends BaseEntity { name: string; client: string; leadId: string; memberIds: string[]; status: Status; }

export interface User extends BaseEntity {
  groupId?: string;
  allowedTenants?: string[];
  employeeId: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  departmentId: string;
  jobFamilyId: string;
  jobTitle: string;
  managerId?: string;
  avatar?: string;
  status: Status;
  joinDate: string;
  points: number;
  level: string;
  streakWeeks: number;
  hideLeaderboard?: boolean;
}

export interface ModuleItem {
  id: string;
  title: string;
  type: 'TEXT' | 'VIDEO' | 'DOCUMENT' | 'LINK' | 'QUIZ';
  durationMinutes: number;
  url?: string;
  content?: string;
  required: boolean;
}

export interface Course extends BaseEntity {
  title: string;
  code: string;
  description: string;
  category: string;
  skillTags: string[];
  difficulty: Difficulty;
  estimatedMinutes: number;
  mandatoryDefault: boolean;
  navigationMode: 'LINEAR' | 'FLEXIBLE';
  passingScore: number;
  certificateEnabled: boolean;
  certificateValidity: 'EXPIRING' | 'NON_EXPIRING';
  certificateValidityDays?: number;
  points: number;
  thumbnail: string;
  status: PublishStatus;
  revision: number;
  modules: ModuleItem[];
}

export interface QuizQuestion {
  id: string;
  text: string;
  type: 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE' | 'TRUE_FALSE';
  options: string[];
  correctOptionIndexes: number[];
  topic: string;
  skillTag: string;
  difficulty: Difficulty;
}

export interface Quiz extends BaseEntity {
  title: string;
  courseId?: string;
  description: string;
  passingScore: number;
  attemptLimit: number;
  durationMinutes: number;
  randomizeQuestions: boolean;
  showAnswers: boolean;
  status: PublishStatus;
  questions: QuizQuestion[];
}

export interface LearningPath extends BaseEntity {
  name: string;
  code: string;
  description: string;
  targetJobFamilyId?: string;
  courseIds: string[];
  navigationMode: 'LINEAR' | 'FLEXIBLE';
  deadlineDays: number;
  certificateEnabled: boolean;
  points: number;
  badgeId?: string;
  status: PublishStatus;
}

export interface Campaign extends BaseEntity {
  name: string;
  description: string;
  banner: string;
  startDate: string;
  endDate: string;
  targetDepartmentIds: string[];
  courseIds: string[];
  pathIds: string[];
  challengeIds: string[];
  requiredChallengeCount: number;
  minimumAverageScore: number;
  points: number;
  badgeId?: string;
  status: CampaignStatus;
}

export interface Assignment extends BaseEntity {
  title: string;
  type: 'COURSE' | 'PATH' | 'CAMPAIGN';
  resourceId: string;
  targetType: 'ALL' | 'TENANT' | 'DEPARTMENT' | 'JOB_FAMILY' | 'EMPLOYEE';
  targetIds: string[];
  mandatory: boolean;
  startDate: string;
  dueDate: string;
  recurrence: 'NONE' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY';
  autoEnrollNewEmployee: boolean;
  status: 'ACTIVE' | 'CLOSED';
}

export interface Enrollment extends BaseEntity {
  userId: string;
  assignmentId?: string;
  type: 'COURSE' | 'PATH' | 'CAMPAIGN';
  resourceId: string;
  status: EnrollmentStatus;
  progress: number;
  score?: number;
  startedAt?: string;
  completedAt?: string;
  dueDate?: string;
  currentModuleId?: string;
}

export interface Certificate extends BaseEntity {
  userId: string;
  type: 'COURSE' | 'PATH' | 'EXTERNAL';
  resourceId?: string;
  title: string;
  code: string;
  issuedAt: string;
  expiresAt?: string;
  status: 'VALID' | 'EXPIRED' | 'REVOKED' | 'PENDING_VERIFICATION';
  provider: string;
  verificationUrl?: string;
  revocationReason?: string;
}

export interface Challenge extends BaseEntity {
  title: string;
  description: string;
  topic: string;
  skillTag: string;
  targetDepartmentIds: string[];
  startDate: string;
  endDate: string;
  passingScore: number;
  attemptLimit: number;
  durationMinutes: number;
  participationPoints: number;
  passPoints: number;
  perfectScoreBonus: number;
  status: 'DRAFT' | 'SCHEDULED' | 'ACTIVE' | 'COMPLETED';
  questions: QuizQuestion[];
}

export interface ChallengeAttempt extends BaseEntity {
  challengeId: string;
  userId: string;
  score: number;
  passed: boolean;
  attemptNumber: number;
  submittedAt: string;
}

export interface PointRule extends BaseEntity {
  key: string;
  name: string;
  description: string;
  points: number;
  approvalRequired: boolean;
  active: boolean;
}

export interface PointTransaction extends BaseEntity {
  userId: string;
  ruleKey: string;
  points: number;
  description: string;
  referenceType?: string;
  referenceId?: string;
  approvedBy?: string;
}

export interface Badge extends BaseEntity {
  name: string;
  code: string;
  description: string;
  icon: string;
  category: 'LEARNING' | 'ASSESSMENT' | 'CONSISTENCY' | 'CONTRIBUTION' | 'COMPETENCY' | 'RANKING';
  conditionType: string;
  threshold: number;
  active: boolean;
}

export interface UserBadge extends BaseEntity {
  userId: string;
  badgeId: string;
  earnedAt: string;
  referenceId?: string;
}

export interface Level extends BaseEntity { name: string; minimumPoints: number; maximumPoints?: number; icon: string; }

export interface Mission extends BaseEntity {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  targetJobFamilyId?: string;
  tasks: { id: string; label: string; target: number; metric: string }[];
  rewardPoints: number;
  badgeId?: string;
  status: 'DRAFT' | 'ACTIVE' | 'COMPLETED';
}

export interface Feedback extends BaseEntity {
  courseId: string;
  userId: string;
  relevance: number;
  clarity: number;
  quality: number;
  durationFit: number;
  recommended: boolean;
  comment?: string;
  anonymous: boolean;
  status: 'VISIBLE' | 'HIDDEN';
}

export interface Notification extends BaseEntity {
  userId: string;
  title: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ACHIEVEMENT';
  read: boolean;
  link?: string;
}

export interface AuditLog extends BaseEntity {
  actorId: string;
  action: string;
  entityType: string;
  entityId: string;
  description: string;
}

export interface KnowledgeGap {
  id: string;
  topic: string;
  skillTag: string;
  departmentId: string;
  correctRate: number;
  responseCount: number;
  classification: 'LOW' | 'MEDIUM' | 'HIGH';
  recommendedCourseId?: string;
}

export interface AppDatabase {
  groups: Group[];
  tenants: Tenant[];
  departments: Department[];
  jobFamilies: JobFamily[];
  squads: Squad[];
  users: User[];
  courses: Course[];
  quizzes: Quiz[];
  learningPaths: LearningPath[];
  campaigns: Campaign[];
  assignments: Assignment[];
  enrollments: Enrollment[];
  certificates: Certificate[];
  challenges: Challenge[];
  challengeAttempts: ChallengeAttempt[];
  pointRules: PointRule[];
  pointTransactions: PointTransaction[];
  badges: Badge[];
  userBadges: UserBadge[];
  levels: Level[];
  missions: Mission[];
  feedback: Feedback[];
  notifications: Notification[];
  auditLogs: AuditLog[];
}

export type CollectionName = keyof AppDatabase;
export type CollectionItem<K extends CollectionName> = AppDatabase[K][number];

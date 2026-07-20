import { Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from '@/components/AppShell';
import { useAuth } from '@/contexts/AuthContext';
import { useAppData } from '@/contexts/AppDataContext';
import type { Role } from '@/domain/types';
import { LoginPage } from '@/pages/LoginPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { DepartmentsPage, EmployeesPage, GroupsTenantsPage, JobFamiliesPage, SquadsPage } from '@/pages/OrganizationPages';
import { AssignmentsPage, CampaignsPage, CertificatesPage, CoursesPage, LearningPathsPage, QuizzesPage } from '@/pages/LearningManagementPages';
import { AchievementsPage, BadgesLevelsPage, ChallengesPage, GamificationOverviewPage, LeaderboardPage, MissionsPage } from '@/pages/GamificationPages';
import { FeedbackAnalyticsPage, KnowledgeGapPage, ProgressAnalyticsPage, ReportsPage } from '@/pages/AnalyticsPages';
import { LearnCoursePage, LearningHistoryPage, MyLearningPage, TeamLearningPage } from '@/pages/EmployeePages';
import { AuditPage, NotFoundPage, SettingsPage, UnauthorizedPage } from '@/pages/SystemPages';

const SUPER: Role[] = ['SUPER_ADMIN'];
const HR: Role[] = ['HR_ADMIN'];
const SUPER_HR: Role[] = ['SUPER_ADMIN', 'HR_ADMIN'];
const MANAGER: Role[] = ['MANAGER'];
const EMPLOYEE: Role[] = ['EMPLOYEE'];
const HR_MANAGER: Role[] = ['HR_ADMIN', 'MANAGER'];
const HR_EMPLOYEE: Role[] = ['HR_ADMIN', 'EMPLOYEE'];
const MANAGER_EMPLOYEE: Role[] = ['MANAGER', 'EMPLOYEE'];
const ALL: Role[] = ['SUPER_ADMIN', 'HR_ADMIN', 'MANAGER', 'EMPLOYEE'];

function ProtectedApp() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <AppShell />;
}

function RoleGate({ allowed, children }: { allowed: Role[]; children: React.ReactNode }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (!allowed.includes(user.role)) return <Navigate to="/unauthorized" replace />;
  return children;
}

export default function App() {
  const { loading, error } = useAppData();
  if (loading) return <div className="app-loading"><div className="loading-logo">B</div><div className="loading-bar"><span /></div><p>Menyiapkan Bithealth Learning Hub…</p></div>;
  if (error) return <div className="app-loading"><h2>Gagal memuat aplikasi</h2><p>{error}</p></div>;

  return <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route element={<ProtectedApp />}>
      <Route index element={<RoleGate allowed={ALL}><DashboardPage /></RoleGate>} />
      <Route path="unauthorized" element={<UnauthorizedPage />} />

      <Route path="organization" element={<RoleGate allowed={SUPER}><GroupsTenantsPage /></RoleGate>} />
      <Route path="employees" element={<RoleGate allowed={SUPER_HR}><EmployeesPage /></RoleGate>} />
      <Route path="departments" element={<RoleGate allowed={SUPER_HR}><DepartmentsPage /></RoleGate>} />
      <Route path="job-families" element={<RoleGate allowed={HR}><JobFamiliesPage /></RoleGate>} />
      <Route path="squads" element={<RoleGate allowed={HR}><SquadsPage /></RoleGate>} />

      <Route path="courses" element={<RoleGate allowed={HR}><CoursesPage /></RoleGate>} />
      <Route path="quizzes" element={<RoleGate allowed={HR}><QuizzesPage /></RoleGate>} />
      <Route path="learning-paths" element={<RoleGate allowed={HR_EMPLOYEE}><LearningPathsPage /></RoleGate>} />
      <Route path="campaigns" element={<RoleGate allowed={HR_EMPLOYEE}><CampaignsPage /></RoleGate>} />
      <Route path="assignments" element={<RoleGate allowed={HR}><AssignmentsPage /></RoleGate>} />
      <Route path="certificates" element={<RoleGate allowed={ALL}><CertificatesPage /></RoleGate>} />

      <Route path="gamification" element={<RoleGate allowed={HR}><GamificationOverviewPage /></RoleGate>} />
      <Route path="gamification/challenges" element={<RoleGate allowed={HR_EMPLOYEE}><ChallengesPage /></RoleGate>} />
      <Route path="gamification/badges" element={<RoleGate allowed={HR}><BadgesLevelsPage /></RoleGate>} />
      <Route path="gamification/missions" element={<RoleGate allowed={HR}><MissionsPage /></RoleGate>} />
      <Route path="leaderboard" element={<RoleGate allowed={HR_MANAGER.concat(EMPLOYEE)}><LeaderboardPage /></RoleGate>} />
      <Route path="achievements" element={<RoleGate allowed={MANAGER_EMPLOYEE}><AchievementsPage /></RoleGate>} />

      <Route path="analytics/progress" element={<RoleGate allowed={HR}><ProgressAnalyticsPage /></RoleGate>} />
      <Route path="analytics/knowledge-gap" element={<RoleGate allowed={HR_MANAGER}><KnowledgeGapPage /></RoleGate>} />
      <Route path="analytics/feedback" element={<RoleGate allowed={HR}><FeedbackAnalyticsPage /></RoleGate>} />
      <Route path="analytics/reports" element={<RoleGate allowed={HR_MANAGER}><ReportsPage /></RoleGate>} />

      <Route path="my-learning" element={<RoleGate allowed={EMPLOYEE}><MyLearningPage /></RoleGate>} />
      <Route path="learn/:courseId" element={<RoleGate allowed={EMPLOYEE}><LearnCoursePage /></RoleGate>} />
      <Route path="team-learning" element={<RoleGate allowed={MANAGER}><TeamLearningPage /></RoleGate>} />
      <Route path="history" element={<RoleGate allowed={EMPLOYEE}><LearningHistoryPage /></RoleGate>} />

      <Route path="settings" element={<RoleGate allowed={SUPER_HR}><SettingsPage /></RoleGate>} />
      <Route path="audit" element={<RoleGate allowed={SUPER}><AuditPage /></RoleGate>} />
      <Route path="*" element={<NotFoundPage />} />
    </Route>
  </Routes>;
}

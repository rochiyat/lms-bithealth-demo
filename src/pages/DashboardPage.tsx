import { Button, Card } from '@heroui/react';
import {
  Award, BookOpen, Building2, CalendarClock, CheckCircle2, Clock3, FileBadge,
  GraduationCap, ShieldAlert, Sparkles, Target, Trophy, Users,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { BarChart, DonutChart, HorizontalBars } from '@/components/MiniCharts';
import { LinkButton, ProgressBar, SectionCard, StatCard, StatusPill } from '@/components/ui';
import { useAuth } from '@/contexts/AuthContext';
import { useAppData } from '@/contexts/AppDataContext';
import { formatDate, formatNumber } from '@/utils/format';

function getGreeting() {
  const hour = new Date().getHours();
  if (hour >= 4 && hour < 11) return 'Selamat pagi';
  if (hour >= 11 && hour < 15) return 'Selamat siang';
  if (hour >= 15 && hour < 19) return 'Selamat sore';
  return 'Selamat malam';
}

export function DashboardPage() {
  const { user } = useAuth();
  const { db } = useAppData();
  if (!user || !db) return null;

  if (user.role === 'EMPLOYEE') return <EmployeeDashboard />;
  if (user.role === 'MANAGER') return <ManagerDashboard />;
  if (user.role === 'SUPER_ADMIN') return <SuperAdminDashboard />;
  return <HrDashboard />;
}

function HrDashboard() {
  const { activeTenantId } = useAuth();
  const { db } = useAppData();
  if (!db) return null;
  const tUsers = db.users.filter(u => !u.tenantId || u.tenantId === activeTenantId);
  const userIds = new Set(tUsers.map(u => u.id));
  const tEnrollments = db.enrollments.filter(e => userIds.has(e.userId));
  const tCourses = db.courses.filter(c => !c.tenantId || c.tenantId === activeTenantId);
  const tCampaigns = db.campaigns.filter(c => !c.tenantId || c.tenantId === activeTenantId);
  const activeUsers = tUsers.filter((item) => item.status === 'ACTIVE').length;
  const completed = tEnrollments.filter((item) => item.status === 'COMPLETED').length;
  const total = tEnrollments.length || 1;
  const overdue = tEnrollments.filter((item) => item.status === 'OVERDUE').length;
  const activeCampaign = tCampaigns.filter((item) => item.status === 'ACTIVE').length;
  const deptData = db.departments.map((dept) => {
    const deptUserIds = tUsers.filter((user) => user.departmentId === dept.id).map((user) => user.id);
    const rows = tEnrollments.filter((item) => deptUserIds.includes(item.userId));
    return { label: dept.code, value: rows.length ? Math.round((rows.filter((item) => item.status === 'COMPLETED').length / rows.length) * 100) : 0 };
  });
  const statusData = [
    { label: 'Belum mulai', value: tEnrollments.filter((item) => item.status === 'NOT_STARTED').length },
    { label: 'Berjalan', value: tEnrollments.filter((item) => item.status === 'IN_PROGRESS').length },
    { label: 'Selesai', value: completed },
    { label: 'Overdue', value: overdue },
  ];

  return <>
    <div className="hero-strip">
      <div><span className="eyebrow">HR Learning Operations</span><h1>{getGreeting()}, Alya.</h1><p>Pantau pembelajaran, skill gap, dan engagement Bithealth dalam satu workspace.</p></div>
      <div className="hero-strip-actions"><LinkButton to="/courses">Buat course</LinkButton><LinkButton to="/campaigns" variant="secondary">Kelola campaign</LinkButton></div>
    </div>
    <div className="stats-grid four">
      <StatCard label="Employee aktif" value={formatNumber(activeUsers)} hint="Di tenant ini" trend={8} icon={<Users size={19} />} />
      <StatCard label="Completion rate" value={`${Math.round((completed / total) * 100)}%`} hint="Semua enrollment" trend={5} icon={<CheckCircle2 size={19} />} />
      <StatCard label="Course published" value={tCourses.filter((item) => item.status === 'PUBLISHED').length} hint={`${tCourses.filter((item) => item.status === 'DRAFT').length} draft`} icon={<BookOpen size={19} />} />
      <StatCard label="Campaign aktif" value={activeCampaign} hint="1 campaign terjadwal" icon={<Sparkles size={19} />} />
    </div>
    <div className="dashboard-grid two-one">
      <SectionCard title="Completion per department" description="Persentase enrollment selesai pada tiap department."><BarChart data={deptData} /></SectionCard>
      <SectionCard title="Overall completion"><DonutChart value={(completed / total) * 100} label="selesai" caption={`${completed} dari ${total} enrollment`} /></SectionCard>
    </div>
    <div className="dashboard-grid two-one">
      <SectionCard title="Enrollment status" description="Distribusi status pembelajaran saat ini."><HorizontalBars data={statusData} /></SectionCard>
      <SectionCard title="Attention needed" description="Item yang perlu ditindaklanjuti HR.">
        <div className="attention-list">
          <div><span className="attention-icon warning"><Clock3 size={17} /></span><div><strong>3 assignment mendekati deadline</strong><p>Kirim reminder sebelum 20 Juli.</p></div></div>
          <div><span className="attention-icon danger"><ShieldAlert size={17} /></span><div><strong>API Security gap tinggi</strong><p>Correct answer rate Engineering 54%.</p></div></div>
          <div><span className="attention-icon info"><FileBadge size={17} /></span><div><strong>1 sertifikasi eksternal pending</strong><p>Menunggu verifikasi HR.</p></div></div>
        </div>
      </SectionCard>
    </div>
    <div className="dashboard-grid two-one">
      <SectionCard title="Campaign performance" action={<LinkButton to="/campaigns" size="sm" variant="ghost">Lihat semua</LinkButton>}>
        {db.campaigns.slice(0, 2).map((campaign) => <div className="campaign-mini" key={campaign.id}><div className="campaign-mini-banner" style={{ background: campaign.banner }} /><div className="campaign-mini-content"><div><strong>{campaign.name}</strong><StatusPill value={campaign.status} /></div><p>{campaign.description}</p><ProgressBar value={campaign.status === 'ACTIVE' ? 61 : 0} label="Progress peserta" /></div></div>)}
      </SectionCard>
      <SectionCard title="Top learners bulan ini">
        <div className="ranking-list">{[...db.users].sort((a,b) => b.points - a.points).slice(0, 5).map((item, index) => <div key={item.id}><span className={`rank-number rank-${index+1}`}>{index+1}</span><div className="avatar small">{item.name.split(' ').map((part) => part[0]).join('').slice(0,2)}</div><div><strong>{item.name}</strong><p>{item.jobTitle}</p></div><b>{formatNumber(item.points)} pts</b></div>)}</div>
      </SectionCard>
    </div>
  </>;
}

function ManagerDashboard() {
  const { user } = useAuth();
  const { db } = useAppData();
  if (!db || !user) return null;
  const team = db.users.filter((item) => item.managerId === user.id);
  const teamIds = team.map((item) => item.id);
  const enrollments = db.enrollments.filter((item) => teamIds.includes(item.userId));
  const completed = enrollments.filter((item) => item.status === 'COMPLETED').length;
  const avg = enrollments.length ? enrollments.reduce((sum, item) => sum + (item.score ?? 0), 0) / enrollments.filter((item) => item.score !== undefined).length : 0;
  return <>
    <div className="hero-strip compact"><div><span className="eyebrow">Engineering Team</span><h1>Team Learning Dashboard</h1><p>Progress, readiness, dan kebutuhan pembelajaran anggota tim Anda.</p></div><LinkButton to="/team-learning">Lihat detail tim</LinkButton></div>
    <div className="stats-grid four">
      <StatCard label="Anggota tim" value={team.length} hint="Engineering" icon={<Users size={19} />} />
      <StatCard label="Completion rate" value={`${enrollments.length ? Math.round((completed/enrollments.length)*100) : 0}%`} trend={6} hint="Periode berjalan" icon={<CheckCircle2 size={19} />} />
      <StatCard label="Average score" value={`${Math.round(avg || 0)}`} hint="Assessment tim" icon={<Target size={19} />} />
      <StatCard label="Active streak" value={`${Math.max(...team.map((item) => item.streakWeeks), 0)} minggu`} hint="Streak terbaik tim" icon={<Sparkles size={19} />} />
    </div>
    <div className="dashboard-grid two-one">
      <SectionCard title="Progress anggota tim" description="Course mandatory dan path aktif."><div className="team-progress-list">{team.map((member) => { const rows = enrollments.filter((item) => item.userId === member.id); const progress = rows.length ? rows.reduce((sum, item) => sum + item.progress, 0) / rows.length : 0; return <div key={member.id}><div className="avatar">{member.name.split(' ').map((p) => p[0]).join('').slice(0,2)}</div><div className="team-progress-main"><div><strong>{member.name}</strong><span>{member.jobTitle}</span></div><ProgressBar value={progress} compact /></div><b>{Math.round(progress)}%</b></div>; })}</div></SectionCard>
      <SectionCard title="Knowledge gap prioritas"><div className="gap-summary"><div><span>API Security</span><b className="gap-high">High</b><ProgressBar value={54} label="Correct rate" /></div><div><span>Healthcare Workflow</span><b className="gap-medium">Medium</b><ProgressBar value={72} label="Correct rate" /></div><div><span>Git Fundamentals</span><b className="gap-low">Low</b><ProgressBar value={91} label="Correct rate" /></div></div></SectionCard>
    </div>
    <SectionCard title="Deadline mendatang" action={<Button size="sm" variant="secondary">Kirim reminder tim</Button>}>
      <div className="deadline-grid">{db.assignments.filter((item) => item.status === 'ACTIVE').map((item) => <div key={item.id}><CalendarClock size={20} /><div><strong>{item.title}</strong><span>Jatuh tempo {formatDate(item.dueDate)}</span></div><StatusPill value={item.mandatory ? 'MANDATORY' : 'OPTIONAL'} /></div>)}</div>
    </SectionCard>
  </>;
}

function EmployeeDashboard() {
  const { user } = useAuth();
  const { db } = useAppData();
  if (!db || !user) return null;
  const enrollments = db.enrollments.filter((item) => item.userId === user.id);
  const courseEnrollments = enrollments.filter((item) => item.type === 'COURSE');
  const current = courseEnrollments.filter((item) => ['NOT_STARTED','IN_PROGRESS','OVERDUE'].includes(item.status));
  const earned = db.userBadges.filter((item) => item.userId === user.id).map((item) => db.badges.find((badge) => badge.id === item.badgeId)).filter(Boolean);
  const nextLevel = db.levels.find((item) => item.minimumPoints > user.points);
  const formattedDate = new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  return <>
    <div className="employee-hero">
      <div><span className="eyebrow">{formattedDate}</span><h1>{getGreeting()}, {user.name.split(' ')[0]}.</h1><p>Lanjutkan momentum belajar Anda dan selesaikan tantangan minggu ini.</p><div className="employee-hero-actions"><LinkButton to="/my-learning">Lanjutkan belajar</LinkButton><LinkButton to="/gamification/challenges" variant="secondary">Weekly challenge</LinkButton></div></div>
      <div className="level-card"><div className="level-icon">🛠️</div><div><span>Current level</span><strong>{user.level}</strong><p>{formatNumber(user.points)} points</p></div><ProgressBar value={nextLevel ? ((user.points - 1000) / (nextLevel.minimumPoints - 1000))*100 : 100} label={nextLevel ? `${nextLevel.minimumPoints-user.points} pts menuju ${nextLevel.name}` : 'Level tertinggi'} /></div>
    </div>
    <div className="stats-grid four">
      <StatCard label="Course aktif" value={current.length} hint="2 deadline bulan ini" icon={<BookOpen size={19} />} />
      <StatCard label="Course selesai" value={courseEnrollments.filter((item) => item.status === 'COMPLETED').length} hint="Riwayat pembelajaran" icon={<CheckCircle2 size={19} />} />
      <StatCard label="Learning streak" value={`${user.streakWeeks} minggu`} hint="Personal best: 6 minggu" icon={<Sparkles size={19} />} />
      <StatCard label="Badge diperoleh" value={earned.length} hint="2 milestone dekat" icon={<Award size={19} />} />
    </div>
    <div className="dashboard-grid two-one">
      <SectionCard title="Continue learning" action={<LinkButton to="/my-learning" size="sm" variant="ghost">Semua course</LinkButton>}>
        <div className="course-list-compact">{current.map((enrollment) => { const course = db.courses.find((item) => item.id === enrollment.resourceId); if (!course) return null; return <div key={enrollment.id}><div className="course-thumb" style={{ background: course.thumbnail }}><BookOpen size={20} /></div><div className="course-compact-main"><div><strong>{course.title}</strong><StatusPill value={enrollment.status} /></div><span>{course.estimatedMinutes} menit • {course.difficulty}</span><ProgressBar value={enrollment.progress} compact /></div><LinkButton to={`/learn/${course.id}`} size="sm" variant="secondary">Lanjut</LinkButton></div>; })}</div>
      </SectionCard>
      <SectionCard title="Weekly Challenge"><div className="challenge-spotlight"><span className="challenge-icon">🛡️</span><span className="eyebrow">Aktif sampai 19 Juli</span><h3>Kenali Email Phishing</h3><p>5 pertanyaan • 5 menit • Maksimal 40 poin</p><LinkButton to="/gamification/challenges" fullWidth>Mulai challenge</LinkButton></div></SectionCard>
    </div>
    <div className="dashboard-grid two-one">
      <SectionCard title="Active learning path"><div className="path-spotlight"><div><span className="path-icon">⚙️</span><div><strong>Backend Developer Foundation</strong><p>3 course • Target 30 September</p></div></div><ProgressBar value={48} label="2 dari 3 course berlangsung" /><div className="path-steps"><span className="done">✓ Security Awareness</span><span className="done">✓ Healthcare Fundamentals</span><span>○ Secure API Design</span></div></div></SectionCard>
      <SectionCard title="Recent achievements"><div className="badge-grid compact">{earned.map((badge) => badge && <div key={badge.id}><span>{badge.icon}</span><strong>{badge.name}</strong><p>{badge.description}</p></div>)}</div></SectionCard>
    </div>
  </>;
}

function SuperAdminDashboard() {
  const { db } = useAppData();
  if (!db) return null;
  return <>
    <div className="hero-strip compact"><div><span className="eyebrow">Platform Operations</span><h1>Multi-tenant Overview</h1><p>Health, usage, dan data footprint platform Learning Hub.</p></div><LinkButton to="/organization">Kelola tenant</LinkButton></div>
    <div className="stats-grid four"><StatCard label="Groups" value={db.groups.length} icon={<Building2 size={19} />} hint="1 group aktif" /><StatCard label="Tenants" value={db.tenants.length} icon={<Building2 size={19} />} trend={100} hint="Semua healthy" /><StatCard label="Active users" value={db.users.filter((u) => u.status === 'ACTIVE').length} icon={<Users size={19} />} trend={12} hint="30 hari terakhir" /><StatCard label="Published content" value={db.courses.filter((c) => c.status === 'PUBLISHED').length + db.learningPaths.filter((p) => p.status === 'PUBLISHED').length} icon={<GraduationCap size={19} />} hint="Course + paths" /></div>
    <div className="dashboard-grid two-one"><SectionCard title="Tenant usage"><BarChart data={db.tenants.map((tenant, index) => ({ label: tenant.code, value: index === 0 ? db.users.length : 2, secondary: index === 0 ? db.enrollments.length : 5 }))} /></SectionCard><SectionCard title="Platform health"><div className="health-list"><div><span className="health-dot good" /><strong>Application API</strong><b>Operational</b></div><div><span className="health-dot good" /><strong>Database</strong><b>Operational</b></div><div><span className="health-dot good" /><strong>Background jobs</strong><b>Operational</b></div><div><span className="health-dot warning" /><strong>Email provider</strong><b>Degraded demo</b></div></div></SectionCard></div>
    <SectionCard title="Recent platform audit"><div className="data-table-wrap"><table className="data-table"><thead><tr><th>Action</th><th>Entity</th><th>Description</th><th>Timestamp</th></tr></thead><tbody>{db.auditLogs.map((log) => <tr key={log.id}><td><StatusPill value={log.action} /></td><td>{log.entityType}</td><td>{log.description}</td><td>{formatDate(log.createdAt)}</td></tr>)}</tbody></table></div></SectionCard>
  </>;
}

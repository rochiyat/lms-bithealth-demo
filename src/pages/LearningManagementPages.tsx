import { Button, Card } from '@heroui/react';
import { BookOpen, CalendarDays, CheckCircle2, Copy, FileBadge, Flag, Route, PlayCircle, ShieldX } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CrudPage } from '@/components/CrudPage';
import { LinkButton, PageHeader, ProgressBar, SectionCard, StatusPill } from '@/components/ui';
import { useAppData } from '@/contexts/AppDataContext';
import { useAuth } from '@/contexts/AuthContext';
import type { Assignment, Campaign, Certificate, Course, LearningPath, Quiz } from '@/domain/types';
import { formatDate, formatNumber, labelize, uid, isoNow } from '@/utils/format';

const publishOptions = [{value:'DRAFT',label:'Draft'},{value:'PUBLISHED',label:'Published'},{value:'ARCHIVED',label:'Archived'}];
const difficultyOptions = [{value:'GENERAL',label:'General'},{value:'BEGINNER',label:'Beginner'},{value:'INTERMEDIATE',label:'Intermediate'},{value:'ADVANCED',label:'Advanced'}];

export function CoursesPage() {
  const { db } = useAppData();
  return <CrudPage collection="courses" title="Courses" description="Kelola course, materi, aturan kelulusan, sertifikat, dan poin." fields={[
    { key: 'title', label: 'Judul course', required: true }, { key: 'code', label: 'Kode', required: true }, { key: 'description', label: 'Deskripsi', type: 'textarea', required: true },
    { key: 'category', label: 'Kategori', required: true }, { key: 'skillTags', label: 'Skill tags', type: 'tags' }, { key: 'difficulty', label: 'Difficulty', type: 'select', options: difficultyOptions, defaultValue: 'GENERAL' },
    { key: 'estimatedMinutes', label: 'Estimasi menit', type: 'number', defaultValue: 60 }, { key: 'mandatoryDefault', label: 'Mandatory default', type: 'boolean' },
    { key: 'navigationMode', label: 'Navigation', type: 'select', options: [{value:'LINEAR',label:'Linear'},{value:'FLEXIBLE',label:'Flexible'}], defaultValue:'LINEAR' },
    { key: 'passingScore', label: 'Passing score', type: 'number', defaultValue: 80 }, { key: 'certificateEnabled', label: 'Aktifkan sertifikat', type: 'boolean', defaultValue: true },
    { key: 'certificateValidity', label: 'Masa berlaku', type: 'select', options: [{value:'NON_EXPIRING',label:'Tanpa batas waktu'},{value:'EXPIRING',label:'Memiliki expiry'}], defaultValue:'NON_EXPIRING' },
    { key: 'certificateValidityDays', label: 'Validity days', type: 'number' }, { key: 'points', label: 'Poin completion', type: 'number', defaultValue: 100 },
    { key: 'thumbnail', label: 'Thumbnail CSS / URL', defaultValue: 'linear-gradient(135deg,#4338ca,#0ea5e9)' }, { key: 'status', label: 'Status', type: 'select', options: publishOptions, defaultValue:'DRAFT' },
    { key: 'revision', label: 'Revision', type: 'number', defaultValue: 1 }, { key: 'modules', label: 'Module IDs', type: 'tags', defaultValue: [] },
  ]} columns={[
    { key: 'title', label: 'Course', render: (item) => { const course = item as Course; return <div className="table-course"><span style={{ background: course.thumbnail }} /><div><strong>{course.title}</strong><small>{course.code}</small></div></div>; } },
    { key: 'category', label: 'Kategori' }, { key: 'difficulty', label: 'Level', render: (item) => <StatusPill value={(item as Course).difficulty} /> },
    { key: 'estimatedMinutes', label: 'Durasi', render: (item) => `${(item as Course).estimatedMinutes} mnt` }, { key: 'points', label: 'Poin', render: (item) => `${(item as Course).points} pts` },
    { key: 'status', label: 'Status', render: (item) => <StatusPill value={(item as Course).status} /> },
  ]} />;
}

export function QuizzesPage() {
  const { db } = useAppData();
  const courseOptions = db?.courses.map((item) => ({value:item.id,label:item.title})) ?? [];
  return <CrudPage collection="quizzes" title="Quizzes" description="Assessment auto-grading untuk course maupun challenge." fields={[
    { key:'title',label:'Judul quiz',required:true }, { key:'courseId',label:'Course',type:'select',options:courseOptions }, { key:'description',label:'Deskripsi',type:'textarea',required:true },
    { key:'passingScore',label:'Passing score',type:'number',defaultValue:80 }, { key:'attemptLimit',label:'Attempt limit',type:'number',defaultValue:2 }, { key:'durationMinutes',label:'Durasi menit',type:'number',defaultValue:15 },
    { key:'randomizeQuestions',label:'Acak pertanyaan',type:'boolean',defaultValue:true }, { key:'showAnswers',label:'Tampilkan jawaban',type:'boolean',defaultValue:true }, { key:'status',label:'Status',type:'select',options:publishOptions,defaultValue:'DRAFT' },
    { key:'questions',label:'Question IDs',type:'tags',defaultValue:[] },
  ]} columns={[
    { key:'title',label:'Quiz' }, { key:'courseId',label:'Course',render:(item) => db?.courses.find((course) => course.id === (item as Quiz).courseId)?.title ?? 'Standalone' },
    { key:'passingScore',label:'Passing score',render:(item) => `${(item as Quiz).passingScore}%` }, { key:'attemptLimit',label:'Attempts' }, { key:'questions',label:'Questions',render:(item) => (item as Quiz).questions.length }, { key:'status',label:'Status',render:(item) => <StatusPill value={(item as Quiz).status} /> },
  ]} />;
}

export function LearningPathsPage() {
  const { user } = useAuth();
  const { db } = useAppData();
  if (!db || !user) return null;
  if (user.role === 'EMPLOYEE') {
    return <>
      <PageHeader title="Learning Paths" description="Jalur belajar terstruktur untuk membangun kompetensi dan readiness." />
      <div className="card-grid two">{db.learningPaths.filter((item) => item.status === 'PUBLISHED').map((path) => {
        const enrollment = db.enrollments.find((item) => item.userId === user.id && item.type === 'PATH' && item.resourceId === path.id);
        return <Card className="path-card" key={path.id}><Card.Content><div className="path-card-head"><span className="resource-icon"><Route /></span><StatusPill value={enrollment?.status ?? 'AVAILABLE'} /></div><h3>{path.name}</h3><p>{path.description}</p><div className="path-meta"><span>{path.courseIds.length} course</span><span>{path.deadlineDays} hari</span><span>{path.points} pts</span></div><ProgressBar value={enrollment?.progress ?? 0} label={enrollment ? 'Progress Anda' : 'Belum ditugaskan'} /><LinkButton to="/my-learning" fullWidth variant={enrollment ? 'primary' : 'secondary'}>{enrollment ? 'Lanjutkan path' : 'Lihat detail'}</LinkButton></Card.Content></Card>;
      })}</div>
    </>;
  }
  const familyOptions = db.jobFamilies.map((item) => ({value:item.id,label:item.name}));
  return <CrudPage collection="learningPaths" title="Learning Paths" description="Susun kumpulan course menjadi jalur kompetensi yang terarah." fields={[
    {key:'name',label:'Nama path',required:true},{key:'code',label:'Kode',required:true},{key:'description',label:'Deskripsi',type:'textarea',required:true},{key:'targetJobFamilyId',label:'Target job family',type:'select',options:familyOptions},
    {key:'courseIds',label:'Course IDs',type:'tags'},{key:'navigationMode',label:'Navigation',type:'select',options:[{value:'LINEAR',label:'Linear'},{value:'FLEXIBLE',label:'Flexible'}],defaultValue:'LINEAR'},
    {key:'deadlineDays',label:'Deadline days',type:'number',defaultValue:90},{key:'certificateEnabled',label:'Sertifikat',type:'boolean',defaultValue:true},{key:'points',label:'Poin',type:'number',defaultValue:200},{key:'badgeId',label:'Badge ID'},{key:'status',label:'Status',type:'select',options:publishOptions,defaultValue:'DRAFT'},
  ]} columns={[
    {key:'name',label:'Learning path'},{key:'targetJobFamilyId',label:'Job family',render:(item) => db.jobFamilies.find((f) => f.id === (item as LearningPath).targetJobFamilyId)?.name ?? 'Semua'},
    {key:'courseIds',label:'Courses',render:(item) => (item as LearningPath).courseIds.length},{key:'navigationMode',label:'Mode',render:(item) => labelize((item as LearningPath).navigationMode)},{key:'points',label:'Reward',render:(item)=>`${(item as LearningPath).points} pts`},{key:'status',label:'Status',render:(item)=><StatusPill value={(item as LearningPath).status}/>}]} />;
}

export function CampaignsPage() {
  const { user } = useAuth();
  const { db } = useAppData();
  if (!db || !user) return null;
  if (user.role === 'EMPLOYEE') {
    return <>
      <PageHeader title="Learning Campaigns" description="Program belajar tematik dengan course, challenge, badge, dan leaderboard." />
      <div className="campaign-grid">{db.campaigns.filter((item) => item.status !== 'ARCHIVED').map((campaign) => { const enrollment = db.enrollments.find((item) => item.userId === user.id && item.type === 'CAMPAIGN' && item.resourceId === campaign.id); return <Card className="campaign-card" key={campaign.id}><div className="campaign-banner" style={{background:campaign.banner}}><Flag size={28}/><StatusPill value={campaign.status}/></div><Card.Content><span className="campaign-date">{formatDate(campaign.startDate)} — {formatDate(campaign.endDate)}</span><h3>{campaign.name}</h3><p>{campaign.description}</p><div className="campaign-activity-count"><span>{campaign.courseIds.length} course</span><span>{campaign.challengeIds.length} challenge</span><span>{campaign.points} pts</span></div><ProgressBar value={enrollment?.progress ?? 0} label="Campaign progress"/><Button fullWidth variant={campaign.status === 'ACTIVE' ? 'primary' : 'secondary'}>{campaign.status === 'ACTIVE' ? 'Buka campaign' : 'Lihat detail'}</Button></Card.Content></Card>; })}</div>
    </>;
  }
  return <CrudPage collection="campaigns" title="Learning Campaigns" description="Program pembelajaran tematik dalam periode tertentu." fields={[
    {key:'name',label:'Nama campaign',required:true},{key:'description',label:'Deskripsi',type:'textarea',required:true},{key:'banner',label:'Banner CSS / URL',defaultValue:'linear-gradient(120deg,#312e81,#2563eb,#06b6d4)'},
    {key:'startDate',label:'Mulai',type:'date',required:true},{key:'endDate',label:'Selesai',type:'date',required:true},{key:'targetDepartmentIds',label:'Department IDs',type:'tags'},{key:'courseIds',label:'Course IDs',type:'tags'},{key:'pathIds',label:'Path IDs',type:'tags'},{key:'challengeIds',label:'Challenge IDs',type:'tags'},
    {key:'requiredChallengeCount',label:'Challenge wajib',type:'number',defaultValue:0},{key:'minimumAverageScore',label:'Minimum score',type:'number',defaultValue:80},{key:'points',label:'Poin',type:'number',defaultValue:250},{key:'badgeId',label:'Badge ID'},
    {key:'status',label:'Status',type:'select',options:[{value:'DRAFT',label:'Draft'},{value:'SCHEDULED',label:'Scheduled'},{value:'ACTIVE',label:'Active'},{value:'COMPLETED',label:'Completed'},{value:'ARCHIVED',label:'Archived'}],defaultValue:'DRAFT'},
  ]} columns={[
    {key:'name',label:'Campaign'},{key:'startDate',label:'Periode',render:(item) => `${formatDate((item as Campaign).startDate)} – ${formatDate((item as Campaign).endDate)}`},{key:'courseIds',label:'Course',render:(item)=>(item as Campaign).courseIds.length},{key:'challengeIds',label:'Challenge',render:(item)=>(item as Campaign).challengeIds.length},{key:'points',label:'Poin',render:(item)=>`${(item as Campaign).points} pts`},{key:'status',label:'Status',render:(item)=><StatusPill value={(item as Campaign).status}/>}]} />;
}

export function AssignmentsPage() {
  const { db } = useAppData();
  if (!db) return null;
  const resourceOptions = [...db.courses.map((i)=>({value:i.id,label:`Course: ${i.title}`})),...db.learningPaths.map((i)=>({value:i.id,label:`Path: ${i.name}`})),...db.campaigns.map((i)=>({value:i.id,label:`Campaign: ${i.name}`}))];
  return <CrudPage collection="assignments" title="Assignments" description="Distribusikan course, path, atau campaign berdasarkan target organisasi." fields={[
    {key:'title',label:'Nama assignment',required:true},{key:'type',label:'Tipe',type:'select',options:[{value:'COURSE',label:'Course'},{value:'PATH',label:'Learning Path'},{value:'CAMPAIGN',label:'Campaign'}],defaultValue:'COURSE'},
    {key:'resourceId',label:'Resource',type:'select',options:resourceOptions,required:true},{key:'targetType',label:'Target type',type:'select',options:[{value:'ALL',label:'All employee'},{value:'TENANT',label:'Tenant'},{value:'DEPARTMENT',label:'Department'},{value:'JOB_FAMILY',label:'Job Family'},{value:'EMPLOYEE',label:'Employee'}],defaultValue:'ALL'},
    {key:'targetIds',label:'Target IDs',type:'tags'},{key:'mandatory',label:'Mandatory',type:'boolean',defaultValue:true},{key:'startDate',label:'Start date',type:'date',required:true},{key:'dueDate',label:'Due date',type:'date',required:true},
    {key:'recurrence',label:'Recurrence',type:'select',options:[{value:'NONE',label:'None'},{value:'MONTHLY',label:'Monthly'},{value:'QUARTERLY',label:'Quarterly'},{value:'YEARLY',label:'Yearly'}],defaultValue:'NONE'},{key:'autoEnrollNewEmployee',label:'Auto-enroll employee baru',type:'boolean'},{key:'status',label:'Status',type:'select',options:[{value:'ACTIVE',label:'Active'},{value:'CLOSED',label:'Closed'}],defaultValue:'ACTIVE'},
  ]} columns={[
    {key:'title',label:'Assignment'},{key:'type',label:'Type',render:(item)=><StatusPill value={(item as Assignment).type}/>},{key:'targetType',label:'Target',render:(item)=>labelize((item as Assignment).targetType)},{key:'mandatory',label:'Mandatory',render:(item)=>(item as Assignment).mandatory?'Ya':'Tidak'},{key:'dueDate',label:'Deadline',render:(item)=>formatDate((item as Assignment).dueDate)},{key:'status',label:'Status',render:(item)=><StatusPill value={(item as Assignment).status}/>}]} />;
}

export function CertificatesPage() {
  const { user } = useAuth();
  const { db, updateItem, createItem } = useAppData();
  if (!db || !user) return null;
  const rows = user.role === 'EMPLOYEE' ? db.certificates.filter((item) => item.userId === user.id) : user.role === 'MANAGER' ? db.certificates.filter((item) => db.users.find((u)=>u.id===item.userId)?.managerId === user.id) : db.certificates;
  const revoke = async (certificate: Certificate) => { const reason = prompt('Alasan pencabutan sertifikat:'); if (reason) await updateItem('certificates', certificate.id, {status:'REVOKED',revocationReason:reason}); };
  const submitExternal = async () => { if (user.role !== 'EMPLOYEE') return; const title = prompt('Nama sertifikasi eksternal:'); if (!title) return; await createItem('certificates',{tenantId:user.tenantId,userId:user.id,type:'EXTERNAL',title,code:`EXT-${uid('cert').toUpperCase()}`,issuedAt:new Date().toISOString().slice(0,10),status:'PENDING_VERIFICATION',provider:'External Provider'}); };
  return <>
    <PageHeader title="Certificates" description={user.role === 'EMPLOYEE' ? 'Sertifikat internal dan eksternal yang telah Anda peroleh.' : 'Kelola, verifikasi, dan cabut sertifikat.'} actions={user.role === 'EMPLOYEE' ? <Button onPress={submitExternal}><FileBadge size={16}/>Submit sertifikat eksternal</Button> : undefined} />
    <div className="certificate-grid">{rows.map((certificate) => { const owner = db.users.find((item)=>item.id===certificate.userId); return <Card className="certificate-card" key={certificate.id}><Card.Content><div className="certificate-head"><span className="certificate-seal"><FileBadge/></span><StatusPill value={certificate.status}/></div><span className="eyebrow">{certificate.type === 'EXTERNAL' ? certificate.provider : 'Bithealth Learning Hub'}</span><h3>{certificate.title}</h3>{user.role !== 'EMPLOYEE' && <p>{owner?.name} • {owner?.employeeId}</p>}<div className="certificate-meta"><span>Code <b>{certificate.code}</b></span><span>Issued <b>{formatDate(certificate.issuedAt)}</b></span><span>Valid until <b>{certificate.expiresAt ? formatDate(certificate.expiresAt) : 'Tanpa batas waktu'}</b></span></div><div className="certificate-actions"><Button variant="secondary"><Copy size={15}/>Copy code</Button><Button variant="secondary">Download PDF</Button>{(user.role === 'HR_ADMIN' || user.role === 'SUPER_ADMIN') && certificate.status === 'VALID' && <Button variant="danger-soft" onPress={()=>revoke(certificate)}><ShieldX size={15}/>Revoke</Button>}</div></Card.Content></Card>; })}</div>
  </>;
}

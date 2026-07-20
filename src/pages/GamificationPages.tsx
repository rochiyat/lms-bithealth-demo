import { Button, Card, Input } from '@heroui/react';
import { Award, CheckCircle2, Flame, Medal, Plus, Sparkles, Target, Trophy, Zap } from 'lucide-react';
import { useMemo, useRef, useState } from 'react';
import { CrudPage } from '@/components/CrudPage';
import { BarChart, HorizontalBars } from '@/components/MiniCharts';
import { PageHeader, ProgressBar, SectionCard, StatCard, StatusPill } from '@/components/ui';
import { useAppData } from '@/contexts/AppDataContext';
import { useAuth } from '@/contexts/AuthContext';
import type { Badge, Challenge, Level, Mission, PointRule, User } from '@/domain/types';
import { formatDate, formatNumber, isoNow, labelize, uid } from '@/utils/format';

export function GamificationOverviewPage() {
  const { db } = useAppData();
  if (!db) return null;
  const thisMonthPoints = db.pointTransactions.reduce((sum, item) => sum + item.points, 0);
  const categoryData = ['LEARNING','ASSESSMENT','CONSISTENCY','CONTRIBUTION','COMPETENCY'].map((category) => ({label:labelize(category),value:db.badges.filter((item)=>item.category===category).length}));
  return <>
    <PageHeader title="Gamification Overview" description="Konfigurasi gamifikasi profesional untuk engagement dan budaya belajar Bithealth." />
    <div className="stats-grid four"><StatCard label="Poin diterbitkan" value={formatNumber(thisMonthPoints)} hint="Ledger transaksi demo" icon={<Zap size={19}/>} /><StatCard label="Badge aktif" value={db.badges.filter((item)=>item.active).length} hint={`${db.userBadges.length} achievement earned`} icon={<Award size={19}/>} /><StatCard label="Challenge aktif" value={db.challenges.filter((item)=>item.status==='ACTIVE').length} hint="Weekly cadence" icon={<Target size={19}/>} /><StatCard label="Average streak" value={`${Math.round(db.users.reduce((s,u)=>s+u.streakWeeks,0)/db.users.length)} minggu`} hint="Karyawan aktif" icon={<Flame size={19}/>} /></div>
    <div className="dashboard-grid two-one"><SectionCard title="Point distribution" description="Poin tertinggi employee dalam data demo."><BarChart data={[...db.users].sort((a,b)=>b.points-a.points).slice(0,7).map((item)=>({label:item.name.split(' ')[0],value:item.points}))}/></SectionCard><SectionCard title="Badge catalog"><HorizontalBars data={categoryData}/></SectionCard></div>
    <div className="dashboard-grid two-one"><SectionCard title="Point rules" action={<Button size="sm" variant="secondary">Kelola rules</Button>}><div className="rule-list">{db.pointRules.map((rule)=><div key={rule.id}><span className="rule-icon"><Zap size={16}/></span><div><strong>{rule.name}</strong><p>{rule.description}</p></div><b>+{rule.points}</b><StatusPill value={rule.active?'ACTIVE':'INACTIVE'}/></div>)}</div></SectionCard><SectionCard title="Design principles"><div className="principle-list"><div><CheckCircle2/><span><strong>Reward meaningful activity</strong>Poin hanya dari aktivitas belajar yang valid.</span></div><div><CheckCircle2/><span><strong>Healthy competition</strong>Leaderboard per kelompok dan periode.</span></div><div><CheckCircle2/><span><strong>Not performance rating</strong>Level tidak menentukan promosi atau gaji.</span></div></div></SectionCard></div>
  </>;
}

export function ChallengesPage() {
  const { user } = useAuth();
  const { db } = useAppData();
  if (!db || !user) return null;
  if (user.role === 'HR_ADMIN') return <CrudPage collection="challenges" title="Weekly Knowledge Challenges" description="Quiz singkat berkala yang terhubung dengan poin, badge, streak, dan Knowledge Gap." fields={[
    {key:'title',label:'Judul challenge',required:true},{key:'description',label:'Deskripsi',type:'textarea',required:true},{key:'topic',label:'Topic',required:true},{key:'skillTag',label:'Skill tag',required:true},{key:'targetDepartmentIds',label:'Target department IDs',type:'tags'},
    {key:'startDate',label:'Start date',type:'date',required:true},{key:'endDate',label:'End date',type:'date',required:true},{key:'passingScore',label:'Passing score',type:'number',defaultValue:80},{key:'attemptLimit',label:'Attempt limit',type:'number',defaultValue:1},{key:'durationMinutes',label:'Durasi',type:'number',defaultValue:5},
    {key:'participationPoints',label:'Participation points',type:'number',defaultValue:10},{key:'passPoints',label:'Pass points',type:'number',defaultValue:20},{key:'perfectScoreBonus',label:'Perfect bonus',type:'number',defaultValue:10},{key:'status',label:'Status',type:'select',options:[{value:'DRAFT',label:'Draft'},{value:'SCHEDULED',label:'Scheduled'},{value:'ACTIVE',label:'Active'},{value:'COMPLETED',label:'Completed'}],defaultValue:'DRAFT'},{key:'questions',label:'Question IDs',type:'tags',defaultValue:[]},
  ]} columns={[
    {key:'title',label:'Challenge'},{key:'topic',label:'Topic'},{key:'startDate',label:'Periode',render:(item)=>`${formatDate((item as Challenge).startDate)} – ${formatDate((item as Challenge).endDate)}`},{key:'questions',label:'Questions',render:(item)=>(item as Challenge).questions.length},{key:'passPoints',label:'Reward',render:(item)=>`${(item as Challenge).passPoints} pts`},{key:'status',label:'Status',render:(item)=><StatusPill value={(item as Challenge).status}/>}]} />;
  return <EmployeeChallenges />;
}

function EmployeeChallenges() {
  const { user } = useAuth();
  const { db, createItem, updateItem } = useAppData();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [active, setActive] = useState<Challenge>();
  const [answers, setAnswers] = useState<Record<string, number[]>>({});
  const [result, setResult] = useState<{score:number;points:number} | null>(null);
  if (!db || !user) return null;
  const attempts = db.challengeAttempts.filter((item)=>item.userId===user.id);
  const open = (challenge:Challenge) => { setActive(challenge);setAnswers({});setResult(null);dialogRef.current?.showModal(); };
  const submit = async () => {
    if (!active) return;
    const correct = active.questions.filter((question) => {
      const chosen = answers[question.id] ?? [];
      return chosen.length===question.correctOptionIndexes.length && chosen.every((value)=>question.correctOptionIndexes.includes(value));
    }).length;
    const score = active.questions.length ? Math.round((correct/active.questions.length)*100):0;
    const passed = score>=active.passingScore;
    const points = active.participationPoints + (passed?active.passPoints:0)+(score===100?active.perfectScoreBonus:0);
    await createItem('challengeAttempts',{tenantId:user.tenantId,challengeId:active.id,userId:user.id,score,passed,attemptNumber:1,submittedAt:isoNow()});
    await createItem('pointTransactions',{tenantId:user.tenantId,userId:user.id,ruleKey:'WEEKLY_CHALLENGE',points,description:`Weekly Challenge: ${active.title}`,referenceType:'CHALLENGE',referenceId:active.id});
    await updateItem('users',user.id,{points:user.points+points});
    setResult({score,points});
  };
  return <>
    <PageHeader title="Weekly Knowledge Challenge" description="Challenge singkat untuk menjaga ritme belajar dan mengidentifikasi knowledge gap." />
    <div className="challenge-stats"><div><Flame/><span><strong>{user.streakWeeks} minggu</strong>Learning streak</span></div><div><Zap/><span><strong>{attempts.length}</strong>Challenge selesai</span></div><div><Trophy/><span><strong>{formatNumber(user.points)} pts</strong>Total points</span></div></div>
    <div className="challenge-grid">{db.challenges.filter((item)=>item.status!=='DRAFT').map((challenge)=>{const attempt=attempts.find((item)=>item.challengeId===challenge.id);return <Card className="challenge-card" key={challenge.id}><Card.Content><div className="challenge-card-head"><span className="challenge-big-icon">{challenge.skillTag.includes('Security')?'🛡️':'⚙️'}</span><StatusPill value={attempt?'COMPLETED':challenge.status}/></div><span className="eyebrow">{challenge.topic}</span><h3>{challenge.title}</h3><p>{challenge.description}</p><div className="challenge-facts"><span>{challenge.questions.length} soal</span><span>{challenge.durationMinutes} menit</span><span>+{challenge.participationPoints+challenge.passPoints} pts</span></div>{attempt?<div className="challenge-result"><CheckCircle2/><span><strong>Score {attempt.score}</strong>Sudah dikerjakan</span></div>:<Button fullWidth onPress={()=>open(challenge)} isDisabled={challenge.status!=='ACTIVE'}>{challenge.status==='ACTIVE'?'Mulai challenge':'Segera hadir'}</Button>}</Card.Content></Card>})}</div>
    <dialog className="challenge-dialog" ref={dialogRef}><div className="challenge-dialog-inner">{active && <>{!result?<><div className="dialog-header"><div><span className="eyebrow">{active.topic}</span><h2>{active.title}</h2><p>Pilih jawaban terbaik untuk setiap pertanyaan.</p></div><Button isIconOnly variant="ghost" onPress={()=>dialogRef.current?.close()}>×</Button></div><div className="question-list">{active.questions.map((question,index)=><div className="question-card" key={question.id}><span>Question {index+1}</span><h3>{question.text}</h3><div className="answer-list">{question.options.map((option,optionIndex)=>{const selected=(answers[question.id]??[]).includes(optionIndex);return <button className={selected?'selected':''} onClick={()=>setAnswers({...answers,[question.id]:question.type==='MULTIPLE_CHOICE'?(selected?(answers[question.id]??[]).filter((v)=>v!==optionIndex):[...(answers[question.id]??[]),optionIndex]):[optionIndex]})} key={option}><i>{String.fromCharCode(65+optionIndex)}</i>{option}</button>})}</div></div>)}</div><div className="dialog-actions"><Button variant="secondary" onPress={()=>dialogRef.current?.close()}>Batal</Button><Button onPress={submit}>Submit answers</Button></div></>:<div className="result-screen"><span className="result-icon">{result.score>=active.passingScore?'🎉':'📘'}</span><span className="eyebrow">Challenge completed</span><h2>Score Anda {result.score}</h2><p>{result.score>=active.passingScore?'Great work! Pengetahuan Anda melewati passing score.':'Belum lulus. Gunakan hasil ini untuk menentukan materi yang perlu dipelajari.'}</p><div className="points-earned"><Zap/>+{result.points} points</div><Button onPress={()=>dialogRef.current?.close()}>Selesai</Button></div>}</>}</div></dialog>
  </>;
}

export function BadgesLevelsPage() {
  const { db } = useAppData();
  if (!db) return null;
  return <div className="stack-page"><CrudPage collection="badges" title="Badges" description="Penghargaan digital berdasarkan pencapaian pribadi, kompetensi, dan kontribusi." fields={[
    {key:'name',label:'Nama badge',required:true},{key:'code',label:'Code',required:true},{key:'description',label:'Deskripsi',type:'textarea',required:true},{key:'icon',label:'Icon / emoji',defaultValue:'🏅'},{key:'category',label:'Category',type:'select',options:[{value:'LEARNING',label:'Learning'},{value:'ASSESSMENT',label:'Assessment'},{value:'CONSISTENCY',label:'Consistency'},{value:'CONTRIBUTION',label:'Contribution'},{value:'COMPETENCY',label:'Competency'},{value:'RANKING',label:'Ranking'}],defaultValue:'LEARNING'},{key:'conditionType',label:'Condition type',required:true},{key:'threshold',label:'Threshold',type:'number',defaultValue:1},{key:'active',label:'Active',type:'boolean',defaultValue:true},
  ]} columns={[{key:'icon',label:'Icon'},{key:'name',label:'Badge'},{key:'category',label:'Category',render:(item)=><StatusPill value={(item as Badge).category}/>},{key:'conditionType',label:'Condition'},{key:'threshold',label:'Threshold'},{key:'active',label:'Status',render:(item)=><StatusPill value={(item as Badge).active?'ACTIVE':'INACTIVE'}/>}]} /><div className="section-divider"/><CrudPage collection="levels" title="Learning Levels" description="Level visual berdasarkan total poin; bukan jabatan atau performance rating." fields={[{key:'name',label:'Nama level',required:true},{key:'minimumPoints',label:'Minimum points',type:'number',required:true},{key:'maximumPoints',label:'Maximum points',type:'number'},{key:'icon',label:'Icon',defaultValue:'⭐'}]} columns={[{key:'icon',label:'Icon'},{key:'name',label:'Level'},{key:'minimumPoints',label:'Min points'},{key:'maximumPoints',label:'Max points',render:(item)=>(item as Level).maximumPoints??'∞'}]} /></div>;
}

export function MissionsPage() {
  const { db } = useAppData();
  const familyOptions=db?.jobFamilies.map((item)=>({value:item.id,label:item.name}))??[];
  return <CrudPage collection="missions" title="Monthly Learning Missions" description="Kumpulan target berkala untuk menjaga momentum belajar per job family." fields={[
    {key:'name',label:'Nama mission',required:true},{key:'description',label:'Deskripsi',type:'textarea',required:true},{key:'startDate',label:'Start date',type:'date',required:true},{key:'endDate',label:'End date',type:'date',required:true},{key:'targetJobFamilyId',label:'Target job family',type:'select',options:familyOptions},{key:'tasks',label:'Task IDs',type:'tags',defaultValue:[]},{key:'rewardPoints',label:'Reward points',type:'number',defaultValue:100},{key:'badgeId',label:'Badge ID'},{key:'status',label:'Status',type:'select',options:[{value:'DRAFT',label:'Draft'},{value:'ACTIVE',label:'Active'},{value:'COMPLETED',label:'Completed'}],defaultValue:'DRAFT'},
  ]} columns={[{key:'name',label:'Mission'},{key:'startDate',label:'Periode',render:(item)=>`${formatDate((item as Mission).startDate)} – ${formatDate((item as Mission).endDate)}`},{key:'targetJobFamilyId',label:'Target',render:(item)=>db?.jobFamilies.find((f)=>f.id===(item as Mission).targetJobFamilyId)?.name??'Semua'},{key:'tasks',label:'Tasks',render:(item)=>(item as Mission).tasks.length},{key:'rewardPoints',label:'Reward',render:(item)=>`${(item as Mission).rewardPoints} pts`},{key:'status',label:'Status',render:(item)=><StatusPill value={(item as Mission).status}/>}]} />;
}

export function LeaderboardPage() {
  const { db } = useAppData();
  const { user } = useAuth();
  const [scope,setScope]=useState('ALL');
  if (!db || !user) return null;
  let users=db.users.filter((item)=>item.role!=='SUPER_ADMIN'&&!item.hideLeaderboard);
  if(scope!=='ALL')users=users.filter((item)=>item.departmentId===scope);
  users=[...users].sort((a,b)=>b.points-a.points);
  const currentRank=users.findIndex((item)=>item.id===user.id)+1;
  return <>
    <PageHeader title="Leaderboard" description="Peringkat berdasarkan learning points pada periode berjalan; bukan performance rating." actions={<select className="toolbar-select" value={scope} onChange={(event)=>setScope(event.target.value)}><option value="ALL">Semua department</option>{db.departments.map((item)=><option value={item.id} key={item.id}>{item.name}</option>)}</select>}/>
    {user.role==='EMPLOYEE'&&<div className="my-rank-banner"><div><span>Your current rank</span><strong>#{currentRank || '-'}</strong></div><div><span>Total points</span><strong>{formatNumber(user.points)}</strong></div><div><span>Level</span><strong>{user.level}</strong></div><ProgressBar value={user.points<2000?((user.points-1000)/1000)*100:100} label="Progress ke level berikutnya"/></div>}
    <div className="leaderboard-podium">{users.slice(0,3).map((item,index)=><div className={`podium-item place-${index+1}`} key={item.id}><span className="podium-medal">{index===0?'🥇':index===1?'🥈':'🥉'}</span><div className="avatar xl">{item.name.split(' ').map((p)=>p[0]).join('').slice(0,2)}</div><strong>{item.name}</strong><span>{item.jobTitle}</span><b>{formatNumber(item.points)} pts</b></div>)}</div>
    <SectionCard title="Ranking lengkap" description="Leaderboard dapat difilter per department agar perbandingan lebih relevan."><div className="ranking-table">{users.map((item,index)=><div className={item.id===user.id?'current-user':''} key={item.id}><span className="rank-number">{index+1}</span><div className="avatar">{item.name.split(' ').map((p)=>p[0]).join('').slice(0,2)}</div><div><strong>{item.name}{item.id===user.id&&' (Anda)'}</strong><p>{db.departments.find((d)=>d.id===item.departmentId)?.name} • {item.level}</p></div><span className="streak-chip"><Flame size={14}/>{item.streakWeeks} w</span><b>{formatNumber(item.points)} pts</b></div>)}</div></SectionCard>
  </>;
}

export function AchievementsPage() {
  const { user } = useAuth();
  const { db } = useAppData();
  if (!db || !user) return null;
  const targetUsers=user.role==='MANAGER'?db.users.filter((item)=>item.managerId===user.id):[user];
  if(user.role==='MANAGER')return <><PageHeader title="Team Achievements" description="Badge, level, poin, dan streak anggota tim."/><div className="card-grid three">{targetUsers.map((member)=><Card className="member-achievement-card" key={member.id}><Card.Content><div className="avatar large">{member.name.split(' ').map((p)=>p[0]).join('').slice(0,2)}</div><h3>{member.name}</h3><p>{member.jobTitle}</p><div className="member-achievement-stats"><span><b>{formatNumber(member.points)}</b>Points</span><span><b>{member.streakWeeks}</b>Week streak</span><span><b>{db.userBadges.filter((ub)=>ub.userId===member.id).length}</b>Badges</span></div></Card.Content></Card>)}</div></>;
  const earnedIds=db.userBadges.filter((item)=>item.userId===user.id).map((item)=>item.badgeId);
  const earned=db.badges.filter((item)=>earnedIds.includes(item.id));
  const locked=db.badges.filter((item)=>!earnedIds.includes(item.id));
  const activeMission=db.missions.find((item)=>item.status==='ACTIVE'&&(!item.targetJobFamilyId||item.targetJobFamilyId===user.jobFamilyId));
  return <>
    <PageHeader title="My Achievements" description="Poin, badge, milestone, level, dan learning streak Anda."/>
    <div className="achievement-hero"><div className="achievement-level"><span className="level-emblem">🛠️</span><div><span>Current Level</span><h2>{user.level}</h2><p>{formatNumber(user.points)} total points</p></div></div><div className="achievement-streak"><Flame/><div><strong>{user.streakWeeks} weeks</strong><span>Learning streak</span></div></div><div className="achievement-next"><span>Next milestone</span><strong>320 points menuju Specialist</strong><ProgressBar value={68}/></div></div>
    <SectionCard title="Earned badges" description={`${earned.length} badge telah diperoleh.`}><div className="badge-grid">{earned.map((badge)=><div className="earned" key={badge.id}><span>{badge.icon}</span><strong>{badge.name}</strong><p>{badge.description}</p><small>Earned</small></div>)}</div></SectionCard>
    <div className="dashboard-grid two-one"><SectionCard title="Milestones"><div className="milestone-list"><div><Target/><div><strong>Learning Explorer</strong><ProgressBar value={80} label="8 dari 10 course"/></div></div><div><Sparkles/><div><strong>Knowledge Challenger</strong><ProgressBar value={75} label="3 dari 4 challenge"/></div></div><div><Flame/><div><strong>Consistent Learner II</strong><ProgressBar value={67} label="4 dari 6 minggu"/></div></div></div></SectionCard>{activeMission&&<SectionCard title="Active mission"><div className="mission-card-inline"><span className="mission-icon">🎯</span><h3>{activeMission.name}</h3><p>{activeMission.description}</p>{activeMission.tasks.map((task,index)=><div className="mission-task" key={task.id}><CheckCircle2 className={index===0?'done':''}/><span>{task.label}</span><b>{index===0?'1 / 1':'1 / '+task.target}</b></div>)}<ProgressBar value={55} label={`Reward ${activeMission.rewardPoints} points`}/></div></SectionCard>}</div>
    <SectionCard title="Locked badges" description="Selesaikan milestone untuk membuka badge berikutnya."><div className="badge-grid locked">{locked.map((badge)=><div key={badge.id}><span>{badge.icon}</span><strong>{badge.name}</strong><p>{badge.description}</p><small>Progress {Math.min(80,badge.threshold*20)}%</small></div>)}</div></SectionCard>
  </>;
}

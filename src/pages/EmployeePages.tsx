import { Button, Card } from '@heroui/react';
import { BookOpen, CheckCircle2, Clock3, FileText, PlayCircle, Star } from 'lucide-react';
import { useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { LinkButton, PageHeader, ProgressBar, SectionCard, StatusPill } from '@/components/ui';
import { useAppData } from '@/contexts/AppDataContext';
import { useAuth } from '@/contexts/AuthContext';
import type { Course, Enrollment } from '@/domain/types';
import { formatDate, isoNow } from '@/utils/format';

export function MyLearningPage() {
  const {user}=useAuth();const {db}=useAppData();const [filter,setFilter]=useState('ACTIVE');
  if(!db||!user)return null;
  const rows=db.enrollments.filter((item)=>item.userId===user.id&&item.type==='COURSE');
  const filtered=filter==='ALL'?rows:filter==='ACTIVE'?rows.filter((item)=>['NOT_STARTED','IN_PROGRESS','OVERDUE'].includes(item.status)):rows.filter((item)=>item.status===filter);
  return <><PageHeader title="My Learning" description="Course wajib, pilihan, progress, deadline, dan riwayat completion." actions={<div className="segmented-control">{['ACTIVE','COMPLETED','ALL'].map((item)=><button className={filter===item?'active':''} onClick={()=>setFilter(item)} key={item}>{item==='ACTIVE'?'Active':item==='COMPLETED'?'Completed':'All'}</button>)}</div>}/><div className="learning-card-grid">{filtered.map((enrollment)=>{const course=db.courses.find((item)=>item.id===enrollment.resourceId);if(!course)return null;return <LearningCard key={enrollment.id} course={course} enrollment={enrollment}/>})}</div></>;
}

function LearningCard({course,enrollment}:{course:Course;enrollment:Enrollment}) {
  return <Card className="learning-card"><div className="learning-card-cover" style={{background:course.thumbnail}}><BookOpen size={34}/><span>{course.category}</span></div><Card.Content><div className="learning-card-title"><div><StatusPill value={course.difficulty}/>{course.mandatoryDefault&&<StatusPill value="MANDATORY"/>}</div><h3>{course.title}</h3><p>{course.description}</p></div><div className="learning-meta"><span><Clock3 size={15}/>{course.estimatedMinutes} menit</span><span><FileText size={15}/>{course.modules.length} modul</span><span><Star size={15}/>{course.points} pts</span></div><ProgressBar value={enrollment.progress} label="Progress"/><div className="learning-deadline"><span>Due {formatDate(enrollment.dueDate)}</span><StatusPill value={enrollment.status}/></div><LinkButton to={`/learn/${course.id}`} fullWidth>{enrollment.status==='COMPLETED'?'Lihat course':'Lanjutkan belajar'}</LinkButton></Card.Content></Card>;
}

export function LearnCoursePage() {
  const {courseId}=useParams();const {user}=useAuth();const {db,updateItem,createItem}=useAppData();const navigate=useNavigate();const feedbackRef=useRef<HTMLDialogElement>(null);
  const [activeModule,setActiveModule]=useState(0);const [feedback,setFeedback]=useState({relevance:5,clarity:5,quality:5,durationFit:4,recommended:true,comment:'',anonymous:false});
  if(!db||!user)return null;
  const course=db.courses.find((item)=>item.id===courseId);const enrollment=db.enrollments.find((item)=>item.userId===user.id&&item.type==='COURSE'&&item.resourceId===courseId);
  if(!course)return <PageHeader title="Course tidak ditemukan"/>;
  const completeModule=async()=>{if(!enrollment)return;const next=Math.min(course.modules.length-1,activeModule+1);const progress=Math.round(((activeModule+1)/course.modules.length)*100);await updateItem('enrollments',enrollment.id,{progress,status:progress>=100?'COMPLETED':'IN_PROGRESS',startedAt:enrollment.startedAt??isoNow(),completedAt:progress>=100?isoNow():undefined,currentModuleId:course.modules[next]?.id});if(progress>=100)feedbackRef.current?.showModal();else setActiveModule(next)};
  const saveFeedback=async()=>{await createItem('feedback',{tenantId:user.tenantId,courseId:course.id,userId:user.id,...feedback,status:'VISIBLE'});await createItem('pointTransactions',{tenantId:user.tenantId,userId:user.id,ruleKey:'COURSE_FEEDBACK',points:5,description:`Feedback: ${course.title}`,referenceType:'COURSE',referenceId:course.id});feedbackRef.current?.close();navigate('/my-learning')};
  
  const currentModule = course.modules[activeModule];
  let videoUrl = currentModule?.url;
  if (course.id === 'course_api' && currentModule?.id === 'mod_api_2') {
    videoUrl = 'https://www.youtube.com/embed/Rrd6xkyjPB8?si=CQ0YC6NjyZvfvHk5';
  }

  let docUrl = currentModule?.url;
  if (course.id === 'course_security' && currentModule?.id === 'mod_sec_2') {
    docUrl = 'https://drive.google.com/file/d/1KrkQh8rytzkqB5RGtPLoeRT-hZCdT-55/view?usp=sharing';
  }

  if (course.id === 'course_security' && currentModule?.id === 'mod_sec_1') {
    videoUrl = 'https://drive.google.com/file/d/1KrkQh8rytzkqB5RGtPLoeRT-hZCdT-55/preview';
  }

  return <div className="learn-layout"><aside className="learn-sidebar"><Button variant="ghost" onPress={()=>navigate('/my-learning')}>← Kembali</Button><div className="learn-course-summary" style={{background:course.thumbnail}}><BookOpen/><h2>{course.title}</h2><span>{course.code}</span></div><div className="module-nav">{course.modules.map((module,index)=><button className={activeModule===index?'active':''} onClick={()=>setActiveModule(index)} key={module.id}><span>{index<activeModule?<CheckCircle2/>:index+1}</span><div><strong>{module.title}</strong><small>{module.durationMinutes} menit • {module.type}</small></div></button>)}</div></aside><section className="learn-content"><div className="learn-top"><div><span className="eyebrow">Module {activeModule+1} of {course.modules.length}</span><h1>{currentModule?.title}</h1></div><ProgressBar value={enrollment?.progress??0} label="Course progress"/></div><div className="content-player">{currentModule?.type==='VIDEO'? (videoUrl && (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be') || videoUrl.includes('embed') || videoUrl.includes('drive.google.com')) ? <div style={{ width: '100%', height: '100%', minHeight: '380px', overflow: 'hidden', borderRadius: '14px' }}><iframe width="100%" height="100%" src={videoUrl} title={currentModule.title} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen style={{ minHeight: '380px' }}></iframe></div> : <div className="video-placeholder" style={{background:course.thumbnail}}><PlayCircle size={72}/><strong>Video learning placeholder</strong><span>Ready replace with signed video playback URL.</span></div>):currentModule?.type==='QUIZ'?<div className="quiz-placeholder"><span>🧠</span><h2>Module assessment</h2><p>Assessment menggunakan quiz engine yang sama dengan Weekly Challenge.</p><Button>Mulai assessment</Button></div>:<article><span className="eyebrow">Learning material</span><h2>{currentModule?.title}</h2><p>{currentModule?.content??'Dokumen dan materi pembelajaran akan ditampilkan melalui signed URL dari backend.'}</p>{docUrl && <div style={{ marginTop: '20px', padding: '16px', borderRadius: '12px', border: '1px dashed var(--border-color)', background: 'var(--neutral-50)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}><div><strong style={{ fontSize: '12px', display: 'block', color: 'var(--text-primary)' }}>Materi Lampiran Tersedia</strong><span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Dokumen referensi eksternal untuk dipelajari</span></div><a href={docUrl} target="_blank" rel="noopener noreferrer" className="app-link-button button button--primary button--sm">Buka Link Materi</a></div>}<h3>Key takeaways</h3><ul><li>Gunakan materi secara kontekstual sesuai kebutuhan proyek.</li><li>Catat pertanyaan untuk sesi knowledge sharing.</li><li>Selesaikan assessment untuk mendapatkan completion.</li></ul></article>}</div><div className="learn-footer"><Button variant="secondary" isDisabled={activeModule===0} onPress={()=>setActiveModule(Math.max(0,activeModule-1))}>Previous</Button><Button onPress={completeModule}>{activeModule===course.modules.length-1?'Complete course':'Mark complete & continue'}</Button></div></section><dialog className="entity-dialog feedback-dialog" ref={feedbackRef}><form onSubmit={(event)=>{event.preventDefault();void saveFeedback()}}><div className="dialog-header"><div><span className="eyebrow">Course completed</span><h2>Bagaimana pengalaman belajar Anda?</h2><p>Feedback membantu HR memperbaiki kualitas materi.</p></div></div><div className="rating-form">{(['relevance','clarity','quality','durationFit'] as const).map((key)=><label key={key}><span>{key==='durationFit'?'Kesesuaian durasi':key.charAt(0).toUpperCase()+key.slice(1)}</span><select value={feedback[key]} onChange={(e)=>setFeedback({...feedback,[key]:Number(e.target.value)})}>{[1,2,3,4,5].map((n)=><option key={n} value={n}>{n} / 5</option>)}</select></label>)}<label className="field-span"><span>Komentar</span><textarea value={feedback.comment} onChange={(e)=>setFeedback({...feedback,comment:e.target.value})}/></label><label className="checkbox-label"><input type="checkbox" checked={feedback.anonymous} onChange={(e)=>setFeedback({...feedback,anonymous:e.target.checked})}/>Kirim sebagai anonymous</label></div><div className="dialog-actions"><Button type="submit">Kirim feedback & selesai</Button></div></form></dialog></div>;
}

export function TeamLearningPage() {
  const {user}=useAuth();const {db}=useAppData();if(!db||!user)return null;
  const team=db.users.filter((item)=>item.managerId===user.id);return <><PageHeader title="Team Learning" description="Progress detail course dan assignment anggota tim." actions={<Button variant="secondary">Send reminder</Button>}/><div className="team-member-grid">{team.map((member)=>{const rows=db.enrollments.filter((item)=>item.userId===member.id);const avg=rows.length?rows.reduce((s,i)=>s+i.progress,0)/rows.length:0;return <Card className="team-member-card" key={member.id}><Card.Content><div className="team-member-head"><div className="avatar large">{member.name.split(' ').map((p)=>p[0]).join('').slice(0,2)}</div><div><h3>{member.name}</h3><p>{member.jobTitle}</p></div><StatusPill value={rows.some((i)=>i.status==='OVERDUE')?'OVERDUE':'ON_TRACK'}/></div><ProgressBar value={avg} label="Overall progress"/><div className="team-course-list">{rows.filter((i)=>i.type==='COURSE').map((row)=>{const course=db.courses.find((c)=>c.id===row.resourceId);return <div key={row.id}><span>{course?.title}</span><b>{row.progress}%</b><StatusPill value={row.status}/></div>})}</div></Card.Content></Card>})}</div></>;
}

export function LearningHistoryPage() {
  const {user}=useAuth();const {db}=useAppData();if(!db||!user)return null;
  const rows=db.enrollments.filter((item)=>item.userId===user.id).sort((a,b)=>(b.completedAt??b.updatedAt).localeCompare(a.completedAt??a.updatedAt));
  return <><PageHeader title="Learning History" description="Riwayat pembelajaran dan assessment Anda."/><SectionCard title="Activity timeline"><div className="history-timeline">{rows.map((item)=>{const title=item.type==='COURSE'?db.courses.find((c)=>c.id===item.resourceId)?.title:item.type==='PATH'?db.learningPaths.find((p)=>p.id===item.resourceId)?.name:db.campaigns.find((c)=>c.id===item.resourceId)?.name;return <div key={item.id}><span className="timeline-dot"/><div><span>{formatDate(item.completedAt??item.updatedAt)}</span><strong>{title}</strong><p>{item.type} • Progress {item.progress}% {item.score!==undefined&&`• Score ${item.score}`}</p></div><StatusPill value={item.status}/></div>})}</div></SectionCard></>;
}

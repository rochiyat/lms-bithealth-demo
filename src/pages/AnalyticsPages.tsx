import { Button, Card } from '@heroui/react';
import { AlertTriangle, BarChart3, Download, FileSpreadsheet, Lightbulb, Send, Star } from 'lucide-react';
import { useMemo, useState } from 'react';
import { BarChart, HorizontalBars } from '@/components/MiniCharts';
import { PageHeader, ProgressBar, SearchInput, SectionCard, StatCard, StatusPill } from '@/components/ui';
import { useAppData } from '@/contexts/AppDataContext';
import { useAuth } from '@/contexts/AuthContext';
import { formatDate, formatNumber } from '@/utils/format';

export function ProgressAnalyticsPage() {
  const { db } = useAppData();
  const [query,setQuery]=useState('');
  if(!db)return null;
  const rows=db.enrollments.filter((enrollment)=>{
    const user=db.users.find((item)=>item.id===enrollment.userId);
    const resource=enrollment.type==='COURSE'?db.courses.find((item)=>item.id===enrollment.resourceId)?.title:enrollment.type==='PATH'?db.learningPaths.find((item)=>item.id===enrollment.resourceId)?.name:db.campaigns.find((item)=>item.id===enrollment.resourceId)?.name;
    return `${user?.name} ${resource}`.toLowerCase().includes(query.toLowerCase());
  });
  const status=[{label:'Not started',value:rows.filter((i)=>i.status==='NOT_STARTED').length},{label:'In progress',value:rows.filter((i)=>i.status==='IN_PROGRESS').length},{label:'Completed',value:rows.filter((i)=>i.status==='COMPLETED').length},{label:'Overdue',value:rows.filter((i)=>i.status==='OVERDUE').length}];
  return <><PageHeader title="Employee Progress" description="Monitoring enrollment course, path, dan campaign lintas organisasi." actions={<Button variant="secondary"><Download size={16}/>Export XLSX</Button>}/><div className="stats-grid four">{status.map((item)=><StatCard key={item.label} label={item.label} value={item.value} icon={<BarChart3 size={19}/>}/>)}</div><SectionCard title="Enrollment records" action={<SearchInput value={query} onChange={setQuery}/>}><div className="data-table-wrap"><table className="data-table"><thead><tr><th>Employee</th><th>Resource</th><th>Type</th><th>Progress</th><th>Score</th><th>Due date</th><th>Status</th></tr></thead><tbody>{rows.map((enrollment)=>{const owner=db.users.find((item)=>item.id===enrollment.userId);const resource=enrollment.type==='COURSE'?db.courses.find((item)=>item.id===enrollment.resourceId)?.title:enrollment.type==='PATH'?db.learningPaths.find((item)=>item.id===enrollment.resourceId)?.name:db.campaigns.find((item)=>item.id===enrollment.resourceId)?.name;return <tr key={enrollment.id}><td><strong>{owner?.name}</strong><small>{owner?.employeeId}</small></td><td>{resource}</td><td>{enrollment.type}</td><td><div className="table-progress"><ProgressBar compact value={enrollment.progress}/><span>{enrollment.progress}%</span></div></td><td>{enrollment.score??'-'}</td><td>{formatDate(enrollment.dueDate)}</td><td><StatusPill value={enrollment.status}/></td></tr>})}</tbody></table></div></SectionCard></>;
}

const gapData=[
  {id:'gap1',topic:'API Security',skill:'Secure Coding',dept:'dept_engineering',rate:54,responses:82,course:'course_api'},
  {id:'gap2',topic:'Phishing Detection',skill:'Security Awareness',dept:'dept_delivery',rate:62,responses:48,course:'course_security'},
  {id:'gap3',topic:'Healthcare Workflow',skill:'Domain Knowledge',dept:'dept_engineering',rate:68,responses:67,course:'course_healthcare'},
  {id:'gap4',topic:'Client Expectation',skill:'Client Communication',dept:'dept_delivery',rate:73,responses:31,course:'course_client'},
  {id:'gap5',topic:'HTTP Semantics',skill:'API Design',dept:'dept_engineering',rate:81,responses:92,course:'course_api'},
  {id:'gap6',topic:'Password Security',skill:'Security Awareness',dept:'dept_hr',rate:91,responses:25,course:'course_security'},
];

export function KnowledgeGapPage() {
  const {db}=useAppData();const {user}=useAuth();const [dept,setDept]=useState('ALL');
  if(!db||!user)return null;
  let data=dept==='ALL'?gapData:gapData.filter((item)=>item.dept===dept);
  if(user.role==='MANAGER')data=gapData.filter((item)=>item.dept===user.departmentId);
  const high=data.filter((i)=>i.rate<65).length;const avg=data.length?data.reduce((s,i)=>s+i.rate,0)/data.length:0;
  return <><PageHeader title="Knowledge Gap Dashboard" description="Analisis agregat hasil quiz dan challenge berdasarkan topic serta skill tag." actions={user.role!=='MANAGER'?<select className="toolbar-select" value={dept} onChange={(e)=>setDept(e.target.value)}><option value="ALL">Semua department</option>{db.departments.map((d)=><option key={d.id} value={d.id}>{d.name}</option>)}</select>:undefined}/><div className="stats-grid four"><StatCard label="Gap tinggi" value={high} hint="Correct rate <65%" icon={<AlertTriangle size={19}/>} /><StatCard label="Average correct rate" value={`${Math.round(avg)}%`} hint={`${data.reduce((s,i)=>s+i.responses,0)} responses`} icon={<BarChart3 size={19}/>} /><StatCard label="Topik dianalisis" value={data.length} hint="Privacy threshold ≥5" icon={<Lightbulb size={19}/>} /><StatCard label="Recommendation" value={new Set(data.map((i)=>i.course)).size} hint="Course rule-based" icon={<Send size={19}/>} /></div><div className="dashboard-grid two-one"><SectionCard title="Correct rate per topic" description="Semakin rendah, semakin tinggi prioritas pembelajaran."><BarChart data={data.map((item)=>({label:item.topic.split(' ')[0],value:item.rate}))}/></SectionCard><SectionCard title="Classification"><HorizontalBars data={[{label:'High gap',value:data.filter((i)=>i.rate<65).length},{label:'Medium gap',value:data.filter((i)=>i.rate>=65&&i.rate<80).length},{label:'Low gap',value:data.filter((i)=>i.rate>=80).length}]}/></SectionCard></div><SectionCard title="Knowledge gap detail"><div className="gap-table">{data.sort((a,b)=>a.rate-b.rate).map((item)=>{const classification=item.rate<65?'HIGH':item.rate<80?'MEDIUM':'LOW';const course=db.courses.find((c)=>c.id===item.course);return <div key={item.id}><div><strong>{item.topic}</strong><span>{item.skill}</span></div><div><span>{db.departments.find((d)=>d.id===item.dept)?.name}</span><small>{item.responses} responses</small></div><div className="gap-rate"><ProgressBar value={item.rate}/><b>{item.rate}%</b></div><StatusPill value={classification}/><div className="gap-recommend"><Lightbulb size={15}/><span>Recommend <b>{course?.title}</b></span></div>{user.role!=='MANAGER'&&<Button size="sm" variant="secondary">Assign course</Button>}</div>})}</div></SectionCard></>;
}

export function FeedbackAnalyticsPage() {
  const {db}=useAppData();if(!db)return null;
  const average=(key:'relevance'|'clarity'|'quality'|'durationFit')=>db.feedback.length?db.feedback.reduce((s,i)=>s+i[key],0)/db.feedback.length:0;
  const courseScores=db.courses.map((course)=>{const rows=db.feedback.filter((f)=>f.courseId===course.id);return {label:course.code,value:rows.length?rows.reduce((s,i)=>s+(i.relevance+i.clarity+i.quality+i.durationFit)/4,0)/rows.length:0};}).filter((i)=>i.value>0);
  return <><PageHeader title="Course Feedback" description="Insight kualitas, relevansi, clarity, dan durasi materi dari employee." actions={<Button variant="secondary"><Download size={16}/>Export feedback</Button>}/><div className="stats-grid four"><StatCard label="Average relevance" value={average('relevance').toFixed(1)} hint="Dari 5" icon={<Star size={19}/>} /><StatCard label="Average clarity" value={average('clarity').toFixed(1)} hint="Dari 5" icon={<Star size={19}/>} /><StatCard label="Average quality" value={average('quality').toFixed(1)} hint="Dari 5" icon={<Star size={19}/>} /><StatCard label="Recommendation rate" value={`${Math.round((db.feedback.filter((i)=>i.recommended).length/db.feedback.length)*100)}%`} hint={`${db.feedback.length} responses`} icon={<Star size={19}/>} /></div><div className="dashboard-grid two-one"><SectionCard title="Rating per course"><BarChart data={courseScores}/></SectionCard><SectionCard title="Feedback dimensions"><HorizontalBars data={[{label:'Relevance',value:average('relevance')*20,suffix:'%'},{label:'Clarity',value:average('clarity')*20,suffix:'%'},{label:'Quality',value:average('quality')*20,suffix:'%'},{label:'Duration fit',value:average('durationFit')*20,suffix:'%'}]}/></SectionCard></div><SectionCard title="Latest comments"><div className="feedback-list">{db.feedback.map((feedback)=>{const course=db.courses.find((i)=>i.id===feedback.courseId);const owner=db.users.find((i)=>i.id===feedback.userId);const rating=(feedback.relevance+feedback.clarity+feedback.quality+feedback.durationFit)/4;return <div key={feedback.id}><div className="feedback-rating"><strong>{rating.toFixed(1)}</strong><span>★★★★★</span></div><div><strong>{course?.title}</strong><p>“{feedback.comment||'Tidak ada komentar.'}”</p><small>{feedback.anonymous?'Anonymous':owner?.name} • {formatDate(feedback.createdAt)}</small></div><StatusPill value={feedback.status}/></div>})}</div></SectionCard></>;
}

export function ReportsPage() {
  const {db}=useAppData();const {user}=useAuth();if(!db||!user)return null;
  const reports=[
    {name:'Learning Completion Report',description:'Enrollment, progress, score, due date, dan completion.',rows:db.enrollments.length},
    {name:'Certificate Register',description:'Sertifikat internal, eksternal, validity, dan revocation.',rows:db.certificates.length},
    {name:'Knowledge Gap Summary',description:'Correct rate per topic, skill, dan department.',rows:gapData.length},
    {name:'Gamification Ledger',description:'Point transaction, badge, level, dan streak.',rows:db.pointTransactions.length},
    {name:'Course Feedback',description:'Rating dan komentar per course.',rows:db.feedback.length},
  ];
  const download=(name:string)=>{const blob=new Blob([JSON.stringify(db,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`${name.toLowerCase().replaceAll(' ','-')}.json`;a.click();URL.revokeObjectURL(url)};
  return <><PageHeader title="Reports" description="Export data source-backed untuk analisis HR, manager, dan audit."/><div className="report-grid">{reports.map((report)=><Card className="report-card" key={report.name}><Card.Content><span className="report-icon"><FileSpreadsheet/></span><div><h3>{report.name}</h3><p>{report.description}</p><span>{formatNumber(report.rows)} records • JSON demo / XLSX backend-ready</span></div><Button onPress={()=>download(report.name)} variant="secondary"><Download size={16}/>Export</Button></Card.Content></Card>)}</div><SectionCard title="Scheduled reports" description="UI demo untuk jadwal report; backend worker dapat dihubungkan kemudian."><div className="schedule-report"><div><strong>Weekly HR Learning Digest</strong><span>Setiap Senin, 08:00 WIB • hr@bithealth.co.id</span></div><StatusPill value="ACTIVE"/><Button variant="secondary">Edit</Button></div><div className="schedule-report"><div><strong>Manager Team Compliance</strong><span>Setiap Jumat, 16:00 WIB • Department managers</span></div><StatusPill value="ACTIVE"/><Button variant="secondary">Edit</Button></div></SectionCard></>;
}

import { Button, Card } from '@heroui/react';
import { Download, LockKeyhole, RefreshCw, Upload } from 'lucide-react';
import { useRef, useState } from 'react';
import { PageHeader, SectionCard, StatusPill } from '@/components/ui';
import { useAppData } from '@/contexts/AppDataContext';
import type { AppDatabase } from '@/domain/types';
import { formatDate } from '@/utils/format';

export function SettingsPage() {
  const {db,reset,replace}=useAppData();const fileRef=useRef<HTMLInputElement>(null);const [message,setMessage]=useState('');
  if(!db)return null;
  const exportData=()=>{const blob=new Blob([JSON.stringify(db,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='bithealth-learning-hub-data.json';a.click();URL.revokeObjectURL(url);setMessage('Data berhasil diekspor.');};
  const importData=async(file?:File)=>{if(!file)return;try{const parsed=JSON.parse(await file.text()) as AppDatabase;await replace(parsed);setMessage('Data berhasil diimpor.');}catch{setMessage('File JSON tidak valid.');}};
  return <><PageHeader title="Settings & Demo Data" description="Konfigurasi frontend, import/export, dan reset localStorage."/><div className="settings-grid"><SectionCard title="Data source" description="Repository dipilih dari environment variable."><div className="setting-row"><div><strong>Current source</strong><p>VITE_DATA_SOURCE</p></div><StatusPill value={import.meta.env.VITE_DATA_SOURCE==='api'?'API':'LOCAL_STORAGE'}/></div><div className="setting-row"><div><strong>API base URL</strong><p>{import.meta.env.VITE_API_BASE_URL??'http://localhost:3000/api'}</p></div></div></SectionCard><SectionCard title="Data management" description="Gunakan data JSON untuk memindahkan skenario demo."><div className="data-buttons"><Button onPress={exportData}><Download size={16}/>Export JSON</Button><Button variant="secondary" onPress={()=>fileRef.current?.click()}><Upload size={16}/>Import JSON</Button><Button variant="danger-soft" onPress={()=>{if(confirm('Reset seluruh data ke seed awal?'))void reset().then(()=>setMessage('Data telah direset.'))}}><RefreshCw size={16}/>Reset seed data</Button><input hidden ref={fileRef} type="file" accept="application/json" onChange={(e)=>void importData(e.target.files?.[0])}/></div>{message&&<p className="settings-message">{message}</p>}</SectionCard></div><SectionCard title="Backend replacement checklist"><div className="checklist-grid"><div>✓ Implement endpoint contracts pada <code>HttpRepository</code></div><div>✓ Set <code>VITE_DATA_SOURCE=api</code></div><div>✓ Set <code>VITE_API_BASE_URL</code></div><div>✓ Tambahkan token/session pada request interceptor</div><div>✓ Map pagination dan error response backend</div><div>✓ Ganti file/document dummy dengan signed URL</div></div></SectionCard><SectionCard title="Current data footprint"><div className="data-footprint">{Object.entries(db).map(([key,value])=><div key={key}><strong>{value.length}</strong><span>{key}</span></div>)}</div></SectionCard></>;
}

export function AuditPage() {
  const {db}=useAppData();if(!db)return null;
  return <><PageHeader title="Audit Log" description="Aktivitas penting yang memerlukan traceability dan review operasional."/><div className="data-table-wrap"><table className="data-table"><thead><tr><th>Timestamp</th><th>Actor</th><th>Action</th><th>Entity</th><th>Description</th></tr></thead><tbody>{db.auditLogs.map((log)=><tr key={log.id}><td>{formatDate(log.createdAt)}</td><td>{db.users.find((u)=>u.id===log.actorId)?.name??'System'}</td><td><StatusPill value={log.action}/></td><td>{log.entityType}<small>{log.entityId}</small></td><td>{log.description}</td></tr>)}</tbody></table></div></>;
}

export function NotFoundPage(){return <div className="not-found"><span>404</span><h1>Halaman tidak ditemukan</h1><p>Route ini belum tersedia untuk role atau modul yang dipilih.</p><Button onPress={()=>history.back()}>Kembali</Button></div>}


export function UnauthorizedPage(){return <div className="not-found"><span><LockKeyhole size={52}/></span><h1>Akses tidak tersedia</h1><p>Role demo yang sedang aktif tidak memiliki permission untuk membuka halaman ini.</p><Button onPress={()=>history.back()}>Kembali ke halaman sebelumnya</Button></div>}
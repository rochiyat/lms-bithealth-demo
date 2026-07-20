import { Button, Card, Input } from '@heroui/react';
import { ArrowRight, Building2, ShieldCheck, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import type { Role } from '@/domain/types';
import { useAuth } from '@/contexts/AuthContext';
import { BrandMark } from '@/components/ui';

const demoRoles: { role: Role; title: string; email: string; description: string; icon: string }[] = [
  { role: 'SUPER_ADMIN', title: 'Super Admin', email: 'superadmin@bithealth.co.id', description: 'Kelola platform, tenant, dan audit.', icon: 'SA' },
  { role: 'HR_ADMIN', title: 'HR Admin', email: 'hr@bithealth.co.id', description: 'Kelola learning, analytics, dan gamifikasi.', icon: 'HR' },
  { role: 'MANAGER', title: 'Manager', email: 'manager@bithealth.co.id', description: 'Pantau progress dan knowledge gap tim.', icon: 'MG' },
  { role: 'EMPLOYEE', title: 'Employee', email: 'employee@bithealth.co.id', description: 'Ikuti course, challenge, dan raih badge.', icon: 'EM' },
];

export function LoginPage() {
  const { user, login, loginAsRole } = useAuth();
  const [email, setEmail] = useState('hr@bithealth.co.id');
  const [password, setPassword] = useState('demo123');
  const [error, setError] = useState('');

  if (user) return <Navigate to="/" replace />;

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!login(email, password)) setError('Email atau password demo tidak sesuai.');
  };

  return <div className="login-page">
    <div className="login-visual">
      <div className="login-visual-content">
        <BrandMark />
        <div className="login-copy"><span className="eyebrow"><Sparkles size={15} />Internal Learning Experience</span><h1>Build skills. Share knowledge. Deliver better.</h1><p>LMS internal multi-tenant untuk pengembangan kompetensi konsultan IT Bithealth.</p></div>
        <div className="login-features"><div><ShieldCheck /><span><strong>Skill intelligence</strong>Knowledge gap dan learning analytics.</span></div><div><Building2 /><span><strong>Multi-role workspace</strong>HR, manager, employee, dan platform admin.</span></div><div><Sparkles /><span><strong>Professional gamification</strong>Challenge, badge, streak, mission, dan leaderboard.</span></div></div>
      </div>
      <div className="login-orb orb-one" /><div className="login-orb orb-two" />
    </div>
    <div className="login-panel">
      <div className="login-form-wrap">
        <div className="mobile-login-brand"><BrandMark /></div>
        <div><span className="eyebrow">Selamat datang</span><h2>Masuk ke Learning Hub</h2><p>Gunakan akun demo atau pilih akses cepat berdasarkan role.</p></div>
        <form onSubmit={submit} className="login-form">
          <label><span>Email</span><Input type="email" value={email} onChange={(event) => setEmail(event.target.value)} /></label>
          <label><span>Password</span><Input type="password" value={password} onChange={(event) => setPassword(event.target.value)} /></label>
          {error && <p className="form-error">{error}</p>}
          <Button type="submit" fullWidth>Masuk <ArrowRight size={17} /></Button>
        </form>
        <div className="login-divider"><span>Akses demo cepat</span></div>
        <div className="demo-role-grid">
          {demoRoles.map((item, index) => (
            <Card 
              className="demo-role-card" 
              key={item.role} 
              onClick={() => loginAsRole(item.role)}
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <Card.Content>
                <span className="demo-role-icon">{item.icon}</span>
                <div>
                  <strong>{item.title}</strong>
                  <p>{item.description}</p>
                </div>
                <ArrowRight size={17} />
              </Card.Content>
            </Card>
          ))}
        </div>
        <p className="login-note">Semua akun demo menggunakan password <code>demo123</code>. Data perubahan disimpan di browser.</p>
      </div>
    </div>
  </div>;
}

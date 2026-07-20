import { Button, Card, Input, Surface } from '@heroui/react';
import { ArrowDownRight, ArrowUpRight, Search, X, Inbox, ChevronRight, Home } from 'lucide-react';
import { ReactNode, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { labelize } from '@/utils/format';

export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <div className="brand-mark">
      <div className="brand-icon">B</div>
      {!compact && <div><strong>Bithealth</strong><span>Learning Hub</span></div>}
    </div>
  );
}

export function LinkButton({ to, children, variant = 'primary', size = 'md', fullWidth = false, className = '' }: { to: string; children: ReactNode; variant?: 'primary' | 'secondary' | 'tertiary' | 'outline' | 'ghost' | 'danger' | 'danger-soft'; size?: 'sm' | 'md' | 'lg'; fullWidth?: boolean; className?: string }) {
  return <Link to={to} className={`app-link-button button button--${variant} button--${size} ${fullWidth ? 'full-width' : ''} ${className}`}>{children}</Link>;
}

export function PageHeader({ title, description, actions }: { title: string; description?: string; actions?: ReactNode }) {
  return (
    <div className="page-header">
      <div>
        <Breadcrumbs />
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {actions && <div className="page-actions">{actions}</div>}
    </div>
  );
}

export function Breadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);
  
  if (pathnames.length === 0) return null;

  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <Link to="/">
        <Home size={11} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
        <span>Home</span>
      </Link>
      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        const formatted = value
          .split('-')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');

        return (
          <span key={to} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <span className="separator"><ChevronRight size={10} /></span>
            {isLast ? (
              <span className="current" aria-current="page">{formatted}</span>
            ) : (
              <Link to={to}>{formatted}</Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}

export function StatCard({ label, value, hint, trend, icon }: { label: string; value: string | number; hint?: string; trend?: number; icon?: ReactNode }) {
  const numericVal = typeof value === 'number' ? value : parseInt(String(value).replace(/[^0-9]/g, ''), 10);
  const isPercent = typeof value === 'string' && value.includes('%');
  const isPts = typeof value === 'string' && value.toLowerCase().includes('pts');
  const [displayValue, setDisplayValue] = useState<string | number>(value);

  useEffect(() => {
    if (isNaN(numericVal) || numericVal <= 0) {
      setDisplayValue(value);
      return;
    }
    
    let start = 0;
    const end = numericVal;
    const duration = 800; // ms
    const stepTime = 16;
    const totalSteps = duration / stepTime;
    const increment = end / totalSteps;
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        clearInterval(timer);
        setDisplayValue(value);
      } else {
        const currentVal = Math.floor(start);
        if (isPercent) setDisplayValue(`${currentVal}%`);
        else if (isPts) setDisplayValue(`${currentVal.toLocaleString('id-ID')} pts`);
        else setDisplayValue(typeof value === 'number' ? currentVal : currentVal.toLocaleString('id-ID'));
      }
    }, stepTime);
    
    return () => clearInterval(timer);
  }, [value, numericVal, isPercent, isPts]);

  return (
    <Card className="stat-card">
      <Card.Content>
        <div className="stat-card-top"><span>{label}</span><div className="stat-icon">{icon}</div></div>
        <strong className="stat-value">{displayValue}</strong>
        <div className="stat-hint">
          {trend !== undefined && (
            <span className={trend >= 0 ? 'trend-up' : 'trend-down'}>
              {trend >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
              {Math.abs(trend)}%
            </span>
          )}
          {hint && <span>{hint}</span>}
        </div>
      </Card.Content>
    </Card>
  );
}

export function ProgressBar({ value, label, compact = false }: { value: number; label?: string; compact?: boolean }) {
  const safe = Math.max(0, Math.min(100, value));
  return (
    <div className={`progress-wrap ${compact ? 'compact' : ''}`}>
      {label && <div className="progress-label"><span>{label}</span><strong>{Math.round(safe)}%</strong></div>}
      <div className="progress-track"><div className="progress-fill" style={{ width: `${safe}%` }} /></div>
    </div>
  );
}

export function StatusPill({ value }: { value: string }) {
  return <span className={`status-pill status-${value.toLowerCase().replaceAll('_', '-')}`}>{labelize(value)}</span>;
}

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <Surface className="empty-state">
      <Inbox size={42} style={{ margin: '0 auto 12px', color: 'var(--text-muted)', opacity: 0.6 }} />
      <strong>{title}</strong>
      <p>{description}</p>
    </Surface>
  );
}

export function SearchInput({ value, onChange, placeholder = 'Cari data...' }: { value: string; onChange: (value: string) => void; placeholder?: string }) {
  return (
    <div className="search-input">
      <Search size={17} />
      <Input aria-label={placeholder} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} />
      {value && <Button aria-label="Hapus pencarian" isIconOnly size="sm" variant="ghost" onPress={() => onChange('')}><X size={15} /></Button>}
    </div>
  );
}

export function SectionCard({ title, description, action, children, className = '' }: { title: string; description?: string; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <Card className={`section-card ${className}`}>
      <Card.Header>
        <div><Card.Title>{title}</Card.Title>{description && <Card.Description>{description}</Card.Description>}</div>
        {action}
      </Card.Header>
      <Card.Content>{children}</Card.Content>
    </Card>
  );
}

export function Skeleton({ className = '', width, height, circle = false }: { className?: string; width?: string | number; height?: string | number; circle?: boolean }) {
  const style: React.CSSProperties = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
    borderRadius: circle ? '50%' : undefined
  };
  return <div className={`skeleton ${className}`} style={style} />;
}

export function Pagination({ currentPage, totalPages, onPageChange }: { currentPage: number; totalPages: number; onPageChange: (page: number) => void }) {
  if (totalPages <= 1) return null;
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'between', gap: '16px', marginTop: '24px', padding: '8px 0' }}>
      <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
        Halaman <strong>{currentPage}</strong> dari <strong>{totalPages}</strong>
      </div>
      <div style={{ display: 'flex', gap: '8px', marginLeft: 'auto' }}>
        <Button 
          variant="secondary" 
          size="sm" 
          isDisabled={currentPage === 1} 
          onPress={() => onPageChange(currentPage - 1)}
        >
          Sebelumnya
        </Button>
        <Button 
          variant="secondary" 
          size="sm" 
          isDisabled={currentPage === totalPages} 
          onPress={() => onPageChange(currentPage + 1)}
        >
          Berikutnya
        </Button>
      </div>
    </div>
  );
}

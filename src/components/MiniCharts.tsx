import { useEffect, useState } from 'react';
import { formatNumber } from '@/utils/format';

export function BarChart({ data, height = 180 }: { data: { label: string; value: number; secondary?: number }[]; height?: number }) {
  const max = Math.max(...data.flatMap((item) => [item.value, item.secondary ?? 0]), 1);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bar-chart" style={{ height }}>
      {data.map((item) => {
        const heightPrimary = animate ? `${Math.max(4, (item.value / max) * 100)}%` : '0%';
        const heightSecondary = animate && item.secondary !== undefined ? `${Math.max(4, (item.secondary / max) * 100)}%` : '0%';
        
        return (
          <div className="bar-group" key={item.label}>
            <div className="bars">
              <div 
                className="bar primary" 
                title={`${item.label}: ${item.value}`} 
                style={{ 
                  height: heightPrimary,
                  transition: 'height 1s cubic-bezier(0.16, 1, 0.3, 1)' 
                }} 
              />
              {item.secondary !== undefined && (
                <div 
                  className="bar secondary" 
                  title={`${item.label}: ${item.secondary}`} 
                  style={{ 
                    height: heightSecondary,
                    transition: 'height 1s cubic-bezier(0.16, 1, 0.3, 1)',
                    transitionDelay: '100ms'
                  }} 
                />
              )}
            </div>
            <span>{item.label}</span>
          </div>
        );
      })}
    </div>
  );
}

export function DonutChart({ value, label, caption }: { value: number; label: string; caption?: string }) {
  const safe = Math.max(0, Math.min(100, value));
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedValue(safe), 100);
    return () => clearTimeout(timer);
  }, [safe]);

  const radius = 45;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedValue / 100) * circumference;

  return (
    <div className="donut-wrap">
      <div style={{ position: 'relative', width: '150px', height: '150px' }}>
        <svg width="150" height="150" viewBox="0 0 120 120" style={{ transform: 'rotate(-90deg)' }}>
          {/* Background circle */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="transparent"
            stroke="var(--neutral-150)"
            strokeWidth={strokeWidth}
          />
          {/* Main value progress circle */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="transparent"
            stroke="url(#donutGradient)"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.8s ease-out' }}
          />
          <defs>
            <linearGradient id="donutGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--brand)" />
              <stop offset="100%" stopColor="var(--brand-violet)" />
            </linearGradient>
          </defs>
        </svg>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center'
        }}>
          <strong style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '-0.05em', lineHeight: 1 }}>
            {Math.round(safe)}%
          </strong>
          <span style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>
            {label}
          </span>
        </div>
      </div>
      {caption && <p>{caption}</p>}
    </div>
  );
}

export function HorizontalBars({ data }: { data: { label: string; value: number; suffix?: string }[] }) {
  const max = Math.max(...data.map((item) => item.value), 1);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="horizontal-bars">
      {data.map((item) => {
        const widthPercent = animate ? `${(item.value / max) * 100}%` : '0%';
        return (
          <div className="hbar-row" key={item.label}>
            <div className="hbar-label"><span>{item.label}</span><strong>{formatNumber(item.value)}{item.suffix ?? ''}</strong></div>
            <div className="hbar-track">
              <div style={{ 
                width: widthPercent,
                transition: 'width 1s cubic-bezier(0.16, 1, 0.3, 1)'
              }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

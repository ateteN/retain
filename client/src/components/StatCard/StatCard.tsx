import React from 'react';
import styles from './StatCard.module.css';

interface StatCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  badge?: React.ReactNode;
  icon?: React.ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  progressPercent?: number;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  subtext,
  badge,
  icon,
  variant = 'default',
  progressPercent,
}) => {

  const totalTicks = 22;
  const percent = progressPercent !== undefined ? Math.min(100, Math.max(0, progressPercent)) : 65;
  const activeTicksCount = Math.round((percent / 100) * totalTicks);

  return (
    <div className={`${styles.card} ${styles[variant]}`}>
      <div className={styles.cardHeader}>
        <div className={styles.headerLeft}>
          {icon && <div className={styles.iconWrap}>{icon}</div>}
          <span className={styles.label}>{label}</span>
        </div>
        <div className={styles.infoIcon} title="Metric details">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
        </div>
      </div>

      <div className={styles.valueRow}>
        <span className={styles.value}>{value}</span>
        {badge && <div className={styles.badgeWrap}>{badge}</div>}
      </div>

      <div className={styles.footerRow}>
        {subtext && <span className={styles.subtext}>{subtext}</span>}
        {progressPercent !== undefined && (
          <span className={styles.percentText}>{Math.round(progressPercent)}%</span>
        )}
      </div>

      <div className={styles.tickTrack}>
        {Array.from({ length: totalTicks }).map((_, i) => (
          <span
            key={i}
            className={`${styles.tick} ${i < activeTicksCount ? styles.activeTick : ''}`}
          />
        ))}
      </div>
    </div>
  );
};

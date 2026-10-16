import React from 'react';
import type { BudgetStatus } from '../../types';
import styles from './BudgetBadge.module.css';

interface BudgetBadgeProps {
  status: BudgetStatus;
  size?: 'sm' | 'md' | 'lg';
}

export const BudgetBadge: React.FC<BudgetBadgeProps> = ({ status, size = 'md' }) => {
  const getBadgeConfig = (status: BudgetStatus) => {
    switch (status) {
      case 'WITHIN_BUDGET':
        return {
          label: 'Within Budget',
          className: styles.within,
          icon: '●',
        };
      case 'APPROACHING_BUDGET':
        return {
          label: 'Approaching Limit (90%+)',
          className: styles.approaching,
          icon: '▲',
        };
      case 'OVER_BUDGET':
        return {
          label: 'Over Budget',
          className: styles.over,
          icon: '✕',
        };
      case 'NO_BUDGET_SET':
      default:
        return {
          label: 'No Budget Set',
          className: styles.none,
          icon: '○',
        };
    }
  };

  const { label, className, icon } = getBadgeConfig(status);

  return (
    <span className={`${styles.badge} ${className} ${styles[size]}`}>
      <span className={styles.icon}>{icon}</span>
      <span className={styles.text}>{label}</span>
    </span>
  );
};

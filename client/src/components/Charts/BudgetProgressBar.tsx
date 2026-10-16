import React from 'react';
import type { BudgetStatus } from '../../types';
import styles from './BudgetProgressBar.module.css';

interface BudgetProgressBarProps {
  budgetAmount: number | null;
  totalSpent: number;
  remaining: number | null;
  status: BudgetStatus;
}

export const BudgetProgressBar: React.FC<BudgetProgressBarProps> = ({
  budgetAmount,
  totalSpent,
  remaining,
  status,
}) => {
  if (budgetAmount === null || budgetAmount <= 0) {
    return (
      <div className={styles.noBudgetCard}>
        <div className={styles.noBudgetHeader}>
          <span className={styles.noBudgetTitle}>No budget set for this month</span>
          <span className={styles.spentAmount}>
            ${totalSpent.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} spent
          </span>
        </div>
        <p className={styles.noBudgetHelp}>Configure a monthly target in the Budget tab to enable tracking.</p>
      </div>
    );
  }

  const rawPercent = (totalSpent / budgetAmount) * 100;
  const percentDisplay = rawPercent.toFixed(1);
  const visualFillPercent = Math.min(100, Math.max(0, rawPercent));

  // radial ticks for the semi-circle gauge 
  const totalRadialTicks = 34;
  const activeRadialCount = Math.round((visualFillPercent / 100) * totalRadialTicks);
  const cx = 140;
  const cy = 125;
  const rInner = 68;
  const rOuter = 96;

  const radialTicks = Array.from({ length: totalRadialTicks }).map((_, i) => {
    const angle = Math.PI + (i / (totalRadialTicks - 1)) * Math.PI;
    const x1 = cx + rInner * Math.cos(angle);
    const y1 = cy + rInner * Math.sin(angle);
    const x2 = cx + rOuter * Math.cos(angle);
    const y2 = cy + rOuter * Math.sin(angle);
    const isActive = i < activeRadialCount;

    let strokeColor = '#28254a';
    if (isActive) {
      if (status === 'OVER_BUDGET') {
        strokeColor = '#ff6b4a';
      } else if (status === 'APPROACHING_BUDGET') {
        strokeColor = '#f59e0b';
      } else {
        strokeColor = '#00e599';
      }
    }

    return { id: i, x1, y1, x2, y2, isActive, strokeColor };
  });

  return (
    <div className={styles.container}>
      {/* circular graph */}
      <div className={styles.gaugeContainer}>
        <svg viewBox="0 0 280 145" className={styles.gaugeSvg}>
          {radialTicks.map((tick) => (
            <line
              key={tick.id}
              x1={tick.x1}
              y1={tick.y1}
              x2={tick.x2}
              y2={tick.y2}
              stroke={tick.strokeColor}
              strokeWidth="4"
              strokeLinecap="round"
            />
          ))}
          {/* Center Text */}
          <text x={cx} y={cy - 20} textAnchor="middle" className={styles.gaugeValue}>
            {Math.round(rawPercent)}%
          </text>
          <text x={cx} y={cy + 2} textAnchor="middle" className={styles.gaugeSublabel}>
            Budget Used
          </text>
        </svg>
      </div>

      {/* status line  */}
      <div className={styles.infoPill}>
        <span className={styles.infoIcon}>ⓘ</span>
        <span>You've used {percentDisplay}% of your monthly budget</span>
      </div>

      {/* Horizontal progress bar */}
      <div className={styles.horizontalTrack}>
        <div
          className={`${styles.horizontalFill} ${status === 'OVER_BUDGET' ? styles.fillOver : status === 'APPROACHING_BUDGET' ? styles.fillWarn : styles.fillMint}`}
          style={{ width: `${visualFillPercent}%` }}
        />
      </div>

      <div className={styles.legendRow}>
        <div className={styles.legendItem}>
          <span className={`${styles.dot} ${styles.dotSpent}`} />
          <span>Spent (${totalSpent.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })})</span>
        </div>
        <div className={styles.legendItem}>
          <span className={`${styles.dot} ${styles.dotLimit}`} />
          <span>Limit (${budgetAmount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })})</span>
        </div>
        <div className={styles.legendItem}>
          <span className={`${styles.dot} ${styles.dotRemaining}`} />
          <span>
            {remaining !== null && remaining >= 0
              ? `Remaining ($${remaining.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })})`
              : `Over ($${Math.abs(remaining || 0).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })})`}
          </span>
        </div>
      </div>
    </div>
  );
};

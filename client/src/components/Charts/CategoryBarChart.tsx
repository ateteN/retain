import React from 'react';
import styles from './CategoryBarChart.module.css';

interface CategorySpendingItem {
  categoryName: string;
  total: number;
}

interface CategoryBarChartProps {
  data: CategorySpendingItem[];
  emptyMessage?: string;
}

export const CategoryBarChart: React.FC<CategoryBarChartProps> = ({
  data,
  emptyMessage = 'No category spending recorded for this period.',
}) => {
  if (!data || data.length === 0) {
    return <p className={styles.empty}>{emptyMessage}</p>;
  }

  const grandTotal = data.reduce((sum, item) => sum + item.total, 0);
  const maxVal = Math.max(...data.map((item) => item.total), 1);

  return (
    <div className={styles.container}>
      <div className={styles.summaryRow}>
        <div className={styles.totalBlock}>
          <span className={styles.grandTotal}>
            ${grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <span className={styles.changePill}>
            <span className={styles.arrowIcon}>↓</span>
            <span>Tracked across {data.length} {data.length === 1 ? 'category' : 'categories'}</span>
          </span>
        </div>

        <div className={styles.legendGroup}>
          <div className={styles.legendItem}>
            <span className={`${styles.legendDot} ${styles.dotMint}`} />
            <span>Spending</span>
          </div>
        </div>
      </div>

      {/*  Column Bars */}
      <div className={styles.columnsWrapper}>
        <div className={styles.columnsTrack}>
          {data.map((item) => {
            const percentage = grandTotal > 0 ? ((item.total / grandTotal) * 100).toFixed(1) : '0';
            const heightPercent = Math.min(100, Math.max(14, (item.total / maxVal) * 100));

            return (
              <div key={item.categoryName} className={styles.columnItem}>
                <div className={styles.barStack} style={{ height: `${heightPercent}%` }}>
                  {/* Solid green bar */}
                  <div className={styles.solidSegment} />
                  {/* Floating tooltip on hover */}
                  <div className={styles.tooltip}>
                    <span className={styles.tooltipAmount}>${item.total.toFixed(2)}</span>
                    <span className={styles.tooltipPercent}>{percentage}%</span>
                  </div>
                </div>
                <span className={styles.columnLabel} title={item.categoryName}>
                  {item.categoryName}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

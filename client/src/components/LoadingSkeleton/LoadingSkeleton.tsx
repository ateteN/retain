import React from 'react';
import styles from './LoadingSkeleton.module.css';

interface SkeletonProps {
  width?: string;
  height?: string;
  borderRadius?: string;
  count?: number;
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = '20px',
  borderRadius = '8px',
  count = 1,
  className = '',
}) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`${styles.skeleton} ${className}`}
          style={{ width, height, borderRadius, marginBottom: count > 1 ? '10px' : 0 }}
        />
      ))}
    </>
  );
};

export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => {
  return (
    <div className={styles.tableSkeleton}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className={styles.tableRowSkeleton}>
          <Skeleton width="28%" height="24px" />
          <Skeleton width="18%" height="24px" />
          <Skeleton width="18%" height="24px" />
          <Skeleton width="16%" height="24px" />
          <Skeleton width="12%" height="24px" />
        </div>
      ))}
    </div>
  );
};

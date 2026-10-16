import React from 'react';
import { Link } from 'react-router-dom';
import styles from './NotFoundPage.module.css';

export const NotFoundPage: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.code}>404</div>
        <h1 className={styles.title}>Page Not Found</h1>
        <p className={styles.description}>
          The page you are looking for does not exist or has been moved.
        </p>
        <Link to="/dashboard" className={styles.homeBtn}>
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

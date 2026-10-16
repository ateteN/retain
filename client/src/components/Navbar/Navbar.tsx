import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './Navbar.module.css';

export const Navbar: React.FC = () => {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* Logo */}
        <NavLink to="/dashboard" className={styles.brand}>
          <div className={styles.logoIcon}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" y1="9" x2="20" y2="9" />
              <line x1="4" y1="15" x2="20" y2="15" />
              <line x1="10" y1="3" x2="8" y2="21" />
              <line x1="16" y1="3" x2="14" y2="21" />
            </svg>
          </div>
          <span className={styles.appName}>Retain</span>
        </NavLink>

        {/* Navigation Links */}
        <nav className={styles.navLinks}>
          <NavLink
            to="/dashboard"
            className={({ isActive }) => (isActive ? `${styles.navLink} ${styles.active}` : styles.navLink)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            <span>Dashboard</span>
          </NavLink>
          <NavLink
            to="/expenses"
            className={({ isActive }) => (isActive ? `${styles.navLink} ${styles.active}` : styles.navLink)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="5" width="20" height="14" rx="2"/>
              <line x1="2" y1="10" x2="22" y2="10"/>
            </svg>
            <span>Expenses</span>
          </NavLink>
          <NavLink
            to="/budget"
            className={({ isActive }) => (isActive ? `${styles.navLink} ${styles.active}` : styles.navLink)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
            <span>Budget</span>
          </NavLink>
          {isAdmin && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                isActive ? `${styles.navLink} ${styles.adminLink} ${styles.active}` : `${styles.navLink} ${styles.adminLink}`
              }
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3"/>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
              </svg>
              <span>Admin Portal</span>
            </NavLink>
          )}
        </nav>

        {/* User info and actions */}
        <div className={styles.userSection}>
          <div className={styles.userPill}>
            <span className={styles.userName}>{user?.name}</span>
            <span className={user?.role === 'admin' ? styles.roleBadgeAdmin : styles.roleBadge}>
              {user?.role === 'admin' ? 'Admin' : 'Personal'}
            </span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.chevronIcon}>
              <path d="m6 9 6 6 6-6"/>
            </svg>
          </div>

          <div className={styles.avatar}>
            {user?.name ? getInitials(user.name) : 'U'}
          </div>

          <button
            onClick={handleLogout}
            className={styles.logoutBtn}
            title="Sign out of Retain"
            aria-label="Sign out"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>

          {/* Mobile hamburger menu */}
          <button
            className={styles.hamburgerBtn}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            <span className={`${styles.bar} ${mobileMenuOpen ? styles.barTopOpen : ''}`} />
            <span className={`${styles.bar} ${mobileMenuOpen ? styles.barMidOpen : ''}`} />
            <span className={`${styles.bar} ${mobileMenuOpen ? styles.barBotOpen : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className={styles.mobileMenu}>
          <NavLink
            to="/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className={({ isActive }) => (isActive ? `${styles.mobileLink} ${styles.activeMobile}` : styles.mobileLink)}
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/expenses"
            onClick={() => setMobileMenuOpen(false)}
            className={({ isActive }) => (isActive ? `${styles.mobileLink} ${styles.activeMobile}` : styles.mobileLink)}
          >
            Expenses
          </NavLink>
          <NavLink
            to="/budget"
            onClick={() => setMobileMenuOpen(false)}
            className={({ isActive }) => (isActive ? `${styles.mobileLink} ${styles.activeMobile}` : styles.mobileLink)}
          >
            Budget
          </NavLink>
          {isAdmin && (
            <NavLink
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                isActive ? `${styles.mobileLink} ${styles.mobileAdminLink} ${styles.activeMobile}` : `${styles.mobileLink} ${styles.mobileAdminLink}`
              }
            >
              Admin Portal
            </NavLink>
          )}
          <div className={styles.mobileDivider} />
          <div className={styles.mobileUserFooter}>
            <div className={styles.mobileUserInfo}>
              <span className={styles.mobileUserName}>{user?.name}</span>
              <span className={styles.mobileUserEmail}>{user?.email}</span>
            </div>
            <button onClick={handleLogout} className={styles.mobileLogoutBtn}>
              Sign Out
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { dashboardApi } from '../../api/dashboardApi';
import { categoryApi } from '../../api/categoryApi';
import { expenseApi } from '../../api/expenseApi';
import type { DashboardData, Category, CreateExpensePayload, BudgetStatus } from '../../types';
import { Navbar } from '../../components/Navbar/Navbar';
import { StatCard } from '../../components/StatCard/StatCard';
import { PaymentMethodBadge } from '../../components/PaymentMethodBadge/PaymentMethodBadge';
import { BudgetProgressBar } from '../../components/Charts/BudgetProgressBar';
import { CategoryBarChart } from '../../components/Charts/CategoryBarChart';
import { ExpenseFormModal } from '../../components/ExpenseModal/ExpenseFormModal';
import { Skeleton } from '../../components/LoadingSkeleton/LoadingSkeleton';
import { EmptyState } from '../../components/EmptyState/EmptyState';
import styles from './DashboardPage.module.css';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [currentDate, setCurrentDate] = useState(() => {
    const now = new Date();
    return new Date(Date.UTC(now.getFullYear(), now.getMonth(), 1));
  });

  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isSubmittingExpense, setIsSubmittingExpense] = useState(false);

  const monthParam = currentDate.toISOString().slice(0, 10);

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true);
      const [data, catRes] = await Promise.all([
        dashboardApi.getDashboard(monthParam),
        categoryApi.getCategories(),
      ]);
      setDashboardData(data);
      setCategories(catRes.categories);
    } catch (err: unknown) {
      let msg = 'Failed to load dashboard data.';
      if (typeof err === 'object' && err !== null && 'response' in err) {
        const resp = (err as { response?: { data?: { message?: string } } }).response;
        if (resp?.data?.message) msg = resp.data.message;
      }
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  }, [monthParam, showToast]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const handlePrevMonth = () => {
    setCurrentDate((prev) => new Date(Date.UTC(prev.getUTCFullYear(), prev.getUTCMonth() - 1, 1)));
  };

  const handleNextMonth = () => {
    setCurrentDate((prev) => new Date(Date.UTC(prev.getUTCFullYear(), prev.getUTCMonth() + 1, 1)));
  };

  const handleCurrentMonth = () => {
    const now = new Date();
    setCurrentDate(new Date(Date.UTC(now.getFullYear(), now.getMonth(), 1)));
  };

  const handleCreateExpense = async (payload: CreateExpensePayload) => {
    try {
      setIsSubmittingExpense(true);
      await expenseApi.createExpense(payload);
      showToast('Expense recorded successfully!', 'success');
      await fetchDashboard();
    } catch (err: unknown) {
      let msg = 'Failed to create expense.';
      if (typeof err === 'object' && err !== null && 'response' in err) {
        const resp = (err as { response?: { data?: { message?: string } } }).response;
        if (resp?.data?.message) msg = resp.data.message;
      }
      showToast(msg, 'error');
      throw err;
    } finally {
      setIsSubmittingExpense(false);
    }
  };

  // budget status based on current dashboard data
  const getComputedStatus = (): BudgetStatus => {
    if (!dashboardData || dashboardData.budgetAmount === null) return 'NO_BUDGET_SET';
    const { totalSpent, budgetAmount } = dashboardData;
    if (totalSpent > budgetAmount) return 'OVER_BUDGET';
    if (totalSpent >= budgetAmount * 0.9) return 'APPROACHING_BUDGET';
    return 'WITHIN_BUDGET';
  };

  const formattedMonthTitle = currentDate.toLocaleString('default', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });

  const budgetStatus = getComputedStatus();

  // Progress metrics calculation for status line
  const budgetUsagePercent =
    dashboardData && dashboardData.budgetAmount && dashboardData.budgetAmount > 0
      ? (dashboardData.totalSpent / dashboardData.budgetAmount) * 100
      : 75;

  return (
    <div className={styles.wrapper}>
      <Navbar />

      <main className={styles.mainContent}>
        {/* Month Navigator and qick Actions */}
        <section className={styles.topBar}>
          <div className={styles.welcomeInfo}>
            <h1 className={styles.pageTitle}>Dashboard</h1>
            <p className={styles.pageSubtitle}>
              <span className={styles.metaDash}>—</span> {formattedMonthTitle.toUpperCase()} &nbsp;
              <span className={styles.metaSeparator}>|</span> &nbsp;
              <span className={styles.metaUser}>User: {user?.name}</span> &nbsp;
              <span className={styles.refreshIcon} onClick={() => fetchDashboard()} title="Refresh dashboard">↺</span>
            </p>
          </div>

          <div className={styles.actionsBar}>
            {/* Month Switcher Pill */}
            <div className={styles.monthNavigator}>
              <button
                onClick={handlePrevMonth}
                className={styles.monthNavBtn}
                title="Previous month"
                aria-label="Previous month"
              >
                ‹
              </button>
              <span className={styles.currentMonthLabel}>{formattedMonthTitle}</span>
              <button
                onClick={handleNextMonth}
                className={styles.monthNavBtn}
                title="Next month"
                aria-label="Next month"
              >
                ›
              </button>
              <button
                onClick={handleCurrentMonth}
                className={styles.thisMonthBtn}
                title="Reset to current month"
              >
                Current
              </button>
            </div>

            {/* Add Expense*/}
            <button
              onClick={() => setIsExpenseModalOpen(true)}
              className={styles.addExpenseBtn}
            >
              <span className={styles.plusIcon}>+</span>
              <span>Record Expense</span>
            </button>
          </div>
        </section>

        {loading ? (
          <div className={styles.skeletonGrid}>
            <Skeleton height="150px" borderRadius="20px" />
            <Skeleton height="150px" borderRadius="20px" />
            <Skeleton height="150px" borderRadius="20px" />
            <Skeleton height="150px" borderRadius="20px" />
          </div>
        ) : dashboardData ? (
          <>
            {/* Stat Cards Grid */}
            <section className={styles.kpiGrid}>
              <StatCard
                label="Monthly Expenses"
                value={`$${dashboardData.totalSpent.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
                subtext={`Target: $${(dashboardData.budgetAmount || 0).toLocaleString()}`}

                progressPercent={budgetUsagePercent}
                variant="danger"
                icon={
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="5" width="20" height="14" rx="2" />
                    <line x1="2" y1="10" x2="22" y2="10" />
                  </svg>
                }
              />

              <StatCard
                label="Monthly Budget"
                value={
                  dashboardData.budgetAmount !== null
                    ? `$${dashboardData.budgetAmount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
                    : 'Not Set'
                }
                subtext="Allocated limit"

                progressPercent={100}
                variant="primary"
                icon={
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 6v6l4 2" />
                  </svg>
                }
              />

              <StatCard
                label="Available Balance"
                value={
                  dashboardData.remainingBudget !== null
                    ? `$${Math.abs(dashboardData.remainingBudget).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
                    : '—'
                }
                subtext={
                  dashboardData.remainingBudget !== null && dashboardData.remainingBudget >= 0
                    ? 'Within monthly cap'
                    : 'Over spending limit'
                }

                progressPercent={dashboardData.remainingBudget && dashboardData.remainingBudget > 0 ? 80 : 20}
                variant={dashboardData.remainingBudget && dashboardData.remainingBudget >= 0 ? 'success' : 'danger'}
                icon={
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="1" x2="12" y2="23" />
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                }
              />

              <StatCard
                label="Highest Single Expense"
                value={
                  dashboardData.highestExpense
                    ? `$${dashboardData.highestExpense.amount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
                    : 'None'
                }
                subtext={dashboardData.highestExpense ? dashboardData.highestExpense.title : 'No entries'}

                progressPercent={45}
                icon={
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                    <polyline points="17 6 23 6 23 12" />
                  </svg>
                }
              />
            </section>

            <div className={styles.twoColumnGrid}>
              {/* Category Spending Breakdown */}
              <section className={styles.panelCard}>
                <div className={styles.panelHeader}>
                  <div>
                    <h2 className={styles.panelTitle}>Spending by Category</h2>
                  </div>
                  <div className={styles.expandIcon} title="Category details">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="15 3 21 3 21 9" />
                      <polyline points="9 21 3 21 3 15" />
                      <line x1="21" y1="3" x2="14" y2="10" />
                      <line x1="3" y1="21" x2="10" y2="14" />
                    </svg>
                  </div>
                </div>

                <div className={styles.panelBody}>
                  {dashboardData.spendingByCategory.length > 0 ? (
                    <CategoryBarChart data={dashboardData.spendingByCategory} />
                  ) : (
                    <EmptyState
                      title="No categorized expenses"
                      description={`You haven't recorded any expenses in ${formattedMonthTitle} yet.`}
                      actionText="Record First Expense"
                      onAction={() => setIsExpenseModalOpen(true)}
                    />
                  )}
                </div>
              </section>

              {/* Budget Usage status line */}
              <section className={styles.panelCard}>
                <div className={styles.panelHeader}>
                  <div>
                    <h2 className={styles.panelTitle}>Budget Usage</h2>
                  </div>
                  <Link to="/budget" className={styles.circleLinkBtn} title="Manage budget">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </Link>
                </div>

                <div className={styles.panelBody}>
                  <BudgetProgressBar
                    budgetAmount={dashboardData.budgetAmount}
                    totalSpent={dashboardData.totalSpent}
                    remaining={dashboardData.remainingBudget}
                    status={budgetStatus}
                  />
                </div>
              </section>
            </div>

            {/* Recent Expenses List Section */}
            <section className={styles.bottomCard}>
              <div className={styles.panelHeader}>
                <div>
                  <h2 className={styles.panelTitle}>Recent Expenses</h2>
                  <p className={styles.panelSubtitle}>Your latest recorded transactions for quick review</p>
                </div>
                <Link to="/expenses" className={styles.viewAllLink}>
                  View All Expenses →
                </Link>
              </div>

              <div className={styles.panelBody}>
                {dashboardData.recentExpenses.length > 0 ? (
                  <div className={styles.recentList}>
                    {dashboardData.recentExpenses.map((expense) => (
                      <div key={expense._id} className={styles.recentItem}>
                        <div className={styles.recentLeft}>
                          <div className={styles.recentIcon}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <line x1="12" y1="1" x2="12" y2="23" />
                              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                            </svg>
                          </div>
                          <div className={styles.recentInfo}>
                            <span className={styles.recentTitle}>{expense.title}</span>
                            <span className={styles.recentDate}>
                              {new Date(expense.date).toLocaleDateString(undefined, {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </span>
                          </div>
                        </div>

                        <div className={styles.recentRight}>
                          <span className={styles.categoryPill}>
                            {expense.category?.name || 'Uncategorized'}
                          </span>
                          <PaymentMethodBadge method={expense.paymentMethod} />
                          <span className={styles.recentAmount}>
                            -${expense.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    title="No recent expenses"
                    description="Start recording your purchases to see recent transaction activity."
                    actionText="Record an Expense"
                    onAction={() => setIsExpenseModalOpen(true)}
                  />
                )}
              </div>
            </section>
          </>
        ) : null}
      </main>

      {/* Expense Modal */}
      <ExpenseFormModal
        isOpen={isExpenseModalOpen}
        categories={categories}
        isLoading={isSubmittingExpense}
        onSubmit={handleCreateExpense}
        onClose={() => setIsExpenseModalOpen(false)}
      />
    </div>
  );
};

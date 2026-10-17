import React, { useState, useEffect, useCallback } from 'react';
import { budgetApi } from '../../api/budgetApi';
import { useToast } from '../../context/ToastContext';
import type { BudgetStatusResponse } from '../../types';
import { Navbar } from '../../components/Navbar/Navbar';
import { BudgetBadge } from '../../components/BudgetBadge/BudgetBadge';
import { BudgetProgressBar } from '../../components/Charts/BudgetProgressBar';
import { Skeleton } from '../../components/LoadingSkeleton/LoadingSkeleton';
import styles from './BudgetPage.module.css';

export const BudgetPage: React.FC = () => {
  const { showToast } = useToast();

  const [currentDate, setCurrentDate] = useState(() => {
    const now = new Date();
    return new Date(Date.UTC(now.getFullYear(), now.getMonth(), 1));
  });

  const [budgetStatus, setBudgetStatus] = useState<BudgetStatusResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [budgetInput, setBudgetInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [validationError, setValidationError] = useState('');

  const monthParam = currentDate.toISOString().slice(0, 10);

  const fetchStatus = useCallback(async () => {
    try {
      setLoading(true);
      const data = await budgetApi.getBudgetStatus(monthParam);
      setBudgetStatus(data);
      if (data.budgetAmount !== null) {
        setBudgetInput(String(data.budgetAmount));
      } else {
        setBudgetInput('');
      }
    } catch (err: unknown) {
      let msg = 'Failed to load budget status.';
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
    fetchStatus();
  }, [fetchStatus]);

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

  const handleSaveBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    const numAmount = parseFloat(budgetInput);
    if (isNaN(numAmount) || numAmount <= 0) {
      setValidationError('Budget amount must be a positive number greater than 0.');
      return;
    }

    try {
      setIsSaving(true);
      await budgetApi.setBudget({
        amount: numAmount,
        month: monthParam,
      });
      showToast('Monthly budget saved successfully!', 'success');
      await fetchStatus();
    } catch (err: unknown) {
      let msg = 'Failed to update budget.';
      if (typeof err === 'object' && err !== null && 'response' in err) {
        const resp = (err as { response?: { data?: { message?: string } } }).response;
        if (resp?.data?.message) msg = resp.data.message;
      }
      showToast(msg, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const formattedMonth = currentDate.toLocaleString('default', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });

  return (
    <div className={styles.wrapper}>
      <Navbar />

      <main className={styles.mainContent}>
        {/* Header with Month Nav */}
        <section className={styles.pageHeader}>
          <div>
            <h1 className={styles.title}>Budget Management</h1>
            <p className={styles.subtitle}>
              Set spending targets and monitor your consumption in real time
            </p>
          </div>

          <div className={styles.monthNav}>
            <button
              onClick={handlePrevMonth}
              className={styles.navBtn}
              title="Previous month"
              aria-label="Previous month"
            >
              ‹
            </button>
            <span className={styles.monthLabel}>{formattedMonth}</span>
            <button
              onClick={handleNextMonth}
              className={styles.navBtn}
              title="Next month"
              aria-label="Next month"
            >
              ›
            </button>
            <button onClick={handleCurrentMonth} className={styles.todayBtn}>
              Current Month
            </button>
          </div>
        </section>

        {loading ? (
          <div className={styles.skeletonWrap}>
            <Skeleton height="180px" borderRadius="18px" />
            <Skeleton height="260px" borderRadius="18px" />
          </div>
        ) : budgetStatus ? (
          <div className={styles.grid}>
            {/* Status & Visual Progress Card */}
            <section className={styles.statusCard}>
              <div className={styles.cardHeader}>
                <div>
                  <span className={styles.cardEyebrow}>Status for {formattedMonth}</span>
                  <h2 className={styles.cardTitle}>Budget Health</h2>
                </div>
                <BudgetBadge status={budgetStatus.status} size="lg" />
              </div>

              <div className={styles.progressContainer}>
                <BudgetProgressBar
                  budgetAmount={budgetStatus.budgetAmount}
                  totalSpent={budgetStatus.totalSpent}
                  remaining={budgetStatus.remaining}
                  status={budgetStatus.status}
                />
              </div>

              {/* Status explanation alert */}
              <div className={styles.statusNotice}>
                {budgetStatus.status === 'WITHIN_BUDGET' && (
                  <p className={styles.noticeText}>
                    Great job! Your spending is comfortably within your target. You have{' '}
                    <strong>
                      ${budgetStatus.remaining?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </strong>{' '}
                    remaining for this month.
                  </p>
                )}
                {budgetStatus.status === 'APPROACHING_BUDGET' && (
                  <p className={`${styles.noticeText} ${styles.warningNotice}`}>
                    Caution: You have utilized over 90% of your allocated budget. Keep an eye on non-essential purchases.
                  </p>
                )}
                {budgetStatus.status === 'OVER_BUDGET' && (
                  <p className={`${styles.noticeText} ${styles.dangerNotice}`}>
                    Attention: You have exceeded your planned budget by{' '}
                    <strong>
                      ${Math.abs(budgetStatus.remaining || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </strong>
                    . Consider adjusting your monthly cap if expenses were anticipated.
                  </p>
                )}
                {budgetStatus.status === 'NO_BUDGET_SET' && (
                  <p className={styles.noticeText}>
                    You have not established a spending target for {formattedMonth}. Use the form below to set one.
                  </p>
                )}
              </div>
            </section>

            {/* Set and update budget form Card */}
            <section className={styles.formCard}>
              <div className={styles.cardHeader}>
                <div>
                  <span className={styles.cardEyebrow}>Budget Configuration</span>
                  <h2 className={styles.cardTitle}>
                    {budgetStatus.budgetAmount !== null ? 'Adjust Target' : 'Set New Target'}
                  </h2>
                </div>
              </div>

              <p className={styles.formDesc}>
                Set a total spending limit for <strong>{formattedMonth}</strong>. Changes apply immediately to all progress indicators across your dashboard.
              </p>

              {validationError && (
                <div className={styles.errorAlert} role="alert">
                  <span>{validationError}</span>
                </div>
              )}

              <form onSubmit={handleSaveBudget} className={styles.form}>
                <div className={styles.formGroup}>
                  <label htmlFor="budget-amount" className={styles.label}>
                    Monthly Limit ($)
                  </label>
                  <div className={styles.amountInputWrap}>
                    <span className={styles.currencyPrefix}>$</span>
                    <input
                      id="budget-amount"
                      type="number"
                      step="0.01"
                      min="0.01"
                      className={styles.amountInput}
                      placeholder="e.g. 2500.00"
                      value={budgetInput}
                      onChange={(e) => setBudgetInput(e.target.value)}
                      disabled={isSaving}
                      required
                    />
                  </div>
                  <span className={styles.helpText}>
                    Enter a positive decimal number representing your maximum allowed spending for this month.
                  </span>
                </div>

                <button
                  type="submit"
                  className={styles.saveBtn}
                  disabled={isSaving}
                >
                  {isSaving ? 'Updating...' : budgetStatus.budgetAmount !== null ? 'Update Monthly Budget' : 'Save Monthly Budget'}
                </button>
              </form>
            </section>
          </div>
        ) : null}
      </main>
    </div>
  );
};

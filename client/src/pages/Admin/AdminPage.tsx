import React, { useState, useEffect, useCallback } from 'react';
import { adminApi } from '../../api/adminApi';
import { categoryApi } from '../../api/categoryApi';
import { useToast } from '../../context/ToastContext';
import type { AdminInsights, Category, CategoryPayload } from '../../types';
import { Navbar } from '../../components/Navbar/Navbar';
import { StatCard } from '../../components/StatCard/StatCard';
import { CategoryModal } from '../../components/CategoryModal/CategoryModal';
import { ConfirmationModal } from '../../components/ConfirmationModal/ConfirmationModal';
import { Skeleton } from '../../components/LoadingSkeleton/LoadingSkeleton';
import { PaymentMethodBadge } from '../../components/PaymentMethodBadge/PaymentMethodBadge';
import { CategoryBarChart } from '../../components/Charts/CategoryBarChart';
import styles from './AdminPage.module.css';

export const AdminPage: React.FC = () => {
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'insights' | 'categories'>('insights');
  const [insights, setInsights] = useState<AdminInsights | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Category modal states
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isSavingCategory, setIsSavingCategory] = useState(false);

  // Delete modal states
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);
  const [isDeletingCategory, setIsDeletingCategory] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [insightsData, catData] = await Promise.all([
        adminApi.getAdminInsights(),
        categoryApi.getCategories(),
      ]);
      setInsights(insightsData);
      setCategories(catData.categories);
    } catch (err: unknown) {
      let msg = 'Failed to load administrator data.';
      if (typeof err === 'object' && err !== null && 'response' in err) {
        const resp = (err as { response?: { data?: { message?: string } } }).response;
        if (resp?.data?.message) msg = resp.data.message;
      }
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSaveCategory = async (payload: CategoryPayload) => {
    try {
      setIsSavingCategory(true);
      if (editingCategory) {
        await categoryApi.updateCategory(editingCategory._id, payload);
        showToast(`Category "${payload.name}" updated successfully.`, 'success');
      } else {
        await categoryApi.createCategory(payload);
        showToast(`Category "${payload.name}" created successfully.`, 'success');
      }
      await fetchData();
    } catch (err: unknown) {
      let msg = 'Failed to save category.';
      if (typeof err === 'object' && err !== null && 'response' in err) {
        const resp = (err as { response?: { data?: { message?: string } } }).response;
        if (resp?.data?.message) msg = resp.data.message;
      }
      showToast(msg, 'error');
      throw err;
    } finally {
      setIsSavingCategory(false);
    }
  };

  const handleDeleteCategoryConfirm = async () => {
    if (!deletingCategory) return;
    try {
      setIsDeletingCategory(true);
      const res = await categoryApi.deleteCategory(deletingCategory._id);
      showToast(res.message || 'Category deleted and expenses moved to Uncategorized.', 'info');
      setDeletingCategory(null);
      await fetchData();
    } catch (err: unknown) {
      let msg = 'Failed to delete category.';
      if (typeof err === 'object' && err !== null && 'response' in err) {
        const resp = (err as { response?: { data?: { message?: string } } }).response;
        if (resp?.data?.message) msg = resp.data.message;
      }
      showToast(msg, 'error');
    } finally {
      setIsDeletingCategory(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <Navbar />

      <main className={styles.mainContent}>
        {/* Header */}
        <section className={styles.pageHeader}>
          <div>
            <div className={styles.badgeRow}>
              <span className={styles.adminBadge}>Admin Portal</span>
            </div>
            <h1 className={styles.title}>System Governance & Insights</h1>
            <p className={styles.subtitle}>
              Monitor platform-wide analytics, inspect recent activity, and manage system categories
            </p>
          </div>

          <div className={styles.tabNav}>
            <button
              onClick={() => setActiveTab('insights')}
              className={`${styles.tabBtn} ${activeTab === 'insights' ? styles.activeTab : ''}`}
            >
              Platform Insights
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`${styles.tabBtn} ${activeTab === 'categories' ? styles.activeTab : ''}`}
            >
              Category Management ({categories.length})
            </button>
          </div>
        </section>

        {loading ? (
          <div className={styles.skeletonGrid}>
            <Skeleton height="130px" borderRadius="18px" />
            <Skeleton height="130px" borderRadius="18px" />
            <Skeleton height="130px" borderRadius="18px" />
            <Skeleton height="130px" borderRadius="18px" />
          </div>
        ) : activeTab === 'insights' && insights ? (
          <>
            {/* KPI Stat Cards */}
            <section className={styles.kpiGrid}>
              <StatCard
                label="Registered Users"
                value={insights.totalUsers}
                subtext="Total user accounts"
                variant="primary"
                icon={
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                }
              />

              <StatCard
                label="Total Volume"
                value={`$${insights.totalExpenseValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                subtext="Cumulative tracked spending"
                variant="success"
                icon={
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="1" x2="12" y2="23" />
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                }
              />

              <StatCard
                label="Total Transactions"
                value={insights.totalExpenses}
                subtext="All-time recorded expenses"
                icon={
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="5" width="20" height="14" rx="2" />
                    <line x1="2" y1="10" x2="22" y2="10" />
                  </svg>
                }
              />

              <StatCard
                label="Expenses This Month"
                value={insights.expensesThisMonth}
                subtext="Activity in current month"
                variant="warning"
                icon={
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                }
              />
            </section>

            {/* Platform Spending & Most Used Categories */}
            <div className={styles.twoColumnGrid}>
              {/* Spending By Category */}
              <section className={styles.cardPanel}>
                <div className={styles.panelHeader}>
                  <h2 className={styles.panelTitle}>Platform Spending by Category</h2>
                  <span className={styles.panelBadge}>Global</span>
                </div>
                <div className={styles.panelBody}>
                  <CategoryBarChart data={insights.spendingByCategory} />
                </div>
              </section>

              {/* Category Usage Rankings */}
              <section className={styles.cardPanel}>
                <div className={styles.panelHeader}>
                  <h2 className={styles.panelTitle}>Category Adoption Rankings</h2>
                  <span className={styles.panelBadge}>Usage Count</span>
                </div>
                <div className={styles.panelBody}>
                  <div className={styles.usageSection}>
                    <h4 className={styles.subHeading}>Top 5 Most Used Categories</h4>
                    <div className={styles.usageList}>
                      {insights.mostUsedCategories.map((c) => (
                        <div key={c.categoryId} className={styles.usageRow}>
                          <span className={styles.usageName}>{c.categoryName}</span>
                          <span className={`${styles.countBadge} ${styles.highCount}`}>
                            {c.count} transactions
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className={styles.usageSection} style={{ marginTop: '24px' }}>
                    <h4 className={styles.subHeading}>Least Used Categories (Bottom 5)</h4>
                    <div className={styles.usageList}>
                      {insights.leastUsedCategories.map((c) => (
                        <div key={c.categoryId} className={styles.usageRow}>
                          <span className={styles.usageName}>{c.categoryName}</span>
                          <span className={`${styles.countBadge} ${styles.lowCount}`}>
                            {c.count} transactions
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* Recent Activity and User Insights */}
            <div className={styles.twoColumnGrid} style={{ marginTop: '28px' }}>
              {/* Recent Global Expenses */}
              <section className={styles.cardPanel}>
                <div className={styles.panelHeader}>
                  <h2 className={styles.panelTitle}>Recent Global Transactions</h2>
                  <span className={styles.panelSubtext}>Latest 5 platform expenses</span>
                </div>
                <div className={styles.panelBody}>
                  <div className={styles.activityList}>
                    {insights.recentExpenses.map((expense) => {
                      const userObj = typeof expense.user === 'object' && expense.user !== null
                        ? (expense.user as { name?: string; email?: string })
                        : null;
                      return (
                        <div key={expense._id} className={styles.activityItem}>
                          <div className={styles.activityTop}>
                            <span className={styles.activityTitle}>{expense.title}</span>
                            <span className={styles.activityAmount}>
                              ${expense.amount.toFixed(2)}
                            </span>
                          </div>
                          <div className={styles.activityMeta}>
                            <span className={styles.userTag}>
                              User: {userObj?.name || 'Unknown User'} ({userObj?.email || 'No email'})
                            </span>
                            <PaymentMethodBadge method={expense.paymentMethod} />
                            <span className={styles.dateTag}>
                              {new Date(expense.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </section>

              {/* Recent Users */}
              <section className={styles.cardPanel}>
                <div className={styles.panelHeader}>
                  <h2 className={styles.panelTitle}>Newly Registered Users</h2>
                  <span className={styles.panelSubtext}>Latest 5 registered accounts</span>
                </div>
                <div className={styles.panelBody}>
                  <div className={styles.userList}>
                    {insights.recentUsers.map((u) => (
                      <div key={u._id} className={styles.userItem}>
                        <div className={styles.userAvatar}>
                          {u.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div className={styles.userMain}>
                          <div className={styles.userNameRow}>
                            <span className={styles.userName}>{u.name}</span>
                            <span className={u.role === 'admin' ? styles.adminPill : styles.userPill}>
                              {u.role}
                            </span>
                          </div>
                          <span className={styles.userEmail}>{u.email}</span>
                        </div>
                        <span className={styles.joinedDate}>
                          Joined {new Date(u.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </div>
          </>
        ) : activeTab === 'categories' ? (
          /* Category Management Tab */
          <section className={styles.categoryManagementSection}>
            <div className={styles.catHeaderRow}>
              <div>
                <h2 className={styles.sectionTitle}>Category Directory</h2>
                <p className={styles.sectionSubtitle}>
                  Create, edit, or remove expense categories. The default <strong>Uncategorized</strong> category is protected.
                </p>
              </div>
              <button
                onClick={() => {
                  setEditingCategory(null);
                  setIsCatModalOpen(true);
                }}
                className={styles.addCategoryBtn}
              >
                + New Category
              </button>
            </div>

            <div className={styles.tableCard}>
              <table className={styles.catTable}>
                <thead>
                  <tr>
                    <th>Category Name</th>
                    <th>Description</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th className={styles.actionsTh}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((cat) => (
                    <tr key={cat._id} className={styles.catTableRow}>
                      <td className={styles.catNameCell}>
                        <span className={styles.catName}>{cat.name}</span>
                      </td>
                      <td className={styles.catDescCell}>
                        {cat.description || <span className={styles.noneText}>No description</span>}
                      </td>
                      <td>
                        {cat.isDefault ? (
                          <span className={styles.defaultBadge}>Default System</span>
                        ) : (
                          <span className={styles.customBadge}>Custom</span>
                        )}
                      </td>
                      <td className={styles.catDateCell}>
                        {new Date(cat.createdAt).toLocaleDateString()}
                      </td>
                      <td className={styles.actionsCell}>
                        {cat.isDefault ? (
                          <span className={styles.protectedText} title="Default system category cannot be modified or deleted">
                            Protected
                          </span>
                        ) : (
                          <div className={styles.catActions}>
                            <button
                              onClick={() => {
                                setEditingCategory(cat);
                                setIsCatModalOpen(true);
                              }}
                              className={styles.catEditBtn}
                              title="Edit Category"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => setDeletingCategory(cat)}
                              className={styles.catDeleteBtn}
                              title="Delete Category"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ) : null}
      </main>

      {/* Category create and edit modal */}
      <CategoryModal
        isOpen={isCatModalOpen}
        initialData={editingCategory}
        isLoading={isSavingCategory}
        onSubmit={handleSaveCategory}
        onClose={() => {
          setIsCatModalOpen(false);
          setEditingCategory(null);
        }}
      />

      {/* Category delete confirmation modal */}
      <ConfirmationModal
        isOpen={!!deletingCategory}
        title="Delete Category"
        message={`Are you sure you want to delete category "${deletingCategory?.name}"? Any existing expenses currently assigned to this category will automatically be moved to "Uncategorized".`}
        confirmLabel="Delete & Reassign"
        isDangerous
        isLoading={isDeletingCategory}
        onConfirm={handleDeleteCategoryConfirm}
        onCancel={() => setDeletingCategory(null)}
      />
    </div>
  );
};

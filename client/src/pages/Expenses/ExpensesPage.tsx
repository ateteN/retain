import React, { useState, useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  setSearch,
  setCategory,
  setPaymentMethod,
  setStartDate,
  setEndDate,
  setSortBy,
  setSortOrder,
  setPage,
  resetFilters,
} from '../../store/expenseFiltersSlice';
import { expenseApi } from '../../api/expenseApi';
import { categoryApi } from '../../api/categoryApi';
import { useToast } from '../../context/ToastContext';
import type { Expense, Category, CreateExpensePayload, PaymentMethod } from '../../types';
import { Navbar } from '../../components/Navbar/Navbar';
import { PaymentMethodBadge } from '../../components/PaymentMethodBadge/PaymentMethodBadge';
import { ExpenseFormModal } from '../../components/ExpenseModal/ExpenseFormModal';
import { ConfirmationModal } from '../../components/ConfirmationModal/ConfirmationModal';
import { EmptyState } from '../../components/EmptyState/EmptyState';
import { TableSkeleton } from '../../components/LoadingSkeleton/LoadingSkeleton';
import styles from './ExpensesPage.module.css';

export const ExpensesPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const filters = useAppSelector((state) => state.expenseFilters);
  const { showToast } = useToast();

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [deletingExpense, setDeletingExpense] = useState<Expense | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch categories once
  useEffect(() => {
    categoryApi
      .getCategories()
      .then((res) => setCategories(res.categories))
      .catch(() => showToast('Could not load categories list.', 'error'));
  }, [showToast]);

  // Fetch expenses using Redux filter state
  const fetchExpenses = useCallback(async () => {
    try {
      setLoading(true);
      const res = await expenseApi.getExpenses({
        search: filters.search || undefined,
        category: filters.category || undefined,
        paymentMethod: filters.paymentMethod || undefined,
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
        page: filters.page,
        pageSize: filters.pageSize,
      });
      setExpenses(res.expenses);
      setPagination(res.pagination);
    } catch (err: unknown) {
      let msg = 'Failed to fetch expenses.';
      if (typeof err === 'object' && err !== null && 'response' in err) {
        const resp = (err as { response?: { data?: { message?: string } } }).response;
        if (resp?.data?.message) msg = resp.data.message;
      }
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  }, [filters, showToast]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  // Create and edit handlera
  const handleSaveExpense = async (payload: CreateExpensePayload) => {
    try {
      setIsSubmitting(true);
      if (editingExpense) {
        await expenseApi.updateExpense(editingExpense._id, payload);
        showToast('Expense updated successfully!', 'success');
      } else {
        await expenseApi.createExpense(payload);
        showToast('Expense created successfully!', 'success');
      }
      await fetchExpenses();
    } catch (err: unknown) {
      let msg = 'Failed to save expense.';
      if (typeof err === 'object' && err !== null && 'response' in err) {
        const resp = (err as { response?: { data?: { message?: string } } }).response;
        if (resp?.data?.message) msg = resp.data.message;
      }
      showToast(msg, 'error');
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Delete
  const handleDeleteConfirm = async () => {
    if (!deletingExpense) return;
    try {
      setIsDeleting(true);
      await expenseApi.deleteExpense(deletingExpense._id);
      showToast('Expense deleted successfully.', 'info');
      setDeletingExpense(null);
      await fetchExpenses();
    } catch (err: unknown) {
      let msg = 'Failed to delete expense.';
      if (typeof err === 'object' && err !== null && 'response' in err) {
        const resp = (err as { response?: { data?: { message?: string } } }).response;
        if (resp?.data?.message) msg = resp.data.message;
      }
      showToast(msg, 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const openCreateModal = () => {
    setEditingExpense(null);
    setIsModalOpen(true);
  };

  const openEditModal = (expense: Expense) => {
    setEditingExpense(expense);
    setIsModalOpen(true);
  };

  const hasActiveFilters = Boolean(
    filters.search ||
    filters.category ||
    filters.paymentMethod ||
    filters.startDate ||
    filters.endDate ||
    filters.sortBy !== 'date' ||
    filters.sortOrder !== 'desc'
  );

  return (
    <div className={styles.wrapper}>
      <Navbar />

      <main className={styles.mainContent}>
        {/* Page Header */}
        <section className={styles.pageHeader}>
          <div>
            <h1 className={styles.title}>All Expenses</h1>
            <p className={styles.subtitle}>
              Search, filter, and manage your personal spending records
            </p>
          </div>
          <button onClick={openCreateModal} className={styles.addBtn}>
            <span className={styles.plusIcon}>+</span>
            <span>Record Expense</span>
          </button>
        </section>

        {/* Filter Controls */}
        <section className={styles.filterCard}>
          <div className={styles.searchRow}>
            {/* Search Input */}
            <div className={styles.searchBox}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.searchIcon}>
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Search by expense title..."
                value={filters.search}
                onChange={(e) => dispatch(setSearch(e.target.value))}
                className={styles.searchInput}
              />
              {filters.search && (
                <button
                  onClick={() => dispatch(setSearch(''))}
                  className={styles.clearSearchBtn}
                  aria-label="Clear search"
                >
                  ×
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div className={styles.filterGroup}>
              <label htmlFor="filter-category" className={styles.filterLabel}>Category</label>
              <select
                id="filter-category"
                value={filters.category}
                onChange={(e) => dispatch(setCategory(e.target.value))}
                className={styles.select}
              >
                <option value="">All Categories</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Payment Method Filter */}
            <div className={styles.filterGroup}>
              <label htmlFor="filter-payment" className={styles.filterLabel}>Payment Method</label>
              <select
                id="filter-payment"
                value={filters.paymentMethod}
                onChange={(e) => dispatch(setPaymentMethod(e.target.value as PaymentMethod | ''))}
                className={styles.select}
              >
                <option value="">All Methods</option>
                <option value="card">Card</option>
                <option value="cash">Cash</option>
                <option value="mobile_money">Mobile Money</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className={styles.advancedRow}>
            {/* Date Range */}
            <div className={styles.dateRangeGroup}>
              <div className={styles.filterGroup}>
                <label htmlFor="filter-start-date" className={styles.filterLabel}>From Date</label>
                <input
                  id="filter-start-date"
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => dispatch(setStartDate(e.target.value))}
                  className={styles.dateInput}
                />
              </div>
              <div className={styles.filterGroup}>
                <label htmlFor="filter-end-date" className={styles.filterLabel}>To Date</label>
                <input
                  id="filter-end-date"
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => dispatch(setEndDate(e.target.value))}
                  className={styles.dateInput}
                />
              </div>
            </div>

            {/* Sorting */}
            <div className={styles.sortGroup}>
              <div className={styles.filterGroup}>
                <label htmlFor="filter-sort-by" className={styles.filterLabel}>Sort By</label>
                <select
                  id="filter-sort-by"
                  value={filters.sortBy}
                  onChange={(e) => dispatch(setSortBy(e.target.value as 'date' | 'amount'))}
                  className={styles.select}
                >
                  <option value="date">Date</option>
                  <option value="amount">Amount</option>
                </select>
              </div>

              <div className={styles.filterGroup}>
                <label htmlFor="filter-sort-order" className={styles.filterLabel}>Order</label>
                <select
                  id="filter-sort-order"
                  value={filters.sortOrder}
                  onChange={(e) => dispatch(setSortOrder(e.target.value as 'asc' | 'desc'))}
                  className={styles.select}
                >
                  <option value="desc">Descending (High to Low)</option>
                  <option value="asc">Ascending (Low to High)</option>
                </select>
              </div>
            </div>

            {/* Reset Button */}
            {hasActiveFilters && (
              <button
                onClick={() => dispatch(resetFilters())}
                className={styles.resetBtn}
                title="Reset all filters to defaults"
              >
                Reset Filters
              </button>
            )}
          </div>
        </section>

        {/* Expenses List table */}
        <section className={styles.listSection}>
          {loading ? (
            <TableSkeleton rows={6} />
          ) : expenses.length === 0 ? (
            <EmptyState
              title="No expenses found"
              description={
                hasActiveFilters
                  ? 'No expenses matched your filter criteria. Try broadening your search or resetting filters.'
                  : "You haven't recorded any expenses yet. Click below to add your first expense."
              }
              actionText={hasActiveFilters ? 'Clear Filters' : 'Record an Expense'}
              onAction={hasActiveFilters ? () => dispatch(resetFilters()) : openCreateModal}
            />
          ) : (
            <div className={styles.tableCard}>
              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Title & Notes</th>
                      <th>Category</th>
                      <th>Payment Method</th>
                      <th>Date</th>
                      <th>Amount</th>
                      <th className={styles.actionsTh}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {expenses.map((expense) => (
                      <tr key={expense._id} className={styles.tableRow}>
                        <td className={styles.titleTd}>
                          <span className={styles.expenseTitle}>{expense.title}</span>
                          {expense.notes && (
                            <span className={styles.expenseNotes} title={expense.notes}>
                              {expense.notes}
                            </span>
                          )}
                        </td>
                        <td>
                          <span className={styles.categoryBadge}>
                            {expense.category?.name || 'Uncategorized'}
                          </span>
                        </td>
                        <td>
                          <PaymentMethodBadge method={expense.paymentMethod} />
                        </td>
                        <td className={styles.dateTd}>
                          {new Date(expense.date).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </td>
                        <td className={styles.amountTd}>
                          ${expense.amount.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </td>
                        <td className={styles.actionsTd}>
                          <button
                            onClick={() => openEditModal(expense)}
                            className={styles.editBtn}
                            title="Edit expense"
                            aria-label={`Edit ${expense.title}`}
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => setDeletingExpense(expense)}
                            className={styles.deleteBtn}
                            title="Delete expense"
                            aria-label={`Delete ${expense.title}`}
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination Bar */}
              <div className={styles.paginationBar}>
                <span className={styles.paginationInfo}>
                  Showing {(pagination.page - 1) * pagination.pageSize + 1} to{' '}
                  {Math.min(pagination.page * pagination.pageSize, pagination.total)} of{' '}
                  {pagination.total} expenses
                </span>

                <div className={styles.pageControls}>
                  <button
                    disabled={pagination.page <= 1}
                    onClick={() => dispatch(setPage(pagination.page - 1))}
                    className={styles.pageBtn}
                    aria-label="Previous page"
                  >
                    ‹ Previous
                  </button>

                  <span className={styles.pageNumber}>
                    Page {pagination.page} of {pagination.totalPages}
                  </span>

                  <button
                    disabled={pagination.page >= pagination.totalPages}
                    onClick={() => dispatch(setPage(pagination.page + 1))}
                    className={styles.pageBtn}
                    aria-label="Next page"
                  >
                    Next ›
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>

      {/* Create / Edit Modal */}
      <ExpenseFormModal
        isOpen={isModalOpen}
        initialData={editingExpense}
        categories={categories}
        isLoading={isSubmitting}
        onSubmit={handleSaveExpense}
        onClose={() => {
          setIsModalOpen(false);
          setEditingExpense(null);
        }}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!deletingExpense}
        title="Delete Expense"
        message={`Are you sure you want to permanently delete "${deletingExpense?.title}" ($${deletingExpense?.amount.toFixed(2)})? This action cannot be undone.`}
        confirmLabel="Delete"
        isDangerous
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingExpense(null)}
      />
    </div>
  );
};

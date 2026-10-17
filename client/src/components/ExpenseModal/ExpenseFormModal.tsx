import React, { useState, useEffect } from 'react';
import type { Category, Expense, PaymentMethod, CreateExpensePayload } from '../../types';
import styles from './ExpenseFormModal.module.css';

interface ExpenseFormModalProps {
  isOpen: boolean;
  initialData?: Expense | null;
  categories: Category[];
  isLoading?: boolean;
  onSubmit: (payload: CreateExpensePayload) => Promise<void>;
  onClose: () => void;
}

export const ExpenseFormModal: React.FC<ExpenseFormModalProps> = ({
  isOpen,
  initialData,
  categories,
  isLoading = false,
  onSubmit,
  onClose,
}) => {
  const getTodayString = () => new Date().toISOString().slice(0, 10);

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(getTodayString());
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [categoryId, setCategoryId] = useState('');
  const [notes, setNotes] = useState('');
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setAmount(String(initialData.amount));
      setDate(new Date(initialData.date).toISOString().slice(0, 10));
      setPaymentMethod(initialData.paymentMethod);
      setCategoryId(initialData.category?._id || '');
      setNotes(initialData.notes || '');
    } else {
      setTitle('');
      setAmount('');
      setDate(getTodayString());
      setPaymentMethod('card');
      setCategoryId('');
      setNotes('');
    }
    setValidationError('');
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!title.trim()) {
      setValidationError('Please enter an expense title.');
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setValidationError('Amount must be a positive number greater than 0.');
      return;
    }

    if (!date) {
      setValidationError('Please select a valid date.');
      return;
    }

    const payload: CreateExpensePayload = {
      title: title.trim(),
      amount: numAmount,
      date: new Date(date).toISOString(),
      paymentMethod,
      notes: notes.trim() ? notes.trim() : undefined,
      categoryId: categoryId ? categoryId : undefined,
    };

    try {
      await onSubmit(payload);
      onClose();
    } catch {
      // Error handling 
    }
  };

  return (
    <div className={styles.backdrop} onClick={() => !isLoading && onClose()}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className={styles.header}>
          <div className={styles.headerTitleGroup}>
            <div className={styles.iconCircle}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <line x1="12" y1="8" x2="12" y2="16" />
                <line x1="8" y1="12" x2="16" y2="12" />
              </svg>
            </div>
            <div>
              <h2 className={styles.title}>{initialData ? 'Edit Expense' : 'Add New Expense'}</h2>
              <p className={styles.subtitle}>
                {initialData ? 'Update details of your existing expense' : 'Record a new transaction to track your spending'}
              </p>
            </div>
          </div>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            disabled={isLoading}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        {validationError && (
          <div className={styles.errorAlert} role="alert">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{validationError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="expense-title" className={styles.label}>
              Title <span className={styles.required}>*</span>
            </label>
            <input
              id="expense-title"
              type="text"
              className={styles.input}
              placeholder="e.g. Grocery shopping, Spotify, Train ticket"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          <div className={styles.row}>
            <div className={styles.formGroup}>
              <label htmlFor="expense-amount" className={styles.label}>
                Amount ($) <span className={styles.required}>*</span>
              </label>
              <div className={styles.amountInputWrap}>
                <span className={styles.currencyPrefix}>$</span>
                <input
                  id="expense-amount"
                  type="number"
                  step="0.01"
                  min="0.01"
                  className={`${styles.input} ${styles.amountInput}`}
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="expense-date" className={styles.label}>
                Date <span className={styles.required}>*</span>
              </label>
              <input
                id="expense-date"
                type="date"
                className={styles.input}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.formGroup}>
              <label htmlFor="expense-payment-method" className={styles.label}>
                Payment Method <span className={styles.required}>*</span>
              </label>
              <select
                id="expense-payment-method"
                className={styles.select}
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                disabled={isLoading}
              >
                <option value="card">Card</option>
                <option value="cash">Cash</option>
                <option value="mobile_money">Mobile Money</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="expense-category" className={styles.label}>
                Category
              </label>
              <select
                id="expense-category"
                className={styles.select}
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                disabled={isLoading}
              >
                <option value="">Default (Uncategorized)</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name} {c.isDefault ? '(Default)' : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="expense-notes" className={styles.label}>
              Notes <span className={styles.optional}>(Optional)</span>
            </label>
            <textarea
              id="expense-notes"
              className={styles.textarea}
              placeholder="Add any additional context or remarks..."
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : initialData ? 'Save Changes' : 'Record Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import type { Category, CategoryPayload } from '../../types';
import styles from './CategoryModal.module.css';

interface CategoryModalProps {
  isOpen: boolean;
  initialData?: Category | null;
  isLoading?: boolean;
  onSubmit: (payload: CategoryPayload) => Promise<void>;
  onClose: () => void;
}

export const CategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  initialData,
  isLoading = false,
  onSubmit,
  onClose,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setDescription(initialData.description || '');
    } else {
      setName('');
      setDescription('');
    }
    setValidationError('');
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!name.trim()) {
      setValidationError('Category name is required.');
      return;
    }

    try {
      await onSubmit({
        name: name.trim(),
        description: description.trim() ? description.trim() : undefined,
      });
      onClose();
    } catch {
      // Handle submission error
    }
  };

  return (
    <div className={styles.backdrop} onClick={() => !isLoading && onClose()}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className={styles.header}>
          <div className={styles.headerTitleGroup}>
            <div className={styles.iconCircle}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 9h16M4 15h16M10 3L8 21M16 3l-2 18" />
              </svg>
            </div>
            <div>
              <h2 className={styles.title}>{initialData ? 'Edit Category' : 'Create Category'}</h2>
              <p className={styles.subtitle}>
                {initialData ? 'Modify category naming or description' : 'Organize expenses into custom spending groups'}
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
            <label htmlFor="category-name" className={styles.label}>
              Category Name <span className={styles.required}>*</span>
            </label>
            <input
              id="category-name"
              type="text"
              className={styles.input}
              placeholder="e.g. Housing, Dining, Healthcare, Education"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="category-desc" className={styles.label}>
              Description <span className={styles.optional}>(Optional)</span>
            </label>
            <textarea
              id="category-desc"
              className={styles.textarea}
              placeholder="Short description of what expenses belong in this category..."
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
              {isLoading ? 'Saving...' : initialData ? 'Update Category' : 'Create Category'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

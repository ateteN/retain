export type UserRole = 'user' | 'admin';

// /api/auth/login:
export interface AuthUser {
  id: string; 
  name: string;
  email: string;
  role: UserRole;
}

export interface AuthResponse {
  user: AuthUser;
  token: string;
}

// category endpoints
export interface Category {
  _id: string; // Note: "_id" here (raw Mongo field)
  name: string;
  description?: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryPayload {
  name: string;
  description?: string;
}

export type PaymentMethod = 'cash' | 'card' | 'mobile_money' | 'bank_transfer' | 'other';

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  cash: 'Cash',
  card: 'Card',
  mobile_money: 'Mobile Money',
  bank_transfer: 'Bank Transfer',
  other: 'Other',
};

export interface ExpenseUserPopulated {
  _id: string;
  name: string;
  email: string;
}

// expense endpoints
export interface Expense {
  _id: string;
  title: string;
  amount: number;
  date: string; 
  paymentMethod: PaymentMethod;
  notes?: string;
  user: string | ExpenseUserPopulated;
  category: Category;
  createdAt: string;
  updatedAt: string;
}

export interface CreateExpensePayload {
  title: string;
  amount: number;
  date: string;
  paymentMethod: PaymentMethod;
  notes?: string;
  categoryId?: string;
}

export interface UpdateExpensePayload {
  title?: string;
  amount?: number;
  date?: string;
  paymentMethod?: PaymentMethod;
  notes?: string;
  categoryId?: string;
}

export interface Pagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface ExpenseListResponse {
  expenses: Expense[];
  pagination: Pagination;
}

export interface ExpenseQueryFilters {
  search?: string;
  category?: string;
  paymentMethod?: PaymentMethod | '';
  startDate?: string;
  endDate?: string;
  sortBy?: 'date' | 'amount';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}

// Returned from budget endpoints:
export interface Budget {
  _id: string;
  user: string;
  month: string; // ISO date, always the 1st of the month
  amount: number;
  createdAt: string;
  updatedAt: string;
}

export type BudgetStatus = 'WITHIN_BUDGET' | 'APPROACHING_BUDGET' | 'OVER_BUDGET' | 'NO_BUDGET_SET';

export interface BudgetStatusResponse {
  month: string;
  budgetAmount: number | null;
  totalSpent: number;
  remaining: number | null;
  status: BudgetStatus;
}

export interface SpendingByCategoryItem {
  categoryName: string;
  total: number;
}

// User dashboard
export interface DashboardData {
  month: string;
  totalSpent: number;
  budgetAmount: number | null;
  remainingBudget: number | null;
  highestExpense: Expense | null;
  spendingByCategory: SpendingByCategoryItem[];
  recentExpenses: Expense[];
}

// Admin insights
export interface AdminCategoryUsage {
  categoryId: string;
  categoryName: string;
  count: number;
}

export interface AdminCategorySpending {
  categoryId: string;
  categoryName: string;
  total: number;
}

export interface AdminRecentUser {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export interface AdminInsights {
  totalUsers: number;
  totalExpenses: number;
  totalExpenseValue: number;
  expensesThisMonth: number;
  spendingByCategory: AdminCategorySpending[];
  mostUsedCategories: AdminCategoryUsage[];
  leastUsedCategories: AdminCategoryUsage[];
  recentExpenses: Expense[];
  recentUsers: AdminRecentUser[];
}

export interface ApiErrorResponse {
  message: string;
}

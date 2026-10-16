import apiClient from './client';
import type {
  Expense,
  ExpenseListResponse,
  ExpenseQueryFilters,
  CreateExpensePayload,
  UpdateExpensePayload,
} from '../types';

export const expenseApi = {
  async getExpenses(filters?: ExpenseQueryFilters): Promise<ExpenseListResponse> {
    const params = new URLSearchParams();
    if (filters) {
      if (filters.search) params.append('search', filters.search);
      if (filters.category) params.append('category', filters.category);
      if (filters.paymentMethod) params.append('paymentMethod', filters.paymentMethod);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
      if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
      if (filters.page) params.append('page', String(filters.page));
      if (filters.pageSize) params.append('pageSize', String(filters.pageSize));
    }

    const response = await apiClient.get<ExpenseListResponse>('/expenses', { params });
    return response.data;
  },

  async getExpense(id: string): Promise<{ expense: Expense }> {
    const response = await apiClient.get<{ expense: Expense }>(`/expenses/${id}`);
    return response.data;
  },

  async createExpense(data: CreateExpensePayload): Promise<{ expense: Expense }> {
    const response = await apiClient.post<{ expense: Expense }>('/expenses', data);
    return response.data;
  },

  async updateExpense(id: string, data: UpdateExpensePayload): Promise<{ expense: Expense }> {
    const response = await apiClient.put<{ expense: Expense }>(`/expenses/${id}`, data);
    return response.data;
  },

  async deleteExpense(id: string): Promise<{ message: string }> {
    const response = await apiClient.delete<{ message: string }>(`/expenses/${id}`);
    return response.data;
  },
};

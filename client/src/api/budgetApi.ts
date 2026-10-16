import apiClient from './client';
import type { Budget, BudgetStatusResponse } from '../types';

export interface SetBudgetPayload {
  amount: number;
  month?: string; 
}

export const budgetApi = {
  async setBudget(data: SetBudgetPayload): Promise<{ budget: Budget }> {
    const response = await apiClient.put<{ budget: Budget }>('/budgets', data);
    return response.data;
  },

  async getBudgetStatus(month?: string): Promise<BudgetStatusResponse> {
    const params = month ? { month } : {};
    const response = await apiClient.get<BudgetStatusResponse>('/budgets/status', { params });
    return response.data;
  },
};

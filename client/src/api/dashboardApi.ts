import apiClient from './client';
import type { DashboardData } from '../types';

export const dashboardApi = {
  async getDashboard(month?: string): Promise<DashboardData> {
    const params = month ? { month } : {};
    const response = await apiClient.get<DashboardData>('/dashboard', { params });
    return response.data;
  },
};

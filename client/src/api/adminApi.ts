import apiClient from './client';
import type { AdminInsights } from '../types';

export const adminApi = {
  async getAdminInsights(): Promise<AdminInsights> {
    const response = await apiClient.get<AdminInsights>('/admin/insights');
    return response.data;
  },
};

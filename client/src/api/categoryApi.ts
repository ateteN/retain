import apiClient from './client';
import type { Category, CategoryPayload } from '../types';

export const categoryApi = {
  async getCategories(): Promise<{ categories: Category[] }> {
    const response = await apiClient.get<{ categories: Category[] }>('/categories');
    return response.data;
  },

  async createCategory(data: CategoryPayload): Promise<{ category: Category }> {
    const response = await apiClient.post<{ category: Category }>('/categories', data);
    return response.data;
  },

  async updateCategory(id: string, data: Partial<CategoryPayload>): Promise<{ category: Category }> {
    const response = await apiClient.put<{ category: Category }>(`/categories/${id}`, data);
    return response.data;
  },

  async deleteCategory(id: string): Promise<{ message: string }> {
    const response = await apiClient.delete<{ message: string }>(`/categories/${id}`);
    return response.data;
  },
};

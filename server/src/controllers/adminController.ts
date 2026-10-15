import { Request, Response } from 'express';
import User from '../models/User';
import Expense from '../models/Expense';
import Category from '../models/Category';

export async function getAdminInsights(_req: Request, res: Response): Promise<void> {
  const now = new Date();
  const startOfMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  const startOfNextMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1));

  const [totalUsers, totalExpenses, allExpenses, expensesThisMonth, recentExpenses, recentUsers, categories] =
    await Promise.all([
      User.countDocuments(),
      Expense.countDocuments(),
      Expense.find().populate('category'),
      Expense.countDocuments({ date: { $gte: startOfMonth, $lt: startOfNextMonth } }),
      Expense.find().sort({ createdAt: -1 }).limit(5).populate('category').populate('user', 'name email'),
      User.find().sort({ createdAt: -1 }).limit(5).select('name email role createdAt'),
      Category.find(),
    ]);

  const totalExpenseValue = allExpenses.reduce((sum, e) => sum + e.amount, 0);

  // Spending + usage count per category, in one pass over allExpenses
  const spendMap = new Map<string, number>();
  const countMap = new Map<string, number>();
  for (const e of allExpenses) {
    const catId = (e.category as any)?._id?.toString() ?? 'unknown';
    spendMap.set(catId, (spendMap.get(catId) ?? 0) + e.amount);
    countMap.set(catId, (countMap.get(catId) ?? 0) + 1);
  }

  const categoryNameById = new Map(categories.map((c) => [c._id.toString(), c.name]));

  const spendingByCategory = Array.from(spendMap.entries())
    .map(([categoryId, total]) => ({ categoryId, categoryName: categoryNameById.get(categoryId) ?? 'Unknown', total }))
    .sort((a, b) => b.total - a.total);

  const usageByCategory = Array.from(countMap.entries())
    .map(([categoryId, count]) => ({ categoryId, categoryName: categoryNameById.get(categoryId) ?? 'Unknown', count }));

  const mostUsedCategories = [...usageByCategory].sort((a, b) => b.count - a.count).slice(0, 5);
  const leastUsedCategories = [...usageByCategory].sort((a, b) => a.count - b.count).slice(0, 5);

  res.status(200).json({
    totalUsers,
    totalExpenses,
    totalExpenseValue,
    expensesThisMonth,
    spendingByCategory,
    mostUsedCategories,
    leastUsedCategories,
    recentExpenses,
    recentUsers,
  });
}
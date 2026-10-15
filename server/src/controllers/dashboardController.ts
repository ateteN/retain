import { Request, Response } from 'express';
import Expense from '../models/Expense';
import Budget from '../models/Budget';
import { normalizeToMonth, startOfNextMonth } from '../utils/date';

export async function getUserDashboard(req: Request, res: Response): Promise<void> {
  const userId = req.user!.userId;
  const month = normalizeToMonth(req.query.month as string | undefined);
  const nextMonth = startOfNextMonth(month);

  const [budget, monthExpenses, highestExpense, recentExpenses] = await Promise.all([
    Budget.findOne({ user: userId, month }),
    Expense.find({ user: userId, date: { $gte: month, $lt: nextMonth } }).populate('category'),
    Expense.findOne({ user: userId, date: { $gte: month, $lt: nextMonth } }).sort({ amount: -1 }).populate('category'),
    Expense.find({ user: userId }).sort({ date: -1 }).limit(5).populate('category'),
  ]);

  const totalSpent = monthExpenses.reduce((sum, e) => sum + e.amount, 0);
  const budgetAmount = budget?.amount ?? null;
  const remainingBudget = budgetAmount !== null ? budgetAmount - totalSpent : null;

  // Group spending by category name
  const byCategory = new Map<string, number>();
  for (const e of monthExpenses) {
    const catName = (e.category as any)?.name ?? 'Unknown';
    byCategory.set(catName, (byCategory.get(catName) ?? 0) + e.amount);
  }
  const spendingByCategory = Array.from(byCategory.entries())
    .map(([categoryName, total]) => ({ categoryName, total }))
    .sort((a, b) => b.total - a.total);

  res.status(200).json({
    month: month.toISOString().slice(0, 10),
    totalSpent,
    budgetAmount,
    remainingBudget,
    highestExpense,
    spendingByCategory,
    recentExpenses,
  });
}
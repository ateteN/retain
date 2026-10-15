import { Request, Response } from 'express';
import Budget from '../models/Budget';
import Expense from '../models/Expense';
import { normalizeToMonth, startOfNextMonth } from '../utils/date';

const APPROACHING_THRESHOLD = 0.9;

export async function setBudget(req: Request, res: Response): Promise<void> {
  const { amount, month: monthInput } = req.body;
  if (!amount || amount <= 0) {
    res.status(400).json({ message: 'Budget amount must be a positive number.' });
    return;
  }

  const month = normalizeToMonth(monthInput);
  const userId = req.user!.userId;

  const budget = await Budget.findOneAndUpdate(
    { user: userId, month },
    { amount },
    { upsert: true, new: true }
  );

  res.status(200).json({ budget });
}

export async function getBudgetStatus(req: Request, res: Response): Promise<void> {
  const userId = req.user!.userId;
  const month = normalizeToMonth(req.query.month as string | undefined);
  const nextMonth = startOfNextMonth(month);

  const [budget, expenses] = await Promise.all([
    Budget.findOne({ user: userId, month }),
    Expense.find({ user: userId, date: { $gte: month, $lt: nextMonth } }),
  ]);

  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const budgetAmount = budget?.amount ?? null;

  let status = 'NO_BUDGET_SET';
  let remaining: number | null = null;

  if (budgetAmount !== null) {
    remaining = budgetAmount - totalSpent;
    if (totalSpent > budgetAmount) status = 'OVER_BUDGET';
    else if (totalSpent >= budgetAmount * APPROACHING_THRESHOLD) status = 'APPROACHING_BUDGET';
    else status = 'WITHIN_BUDGET';
  }

  res.status(200).json({
    month: month.toISOString().slice(0, 10),
    budgetAmount,
    totalSpent,
    remaining,
    status,
  });
}
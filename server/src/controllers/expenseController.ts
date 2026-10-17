import { Request, Response } from 'express';
import Expense, { PaymentMethod } from '../models/Expense';
import { getOrCreateUncategorized } from './categoryController';

interface ExpenseFilter {
  user: string;
  title?: { $regex: string; $options: string };
  category?: string;
  paymentMethod?: PaymentMethod;
  date?: { $gte?: Date; $lte?: Date };
}

export async function listExpenses(req: Request, res: Response): Promise<void> {
  const userId = req.user!.userId;
  const { search, category, paymentMethod, startDate, endDate, sortBy = 'date', sortOrder = 'desc', page = '1', pageSize = '10' } = req.query as Record<string, string>;

  const filter: ExpenseFilter = { user: userId };
  if (search) filter.title = { $regex: search, $options: 'i' };
  if (category) filter.category = category;
  if (paymentMethod) filter.paymentMethod = paymentMethod as PaymentMethod;
  if (startDate || endDate) {
    filter.date = {};
    if (startDate) filter.date.$gte = new Date(startDate);
    if (endDate) {
      const endOfDay = new Date(endDate);
      endOfDay.setUTCHours(23, 59, 59, 999);
      filter.date.$lte = endOfDay;
    }
  }

  const sortField = sortBy === 'amount' ? 'amount' : 'date';
  const sortDir = sortOrder === 'asc' ? 1 : -1;
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const sizeNum = Math.min(100, Math.max(1, parseInt(pageSize, 10) || 10));

  const [expenses, total] = await Promise.all([
    Expense.find(filter)
      .populate('category')
      .sort({ [sortField]: sortDir })
      .skip((pageNum - 1) * sizeNum)
      .limit(sizeNum),
    Expense.countDocuments(filter),
  ]);

  res.status(200).json({
    expenses,
    pagination: { page: pageNum, pageSize: sizeNum, total, totalPages: Math.ceil(total / sizeNum) || 1 },
  });
}

export async function getExpense(req: Request, res: Response): Promise<void> {
  const expense = await Expense.findOne({ _id: req.params.id, user: req.user!.userId }).populate('category');
  if (!expense) {
    res.status(404).json({ message: 'Expense not found.' });
    return;
  }
  res.status(200).json({ expense });
}

export async function createExpense(req: Request, res: Response): Promise<void> {
  const { title, amount, date, paymentMethod, notes, categoryId } = req.body;

  if (!title || !amount || !date || !paymentMethod) {
    res.status(400).json({ message: 'title, amount, date, and paymentMethod are required.' });
    return;
  }

  if (typeof amount !== 'number' || amount <= 0) {
    res.status(400).json({ message: 'Amount must be a positive number.' });
    return;
  }

  const resolvedCategory = categoryId || (await getOrCreateUncategorized())._id;

  const expense = await Expense.create({
    title, amount, date: new Date(date), paymentMethod, notes,
    user: req.user!.userId,
    category: resolvedCategory,
  });
  await expense.populate('category');

  res.status(201).json({ expense });
}

export async function updateExpense(req: Request, res: Response): Promise<void> {
  const expense = await Expense.findOne({ _id: req.params.id, user: req.user!.userId });
  if (!expense) {
    res.status(404).json({ message: 'Expense not found.' });
    return;
  }

  const { title, amount, date, paymentMethod, notes, categoryId } = req.body;
  if (title !== undefined) expense.title = title;
  if (amount !== undefined) {
    if (typeof amount !== 'number' || amount <= 0) {
      res.status(400).json({ message: 'Amount must be a positive number.' });
      return;
    }
    expense.amount = amount;
  }
  if (date !== undefined) expense.date = new Date(date);
  if (paymentMethod !== undefined) expense.paymentMethod = paymentMethod;
  if (notes !== undefined) expense.notes = notes;
  if (categoryId !== undefined) expense.category = categoryId;

  await expense.save();
  await expense.populate('category');

  res.status(200).json({ expense });
}

export async function deleteExpense(req: Request, res: Response): Promise<void> {
  const expense = await Expense.findOneAndDelete({ _id: req.params.id, user: req.user!.userId });
  if (!expense) {
    res.status(404).json({ message: 'Expense not found.' });
    return;
  }
  res.status(200).json({ message: 'Expense deleted.' });
}
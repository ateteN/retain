import { Request, Response } from 'express';
import Category from '../models/Category';
import Expense from '../models/Expense';

const UNCATEGORIZED_NAME = 'Uncategorized';

export async function getOrCreateUncategorized() {
  let cat = await Category.findOne({ isDefault: true });
  if (!cat) {
    cat = await Category.create({ name: UNCATEGORIZED_NAME, isDefault: true, description: 'Default category.' });
  }
  return cat;
}

export async function listCategories(_req: Request, res: Response): Promise<void> {
  const categories = await Category.find().sort({ name: 1 });
  res.status(200).json({ categories });
}

export async function createCategory(req: Request, res: Response): Promise<void> {
  const { name, description } = req.body;
  if (!name) {
    res.status(400).json({ message: 'Category name is required.' });
    return;
  }
  const existing = await Category.findOne({ name });
  if (existing) {
    res.status(409).json({ message: 'A category with this name already exists.' });
    return;
  }
  const category = await Category.create({ name, description });
  res.status(201).json({ category });
}

export async function updateCategory(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const { name, description } = req.body;

  const category = await Category.findById(id);
  if (!category) {
    res.status(404).json({ message: 'Category not found.' });
    return;
  }
  if (category.isDefault) {
    res.status(400).json({ message: 'The default Uncategorized category cannot be renamed.' });
    return;
  }

  if (name) category.name = name;
  if (description !== undefined) category.description = description;
  await category.save();

  res.status(200).json({ category });
}

export async function deleteCategory(req: Request, res: Response): Promise<void> {
  const { id } = req.params;

  const category = await Category.findById(id);
  if (!category) {
    res.status(404).json({ message: 'Category not found.' });
    return;
  }
  if (category.isDefault) {
    res.status(400).json({ message: 'The default Uncategorized category cannot be deleted.' });
    return;
  }

  const fallback = await getOrCreateUncategorized();
  await Expense.updateMany({ category: id }, { category: fallback._id });
  await category.deleteOne();

  res.status(200).json({ message: 'Category deleted. Its expenses were moved to Uncategorized.' });
}
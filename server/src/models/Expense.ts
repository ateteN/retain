import mongoose, { Schema, Document, Types } from 'mongoose';

export type PaymentMethod = 'cash' | 'card' | 'mobile_money' | 'bank_transfer' | 'other';

export interface IExpense extends Document {
  title: string;
  amount: number;
  date: Date;
  paymentMethod: PaymentMethod;
  notes?: string;
  user: Types.ObjectId;
  category: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const expenseSchema = new Schema<IExpense>(
  {
    title: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 0.01 },
    date: { type: Date, required: true },
    paymentMethod: {
      type: String,
      enum: ['cash', 'card', 'mobile_money', 'bank_transfer', 'other'],
      required: true,
    },
    notes: { type: String, trim: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true, index: true },
  },
  { timestamps: true }
);

export default mongoose.model<IExpense>('Expense', expenseSchema);
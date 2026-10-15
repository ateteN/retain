import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IBudget extends Document {
  user: Types.ObjectId;
  month: Date;
  amount: number;
  createdAt: Date;
  updatedAt: Date;
}

const budgetSchema = new Schema<IBudget>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    month: { type: Date, required: true },
    amount: { type: Number, required: true, min: 0.01 },
  },
  { timestamps: true }
);

budgetSchema.index({ user: 1, month: 1 }, { unique: true });

export default mongoose.model<IBudget>('Budget', budgetSchema);
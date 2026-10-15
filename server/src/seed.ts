import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/User';
import Category from './models/Category';

async function main() {
  await mongoose.connect(process.env.MONGODB_URI as string);
  console.log('Connected for seeding...');

  const adminPasswordHash = await bcrypt.hash('AdminPass123!', 10);
  const admin = await User.findOneAndUpdate(
    { email: 'admin@retain.app' },
    { name: 'Retain Admin', email: 'admin@retain.app', passwordHash: adminPasswordHash, role: 'admin' },
    { upsert: true, new: true }
  );
  console.log(`Admin ready: ${admin.email} / AdminPass123!`);

  const uncategorized = await Category.findOneAndUpdate(
    { isDefault: true },
    { name: 'Uncategorized', isDefault: true, description: 'Default category for expenses without one.' },
    { upsert: true, new: true }
  );
  console.log(`Default category ready: ${uncategorized.name}`);

  await mongoose.disconnect();
  console.log('Seeding complete.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
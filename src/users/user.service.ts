import bcrypt from 'bcryptjs';
import { db } from '_helpers/db';
import { UserCreationAttributes } from 'users/user.model';

async function getAll(): Promise<any[]> {
  return await db.User.findAll();
}

async function getById(id: number): Promise<any> {
  const user = await db.User.findByPk(id);
  if (!user) throw new Error('User not found');
  return user;
}

async function create(params: UserCreationAttributes): Promise<void> {
  const existing = await db.User.findOne({ where: { email: params.email } } as any);
  if (existing) throw new Error(`Email "${params.email}" is already registered`);

  const user = new (db.User as any)();
  Object.assign(user, params);
  (user as any).passwordHash = await bcrypt.hash(params.passwordHash, 10);
  await user.save();
}

async function update(id: number, params: Partial<UserCreationAttributes>): Promise<void> {
  const user = await db.User.findByPk(id) as any;
  if (!user) throw new Error('User not found');

  const emailChanged = params.email && params.email !== user.email;
  if (emailChanged) {
    const existing = await db.User.findOne({ where: { email: params.email } } as any);
    if (existing) throw new Error(`Email "${params.email}" is already taken`);
  }

  if (params.passwordHash) {
    params.passwordHash = await bcrypt.hash(params.passwordHash, 10);
  }

  Object.assign(user, params);
  await user.save();
}

async function remove(id: number): Promise<void> {
  const user = await db.User.findByPk(id) as any;
  if (!user) throw new Error('User not found');
  await user.destroy();
}

export const userService = { getAll, getById, create, update, remove };
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '_helpers/db';
import { Role } from '_helpers/role';
const config = require('../../config.json');

async function register(params: any): Promise<void> {
  const existing = await db.User.findOne({
    where: { email: params.email }
  } as any);
  if (existing) throw new Error(`Email "${params.email}" is already registered`);

  const user = (db.User as any).build({
    firstName: params.firstName,
    lastName: params.lastName,
    email: params.email,
    role: Role.User,
    passwordHash: await bcrypt.hash(params.password, 10),
    verified: false
  });

  await user.save();
}

async function verifyEmail(email: string): Promise<void> {
  const user = await db.User.findOne({
    where: { email }
  } as any) as any;

  if (!user) throw new Error('User not found');
  user.verified = true;
  await user.save();
}

async function login(email: string, password: string): Promise<any> {
  const user = await (db.User as any).scope('withPassword').findOne({
    where: { email }
  });

  if (!user) throw new Error('Invalid credentials');
  if (!user.verified) throw new Error('Please verify your email first');

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) throw new Error('Invalid credentials');

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    config.secret,
    { expiresIn: '24h' }
  );

  return {
    token,
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role
    }
  };
}

async function getProfile(id: number): Promise<any> {
  const user = await db.User.findByPk(id);
  if (!user) throw new Error('User not found');
  return user;
}

export const authService = { register, verifyEmail, login, getProfile };
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { query } from './db';
import { cookies } from 'next/headers';

// Add password_hash column to users table if it doesn't exist
// This should be done via migration, but we'll check at runtime

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export interface AuthUser {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: 'user' | 'moderator' | 'admin';
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateToken(user: AuthUser): string {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email,
      role: user.role 
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export async function verifyToken(token: string): Promise<AuthUser | null> {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    return await getUserById(decoded.id);
  } catch (error) {
    return null;
  }
}

export async function getUserById(id: string): Promise<AuthUser | null> {
  return await query(async (sql) => {
    const [user] = await sql`
      SELECT id, email, full_name, avatar_url, role
      FROM users
      WHERE id = ${id}
    `;
    return user || null;
  });
}

export async function getUserByEmail(email: string): Promise<(AuthUser & { password_hash?: string }) | null> {
  return await query(async (sql) => {
    const [user] = await sql`
      SELECT id, email, full_name, avatar_url, role, password_hash
      FROM users
      WHERE email = ${email}
    `;
    return user || null;
  });
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;
    if (!token) return null;
    return await verifyToken(token);
  } catch (error) {
    return null;
  }
}

export async function createUser(userData: {
  email: string;
  password: string;
  full_name?: string;
}): Promise<AuthUser | null> {
  const passwordHash = await hashPassword(userData.password);
  
  return await query(async (sql) => {
    const [user] = await sql`
      INSERT INTO users (
        email,
        password_hash,
        full_name,
        role,
        created_at,
        updated_at
      ) VALUES (
        ${userData.email},
        ${passwordHash},
        ${userData.full_name || null},
        'user',
        NOW(),
        NOW()
      )
      RETURNING id, email, full_name, avatar_url, role
    `;
    return user || null;
  });
}

export async function login(email: string, password: string): Promise<{ user: AuthUser; token: string } | null> {
  const user = await getUserByEmail(email);
  if (!user || !user.password_hash) return null;
  
  const isValid = await verifyPassword(password, user.password_hash);
  if (!isValid) return null;

  const { password_hash, ...userWithoutPassword } = user;
  const token = generateToken(userWithoutPassword as AuthUser);
  
  return { user: userWithoutPassword as AuthUser, token };
}


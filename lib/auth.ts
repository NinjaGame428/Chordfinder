import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { query } from './db';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export interface AuthUser {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: 'user' | 'moderator' | 'admin';
}

// Ensure password_hash column exists
async function ensurePasswordHashColumn() {
  try {
    await query(async (sql) => {
      await sql`
        DO $$ 
        BEGIN
          IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'users' 
            AND column_name = 'password_hash'
          ) THEN
            ALTER TABLE users ADD COLUMN password_hash TEXT;
          END IF;
        END $$;
      `;
    });
  } catch (error) {
    console.error('Error ensuring password_hash column:', error);
  }
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
  try {
    return await query(async (sql) => {
      const result = await sql`
        SELECT id, email, full_name, avatar_url, role
        FROM users
        WHERE id = ${id}
        LIMIT 1
      `;
      const user = result[0] as any;
      return user ? {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        avatar_url: user.avatar_url,
        role: user.role
      } as AuthUser : null;
    });
  } catch (error) {
    console.error('Error getting user by ID:', error);
    return null;
  }
}

export async function getUserByEmail(email: string): Promise<(AuthUser & { password_hash?: string }) | null> {
  try {
    return await query(async (sql) => {
      const result = await sql`
        SELECT id, email, full_name, avatar_url, role, password_hash
        FROM users
        WHERE email = ${email}
        LIMIT 1
      `;
      const user = result[0] as any;
      return user ? {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        avatar_url: user.avatar_url,
        role: user.role,
        password_hash: user.password_hash
      } : null;
    });
  } catch (error) {
    console.error('Error getting user by email:', error);
    return null;
  }
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
  try {
    // Ensure password_hash column exists
    await ensurePasswordHashColumn();
    
    const passwordHash = await hashPassword(userData.password);
    
    return await query(async (sql) => {
      // Check if user already exists
      const existing = await sql`
        SELECT id FROM users WHERE email = ${userData.email} LIMIT 1
      `;
      
      if (existing && existing.length > 0) {
        throw new Error('User with this email already exists');
      }
      
      // Insert new user - let database generate UUID
      const result = await sql`
        INSERT INTO users (
          email,
          password_hash,
          full_name,
          role,
          created_at,
          updated_at
        ) VALUES (
          ${userData.email.toLowerCase().trim()},
          ${passwordHash},
          ${userData.full_name || null},
          'user',
          NOW(),
          NOW()
        )
        RETURNING id, email, full_name, avatar_url, role
      `;
      const user = result[0] as any;
      return user ? {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        avatar_url: user.avatar_url,
        role: user.role
      } as AuthUser : null;
    });
  } catch (error: any) {
    console.error('Error creating user:', error);
    throw error;
  }
}

export async function login(email: string, password: string): Promise<{ user: AuthUser; token: string } | null> {
  try {
    const user = await getUserByEmail(email.toLowerCase().trim());
    if (!user || !user.password_hash) {
      return null;
    }
    
    const isValid = await verifyPassword(password, user.password_hash);
    if (!isValid) {
      return null;
    }

    const { password_hash, ...userWithoutPassword } = user;
    const token = generateToken(userWithoutPassword as AuthUser);
    
    return { user: userWithoutPassword as AuthUser, token };
  } catch (error) {
    console.error('Login error:', error);
    return null;
  }
}

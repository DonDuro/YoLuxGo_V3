import bcrypt from "bcrypt";
import { adminUsers, type AdminUser, type InsertAdminUser } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

const SALT_ROUNDS = 12;

export interface AdminAuthService {
  createAdminUser(userData: Omit<InsertAdminUser, 'passwordHash'> & { password: string }): Promise<AdminUser>;
  authenticateAdmin(username: string, password: string): Promise<AdminUser | null>;
  getAdminByUsername(username: string): Promise<AdminUser | null>;
  getAdminById(id: string): Promise<AdminUser | null>;
}

export class DatabaseAdminAuth implements AdminAuthService {
  async createAdminUser(userData: Omit<InsertAdminUser, 'passwordHash'> & { password: string }): Promise<AdminUser> {
    const { password, ...adminData } = userData;
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    
    const [admin] = await db
      .insert(adminUsers)
      .values({
        ...adminData,
        passwordHash,
      })
      .returning();
    
    return admin;
  }

  async authenticateAdmin(username: string, password: string): Promise<AdminUser | null> {
    const [admin] = await db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.username, username));
    
    if (!admin || !admin.isActive) {
      return null;
    }

    const isValidPassword = await bcrypt.compare(password, admin.passwordHash);
    if (!isValidPassword) {
      return null;
    }

    return admin;
  }

  async getAdminByUsername(username: string): Promise<AdminUser | null> {
    const [admin] = await db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.username, username));
    
    return admin || null;
  }

  async getAdminById(id: string): Promise<AdminUser | null> {
    const [admin] = await db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.id, id));
    
    return admin || null;
  }
}

export const adminAuth = new DatabaseAdminAuth();
import { query } from '../config/database';
import { User } from '../types';

export class UserService {
  static async findById(id: string): Promise<User | null> {
    try {
      const users = await query<User[]>(
        'SELECT * FROM users WHERE id = ?',
        [id]
      );
      return users[0] || null;
    } catch (error) {
      console.error('Error finding user by id:', error);
      throw error;
    }
  }

  static async findByEmail(email: string): Promise<User | null> {
    try {
      const users = await query<User[]>(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );
      return users[0] || null;
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw error;
    }
  }

  static async create(userData: Omit<User, 'id'>): Promise<User> {
    try {
      const result = await query<{ insertId: number }>(
        'INSERT INTO users SET ?',
        [userData]
      );
      return { ...userData, id: result.insertId.toString() } as User;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  static async update(id: string, userData: Partial<User>): Promise<void> {
    try {
      await query(
        'UPDATE users SET ? WHERE id = ?',
        [userData, id]
      );
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }
}
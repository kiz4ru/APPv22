import { query } from '../config/database';
import { User } from '../types';

/*interface Match {
  id: string;
  user1_id: string;
  user2_id: string;
  compatibility_score: number;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: Date;
}*/

export class MatchService {
  static async findMatches(userId: string): Promise<Array<User & { compatibility_score: number }>> {
    try {
      return await query<Array<User & { compatibility_score: number }>>(
        `SELECT u.*, m.compatibility_score
         FROM matches m
         JOIN users u ON (m.user1_id = u.id OR m.user2_id = u.id)
         WHERE (m.user1_id = ? OR m.user2_id = ?)
           AND m.status = 'accepted'
           AND u.id != ?`,
        [userId, userId, userId]
      );
    } catch (error) {
      console.error('Error finding matches:', error);
      throw error;
    }
  }

  static async createMatch(user1Id: string, user2Id: string, score: number): Promise<void> {
    try {
      await query(
        'INSERT INTO matches (user1_id, user2_id, compatibility_score, status) VALUES (?, ?, ?, ?)',
        [user1Id, user2Id, score, 'pending']
      );
    } catch (error) {
      console.error('Error creating match:', error);
      throw error;
    }
  }

  static async updateMatchStatus(
    matchId: string,
    userId: string,
    status: 'accepted' | 'rejected'
  ): Promise<void> {
    try {
      await query(
        'UPDATE matches SET status = ? WHERE id = ? AND (user1_id = ? OR user2_id = ?)',
        [status, matchId, userId, userId]
      );
    } catch (error) {
      console.error('Error updating match status:', error);
      throw error;
    }
  }

  static async calculateCompatibilityScore(user1: User, user2: User): Promise<number> {
    // This is a placeholder for the compatibility algorithm
    let score = 0;
    
    // Location preference match
    if (user1.location.city === user2.location.city) score += 20;
    
    // Lifestyle matches
    if (user1.preferences.smoking === user2.preferences.smoking) score += 10;
    if (user1.preferences.pets === user2.preferences.pets) score += 10;
    if (user1.preferences.schedule === user2.preferences.schedule) score += 10;
    if (Math.abs(user1.preferences.cleanliness - user2.preferences.cleanliness) <= 1) score += 10;
    
    // Common interests
    const commonInterests = user1.interests.filter(interest => 
      user2.interests.includes(interest)
    ).length;
    score += commonInterests * 5;
    
    // Budget compatibility
    if (Math.abs(user1.preferences.maxRent - user2.preferences.maxRent) <= 500) score += 10;
    
    return Math.min(score, 100);
  }
}
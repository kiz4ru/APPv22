import { query } from '../config/database';
import { Property } from '../types';

export class PropertyService {
  static async findAll(filters?: Partial<Property>): Promise<Property[]> {
    try {
      let sql = 'SELECT * FROM properties WHERE 1=1';
      const params: any[] = [];

      if (filters) {
        if (filters.location?.city) {
          sql += ' AND city = ?';
          params.push(filters.location.city);
        }
        if (filters.price) {
          sql += ' AND price <= ?';
          params.push(filters.price);
        }
        // Add more filter conditions as needed
      }

      return await query<Property[]>(sql, params);
    } catch (error) {
      console.error('Error finding properties:', error);
      throw error;
    }
  }

  static async findById(id: string): Promise<Property | null> {
    try {
      const properties = await query<Property[]>(
        'SELECT * FROM properties WHERE id = ?',
        [id]
      );
      return properties[0] || null;
    } catch (error) {
      console.error('Error finding property by id:', error);
      throw error;
    }
  }

  static async create(propertyData: Omit<Property, 'id'>): Promise<Property> {
    try {
      const result = await query<{ insertId: number }>(
        'INSERT INTO properties SET ?',
        [propertyData]
      );
      return { ...propertyData, id: result.insertId.toString() } as Property;
    } catch (error) {
      console.error('Error creating property:', error);
      throw error;
    }
  }

  static async update(id: string, propertyData: Partial<Property>): Promise<void> {
    try {
      await query(
        'UPDATE properties SET ? WHERE id = ?',
        [propertyData, id]
      );
    } catch (error) {
      console.error('Error updating property:', error);
      throw error;
    }
  }
}
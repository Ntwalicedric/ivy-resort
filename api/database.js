// Centralized database connection and operations
// Using PostgreSQL with connection pooling for production scalability

import pkg from 'pg';
const { Pool } = pkg;

// Database configuration
const dbConfig = {
  user: process.env.DB_USER || 'ivyresort',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'ivy_resort',
  password: process.env.DB_PASSWORD || 'password',
  port: process.env.DB_PORT || 5432,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
};

// Create connection pool
const pool = new Pool(dbConfig);

// Initialize database tables
export async function initializeDatabase() {
  try {
    const client = await pool.connect();
    
    // Create reservations table
    await client.query(`
      CREATE TABLE IF NOT EXISTS reservations (
        id SERIAL PRIMARY KEY,
        confirmation_id VARCHAR(50) UNIQUE NOT NULL,
        guest_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        room_number VARCHAR(20),
        room_type VARCHAR(50),
        room_name VARCHAR(255) NOT NULL,
        check_in DATE NOT NULL,
        check_out DATE NOT NULL,
        total_amount DECIMAL(10,2) NOT NULL,
        currency VARCHAR(10) DEFAULT 'USD',
        total_amount_in_currency DECIMAL(10,2),
        total_amount_display VARCHAR(100),
        special_requests TEXT,
        arrival_time VARCHAR(50),
        guest_count INTEGER DEFAULT 1,
        country VARCHAR(50),
        status VARCHAR(20) DEFAULT 'pending',
        email_sent BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create index for faster queries
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_reservations_updated_at 
      ON reservations(updated_at DESC)
    `);
    
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_reservations_confirmation_id 
      ON reservations(confirmation_id)
    `);

    // Create users table for admin authentication
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'admin',
        active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Insert default admin user if not exists
    const adminExists = await client.query(
      'SELECT id FROM users WHERE email = $1',
      ['admin@ivyresort.com']
    );

    if (adminExists.rows.length === 0) {
      // In production, use proper password hashing (bcrypt)
      await client.query(`
        INSERT INTO users (email, password_hash, role) 
        VALUES ($1, $2, $3)
      `, ['admin@ivyresort.com', 'hashed_password_here', 'admin']);
    }

    client.release();
    console.log('✅ Database initialized successfully');
    return true;
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    return false;
  }
}

// Reservation CRUD operations
export class ReservationService {
  // Create a new reservation
  static async create(reservationData) {
    const client = await pool.connect();
    try {
      const {
        guestName, email, phone, roomNumber, roomType, roomName,
        checkIn, checkOut, totalAmount, currency, totalAmountInCurrency,
        totalAmountDisplay, specialRequests, arrivalTime, guestCount, country
      } = reservationData;

      const confirmationId = `IVY-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
      
      const result = await client.query(`
        INSERT INTO reservations (
          confirmation_id, guest_name, email, phone, room_number, room_type, room_name,
          check_in, check_out, total_amount, currency, total_amount_in_currency,
          total_amount_display, special_requests, arrival_time, guest_count, country
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
        RETURNING *
      `, [
        confirmationId, guestName, email, phone, roomNumber, roomType, roomName,
        checkIn, checkOut, totalAmount, currency, totalAmountInCurrency,
        totalAmountDisplay, specialRequests, arrivalTime, guestCount, country
      ]);

      return {
        success: true,
        data: result.rows[0]
      };
    } catch (error) {
      console.error('Error creating reservation:', error);
      return {
        success: false,
        error: error.message
      };
    } finally {
      client.release();
    }
  }

  // Get all reservations with optional filtering
  static async getAll(filters = {}) {
    const client = await pool.connect();
    try {
      let query = 'SELECT * FROM reservations';
      const params = [];
      let paramCount = 0;

      const conditions = [];
      
      if (filters.status) {
        paramCount++;
        conditions.push(`status = $${paramCount}`);
        params.push(filters.status);
      }

      if (filters.since) {
        paramCount++;
        conditions.push(`updated_at > $${paramCount}`);
        params.push(filters.since);
      }

      if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
      }

      query += ' ORDER BY updated_at DESC';

      if (filters.limit) {
        paramCount++;
        query += ` LIMIT $${paramCount}`;
        params.push(filters.limit);
      }

      const result = await client.query(query, params);
      return {
        success: true,
        data: result.rows
      };
    } catch (error) {
      console.error('Error fetching reservations:', error);
      return {
        success: false,
        error: error.message
      };
    } finally {
      client.release();
    }
  }

  // Get reservations updated since a specific timestamp
  static async getUpdatedSince(timestamp) {
    const client = await pool.connect();
    try {
      const result = await client.query(`
        SELECT * FROM reservations 
        WHERE updated_at > $1 
        ORDER BY updated_at DESC
      `, [timestamp]);

      return {
        success: true,
        data: result.rows
      };
    } catch (error) {
      console.error('Error fetching updated reservations:', error);
      return {
        success: false,
        error: error.message
      };
    } finally {
      client.release();
    }
  }

  // Update reservation status
  static async updateStatus(id, status, emailSent = false) {
    const client = await pool.connect();
    try {
      const result = await client.query(`
        UPDATE reservations 
        SET status = $1, email_sent = $2, updated_at = CURRENT_TIMESTAMP
        WHERE id = $3
        RETURNING *
      `, [status, emailSent, id]);

      if (result.rows.length === 0) {
        return {
          success: false,
          error: 'Reservation not found'
        };
      }

      return {
        success: true,
        data: result.rows[0]
      };
    } catch (error) {
      console.error('Error updating reservation:', error);
      return {
        success: false,
        error: error.message
      };
    } finally {
      client.release();
    }
  }

  // Delete reservation
  static async delete(id) {
    const client = await pool.connect();
    try {
      const result = await client.query(`
        DELETE FROM reservations 
        WHERE id = $1
        RETURNING *
      `, [id]);

      if (result.rows.length === 0) {
        return {
          success: false,
          error: 'Reservation not found'
        };
      }

      return {
        success: true,
        data: result.rows[0]
      };
    } catch (error) {
      console.error('Error deleting reservation:', error);
      return {
        success: false,
        error: error.message
      };
    } finally {
      client.release();
    }
  }

  // Get reservation statistics
  static async getStats() {
    const client = await pool.connect();
    try {
      const result = await client.query(`
        SELECT 
          COUNT(*) as total_reservations,
          COUNT(CASE WHEN status = 'confirmed' THEN 1 END) as confirmed,
          COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending,
          COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled,
          COUNT(CASE WHEN email_sent = true THEN 1 END) as emails_sent,
          SUM(total_amount) as total_revenue
        FROM reservations
        WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
      `);

      return {
        success: true,
        data: result.rows[0]
      };
    } catch (error) {
      console.error('Error fetching stats:', error);
      return {
        success: false,
        error: error.message
      };
    } finally {
      client.release();
    }
  }
}

// Initialize database on module load
initializeDatabase();

export default pool;

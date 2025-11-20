// /pages/api/testdb.js

import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// Default export required for Next.js API route!
export default async function handler(req, res) {
  try {
    const result = await pool.query('SELECT NOW()');
    res.status(200).json({
      connected: true,
      time: result.rows[0].now
    });
  } catch (error) {
    res.status(500).json({
      connected: false,
      error: error.message
    });
  }
}

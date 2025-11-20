// pages/api/links.js
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Helper for generating random code
function generateShortCode(length = 6) {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { url } = req.body;
    if (!url || typeof url !== "string") {
      return res.status(400).json({ error: "Invalid URL." });
    }

    let short_code;
    let isUnique = false;
    for (let attempts = 0; attempts < 5 && !isUnique; attempts++) {
      short_code = generateShortCode();
      const exists = await pool.query(
        "SELECT 1 FROM links WHERE short_code = $1",
        [short_code]
      );
      isUnique = exists.rows.length === 0;
    }
    if (!isUnique) {
      return res.status(500).json({ error: "Could not generate unique code, try again." });
    }

    try {
      await pool.query(
        "INSERT INTO links (original_url, short_code) VALUES ($1, $2)",
        [url, short_code]
      );
      res.status(200).json({
        message: "Short link created!",
        short_code,
        short_url: `http://localhost:3000/${short_code}`
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else if (req.method === "GET") {
    try {
      const result = await pool.query("SELECT * FROM links ORDER BY id DESC");
      res.status(200).json({ links: result.rows });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

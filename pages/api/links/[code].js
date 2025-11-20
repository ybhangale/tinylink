

import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export default async function handler(req, res) {
  const { code } = req.query;
  if (!code) {
    return res.status(400).json({ error: "Missing code" });
  }

  if (req.method === "GET") {
   
    try {
      const result = await pool.query(
        "SELECT * FROM links WHERE short_code = $1",
        [code]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Link not found" });
      }
      res.status(200).json({ link: result.rows[0] });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else if (req.method === "DELETE") {
   
    try {
      const deleted = await pool.query(
        "DELETE FROM links WHERE short_code = $1 RETURNING *",
        [code]
      );
      if (deleted.rowCount === 0) {
        return res.status(404).json({ error: "Link not found" });
      }
      res.status(200).json({ message: "Deleted", link: deleted.rows[0] });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else {
    res.setHeader("Allow", ["GET", "DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

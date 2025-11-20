import React from "react";
import { Pool } from "pg";

function CodeRedirectPage() {
  return <div>Redirecting...</div>;
}

export async function getServerSideProps(context) {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  const { params } = context;
  const code = params ? params.code : null;
  if (!code) {
    return { notFound: true };
  }

  try {
    const result = await pool.query(
      "SELECT original_url FROM links WHERE short_code = $1",
      [code]
    );
    if (result.rows.length === 0) {
      return { notFound: true };
    }
    await pool.query(
      "UPDATE links SET click_count = click_count + 1 WHERE short_code = $1",
      [code]
    );
    return {
      redirect: {
        destination: result.rows[0].original_url,
        permanent: false
      }
    };
  } catch (err) {
    return { notFound: true };
  }
}

export default CodeRedirectPage;

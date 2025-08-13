const { Pool } = require("pg");

const useSsl =
  (process.env.PG_SSL || "").toLowerCase() === "true" &&
  !/localhost|127\.0\.0\.1/i.test(process.env.DATABASE_URL || "");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: useSsl ? { rejectUnauthorized: false } : false
});

async function migrate() {
  // idempotent migration
  await pool.query(`
    CREATE TABLE IF NOT EXISTS saved_players (
      id SERIAL PRIMARY KEY,
      tag TEXT UNIQUE NOT NULL,
      name TEXT,
      trophies INTEGER,
      note TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

async function healthcheck() {
  const r = await pool.query("SELECT 1 as ok");
  return r.rows[0].ok === 1;
}

module.exports = {
  query: (text, params) => pool.query(text, params),
  migrate,
  healthcheck
};

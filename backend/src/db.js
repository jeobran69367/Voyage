import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, '../../data/survey.db');

const isProduction = process.env.NODE_ENV === 'production';
const useVercelPostgres = isProduction && process.env.POSTGRES_URLPRIVATE;

let database;
let pool;

if (useVercelPostgres) {
  // Production: Use Vercel Postgres via pg client
  try {
    import('pg').then(pg => {
      const { Client } = pg.default;
      console.log('Initializing Vercel Postgres connection');
      
      const client = new Client({
        connectionString: process.env.POSTGRES_URLPRIVATE
      });
      
      pool = {
        query: async (sql, params = []) => {
          try {
            const result = await client.query(sql, params);
            return { rows: result.rows };
          } catch (err) {
            console.error('PostgreSQL error:', err);
            throw err;
          }
        }
      };
    });
  } catch (err) {
    console.warn('Vercel Postgres not available, falling back to SQLite:', err.message);
    useVercelPostgres = false;
  }
}

// Local development: Use SQLite
if (!useVercelPostgres) {
  // Ensure data directory exists
  try {
    const { execSync } = await import('child_process');
    const dataDir = path.dirname(dbPath);
    execSync(`mkdir -p "${dataDir}"`, { stdio: 'pipe' });
  } catch (err) {
    console.log('Data directory already exists or could not be created');
  }

  database = new Database(dbPath);
  database.pragma('journal_mode = WAL');

  pool = {
    query: (sql, params = []) => {
      try {
        // Convert PostgreSQL placeholders ($1, $2) to SQLite (?)
        let sqliteSql = sql;
        let index = 1;
        while (sqliteSql.includes(`$${index}`)) {
          sqliteSql = sqliteSql.replace(`$${index}`, '?');
          index++;
        }

        // Handle different query types
        if (sqliteSql.trim().toUpperCase().startsWith('INSERT') || 
            sqliteSql.trim().toUpperCase().startsWith('UPDATE') ||
            sqliteSql.trim().toUpperCase().startsWith('DELETE')) {
          const stmt = database.prepare(sqliteSql);
          const result = stmt.run(...params);
          
          // Get the inserted row if RETURNING clause exists
          if (sqliteSql.includes('RETURNING')) {
            const id = result.lastInsertRowid;
            const row = database.prepare(`SELECT * FROM surveys WHERE id = ?`).get(id);
            return { rows: [row] };
          }
          
          return { rows: [] };
        } else {
          // SELECT query
          const stmt = database.prepare(sqliteSql);
          const rows = stmt.all(...params);
          return { rows };
        }
      } catch (err) {
        throw err;
      }
    }
  };
}

export default pool;
export { database };

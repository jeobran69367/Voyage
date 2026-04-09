import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, '../../data/survey.db');

// Create database connection
const database = new Database(dbPath);

// Enable foreign keys
database.pragma('journal_mode = WAL');

// Create a wrapper that mimics PostgreSQL pool API
const pool = {
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
          const selectSql = sql.split('RETURNING')[0];
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

export default pool;
export { database };

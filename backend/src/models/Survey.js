import { database } from '../db.js';

export const createTablesIfNotExists = async () => {
  try {
    database.exec(`
      CREATE TABLE IF NOT EXISTS surveys (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        country TEXT NOT NULL,
        month TEXT NOT NULL,
        duration INTEGER,
        budget_min INTEGER,
        budget_max INTEGER,
        activities TEXT,
        comments TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS participants (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Database initialized - Tables ready');
  } catch (err) {
    console.error('❌ Error creating tables:', err.message);
    throw err;
  }
};

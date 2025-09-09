import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = new Database(join(__dirname, './sqlite.db'));

// Delete settings with null or 'null' keys
const stmt = db.prepare('DELETE FROM settings WHERE key IS NULL OR key = ?');
const result = stmt.run('null');
console.log('Deleted', result.changes, 'rows');

// Show remaining settings
const selectStmt = db.prepare('SELECT id, key, value, description FROM settings');
const settings = selectStmt.all();
console.log('Remaining settings:', settings.length);
settings.forEach(setting => {
  console.log(`- ${setting.key}: ${setting.value}`);
});

db.close();

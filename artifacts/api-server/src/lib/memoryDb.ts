import fs from "fs";
import path from "path";

const DB_FILE = process.env.VERCEL
  ? path.join("/tmp", "local_memory_db.json")
  : path.join(process.cwd(), "local_memory_db.json");

export function readDB(): Record<string, any> {
  try {
    if (!fs.existsSync(DB_FILE)) return {};
    return JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));
  } catch {
    return {};
  }
}

export function writeDB(data: Record<string, any>) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

export function updateDB(key: string, value: any) {
  const db = readDB();
  db[key] = value;
  writeDB(db);
}

export function getDB(key?: string, defaultValue?: any) {
  const db = readDB();
  if (!key) return db;
  return db[key] || defaultValue;
}

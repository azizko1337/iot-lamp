import path from "path";
import sqlite3 from "sqlite3";
import { open } from "sqlite";

async function openDb() {
  return await open({
    filename: path.join("db.sqlite"),
    driver: sqlite3.Database,
  });
}

export default openDb;

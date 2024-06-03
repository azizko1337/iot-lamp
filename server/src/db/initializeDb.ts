import openDb from "./openDb";

async function initializeDb() {
  const db = await openDb();
  await db.exec(`
        CREATE TABLE IF NOT EXISTS lamps (
            lampCode TEXT PRIMARY KEY,
            brightness INTEGER DEFAULT 0,
            temperature INTEGER DEFAULT 0,
            motion INTEGER DEFAULT 0,
            angle INTEGER DEFAULT 90,
            power INTEGER DEFAULT 0
        )
    `);
  await db.exec(`
        CREATE TABLE IF NOT EXISTS sockets (
            socketId TEXT PRIMARY KEY,
            lampCode TEXT,
            isDevice BOOLEAN DEFAULT 0,
            FOREIGN KEY(lampCode) REFERENCES lamps(lampCode)
        )
    `);
  await db.close();
}

export default initializeDb;

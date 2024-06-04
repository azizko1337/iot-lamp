import openDb from "../db/openDb";

async function showDb() {
  const db = await openDb();

  let result = await db.all("SELECT * FROM lamps");
  console.log("LAMPS:");
  for (const row of result) {
    console.log(row);
  }

  console.log("\n ================ \n");

  result = await db.all("SELECT * FROM sockets");
  console.log("CONNECTIONS:");
  for (const row of result) {
    console.log(row);
  }

  await db.close();
}

showDb();

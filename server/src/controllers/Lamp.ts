import openDb from "../db/openDb";
import { v4 as uuidv4 } from "uuid";

class Lamp {
  static async exists(lampCode: string) {
    const db = await openDb();
    const result = await db.get("SELECT * FROM lamps WHERE lampCode = ?", [
      lampCode,
    ]);
    await db.close();
    return result ? true : false;
  }
  static async isConnected(lampCode: string) {
    const db = await openDb();
    const result = await db.get(
      "SELECT * FROM sockets WHERE lampCode = ? AND isDevice = true",
      [lampCode]
    );
    await db.close();
    return result ? true : false;
  }
  //get all
  static async getState(lampCode: string) {
    const db = await openDb();
    const result = await db.get("SELECT * FROM lamps WHERE lampCode = ?", [
      lampCode,
    ]);
    await db.close();
    return result;
  }
  //set property
  static async set(lampCode: string, property: string, value: number) {
    const db = await openDb();

    await db.run(`UPDATE lamps SET ${property} = ? WHERE lampCode = ?`, [
      value,
      lampCode,
    ]);

    await db.close();
  }

  //create
  static async create(): Promise<string> {
    const db = await openDb();

    //generate unique lampCode
    let lampCode = uuidv4();
    while (await db.get("SELECT * FROM lamps WHERE lampCode = ?", [lampCode])) {
      lampCode = uuidv4();
    }

    await db.run("INSERT INTO lamps (lampCode) VALUES (?)", [lampCode]);
    await db.close();

    return lampCode;
  }
}

export default Lamp;

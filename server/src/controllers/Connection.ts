import openDb from "../db/openDb";

class Connection {
  static async add(socketId: string, lampCode: string, isDevice = false) {
    const db = await openDb();

    //insert lamp if not connected already
    if (isDevice) {
      const lamp = await db.get("SELECT * FROM lamps WHERE lampCode = ?", [
        lampCode,
      ]);
      if (!lamp) {
        await db.run("INSERT INTO lamps (lampCode) VALUES (?)", [lampCode]);
      }
    }

    try {
      await db.run(
        `INSERT INTO sockets (socketId, lampCode, isDevice) VALUES (?, ?, ?)`,
        socketId,
        lampCode,
        isDevice
      );
    } catch (e) {
      await db.run(
        `UPDATE sockets SET lampCode = ?, isDevice = ? WHERE socketId = ?`,
        lampCode,
        socketId,
        isDevice
      );
    }
    await db.close();
  }
  static async remove(socketId: string) {
    if (await this.isDevice(socketId)) {
      const lampCode = await this.getLampCode(socketId);
      const db = await openDb();
      await db.run(
        `DELETE FROM sockets WHERE lampCode = ? AND isDevice = true`,
        [lampCode]
      );
      await db.close();
      return;
    }
    const db = await openDb();
    await db.run(`DELETE FROM sockets WHERE socketId = ?`, socketId);
    await db.close();
  }
  static async getByCode(lampCode: string): Promise<string[]> {
    const db = await openDb();
    const sockets = await db.all(
      `SELECT socketId FROM sockets WHERE lampCode = ?`,
      lampCode
    );
    await db.close();
    return sockets.map((socket) => socket.socketId);
  }
  static async getLampCode(socketId: string): Promise<string> {
    const db = await openDb();
    const result = await db.get(
      `SELECT lampCode FROM sockets WHERE socketId = ?`,
      socketId
    );
    await db.close();
    if (!result) return "";
    return result.lampCode;
  }
  static async isDevice(socketId: string): Promise<boolean> {
    const db = await openDb();
    const result = await db.get(
      `SELECT isDevice FROM sockets WHERE socketId = ?`,
      socketId
    );
    await db.close();
    if (!result) return false;
    return result.isDevice;
  }
}

export default Connection;
